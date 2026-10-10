import { cn } from "@/lib/utils";

interface MaskedLinesProps {
  lines: readonly string[];
  /** Lines (by index) pushed toward the centre of the grid, echoing the other section titles. */
  offset?: readonly number[];
}

export function MaskedLines({ lines, offset = [] }: MaskedLinesProps) {
  return (
    <>
      {lines.map((line, index) => (
        <span className={cn("line-mask", offset.includes(index) && "line-mask-offset")} key={line}>
          <span>{line}</span>
        </span>
      ))}
    </>
  );
}
