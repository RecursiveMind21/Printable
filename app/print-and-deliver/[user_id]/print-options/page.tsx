"use client";

import { useState } from "react";
import {
  Printer,
  MapPin,
  CreditCard,
  ChevronDown,
  X,
  ChevronLeft,
  Check,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NavBar } from "@/components/nav-bar";
import { cn } from "@/lib/utils";
import { useOrder } from "@/context/orderContext";
type PrintFile = {
  id: string;
  name: string;
  size: string;
};

export default function PrintOptionsPage() {
  const { order, dispatch } = useOrder();

  // const [files, setFiles] = useState<PrintFile[]>([
  //   { id: "1", name: "theprojetks-design-tokens.pdf", size: "0.10 MB" },
  //   { id: "2", name: "Company Policy.pdf", size: "5.1 MB" },
  //   { id: "3", name: "Marketing Presentation.pptx", size: "3.2 MB" },
  // ]);

  // Track which document's options are expanded (first one by default)
  const [expandedDocId, setExpandedDocId] = useState<string>(
    order.documents[0]?.id || "",
  );

  const removeFile = (id: string) => {
    // If we're removing the expanded document, expand the first remaining one
    const indexToRemove = order.documents.findIndex((doc) => doc.id === id);
    if (indexToRemove !== -1) {
      dispatch({ type: "REMOVE_DOCUMENT", index: indexToRemove });
    }
    if (id === expandedDocId && order.documents.length > 1) {
      const remainingFiles = order.documents.filter((f) => f.id !== id);
      if (remainingFiles.length > 0) {
        setExpandedDocId(remainingFiles[0].id);
      } else {
        setExpandedDocId("");
      }
    }
  };

  const toggleDocumentOptions = (id: string) => {
    setExpandedDocId(expandedDocId === id ? "" : id);
  };

  const getFileIcon = (filename: string) => {
    const ext = filename.split(".").pop()?.toLowerCase() || "";

    // Different colors for different file types
    let fillColor = "#FF5252";
    let pathColor = "#FF8A80";

    if (["jpg", "jpeg", "png", "gif"].includes(ext)) {
      fillColor = "#4CAF50";
      pathColor = "#A5D6A7";
    } else if (["doc", "docx"].includes(ext)) {
      fillColor = "#2196F3";
      pathColor = "#90CAF9";
    } else if (["xls", "xlsx"].includes(ext)) {
      fillColor = "#4CAF50";
      pathColor = "#A5D6A7";
    } else if (["ppt", "pptx"].includes(ext)) {
      fillColor = "#FF9800";
      pathColor = "#FFCC80";
    }

    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="4" fill={fillColor} />
        <path
          d="M7 18V6C7 5.44772 7.44772 5 8 5H16C16.5523 5 17 5.44772 17 6V18C17 18.5523 16.5523 19 16 19H8C7.44772 19 7 18.5523 7 18Z"
          fill={pathColor}
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
        <div className="flex justify-center items-center w-full max-w-2xl mb-12 overflow-x-auto py-4">
          <div className="flex flex-col items-center flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-[#61e987] flex items-center justify-center">
              <Check className="h-6 w-6 text-white" />
            </div>
            <span className="text-xs mt-2 whitespace-nowrap">Upload Files</span>
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

        {/* Print Options Card */}
        <div className="bg-white rounded-xl p-8 w-full max-w-2xl border border-[#90f0ab] mb-6">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 rounded-full bg-[#f0fdf4] flex items-center justify-center mr-4">
              <Printer className="h-6 w-6 text-[#06044b]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Print options</h2>
              <p className="text-sm text-[#555555]">
                Customize your print job settings
              </p>
            </div>
          </div>

          {/* Document List with Expandable Options */}
          <div className="space-y-4">
            {order.documents.map((file) => (
              <div
                key={file.id}
                className="border border-[#e0e0e0] rounded-lg overflow-hidden"
              >
                {/* Document Header - Clickable */}
                <div
                  className={cn(
                    "flex items-center justify-between p-3 cursor-pointer transition-colors",
                    expandedDocId === file.id
                      ? "bg-[#f0fdf4] border-b border-[#e0e0e0]"
                      : "bg-white hover:bg-gray-50",
                  )}
                  onClick={() => toggleDocumentOptions(file.id)}
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 mr-3">
                      {getFileIcon(file.fileName)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#06044b]">
                        {file.fileName}
                      </p>
                      <p className="text-xs text-[#999999]">{file.size}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {expandedDocId !== file.id && (
                      <div className="mr-3 text-xs text-[#61e987] flex items-center">
                        <span>Click to configure</span>
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </div>
                    )}
                    <div className="flex items-center">
                      <button
                        className="text-[#999999] hover:text-[#06044b] mr-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(file.id);
                        }}
                      >
                        <X className="h-5 w-5" />
                      </button>
                      <ChevronDown
                        className={cn(
                          "h-5 w-5 text-[#999999] transition-transform",
                          expandedDocId === file.id
                            ? "transform rotate-180"
                            : "",
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* Expanded Print Options */}
                {expandedDocId === file.id && (
                  <div className="p-4 bg-white">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-[#555555] mb-2">
                          Pages to Print
                        </label>
                        <div className="relative">
                          <Input
                            type="text"
                            defaultValue="1"
                            className="pl-3 pr-10 py-2 border border-[#d0d0d0] rounded-md bg-[#f0fdf4] focus:outline-none focus:ring-1 focus:ring-[#61e987] focus:border-[#61e987]"
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <ChevronDown className="h-4 w-4 text-[#999999]" />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#555555] mb-2">
                          Print Color
                        </label>
                        <div className="relative">
                          <button className="w-full flex items-center justify-between pl-3 pr-3 py-2 border border-[#d0d0d0] rounded-md bg-[#f0fdf4] text-left">
                            <span>Color</span>
                            <ChevronDown className="h-4 w-4 text-[#999999]" />
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#555555] mb-2">
                          Page Orientation
                        </label>
                        <div className="relative">
                          <button className="w-full flex items-center justify-between pl-3 pr-3 py-2 border border-[#d0d0d0] rounded-md bg-[#f0fdf4] text-left">
                            <span>Portrait</span>
                            <ChevronDown className="h-4 w-4 text-[#999999]" />
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#555555] mb-2">
                          Pages Per Sheet
                        </label>
                        <div className="relative">
                          <button className="w-full flex items-center justify-between pl-3 pr-3 py-2 border border-[#d0d0d0] rounded-md bg-[#f0fdf4] text-left">
                            <span>Odd pages only</span>
                            <ChevronDown className="h-4 w-4 text-[#999999]" />
                          </button>
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-[#555555] mb-2">
                          Paper Size
                        </label>
                        <div className="relative">
                          <button className="w-full flex items-center justify-between pl-3 pr-3 py-2 border border-[#d0d0d0] rounded-md bg-[#f0fdf4] text-left">
                            <span>A4 (8.27" x 11.69")</span>
                            <ChevronDown className="h-4 w-4 text-[#999999]" />
                          </button>
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-[#555555] mb-2">
                          Paper Margin
                        </label>
                        <div className="relative">
                          <button className="w-full flex items-center justify-between pl-3 pr-3 py-2 border border-[#d0d0d0] rounded-md bg-[#f0fdf4] text-left">
                            <span>Normal</span>
                            <ChevronDown className="h-4 w-4 text-[#999999]" />
                          </button>
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-[#555555] mb-2">
                          Number of Copies
                        </label>
                        <Input
                          type="number"
                          defaultValue="1"
                          min="1"
                          className="w-full pl-3 pr-3 py-2 border border-[#d0d0d0] rounded-md bg-[#f0fdf4] focus:outline-none focus:ring-1 focus:ring-[#61e987] focus:border-[#61e987]"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add Document Button */}
          <div className="mt-4">
            <Button
              variant="outline"
              className="w-full border-dashed border-[#d0d0d0] text-[#555555] hover:bg-[#f0fdf4] hover:text-[#06044b]"
            >
              + Add another document
            </Button>
          </div>
        </div>

        {/* Location Selection Card */}
        <div className="bg-white rounded-xl p-8 w-full max-w-2xl border border-[#90f0ab] mb-6">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 rounded-full bg-[#f0fdf4] flex items-center justify-center mr-4">
              <MapPin className="h-6 w-6 text-[#06044b]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Location Selection</h2>
              <p className="text-sm text-[#555555]">
                Choose a merchant and delivery option
              </p>
            </div>
          </div>

          <p className="text-center text-[#999999] py-6">
            Complete the previous steps to select a location.
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between w-full max-w-2xl">
          <Button
            variant="outline"
            className="flex items-center gap-2 border-[#d0d0d0] text-[#555555]"
            onClick={() => window.history.back()}
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
          <Button className="bg-[#06044b] hover:bg-[#06044b]/90 text-white px-6 uppercase text-xs font-semibold tracking-wider">
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
