"use client";
import { LuFileText } from "react-icons/lu"; // Import the file icon
import React, { useRef } from "react";
import { FaChevronDown } from "react-icons/fa";
import "../../styles/customBorder.css";


export default function Page() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Handle the file input trigger
  const handleChooseFiles = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger hidden file input
    }
  };

  // Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("Selected file:", file); // Log selected file
    }
  };

  return (
    <div className="flex justify-center items-center h-screen w-full  sm:px-8 md:px-10 bg-[#E6E6ED] overflow-x-hidden">
      <div className="w-full max-w-4xl">
        <h1 className="text-center text-[#000000] font-semibold py-10 text-3xl sm:text-4xl md:text-5xl">
          Excel to PDF Converter
        </h1>

        <div className="px-4 sm:px-6">
          {/* Main container with responsive width and height */}
          <div className="bg-white border border-gray-500 rounded-lg w-full lg:w-[930px] lg:h-[367px] md:w-full h-auto flex justify-center items-center p-6 sm:p-8 md:p-10">
            <div className=" custom-dashed-border  w-full rounded-lg p-6 bg-[#F3F3F3] flex flex-col justify-center">
              <h2 className="text-center text-[#06044B] text-xl sm:text-2xl md:text-3xl py-5 font-semibold">
                Drag & Drop your file here
              </h2>

              <div className="flex items-center gap-4 py-2 px-6 sm:px-8 md:px-10">
                <div className="flex-1 border-t border-gray-500"></div>
                <span className="text-[#06044B] text-lg sm:text-xl font-semibold">
                  Or
                </span>
                <div className="flex-1 border-t border-gray-500"></div>
              </div>

              <div className="flex justify-center items-center gap-[1px] mt-6 flex-nowrap">
                {/* Button container */}
                <div className="h-[40px] lg:w-[145px] md:w-[150px] sm:w-[150px] w-[auto]">
                  <button
                    onClick={handleChooseFiles} // Click to open file input
                    className="bg-[#06044B] text-white px-2 py-2 rounded-l-[10px] flex items-center gap-2 h-full text-sm sm:text-base cursor-pointer"
                  >
                    {/* File Icon */}
                    <LuFileText className="text-white text-lg" />
                    CHOOSE FILES
                  </button>
                </div>

                {/* Icon container */}
                <div
                  onClick={handleChooseFiles} // Icon click also triggers file input
                  className="bg-[#06044B] flex items-center justify-center  rounded-r-[10px] cursor-pointer h-[40px] w-[50px] lg:py-[11px] md:py-[11px] sm:py-[11px] py-[9px] px-2"
                >
                  <FaChevronDown className="text-white text-lg" />
                </div>

                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange} // Handle file selection
                />
              </div>

              <p className="text-center text-[#555555] text-sm sm:text-base pt-4">
                Supported formats: .pdf, .doc, .docx, .ppt, .pptx, .xls, .xlsx,
                .jpg, .jpeg, .png, .gif, .txt
                <br />
                Max file size: 50MB
              </p>
            </div>
          </div>
        </div>

        <p className="text-center text-black pt-4 text-sm sm:text-base md:text-lg lg:text-xl">
          Quickly convert your Excel Spreadsheet to PDFs in seconds. Simple and
          fast, with no signups or downloads required.
        </p>
      </div>
    </div>
  );
}
