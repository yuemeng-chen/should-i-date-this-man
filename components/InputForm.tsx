"use client";

import { useState, useRef } from "react";
import { RoastRequest } from "@/types";
import { fileToBase64 } from "@/lib/utils";
import { Upload, X } from "lucide-react";

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

  const handleImageUpload = async (files: FileList) => {
    const newPreviews: string[] = [];
    const newBase64s: string[] = [];

    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;
      const base64 = await fileToBase64(file);
      newBase64s.push(base64);
      newPreviews.push(URL.createObjectURL(file));
    }

    setImageBase64s((prev) => [...prev, ...newBase64s].slice(0, 4));
    setUploadedImages((prev) => [...prev, ...newPreviews].slice(0, 4));
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!infoText.trim() && imageBase64s.length === 0) return;

    onSubmit({
      profileType: "general",
      profileText: infoText || undefined,
      imageBase64s: imageBase64s.length > 0 ? imageBase64s : undefined,
    });
  };

  const hasLinkedInUrlOnly =
    /linkedin\.com\/in\//.test(infoText) &&
    infoText.replace(/https?:\/\/[^\s]+/g, "").trim().length < 20 &&
    imageBase64s.length === 0;

  const canSubmit = (infoText.trim().length > 0 || imageBase64s.length > 0) && !isLoading && !hasLinkedInUrlOnly;

  return (
    <form onSubmit={handleSubmit} className="space-y-3">

      <textarea
        className="y2k-input w-full p-4 min-h-[140px] resize-none text-sm leading-relaxed"
        placeholder="Paste his bio, Hinge/Tinder profile, Instagram captions, height claim — anything. The more dirt, the better the roast."
        value={infoText}
        onChange={(e) => setInfoText(e.target.value)}
      />

      {hasLinkedInUrlOnly && (
        <div className="rounded-2xl p-4" style={{ background: "#FFF8E1", border: "2px solid #111" }}>
          <p className="font-black text-sm text-gray-900 mb-1">📋 LinkedIn blocks bots</p>
          <p className="text-xs text-gray-600 leading-relaxed">
            Open his profile → click <strong>see more</strong> on the About section → copy-paste his headline, bio, and job titles here. That&apos;s where the good stuff is anyway.
          </p>
        </div>
      )}

      {/* Screenshot upload — up to 4 */}
      <div
        className="rounded-2xl cursor-pointer transition-all"
        style={{ border: `3px dashed ${dragOver ? "#FF1493" : "#ccc"}`, background: dragOver ? "#FFF0F5" : "transparent" }}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {uploadedImages.length > 0 ? (
          <div className="p-3 grid grid-cols-2 gap-2">
            {uploadedImages.map((src, i) => (
              <div key={i} className="relative rounded-xl overflow-hidden border-2 border-gray-200 aspect-video">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                  className="absolute top-1 right-1 bg-white rounded-full p-0.5 border-2 border-gray-800 hover:bg-red-100 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {uploadedImages.length < 4 && (
              <div className="aspect-video rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xs font-medium">
                + Add more
              </div>
            )}
          </div>
        ) : (
          <div className="py-6 flex flex-col items-center gap-1 text-gray-400">
            <Upload className="w-5 h-5" />
            <span className="text-xs font-semibold">Drop screenshots (up to 4)</span>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => { if (e.target.files) handleImageUpload(e.target.files); }}
      />

      <button
        type="submit"
        disabled={!canSubmit}
        className="y2k-btn w-full py-4 text-lg"
      >
        🚩 Roast Him
      </button>

    </form>
  );
}
