import React from 'react';

export default function Page() {
  return (
    <div className='pb-10 bg-[#E6E6ED] overflow-x-hidden h-screen'>
      {/* Header */}
      <div className='h-auto w-full bg-[#FFFFFF] border-b border-gray-300 shadow-lg px-4 py-4'>
        <h1 className='text-[24px] font-semibold lg:text-start md:text-start  text-center'>
          PDF <img src='/exchange.png' alt="Exchange" className="inline-block mx-2" height={50} width={20} /> Excel
        </h1>
      </div>

      {/* File Info */}
      <div className='flex justify-center items-center h-auto w-full pt-16 px-4'>
        <div className='text-center w-full'>
          <div className='flex justify-center items-center'>
            <img 
              src='/Word file.png' 
              className='max-w-[300px] w-full h-auto' 
              alt="Word file" 
            />
          </div>
          <p className='text-[14px] text-[#555555] pt-5'>
            Personal-scanned-letter-template.docx (5.1MB)
          </p>
        </div>
      </div>

      {/* Uploading Text */}
      <h5 className='text-[24px] font-bold text-center pt-5'>Uploading...</h5>

      {/* Progress Bar */}
      <div className='flex justify-center items-center pt-4'>
        <div className='h-[20px] w-[80%] max-w-[300px] bg-[#FFFFFF] rounded-[15px] overflow-hidden shadow'>
          <div
            className="h-[20px] w-[10%] rounded-full transition-all duration-500 ml-[2px]"
            style={{
              backgroundImage: 'linear-gradient(to right, #06044B 30%, #61E987 70%)'
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
