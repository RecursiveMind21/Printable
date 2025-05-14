"use client";

import { useState, useCallback } from "react";
import {
  FileText,
  Printer,
  MapPin,
  CreditCard,
  Upload,
  X,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDropzone } from "react-dropzone";
import { NavBar } from "@/components/nav-bar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useOrder, DocumentItem } from "@/context/orderContext";
import { BreadcrumbLink } from "@/components/ui/breadcrumb";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export default function PrintablePage() {
  const User = useUser();
  const { order, dispatch } = useOrder();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{
    text: string;
    isError?: boolean;
  } | null>(null);
  const router = useRouter();

  /**
   * Upload a single file and sync with context
   */
  const uploadFile = async (file: File): Promise<DocumentItem | null> => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_BASE_URL}/api/file/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(
          `Upload failed: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();
      const newDoc: DocumentItem = {
        id: data.fileId,
        fileName: file.name,
        fileUrl: data.fileUrl,
        copies: 1,
        colorType: "black_and_white",
        paperType: "A4",
        printType: "front",
        pageDirection: "vertical",
        size: file.size,
      };
      dispatch({ type: "ADD_DOCUMENT", payload: newDoc });
      return newDoc;
    } catch (err: any) {
      console.error("Upload error:", err);
      const errorDoc: DocumentItem = {
        id: `error-${Date.now()}`,
        fileName: file.name,
        fileUrl: "",
        copies: 1,
        colorType: "black_and_white",
        paperType: "A4",
        printType: "front",
        pageDirection: "vertical",
        size: file.size,
        error: err.message || String(err),
      };
      dispatch({ type: "ADD_DOCUMENT", payload: errorDoc });
      return null;
    }
  };

  /**
   * Delete a single file via API and sync context
   */
  const deleteFile = async (
    fileId: string,
    fileName: string,
    index: number,
  ) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/file/${encodeURIComponent(fileId)}`,
        { method: "DELETE" },
      );

      if (!response.ok) {
        throw new Error(
          `Delete failed: ${response.status} ${response.statusText}`,
        );
      }

      await response.json();
      dispatch({ type: "REMOVE_DOCUMENT", index });
      setStatusMessage({ text: `${fileName} was successfully deleted.` });
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: any) {
      console.error("Delete error:", err);
      setStatusMessage({
        text: `Failed to delete ${fileName}.`,
        isError: true,
      });
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!acceptedFiles.length) return;

      setIsUploading(true);
      setUploadError(null);
      setStatusMessage(null);

      const results = await Promise.all(acceptedFiles.map(uploadFile));
      const successCount = results.filter(Boolean).length;
      const failCount = acceptedFiles.length - successCount;

      if (failCount) {
        setUploadError(`Failed to upload ${failCount} file(s).`);
      } else {
        setStatusMessage({
          text: `Successfully uploaded ${successCount} file(s).`,
        });
        setTimeout(() => setStatusMessage(null), 3000);
      }

      setIsUploading(false);
    },
    [dispatch],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "application/vnd.ms-powerpoint": [".ppt"],
      "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        [".pptx"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/gif": [".gif"],
      "text/plain": [".txt"],
    },
    maxSize: 50 * 1024 * 1024,
  });

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const getFileExtension = (filename: string) =>
    filename.split(".").pop()?.toLowerCase() || "";
  const getFileIcon = (filename: string) => {
    const ext = getFileExtension(filename);
    let fill = "#FF5252",
      path = "#FF8A80";
    if (["jpg", "jpeg", "png", "gif"].includes(ext)) {
      fill = "#4CAF50";
      path = "#A5D6A7";
    }
    if (["doc", "docx"].includes(ext)) {
      fill = "#2196F3";
      path = "#90CAF9";
    }
    if (["xls", "xlsx"].includes(ext)) {
      fill = "#4CAF50";
      path = "#A5D6A7";
    }
    if (["ppt", "pptx"].includes(ext)) {
      fill = "#FF9800";
      path = "#FFCC80";
    }
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="4" fill={fill} />
        <path
          d="M7 18V6C7 5.44772 7.44772 5 8 5H16C16.5523 5 17 5.44772 17 6V18C17 18.5523 16.5523 19 16 19H8C7.44772 19 7 18 7 18Z"
          fill={path}
        />
        <path
          d="M9 9H15M9 12H15M9 15H13"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  };
  return (
    <div className="min-h-screen bg-[#dffbe7] flex flex-col">
      <div className="flex-1 flex flex-col items-center py-12 px-4">
        <div className="max-w-3xl w-full text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Print Your Documents with
            <span className="block text-[#61e987]">Printable</span>
          </h1>
          <p className="text-center max-w-xl mx-auto">
            Seamlessly upload your files, customize your print job, and have it
            delivered or ready for pickup
          </p>
        </div>

        {/* Process Steps */}
        {/* Upload -> Print -> Location -> Pay steps as before */}
        <div className="flex justify-center items-center w-full max-w-2xl mb-12 overflow-x-auto py-4">
          <div className="flex flex-col items-center flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
              <FileText className="h-6 w-6 text-[#06044b]" />
            </div>
            <span className="text-xs mt-2 whitespace-nowrap">
              Upload Document
            </span>
          </div>
          <div className="h-[2px] w-16 bg-[#61e987] flex-shrink-0"></div>
          <div className="flex flex-col items-center flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
              <Printer className="h-6 w-6 text-[#06044b]" />
            </div>
            <span className="text-xs mt-2 whitespace-nowrap">
              Print Options
            </span>
          </div>
          <div className="h-[2px] w-16 bg-[#61e987] flex-shrink-0"></div>
          <div className="flex flex-col items-center flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
              <MapPin className="h-6 w-6 text-[#06044b]" />
            </div>
            <span className="text-xs mt-2 whitespace-nowrap">
              Select Location
            </span>
          </div>
          <div className="h-[2px] w-16 bg-[#61e987] flex-shrink-0"></div>
          <div className="flex flex-col items-center flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-[#06044b]" />
            </div>
            <span className="text-xs mt-2 whitespace-nowrap">Review & Pay</span>
          </div>
        </div>
        {/* Upload Card */}
        <div className="bg-white rounded-xl p-8 w-full max-w-2xl border border-[#90f0ab]">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-[#f0fdf4] flex items-center justify-center mr-4">
              <FileText className="h-6 w-6 text-[#06044b]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Upload Your Document</h2>
              <p className="text-sm text-[#555555]">
                Select the file you want to print
              </p>
            </div>
          </div>

          {/* Status Message */}
          {statusMessage && (
            <Alert
              variant={statusMessage.isError ? "destructive" : "default"}
              className={`mb-4 ${statusMessage.isError ? "bg-red-50 border-red-200" : "bg-[#f0fdf4] border-[#90f0ab]"}`}
            >
              {statusMessage.isError ? (
                <AlertCircle className="h-4 w-4" />
              ) : null}
              <AlertDescription>{statusMessage.text}</AlertDescription>
            </Alert>
          )}

          {uploadError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{uploadError}</AlertDescription>
            </Alert>
          )}

          {/* Drop Area */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed ${isDragActive ? "border-[#61e987] bg-[#f0fdf4]" : "border-[#d9d9d9] bg-[#e6e6ed]"}
                                 rounded-lg p-8 mb-6 flex flex-col items-center justify-center cursor-pointer transition-colors`}
          >
            <input {...getInputProps()} />
            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center mb-4">
              <Upload className="h-5 w-5 text-[#06044b]" />
            </div>
            <p className="font-medium mb-4">
              {isDragActive
                ? "Drop your files here"
                : "Drag & Drop your file here"}
            </p>
            <div className="w-full flex items-center justify-center mb-4">
              <div className="h-[1px] bg-[#d0d0d0] flex-1"></div>
              <span className="px-3 text-sm text-[#999999]">or</span>
              <div className="h-[1px] bg-[#d0d0d0] flex-1"></div>
            </div>
            <Button
              variant="outline"
              className="bg-white border-[#d9d9d9] text-[#06044b]"
            >
              Select File
            </Button>
            <p className="text-xs text-[#999999] mt-4">
              Supported formats: pdf, doc, docx, ppt, pptx, xls, xlsx, jpg, png,
              gif, txt
            </p>
            <p className="text-xs text-[#999999]">Max file size: 50MB</p>
          </div>

          {/* Global Upload Indicator */}
          {isUploading && (
            <div className="flex items-center justify-center mb-4 text-[#06044b]">
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              <span>Uploading files...</span>
            </div>
          )}

          {/* Uploaded Files */}
          <div className="space-y-3">
            {order.documents.map((fileItem, index) => (
              <div
                key={fileItem.id}
                className={`flex items-center justify-between rounded-lg p-3 border ${
                  fileItem.error
                    ? "bg-red-50 border-red-200"
                    : "bg-[#f0fdf4] border-[#90f0ab]"
                }`}
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 mr-3">
                    {getFileIcon(fileItem.fileName)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#06044b]">
                      {fileItem.fileName}
                    </p>
                    <p className="text-xs text-[#999999]">
                      {formatFileSize(fileItem.size)}
                      {fileItem.error && (
                        <span className="text-red-500 ml-2">
                          {fileItem.error}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                {fileItem.uploading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-[#06044b]" />
                ) : (
                  <button
                    className="text-[#999999] hover:text-[#06044b]"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteFile(fileItem.id, fileItem.fileName, index);
                    }}
                    disabled={fileItem.uploading}
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}

            {/* Show example files only when no real files are uploaded */}
          </div>

          {/* Continue Button */}
          <div className="flex justify-end mt-6">
            <Button
              className="bg-[#06044b] hover:bg-[#06044b]/90 text-white px-6 uppercase text-xs font-semibold tracking-wider"
              onClick={() =>
                router.push(`/print-and-deliver/${User.user?.id}/print-options`)
              }
              disabled={
                isUploading ||
                order.documents.length === 0 ||
                order.documents.some((f) => f.uploading || f.error)
              }
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading
                </>
              ) : (
                "Continue"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
