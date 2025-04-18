import React, { useState } from "react";

const CourseRating = ({ onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const handleRatingClick = (value) => {
    setRating(value);
  };

  const handleSubmit = () => {
    if (rating === 0) {
      alert("Please select a rating before submitting.");
      return;
    }
    onSubmit(rating);
  };

  return (
    <div className="flex flex-col  justify-center py-6 mt-10 border-t border-gray-300">
      <h2 className="text-xl font-bold text-gray-800 mb-3">Rate this Course</h2>

      <div className="flex gap-2 text-yellow-400 text-3xl mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => handleRatingClick(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className={`cursor-pointer transition-transform duration-200 ${
              (hover || rating) >= star ? "scale-110" : "scale-100 text-gray-300"
            }`}
          >
            ★
          </span>
        ))}
      </div>

      <div className="w-fit">
        <button
          onClick={handleSubmit}
          className="text-xs sm:text-sm md:text-base bg-white text-[#0D47A1] font-semibold px-5 py-2 rounded-full shadow-md border border-[#0D47A1] hover:bg-[#e3f2fd] transition duration-300"
        >
          Submit Rating
        </button>
      </div>
    </div>
  );
};

export default CourseRating;
