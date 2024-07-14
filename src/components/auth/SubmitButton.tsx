import React from "react";
import { PulseLoader } from "react-spinners";

const SubmitButton = ({
  isPending,
  buttonText,
}: {
  isPending: boolean;
  buttonText: string;
}) => {
  return (
    <button
      disabled={isPending}
      type="submit"
      className="text-white bg-black border-2 border-white rounded-lg text-xl py-2 my-1 tracking-wide  min-h-[48px]"
    >
      {!isPending ? (
        buttonText
      ) : (
        <PulseLoader
          className="flex items-center justify-center "
          color={"#fff"}
        />
      )}
    </button>
  );
};

export default SubmitButton;
