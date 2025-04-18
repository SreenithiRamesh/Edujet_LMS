import React from 'react';
import { dummyTestimonial } from '../../../assets/assets'; // adjust path as needed
import { Star, StarHalf } from 'lucide-react'; // or use your own star icon if preferred

const renderStars = (rating) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;

  const stars = [];

  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <Star
        key={`star-${i}`}
        className="text-yellow-500 w-4 h-4 fill-yellow-500 shrink-0"
      />
    );
  }

  if (halfStar) {
    stars.push(
      <StarHalf
        key="half-star"
        className="text-yellow-500 w-4 h-4 fill-yellow-500 shrink-0"
      />
    );
  }

  return <div className="flex flex-wrap gap-1">{stars}</div>;
};

const Testimonial = () => {
  return (
    <div className="py-16 px-4 sm:px-6 lg:px-40  overflow-hidden max-w-full">
      <h2 className="text-2xl sm:text-3xl font-semibold text-center text-[#0d47a1] mb-4">
        What Our Learners Say
      </h2>
      <p className="text-center text-gray-600 max-w-2xl mx-auto mb-10 text-sm sm:text-base">
        Hear from the students who transformed their careers through EduJet.
      </p>

      <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {dummyTestimonial.map((testimonial, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-2xl p-5 sm:p-6 transition hover:scale-[1.02] duration-300 border border-[#e0f2ff] min-w-0 overflow-hidden"
          >
            <div className="flex items-center gap-4 mb-4 min-w-0">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-14 h-14 rounded-full border-2 border-[#42a5f5] shrink-0"
              />
              <div className="min-w-0">
                <h3 className="font-semibold text-[#0d47a1] truncate">
                  {testimonial.name}
                </h3>
                <p className="text-sm text-gray-500 truncate">
                  {testimonial.role}
                </p>
                {renderStars(testimonial.rating)}
              </div>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">
              “{testimonial.feedback}”
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonial;
