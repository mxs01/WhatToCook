import { useState, useRef, useCallback, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { uploadFridgeImage } from "../api/client";
import { Upload, X, Loader2 } from "lucide-react";

export default function FridgeUpload() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file (JPEG, PNG).");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be under 10 MB.");
      return;
    }
    setError(null);
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  }

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragActive(false);
  }, []);

  async function handleUpload() {
    if (!selectedFile) return;
    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      const job = await uploadFridgeImage(selectedFile, setProgress);
      navigate(`/processing/${job.upload_id}`);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  function clearSelection() {
    setSelectedFile(null);
    setPreview(null);
    setProgress(0);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 md:px-8">
      <h1 className="mb-2 text-2xl font-semibold tracking-tight text-text-main">
        Upload your fridge photo
      </h1>
      <p className="mb-8 text-sm text-text-muted">
        Take a photo of your fridge and we'll suggest recipes based on what you
        have.
      </p>

      {error && (
        <div
          className="mb-6 rounded-2xl px-4 py-3 text-sm font-medium"
          style={{
            backgroundColor: "rgba(212,140,132,0.1)",
            color: "#D48C84",
          }}
        >
          {error}
        </div>
      )}

      {!preview ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className="flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed p-16 transition-all"
          style={{
            borderColor: dragActive ? "#00A388" : "#D1D1D6",
            backgroundColor: dragActive ? "rgba(0,163,136,0.04)" : "#FFFFFF",
            boxShadow: dragActive
              ? "0 0 0 4px rgba(0,163,136,0.1)"
              : "0 0 0 1px rgba(0,0,0,0.03)",
            transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        >
          <div
            className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
            style={{ backgroundColor: "rgba(0,163,136,0.08)" }}
          >
            <Upload className="h-6 w-6" style={{ color: "#00A388" }} />
          </div>
          <p className="text-sm font-medium text-text-main">
            Click or drag & drop your fridge photo
          </p>
          <p className="mt-1.5 text-xs text-text-muted">
            JPEG or PNG, max 10 MB
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="hidden"
          />
        </div>
      ) : (
        <div className="space-y-5">
          <div
            className="overflow-hidden rounded-3xl"
            style={{
              boxShadow:
                "0 0 0 1px rgba(0,0,0,0.03), 0 20px 50px -12px rgba(0,0,0,0.08)",
            }}
          >
            <img
              src={preview}
              alt="Fridge preview"
              className="h-auto w-full object-contain bg-white"
              style={{ maxHeight: "400px" }}
            />
          </div>

          {uploading && (
            <div className="h-2 w-full overflow-hidden rounded-full bg-surface-alt">
              <div
                className="h-full rounded-full bg-primary-500"
                style={{
                  width: `${progress}%`,
                  transition: "width 0.3s ease-out",
                }}
              />
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary-500 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-primary-600 disabled:opacity-50"
              style={{
                boxShadow: "0 8px 24px rgba(0,163,136,0.25)",
                transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              }}
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading... {progress}%
                </>
              ) : (
                "Generate recipes"
              )}
            </button>
            <button
              onClick={clearSelection}
              disabled={uploading}
              className="flex items-center gap-2 rounded-xl border border-border bg-white px-5 py-3 text-sm font-medium text-text-muted transition-all hover:text-text-main disabled:opacity-50"
              style={{ transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)" }}
            >
              <X className="h-4 w-4" />
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
