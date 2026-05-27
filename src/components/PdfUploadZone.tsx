"use client";

import { useState, useRef, type DragEvent } from "react";

export function PdfUploadZone({ currentFilename }: { currentFilename: string | null }) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      setFileName(file.name);
      if (inputRef.current) {
        const dt = new DataTransfer();
        dt.items.add(file);
        inputRef.current.files = dt.files;
      }
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setFileName(file?.name || null);
  }

  return (
    <div className="text-sm">
      <span className="mb-2 block text-stone">PDF document (delivered to buyers)</span>
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer rounded border-2 border-dashed p-8 text-center transition ${
          isDragging
            ? "border-brass bg-brass/5"
            : "border-line hover:border-brass/50"
        }`}
      >
        <input
          ref={inputRef}
          name="pdf"
          type="file"
          accept="application/pdf"
          onChange={handleChange}
          data-testid="pf-pdf"
          className="hidden"
        />
        {fileName ? (
          <div>
            <p className="font-medium text-brass-deep">{fileName}</p>
            <p className="mt-1 text-xs text-stone">Ready to upload. Click or drop to replace.</p>
          </div>
        ) : currentFilename ? (
          <div>
            <p className="text-stone">Current: <span className="font-medium text-ink">{currentFilename}</span></p>
            <p className="mt-1 text-xs text-stone">Drop a new PDF here or click to replace.</p>
          </div>
        ) : (
          <div>
            <p className="text-stone">Drop PDF here or click to browse</p>
            <p className="mt-1 text-xs text-stone">This is the gated file delivered to buyers after purchase.</p>
          </div>
        )}
      </div>
    </div>
  );
}
