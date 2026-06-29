 /* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { 
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  FileText
} from "lucide-react";

interface Props {
  initialDocuments: any[];
}

export function KycClient({ initialDocuments }: Props) {
  const router = useRouter();
  const supabase = createClient();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 5 * 1024 * 1024) {
        setErrorMsg("File size must be under 5MB");
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setErrorMsg(null);
    }
  };

  const onSubmit = async () => {
    if (!file) {
      setErrorMsg("Please select a document to upload");
      return;
    }

    setIsUploading(true);
    setErrorMsg(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Unauthorized");

      // 1. Upload to Storage
      const timestamp = Date.now();
      const safeFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const path = `${user.id}/business_reg/${timestamp}-${safeFilename}`;

      const { error: uploadError } = await supabase.storage
        .from("brand-kyc-documents")
        .upload(path, file, { upsert: false });

      if (uploadError) {
        throw new Error("Failed to upload document: " + uploadError.message);
      }

      // 2. Call API to record metadata and update status
      const res = await fetch("/api/brand/kyc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          document_type: "business_registration",
          bucket: "brand-kyc-documents",
          path,
          original_filename: file.name,
          mime_type: file.type,
          size_bytes: file.size
        })
      });

      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        throw new Error("Server returned non-JSON response");
      }

      const result = await res.json();
      if (!res.ok || !result.ok) {
        throw new Error(result.error?.message || "Failed to submit KYC");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-full py-2 sm:py-4">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-left">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Verification
          </h2>
          <p className="mt-2 text-sm text-slate-500 font-medium">
            Upload your business registration or GST certificate to get verified and access the platform.
          </p>
        </div>

        {initialDocuments.length > 0 && (
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-4">Uploaded Documents</h3>
            <div className="space-y-3">
              {initialDocuments.map(doc => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-brand-red-50 text-brand-red-600 rounded-lg flex items-center justify-center">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{doc.original_filename}</p>
                      <p className="text-[10px] text-slate-500">{new Date(doc.uploaded_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${doc.status === 'Verified' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200"
        >
          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3 text-red-700 text-xs font-semibold">
              <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="space-y-6">
            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:bg-slate-50 transition cursor-pointer relative">
              <input 
                type="file" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept=".pdf,.png,.jpg,.jpeg,.webp"
                onChange={handleFileChange}
                disabled={isUploading}
              />
              
              {!file ? (
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <UploadCloud className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-700">Click to upload or drag and drop</p>
                    <p className="text-xs text-slate-400 mt-1">PDF, PNG, JPG up to 5MB</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{file.name}</p>
                    <p className="text-xs text-slate-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <p className="text-xs text-brand-red-600 font-bold uppercase tracking-wider mt-2 z-10 pointer-events-auto" onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                  }}>Remove file</p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
              <button
                onClick={onSubmit}
                disabled={isUploading || !file}
                className="w-full md:w-auto md:px-12 ml-auto flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white rounded-xl py-3.5 text-sm font-bold transition disabled:opacity-75 cursor-pointer shadow-lg shadow-slate-900/10"
              >
                {isUploading ? "Uploading..." : "Submit Verification"}
                {!isUploading && <ArrowRight className="h-4 w-4" />}
              </button>
              
              <button
                onClick={() => router.push("/dashboard")}
                disabled={isUploading}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 transition text-center w-full md:w-auto md:ml-auto md:px-12 cursor-pointer uppercase tracking-wider"
              >
                Skip for now
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
