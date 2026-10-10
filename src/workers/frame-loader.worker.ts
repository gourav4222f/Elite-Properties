// Fetches and decodes hero frames away from the main thread. Decoded frames are transferred
// back as ImageBitmaps, so the page only ever draws.
//
// In the background it first builds a small low-resolution keyframe set across the whole
// sequence (a stand-in while full frames are on their way), then warms every remaining
// frame into the HTTP cache without decoding it.

type LoaderRequest =
  | { type: "decode"; frame: number; url: string }
  | {
      type: "background";
      previews: { frame: number; url: string }[];
      previewWidth: number;
      previewHeight: number;
      warm: string[];
      lanes: number;
    };

interface WorkerScope {
  postMessage(message: unknown, transfer?: Transferable[]): void;
  onmessage: ((event: MessageEvent<LoaderRequest>) => void) | null;
}

const scope = self as unknown as WorkerScope;
const canDecode = typeof createImageBitmap === "function";

async function decode(frame: number, url: string) {
  if (!canDecode) {
    scope.postMessage({ type: "unsupported", frame });
    return;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Frame ${frame} responded ${response.status}`);
    const bitmap = await createImageBitmap(await response.blob());
    scope.postMessage({ type: "decoded", frame, bitmap }, [bitmap]);
  } catch {
    scope.postMessage({ type: "failed", frame });
  }
}

async function preview(frame: number, url: string, width: number, height: number) {
  const response = await fetch(url, { priority: "low" });
  if (!response.ok) return;
  const blob = await response.blob();

  let bitmap = await createImageBitmap(blob, { resizeWidth: width, resizeHeight: height, resizeQuality: "medium" });
  // Browsers that ignore the resize options get scaled down here, or the preview is skipped.
  if (bitmap.width > width) {
    if (typeof OffscreenCanvas !== "function") {
      bitmap.close();
      return;
    }
    const canvas = new OffscreenCanvas(width, height);
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();
    bitmap = canvas.transferToImageBitmap();
  }

  scope.postMessage({ type: "preview", frame, bitmap }, [bitmap]);
}

function runLanes<T>(items: T[], lanes: number, task: (item: T) => Promise<unknown>) {
  let cursor = 0;
  const next = (): Promise<void> => {
    if (cursor >= items.length) return Promise.resolve();
    const item = items[cursor];
    cursor += 1;
    return task(item)
      .catch(() => undefined)
      .then(next);
  };
  return Promise.all(Array.from({ length: lanes }, next));
}

scope.onmessage = (event) => {
  const message = event.data;
  if (message.type === "decode") {
    decode(message.frame, message.url);
    return;
  }

  const { previews, previewWidth, previewHeight, warm, lanes } = message;
  const previewPass = canDecode
    ? runLanes(previews, lanes, ({ frame, url }) => preview(frame, url, previewWidth, previewHeight))
    : Promise.resolve();
  previewPass.then(() =>
    runLanes(warm, lanes, (url) => fetch(url, { priority: "low" }).then((response) => response.blob())),
  );
};
