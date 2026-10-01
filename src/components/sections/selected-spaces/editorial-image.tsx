import Image from "next/image";
import type { CSSProperties } from "react";

import type { SelectedSpaceImage } from "@/data/selected-spaces";

type EditorialImageProps = {
  image: SelectedSpaceImage;
  className: string;
  reveal?: "vertical" | "horizontal" | "open";
  depth?: "background" | "midground" | "foreground";
};

export function EditorialImage({
  image,
  className,
  reveal = "vertical",
  depth = "midground",
}: EditorialImageProps) {
  return (
    <figure
      className={`spaces-image ${className}`}
      data-image-reveal={reveal}
      data-depth={depth}
      style={{
        "--image-position": image.objectPosition ?? "center center",
        "--image-position-mobile": image.mobileObjectPosition ?? image.objectPosition ?? "center center",
      } as CSSProperties}
    >
      <div className="spaces-image-frame">
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
