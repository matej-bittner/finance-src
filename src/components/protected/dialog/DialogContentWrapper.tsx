import React from "react";

interface TableDialogWrapperProps {
  children: React.ReactNode;
  title: string;
  description: string;
  buttonText?: string;
  showDeleteButton?: boolean;
  titleCenter?: boolean;
}
const DialogContentWrapper = ({
  children,
  title,
  description,
  showDeleteButton,
  buttonText,
  titleCenter,
}: TableDialogWrapperProps) => {
  return (
    <div className="flex flex-col gap-2 min-[450px]:gap-3 tb:gap-4 relative">
      <div className={`${titleCenter && "text-center"}`}>
        <h1 className="font-medium text-lg underline sm:text-2xl">{title}</h1>
        <p className="max-lg:text-sm">{description}</p>
      </div>
      {children}
      {showDeleteButton && (
        <button className="py-1 px-2 bg-black text-white rounded-lg mt-2">
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default DialogContentWrapper;
