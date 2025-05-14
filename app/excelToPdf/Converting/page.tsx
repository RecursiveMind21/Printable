import React from 'react';
import { FaCircleArrowRight } from "react-icons/fa6";

export default function Page() {
  return (
    <div className="overflow-x-hidden bg-[#E6E6ED] pb-20 h-screen">
      {/* Header */}
      <div className="w-full bg-[#FFFFFF] border-b border-gray-300 shadow-lg px-4 py-4">
        <h1 className="text-[20px] sm:text-[24px] font-semibold lg:text-start md:text-start  text-center">
          Excel 
          <img 
            src="/exchange.png" 
            alt="Exchange" 
            className="inline-block mx-2 align-middle w-[20px] h-auto" 
          /> 
          PDF
        </h1>
      </div>

      
      {/* Image Section */}
      <div className="flex justify-center items-center pt-10 px-4">
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 ">
          {/* Left Image */}
          <img
            src="/Letter.png"
            className="w-[120px] sm:w-[160px] md:w-[180px] h-auto"
            alt="Excel File"
          />

          {/* Icon in Between */}
          <FaCircleArrowRight className="text-[#06044B] text-[32px]" />

          {/* Right Image */}
          <img
            src="/pdf file.png"
            className="w-[120px] sm:w-[160px] md:w-[180px] h-auto"
            alt="PDF File"
          />
        </div>
      </div>

            {/* File Info */}
            <p className="text-[14px] text-[#555555] pt-5 text-center px-4">
        Personal-scanned-letter-template.docx (5.1MB)
      </p>

            {/* Uploading Text */}
            <h5 className="text-[20px] sm:text-[24px] font-bold text-center pt-5">Converting to PDF</h5>

{/* Progress Bar */}
<div className="flex justify-center items-center pt-4 px-4">
  <div className="h-[20px] w-full max-w-[300px] bg-[#FFFFFF] rounded-[15px] overflow-hidden shadow">
    <div
      className="h-[20px] w-[30px] rounded-full transition-all duration-500 ml-[2px]"
      style={{
        backgroundImage: 'linear-gradient(to right, #06044B 30%, #61E987 70%)'
      }}
    ></div>
  </div>
</div>

      






     
    </div>
  );
}
