import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Companies = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1500,
    arrows: false,
    pauseOnHover: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 6 }
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 4 }
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 3 }
      }
    ]
  };

  const dummyImages = [
    "https://ik.imagekit.io/ytissbwn8/logo_course/meta.png",
    "https://ik.imagekit.io/ytissbwn8/36764cad429d97090de6e08a7ef82c7b-removebg-preview.png",
    "https://ik.imagekit.io/ytissbwn8/wipro-removebg-preview.png",
    "https://ik.imagekit.io/ytissbwn8/logo_course/Sify.png",
    "https://ik.imagekit.io/ytissbwn8/8867.Microsoft_-removebg-preview%20(1).png",
    "https://ik.imagekit.io/ytissbwn8/cisco-removebg-preview.png",
    "https://ik.imagekit.io/ytissbwn8/Accenture-Logo-2020-present-removebg-preview.png",
    "https://ik.imagekit.io/ytissbwn8/google_PNG19644.png"
  ];

  return (
    <div className="w-full  mx-auto py-6 px-4 
 text-black">
      <h2 className="text-center text-base font-semibold md:mb-10 mb-5">Our Partners</h2>
      <Slider {...settings}>
        {dummyImages.map((img, index) => (
          <div key={index} className="px-4">
            <div className="gap-6 md:gap-16 w-24 md:w-32  m-3 backdrop-blur-md border border-white/20 shadow-lg rounded-xl p-4 flex  justify-center items-center h-18 transition hover:scale-105 duration-300">
              <img
                src={img}
                alt={`Company ${index + 1}`}
                className="h-28 md:h-32 object-contain"
              />
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Companies;
