"use client";

import { useState, useRef } from "react";
import { RoastRequest } from "@/types";
import { ImagePlus, X } from "lucide-react";

function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const MAX_DIM = 1200;
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
      const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleImageUpload = async (files: FileList) => {
    const newPreviews: string[] = [];
    const newBase64s: string[] = [];

    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;
      const base64 = await compressImage(file);
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
    if (e.dataTransfer.files.length) handleImageUpload(e.dataTransfer.files);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const files = e.clipboardData.files;
    if (files.length > 0) {
      e.preventDefault();
      handleImageUpload(files);
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

  const hasLinkedInUrlOnly =
    /linkedin\.com\/in\//.test(infoText) &&
    infoText.replace(/https?:\/\/[^\s]+/g, "").trim().length < 20 &&
    imageBase64s.length === 0;

  const canSubmit = (infoText.trim().length > 0 || imageBase64s.length > 0) && !isLoading && !hasLinkedInUrlOnly;

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
          placeholder="spill the tea... paste his bio, dating app profile, linkedin, whatever receipts you have"
          value={infoText}
          onChange={(e) => setInfoText(e.target.value)}
          onPaste={handlePaste}
          onKeyDown={handleKeyDown}
        />

        {/* Bottom toolbar */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200" style={{ background: "var(--paper-dark)" }}>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 text-gray-400 hover:text-gray-600 transition-colors"
              disabled={uploadedImages.length >= 6}
            >
              <ImagePlus className="w-5 h-5" />
              <span className="text-xs font-medium">
                {uploadedImages.length > 0
                  ? `${uploadedImages.length}/6 screenshots`
                  : "screenshots (up to 6)"}
              </span>
            </button>
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="burn-btn px-5 py-2 text-sm"
          >
            EXPOSE HIM
          </button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => { if (e.target.files) handleImageUpload(e.target.files); }}
      />

      {hasLinkedInUrlOnly && (
        <div className="scrapbook-card p-4 tilt-left" style={{ background: "var(--paper-dark)" }}>
          <p className="handwritten text-lg text-gray-900 mb-1">📋 linkedin blocks bots bestie</p>
          <p className="text-xs text-gray-600 leading-relaxed">
            Open his profile → click <strong>see more</strong> on the About section → copy-paste his headline, bio, and job titles here.
          </p>
        </div>
      )}
    </form>
  );
}
