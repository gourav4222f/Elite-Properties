import Image from "next/image";
import type { CSSProperties } from "react";

import type { SelectedSpaceImage } from "@/data/selected-spaces";

type EditorialImageProps = {
  image: SelectedSpaceImage;
  className: string;
  reveal?: "vertical" | "horizontal" | "open";
  depth?: "background" | "midground" | "foreground";
  /** Overrides the drift implied by `depth`; 0 keeps the photograph still. */
  parallax?: number;
};

const REVEAL = { vertical: "up", horizontal: "left", open: "none" } as const;
const DRIFT = { background: 3, midground: 5, foreground: 7 } as const;

export function EditorialImage({
  image,
  className,
  reveal = "vertical",
  depth = "midground",
  parallax = DRIFT[depth],
}: EditorialImageProps) {
  return (
    <figure
      className={`spaces-image ${className}`}
      style={{
        "--image-position": image.objectPosition ?? "center center",
        "--image-position-mobile": image.mobileObjectPosition ?? image.objectPosition ?? "center center",
      } as CSSProperties}
    >
      <div className="spaces-image-frame" data-image={REVEAL[reveal]} data-parallax={parallax}>
        <Image
          alt={image.alt}
          className="spaces-image-media"
          fill
          sizes={image.sizes}
          src={image.src}
        />
      </div>
      {image.caption ? <figcaption>{image.caption}</figcaption> : null}
    </figure>
  );
}
