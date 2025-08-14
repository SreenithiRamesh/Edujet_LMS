import React, { useContext, useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import YouTube from "react-youtube";
import humanizeDuration from "humanize-duration";
import { AppContext } from "../../Context/AppContext";
import { useParams } from "react-router-dom";
import Footer from "../../Components/Students/Footer/Footer";
import CourseRating from "../../Components/Students/CourseRating/CourseRating";
import { toast } from "react-toastify";
import axios from "axios";
import Loading from "../../Components/Students/Loading/Loading";

const CourseVideo = () => {
  const {
    enrolledCourses,
    calChapterTime,
    backendUrl,
    getToken,
    userData,
    fetchUserEnrolledCourses,
  } = useContext(AppContext);

  const { courseId } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [currentVideo, setCurrentVideo] = useState(null);
  const [progressData, setProgressData] = useState({ lectureCompleted: [] });
  const [initialRating, setInitialRating] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const course = enrolledCourses.find((course) => course._id === courseId);
    if (course) {
      setCourseData(course);
      const userRating = course.CourseRating?.find(
        (r) => r.userId === userData?._id
      );
      if (userRating) setInitialRating(userRating.rating);
    }
  }, [enrolledCourses, courseId, userData]);

  const fetchCourseProgress = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/user/get-course-progress`,
        { courseId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        setProgressData(data.progress || { lectureCompleted: [] });
      }
    } catch (error) {
      console.error("Error fetching progress:", error);
    }
  };

  useEffect(() => {
    fetchCourseProgress();
  }, [courseId]);

  const markLectureAsCompleted = async (lectureId) => {
    if (isProcessing) return;
    if (progressData.lectureCompleted.includes(lectureId)) {
      toast.info("Lecture already completed");
      return;
    }

    setIsProcessing(true);

    try {
      const newProgressData = {
        ...progressData,
        lectureCompleted: [...progressData.lectureCompleted, lectureId],
      };
      setProgressData(newProgressData);
      setCurrentVideo((prev) => ({ ...prev }));

      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/user/update-course-progress`,
        { courseId, lectureId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!data.success) throw new Error(data.message);

      toast.success("Progress updated");
      await Promise.all([fetchCourseProgress(), fetchUserEnrolledCourses()]);
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message);
      setProgressData((prev) => ({
        ...prev,
        lectureCompleted: prev.lectureCompleted.filter(
          (id) => id !== lectureId
        ),
      }));
    } finally {
      setIsProcessing(false);
    }
  };

  const isCourseComplete = () => {
    if (!courseData) return false;
    const totalLectures = courseData.courseContent.reduce(
      (total, chapter) => total + (chapter.chapterContent?.length || 0),
      0
    );
    return progressData.lectureCompleted?.length >= totalLectures;
  };

  const toggleSection = (index) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleRate = async (rating) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/user/add-rating`,
        { courseId, rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success(data.message);
        const course = enrolledCourses.find((c) => c._id === courseId);
        if (course) {
          setCourseData({ ...course });
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const extractVideoId = (url) => {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w-]{11})/;
    const match = url?.match(regex);
    return match ? match[1] : null;
  };

  const handleDownloadCertificate = async () => {
    try {
      const token = await getToken();
      const response = await fetch(`${backendUrl}/api/user/generate-certificate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ courseId }),
      });

      if (!response.ok) throw new Error("Failed to download certificate");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${courseData.courseTitle}_certificate.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    }
  };

  return courseData ? (
    <>
      <div className="p-4 sm:p-10 flex flex-col-reverse md:grid md:grid-cols-2 gap-10 md:px-36">
        {/* Left Column */}
        <div className="text-gray-800">
          <h2 className="text-xl font-semibold">Course Structure</h2>
          <div className="pt-5">
            {courseData.courseContent?.map((chapter, index) => (
              <div key={index} className="border border-gray-300 bg-white mb-2 rounded">
                <div
                  className="flex items-center justify-between px-4 py-3 cursor-pointer select-none"
                  onClick={() => toggleSection(index)}
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={assets.down_arrow_icon}
                      alt="icon"
                      className={`transition-transform duration-300 ${
                        openSections[index] ? "rotate-180" : "rotate-0"
                      }`}
                    />
                    <p className="font-medium md:text-base text-sm">{chapter.chapterTitle}</p>
                  </div>
                  <p className="text-sm md:text-[15px]">
                    {chapter.chapterContent?.length || 0} lectures - {calChapterTime(chapter)}
                  </p>
                </div>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openSections[index] ? "max-h-96" : "max-h-0"
                  }`}
                >
                  <ul className="list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600 border-t border-gray-300">
                    {chapter.chapterContent?.map((lecture, i) => (
                      <li key={i} className="flex items-start gap-2 py-1">
                        <img
                          src={
                            progressData.lectureCompleted.includes(lecture.lectureId)
                              ? assets.blue_tick_icon
                              : assets.play_icon
                          }
                          alt="icon"
                          className="w-4 h-3 mt-1"
                        />
                        <div className="flex items-center justify-between w-full text-gray-800 text-xs md:text-[14px]">
                          <p>{lecture.lectureTitle}</p>
                          <div className="flex gap-2">
                            <p
                              onClick={() => {
                                const videoId = extractVideoId(lecture.lectureUrl);
                                if (videoId) {
                                  setCurrentVideo({
                                    ...lecture,
                                    videoId,
                                    chapter: index + 1,
                                    lecture: i + 1,
                                  });
                                } else {
                                  toast.error("Invalid YouTube URL");
                                }
                              }}
                              className="text-blue-500 cursor-pointer"
                            >
                              Watch
                            </p>
                            <p>
                              {humanizeDuration(lecture.lectureDuration * 60 * 1000, {
                                units: ["h", "m"],
                              })}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <CourseRating
            initialRating={initialRating}
            onRate={handleRate}
            onSubmit={(rating) =>
              alert(`Thank you for rating this course ${rating} stars!`)
            }
          />
        </div>

        {/* Right Column */}
        <div className="md:mt-10">
          {currentVideo ? (
            <div>
              <YouTube videoId={currentVideo.videoId} iframeClassName="w-full aspect-video" />
              <div className="flex justify-between items-center mt-5 shadow-sm p-1">
                <p>
                  {currentVideo.chapter}.{currentVideo.lecture} {currentVideo.lectureTitle}
                </p>
                <button
                  onClick={() => markLectureAsCompleted(currentVideo.lectureId)}
                  disabled={
                    isProcessing ||
                    progressData.lectureCompleted.includes(currentVideo.lectureId)
                  }
                  className={`text-xs sm:text-sm md:text-base font-semibold px-3 py-2 rounded-lg shadow-md transition ${
                    progressData.lectureCompleted.includes(currentVideo.lectureId)
                      ? isCourseComplete()
                        ? "bg-green-500 text-white"
                        : "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-gradient-to-r from-[#64B5F6] via-[#1E88E5] to-[#0D47A1] text-white hover:scale-105"
                  }`}
                >
                  {progressData.lectureCompleted.includes(currentVideo.lectureId)
                    ? isCourseComplete()
                      ? "Course Completed"
                      : "Lecture Completed"
                    : isProcessing
                    ? "Processing..."
                    : "Mark as Complete"}
                </button>
              </div>

              {isCourseComplete() && (
                <div className="mt-5">
                  <button
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    onClick={handleDownloadCertificate}
                  >
                    🎓 Download Certificate
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full aspect-video bg-gray-100 flex items-center justify-center">
              <img
                src={courseData.courseThumbnail || assets.course_placeholder}
                alt="Course thumbnail"
                className="max-h-full max-w-full object-contain"
              />
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  ) : (
    <Loading />
  );
};

export default CourseVideo;
