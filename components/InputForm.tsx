"use client";

import { useState, useRef } from "react";
import { RoastRequest } from "@/types";
import { Paperclip, X, Info } from "lucide-react";

function compressImage(file: File, totalImages: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      // Scale down more aggressively when uploading multiple images
      // to stay under Vercel's 4.5MB body size limit
      const MAX_DIM = totalImages > 3 ? 800 : totalImages > 1 ? 1000 : 1200;
      const quality = totalImages > 3 ? 0.6 : 0.7;
      let { width, height } = img;

      if (width > MAX_DIM || height > MAX_DIM) {
        if (width > height) {
          height = Math.round(height * (MAX_DIM / width));
          width = MAX_DIM;
        } else {
          width = Math.round(width * (MAX_DIM / height));
          height = MAX_DIM;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Could not get canvas context"));

      ctx.drawImage(img, 0, 0, width, height);
      const dataUrl = canvas.toDataURL("image/jpeg", quality);
      resolve(dataUrl);
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(file);
  });
}

interface InputFormProps {
  onSubmit: (request: RoastRequest) => void;
  isLoading: boolean;
}

export default function InputForm({ onSubmit, isLoading }: InputFormProps) {
  const [infoText, setInfoText] = useState("");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [imageBase64s, setImageBase64s] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [showWhyInfo, setShowWhyInfo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleFileUpload = async (files: FileList) => {
    const newPreviews: string[] = [];
    const newBase64s: string[] = [];

    for (const file of Array.from(files)) {
      if (file.type === "application/pdf") {
        // Convert PDF pages to images using pdf.js via canvas
        try {
          const pdfjsLib = await import("pdfjs-dist");
          pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
          const arrayBuffer = await file.arrayBuffer();
          const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
          const pagesToRender = Math.min(pdf.numPages, 6 - newBase64s.length);
          for (let i = 1; i <= pagesToRender; i++) {
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: 2 });
            const canvas = document.createElement("canvas");
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            const ctx = canvas.getContext("2d");
            if (!ctx) continue;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await (page.render({ canvasContext: ctx, viewport } as any) as any).promise;
            const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
            newBase64s.push(dataUrl);
            newPreviews.push(dataUrl);
          }
        } catch (e) {
          console.error("PDF processing failed:", e);
        }
        continue;
      }

      if (!file.type.startsWith("image/")) continue;
      const totalImages = uploadedImages.length + newBase64s.length + 1;
      const base64 = await compressImage(file, totalImages);
      newBase64s.push(base64);
      newPreviews.push(URL.createObjectURL(file));
    }

    setImageBase64s((prev) => [...prev, ...newBase64s].slice(0, 6));
    setUploadedImages((prev) => [...prev, ...newPreviews].slice(0, 6));
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
    setImageBase64s((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) handleFileUpload(e.dataTransfer.files);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const files = e.clipboardData.files;
    if (files.length > 0) {
      e.preventDefault();
      handleFileUpload(files);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!infoText.trim() && imageBase64s.length === 0) return;

    onSubmit({
      profileType: "general",
      profileText: infoText || undefined,
      imageBase64s: imageBase64s.length > 0 ? imageBase64s : undefined,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && canSubmit) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const hasUrl = /https?:\/\/[^\s]+/.test(infoText);
  const textWithoutUrls = infoText.replace(/https?:\/\/[^\s]+/g, "").trim();
  const hasUrlOnly = hasUrl && textWithoutUrls.length < 20 && imageBase64s.length === 0;

  const canSubmit = (infoText.trim().length > 0 || imageBase64s.length > 0) && !isLoading && !hasUrlOnly;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div
        className="scrapbook-card overflow-hidden"
        style={{
          transform: "rotate(0.3deg)",
          border: dragOver ? "3px solid var(--pink-hot)" : undefined,
        }}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        {/* Image previews — inside the box, above the text */}
        {uploadedImages.length > 0 && (
          <div className="p-3 pb-0 flex gap-2 flex-wrap">
            {uploadedImages.map((src, i) => (
              <div
                key={i}
                className="relative w-20 h-20 shrink-0"
                style={{
                  transform: `rotate(${[-2, 1.5, -1, 2.5][i]}deg)`,
                  boxShadow: "2px 3px 6px rgba(0,0,0,0.15)",
                  border: "3px solid white",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                  className="absolute -top-2 -right-2 bg-white rounded-full p-0.5 border border-gray-300 hover:bg-red-100 transition-colors shadow-sm"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          className="burn-input w-full p-5 pl-6 min-h-[160px] resize-none border-none shadow-none"
          style={{ boxShadow: "none", border: "none", background: uploadedImages.length > 0 ? "transparent" : undefined }}
          placeholder="spill the tea... paste/upload his bio, texts, hinge, linkedin, resume (sky's the limit), anything you got on him. more receipts = better roast 💅"
          value={infoText}
          onChange={(e) => setInfoText(e.target.value)}
          onPaste={handlePaste}
          onKeyDown={handleKeyDown}
        />

        {/* Bottom toolbar */}
        <div className="relative flex items-center justify-between px-4 py-4 border-t border-gray-200" style={{ background: "var(--paper-dark)" }}>
          <div className="flex items-center gap-1.5 min-w-0">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 hover:underline transition-all min-w-0"
              style={{
                background: "transparent",
                color: "var(--pink-burn)",
                fontWeight: 600,
                fontSize: "12px",
                border: "none",
              }}
              disabled={uploadedImages.length >= 6}
            >
              <Paperclip className="w-3.5 h-3.5 shrink-0" />
              <span>
                {uploadedImages.length > 0
                  ? `${uploadedImages.length}/6 files`
                  : (<><span className="hidden sm:inline">drop or upload · screenshots work best</span><span className="sm:hidden">upload screenshots</span></>)}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setShowWhyInfo(!showWhyInfo)}
              className="shrink-0 flex items-center justify-center w-5 h-5 rounded-full border border-gray-300 hover:border-gray-500 hover:bg-gray-100 transition-all"
            >
              <Info className="w-3 h-3 text-gray-400" />
            </button>
          </div>
          {showWhyInfo && (
            <p className="absolute bottom-full left-4 mb-1 text-[10px] text-gray-500 bg-white rounded px-2 py-1 shadow-sm border border-gray-100">
              links usually don&apos;t work — most apps block scraping. screenshots give us the full picture 🔒
            </p>
          )}

          <button
            type="submit"
            disabled={!canSubmit}
            className="burn-btn px-4 py-2.5 text-sm font-bold shrink-0 ml-3 whitespace-nowrap"
          >
            Should I?
          </button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf,.svg"
        multiple
        className="hidden"
        onChange={(e) => { if (e.target.files) handleFileUpload(e.target.files); }}
      />

      {hasUrlOnly && (
        <div className="scrapbook-card p-4 tilt-left" style={{ background: "var(--paper-dark)" }}>
          <p className="handwritten text-lg text-gray-900 mb-1">🔗 links don&apos;t work bestie</p>
          <p className="text-xs text-gray-600 leading-relaxed">
            most sites block us from reading links. screenshot his profile and upload it instead — we&apos;ll get way more tea that way 📸
          </p>
        </div>
      )}
    </form>
  );
}
