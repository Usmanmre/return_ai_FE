import { useCallback, useRef, type DragEvent, type ReactNode } from "react";

type Props = {
  accept?: string;
  onFile: (file: File | null) => void;
  disabled?: boolean;
  children: ReactNode;
  className?: string;
};

export function FileDropzone({
  accept = ".csv,text/csv",
  onFile,
  disabled,
  children,
  className = "",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (list: FileList | null) => {
      const f = list?.[0] ?? null;
      onFile(f);
    },
    [onFile]
  );

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    handleFiles(e.dataTransfer.files);
  };

  const onDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  return (
    <div
      className={`relative ${className}`}
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        tabIndex={-1}
        disabled={disabled}
        onChange={(e) => handleFiles(e.target.files)}
        aria-hidden
      />
      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        className="w-full text-left"
      >
        {children}
      </button>
    </div>
  );
}
