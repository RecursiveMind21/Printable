import React from "react";
import { GoDownload } from "react-icons/go";
import { IoIosArrowDown } from "react-icons/io";
import { MdPrint } from "react-icons/md";
import { FiUpload } from "react-icons/fi";
import { IoShareSocialOutline } from "react-icons/io5";
import { AiOutlineDelete } from "react-icons/ai"; // Delete icon

export default function Page() {
  return (
    <div className="bg-[#E6E6ED] overflow-x-hidden h-screen">
      {/* Header */}
      <div className="h-auto w-full bg-[#FFFFFF] border-b border-gray-300 shadow-lg px-4 py-4">
        {/* Header content can be added here */}
      </div>

      {/* File Info Section */}
      <div className="flex flex-wrap justify-center">
        <div className="h-auto lg:w-[75%] md:w-[60%] sm:w-[60%] w-full flex justify-center pt-10">
          <div>
            <img
              src="/pdf file.png"
              className="h-auto w-[200px]"
              alt="PDF File"
            />
            <h3 className="text-[14px] text-[#555555] pt-4 pb-4">
              Personal-letter-template.pdf
            </h3>
          </div>
        </div>

        <div className="h-screen lg:w-[25%] md:w-[40%] sm:w-[40%] w-full bg-gradient-to-b from-[#DFFBE7] to-[#CDCDDB] px-10 py-10 lg:mt-0 md:mt-0 sm:mt-0">
          <h3 className="text-[16px] font-semibold border-b-2 border-dashed border-gray-500">
            Personal-letter-template.pdf
          </h3>

          {/* Download Section */}
          <div className="flex gap-[2px] mt-4">
            {/* For larger screens, align text left; for smaller screens, align text center */}
            <div className="h-[40px] flex items-center w-full bg-[#06044B] rounded-l-[10px] text-left sm:text-center">
              <button className="text-white px-4 flex items-center gap-2 w-full lg:justify-start md:justify-start justify-center sm:justify-center">
                <GoDownload className="text-white" /> DOWNLOAD
              </button>
            </div>
            <div className="h-[40px] w-[40px] bg-[#06044B] rounded-r-[10px] flex justify-center items-center">
              <button>
                <IoIosArrowDown className="text-white" />
              </button>
            </div>
          </div>

          <h5 className="text-center pt-4 text-[14px]">Or</h5>

          {/* Print Section */}
          <div className="flex justify-center mt-4">
            <button className="flex items-center justify-center bg-[#06044B] text-white rounded-[10px] py-2 px-6 w-[100%]">
              <MdPrint className="text-white mr-2" /> PRINT
            </button>
          </div>

          {/* Export Section */}
          <div className="flex justify-center mt-4">
            <button className="flex items-center justify-center border border-black text-black rounded-[10px] py-2 px-6 w-full gap-2 text-[14px]">
              <FiUpload className="text-black mr-2" /> {/* Upload icon */}
              Export as
              <IoIosArrowDown className="text-black ml-2" /> {/* Dropdown icon */}
            </button>
          </div>

          {/* Share and Delete Buttons */}
          <div className="flex gap-2 mt-4">
            {/* Share Button */}
            <button className="flex items-center justify-center border border-black text-black rounded-[10px] py-2 px-6 w-1/2 gap-2">
              <IoShareSocialOutline className="text-black" />
              Share
            </button>

            {/* Delete Button */}
            <button className="flex items-center justify-center border border-black text-black rounded-[10px] py-2 px-6 w-1/2 gap-2">
              <AiOutlineDelete className="text-black" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
