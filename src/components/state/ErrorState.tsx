import React from "react";
import Lottie from "lottie-react";
import ErrorStateLottie from "@src/components/LottieFiles/ErrorState.json";

interface ErrorStateProps {
  onRefetch: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ onRefetch }) => {
  return (
    <div className=" bg-white flex-1 p-3 sm:p-6 overflow-y-auto flex items-center justify-center ">
      <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <Lottie
          animationData={ErrorStateLottie}
          loop={true}
          style={{ width: 180, height: 180 }}
        />
        <p className="text-gray-400 -mt-4 mb-3 sm:mb-4 text-sm sm:text-base">
          Something went wrong while fetching hadiths. <br /> Please try again.
        </p>
        <button
          className="text-xs sm:text-sm text-gray-500 border p-1.5 sm:p-2 rounded-sm relative overflow-hidden group hover:cursor-pointer"
          onClick={onRefetch}
        >
          <span className="relative z-10 transition-colors duration-150 group-hover:text-white">
            Refresh
          </span>
          <span className="absolute inset-0 bg-black/80 transform scale-x-0 origin-left transition-transform duration-150 ease-in-out group-hover:scale-x-100"></span>
        </button>
      </div>
    </div>
  );
};
