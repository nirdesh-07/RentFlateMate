"use client";

import React, { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
}

export function ImageUploader({ value, onChange }: ImageUploaderProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file);
        onChange(url);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file);
        onChange(url);
      }
    }
  };

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerInputClick = () => {
    fileInputRef.current?.click();
  };

  // Check if current value is NOT an avatar URL (avatars start with '/avatars/')
  const hasUploadedImage = value && !value.startsWith("/avatars/");

  return (
    <div className="w-full font-body">
      <label className="text-sm font-semibold text-slate-800 mb-2 block">
        Profile Picture
      </label>
      
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={triggerInputClick}
        className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-2xl h-[120px] cursor-pointer transition-all duration-200 ${
          isDragActive
            ? "border-[--color-flatmate-green] bg-emerald-50/30"
            : hasUploadedImage
            ? "border-emerald-200 bg-emerald-50/10"
            : "border-slate-300 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />

        {hasUploadedImage ? (
          <div className="flex items-center gap-4 w-full px-5 h-full">
            {/* Thumbnail Preview */}
            <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={value}
                alt="Profile Preview"
                className="h-full w-full object-cover"
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">
                Custom photo uploaded
              </p>
              <p className="text-xs text-slate-400">Ready to save</p>
            </div>

            <button
              type="button"
              onClick={clearImage}
              className="h-8 w-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-4">
            <Upload className="h-6 w-6 text-slate-400 mb-2" />
            <p className="text-sm font-semibold text-slate-700">
              Drag and drop your photo here
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              or click to browse from files
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
