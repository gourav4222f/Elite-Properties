import { cn } from "@/lib/utils";

/** A statement that reads itself in, word by word, as it travels up the screen. */
export function ReadingStatement({ text, className }: { text: string; className?: string }) {
  return (
    <p className={cn("reading-statement", className)} data-read>
      {text.split(" ").map((word, index) => (
        <span className="read-word" key={`${word}-${index}`}>
          {word}{" "}
        </span>
      ))}
    </p>
  );
}
