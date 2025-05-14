"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import LeftSectionElement from "../Convert/LeftSectionElement";
import RightSectionElement from "../Convert/RightSectionElement";
import { motion, AnimatePresence } from "framer-motion";

interface ToolsDropDownProps {
  isOpen: boolean;
  onToggle: (open: boolean) => void;
}

type ActiveSection =
  | "AIPDF"
  | "View&Edit"
  | "Organize"
  | "AIPresenet"
  | "MoreTools";

const LEFT_FIXED_WIDTH = 369;
const LEFT_FIXED_HEIGHT = 412;
const DIVIDER_WIDTH = 12;

export default function ToolsDropDown({
  isOpen,
  onToggle,
}: ToolsDropDownProps) {
  const [activeSection, setActiveSection] = useState<ActiveSection>("AIPDF");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const rightWidthMapping: Record<ActiveSection, number> = {
    AIPDF: 301,
    "View&Edit": 241,
    Organize: 241,
    AIPresenet: 211,
    MoreTools: 441,
  };

  const [rightWidth, setRightWidth] = useState<number>(
    rightWidthMapping[activeSection]
  );

  const containerWidth = LEFT_FIXED_WIDTH + DIVIDER_WIDTH + rightWidth;

  useEffect(() => {
    setRightWidth(rightWidthMapping[activeSection]);
  }, [activeSection]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onToggle(false);
        setActiveSection("AIPDF");
      }
    };

    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onToggle]);

  const renderRightSection = () => {
    switch (activeSection) {
      case "AIPDF":
        return (
          <div className="flex flex-col space-y-2">
            <RightSectionElement text="Chat With PDF" src="/AI-PDF/chat.png" />
            <RightSectionElement
              text="AI PDF Summarizer"
              src="/AI-PDF/summarize.png"
            />
            <RightSectionElement
              text="Translate PDF"
              src="/AI-PDF/translate.png"
            />
            <RightSectionElement
              text="AI Questions Generator"
              src="/AI-PDF/aiquestion.png"
            />
          </div>
        );
      case "View&Edit":
        return (
          <div className="grid grid-cols gap-2">
            <RightSectionElement text="Edit PDF" src="/VIEWANDEDIT/text.png" />
            <RightSectionElement
              text="Annote PDF"
              src="/VIEWANDEDIT/annote.png"
            />
            <RightSectionElement
              text="PDF Reader"
              src="/VIEWANDEDIT/reader.png"
            />
            <RightSectionElement
              text="Number Pages"
              src="/VIEWANDEDIT/number.png"
            />
            <RightSectionElement text="Crop PDF" src="/VIEWANDEDIT/crop.png" />
            <RightSectionElement
              text="Redact PDF"
              src="/VIEWANDEDIT/redact.png"
            />
            <RightSectionElement
              text="Watermark PDF"
              src="/VIEWANDEDIT/watermark.png"
            />
          </div>
        );
      case "Organize":
        return (
          <div className="flex flex-col space-y-2">
            <RightSectionElement text="Merge PDF" src="/ORGANIZE/merge.png" />
            <RightSectionElement text="Split PDF" src="/ORGANIZE/split.png" />
            <RightSectionElement text="Rotate PDF" src="/ORGANIZE/rotate.png" />
            <RightSectionElement
              text="Delete Pages"
              src="/ORGANIZE/delete.png"
            />
            <RightSectionElement
              text="Extract PDF Pages"
              src="/ORGANIZE/extract.png"
            />
            <RightSectionElement
              text="Organize Pages"
              src="/ORGANIZE/organize.png"
            />
          </div>
        );
      case "AIPresenet":
        return (
          <div className="flex flex-col space-y-2">
            <RightSectionElement
              text="Generate"
              src="/AI-PRESENTATION/generate.png"
            />
            <RightSectionElement
              text="Single Slide"
              src="/AI-PRESENTATION/single.png"
            />
            <RightSectionElement
              text="Edit PPT"
              src="/AI-PRESENTATION/edit.png"
            />
          </div>
        );
      case "MoreTools":
        return (
          <div className="grid grid-cols-2 gap-x-8">
            <div className="flex flex-col space-y-6">
              <div>
                <h5 className="text-xs mb-2">Sign</h5>
                <RightSectionElement text="Sign PDF" src="/tools/sign.png" />
              </div>
              <div>
                <h5 className="text-xs mb-2">Compress</h5>
                <RightSectionElement
                  text="Compress PDF"
                  src="/tools/compress.png"
                  link="/pdfcompress"
                />
              </div>
              <div>
                <h5 className="text-xs mb-2">Scan</h5>
                <RightSectionElement
                  text="PDF Scanner"
                  src="/tools/scanner.png"
                />
              </div>
            </div>
            <div className="flex flex-col space-y-6">
              <div>
                <h5 className="text-xs mb-2">PDF Security</h5>
                <div className="flex flex-col space-y-2">
                  <RightSectionElement
                    text="Unlock PDF"
                    src="/tools/unlock.png"
                  />
                  <RightSectionElement
                    text="Protect PDF"
                    src="/tools/lock.png"
                  />
                  <RightSectionElement text="Flat PDF" src="/tools/flat.png" />
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="text-sm text-gray-500">
            Please select a tool from the left menu
          </div>
        );
    }
  };

  return (
    <div className="relative hover:text-[#61e987]">
      <button
        onClick={() => onToggle(!isOpen)}
        className="px-3 py-2 text-sm font-medium flex items-center hover:cursor-pointer"
      >
        Tool ▼
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={dropdownRef}
            animate={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.95 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="absolute left-0 mt-6 bg-[#E6E6ED] text-black rounded-md shadow-xl z-50 p-4"
            style={{
              width: containerWidth,
              height: LEFT_FIXED_HEIGHT,
            }}
          >
            <div className="flex h-full">
              {/* Left Section */}
              <motion.div
                className="bg-white rounded-md p-4 flex flex-col h-full"
                style={{ width: LEFT_FIXED_WIDTH, flexShrink: 0 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h5 className="text-xs mb-4">Convert</h5>
                <div className="flex flex-col space-y-2 flex-1 overflow-hidden">
                  <LeftSectionElement
                    text="AI PDF"
                    onClick={() => setActiveSection("AIPDF")}
                    src="/ai.png"
                  />
                  <LeftSectionElement
                    text="View & Edit"
                    onClick={() => setActiveSection("View&Edit")}
                    src="/ai.png"
                  />
                  <LeftSectionElement
                    text="Organize"
                    onClick={() => setActiveSection("Organize")}
                    src="/ai.png"
                  />
                  <LeftSectionElement
                    text="AI Presentation Maker"
                    onClick={() => setActiveSection("AIPresenet")}
                    src="/ai.png"
                  />
                  <div className="mt-auto pt-4">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50 cursor-pointer"
                      onClick={() => setActiveSection("MoreTools")}
                    >
                      <span className="text-sm font-medium text-gray-500">
                        More Tools
                      </span>
                      <Image
                        src="/arrow.png"
                        alt=""
                        width={9}
                        height={4.5}
                        className="transition-transform duration-200 group-hover:translate-x-1"
                      />
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              <div className="bg-[#E6E6ED]" style={{ width: DIVIDER_WIDTH }} />

              {/* Right Section */}
              <motion.div
                className={`bg-white rounded-md p-4 h-full ${
                  activeSection === "View&Edit"
                    ? "overflow-hidden"
                    : "overflow-y-auto"
                }`}
                animate={{ width: rightWidth }}
                initial={false}
                transition={{
                  duration: 0.5,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                key={activeSection}
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col h-full space-y-4"
                >
                  <h5 className="text-xs mb-2">
                    {activeSection.replace("&", " & ")}
                  </h5>
                  <div className="flex flex-col space-y-2 flex-1">
                    {renderRightSection()}
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
