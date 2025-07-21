import React from "react";
import SearchBar from "../SearchBar/SearchBar";

const HeroSection = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full md:pt-36 pt-20 px-5 md:px-0 space-y-7 text-center bg-gradient-to-b from-[#bbdefb]">
      <h1 className="md:text-[48px] leading-[56px] text-[28px] relative font-bold text-gray-800 max-w-3xl mx-auto">
        Unlock a universe of learning made to fuel your{" "}
        <span className="text-[#0d47a1]"> passion </span>and{" "}
        <span className="text-[#0d47a1]"> profession.</span>
      </h1>

      <p className="md:block hidden text-gray-500 max-w-2xl mx-auto">
        EduJet delivers immersive, flexible, and future-ready education—tailored
        just for you.
      </p>
      <p className="md:hidden text-gray-500 max-w-sm mx-auto">
        EduJet delivers immersive, flexible, and future-ready education—tailored
        just for you.
      </p>
      <SearchBar />
    </div>
  );
};

export default HeroSection;
