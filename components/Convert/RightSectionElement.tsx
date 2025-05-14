import Image from "next/image";
import Link from "next/link";

type RightSectionElementProps = {
  text: string;
  src: string;
  onClick?: () => void;
  link?: string;
};

export default function RightSectionElement({
  text,
  src,
  onClick,
  link,
}: RightSectionElementProps) {
  const content = (
    <div
      className="flex items-center space-x-3 hover:cursor-pointer"
      onClick={onClick}
    >
      <Image src={src} alt="" width={24} height={24} />
      <span className="relative text-base font-medium after:block after:h-[2px] after:w-0 after:bg-gray-500 after:absolute after:bottom-0 after:left-0 after:transition-all after:duration-300 hover:after:w-full">
        {text}
      </span>
    </div>
  );

  return link ? (
    <Link
      href={link}
      className="flex items-center justify-between p-2 rounded-md"
    >
      {content}
    </Link>
  ) : (
    <div className="flex items-center justify-between p-2 rounded-md">
      {content}
    </div>
  );
}
