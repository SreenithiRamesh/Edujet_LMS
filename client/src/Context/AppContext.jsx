import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();

  const { getToken } = useAuth();
  const { user } = useUser();

  const [AllCourses, SetAllCourses] = useState([]);
  const [isEducator, SetisEducator] = useState(false);
  const [enrolledCourses, SetenrolledCourses] = useState([]);
  const [userData, SetuserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progressData, setProgressData] = useState({});

  // Fetch all published courses
  const fetchAllCourses = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/course/all`);
      if (data.success) {
        SetAllCourses(data.courses);
      } else {
        toast.error(data.message || "Failed to fetch courses");
      }
    } catch (error) {
      console.error("Fetch courses error:", error);
      toast.error(error.message || "Network error");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch authenticated user data
  const fetchUserData = async () => {
    if (!user) return;

    try {
      const token = await getToken();
      const { data } = await axios.get(`${backendUrl}/api/user/data`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        SetuserData(data.user);
        SetisEducator(user.publicMetadata.role === "educator");
      } else {
        toast.error(data.message || "Failed to fetch user data");
      }
    } catch (error) {
      console.error("Fetch user error:", error);
      toast.error(error.message || "User data error");
    }
  };

  // Fetch user's enrolled courses with progress
  const fetchUserEnrolledCourses = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const token = await getToken();
      const [enrolledRes, progressRes] = await Promise.all([
        axios.get(`${backendUrl}/api/user/enrolled-courses`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${backendUrl}/api/user/all-progress`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (enrolledRes.data.success) {
        const courses = enrolledRes.data.enrolledCourses.reverse();
        SetenrolledCourses(courses);

        if (progressRes.data.success) {
          // Create a progress map: { courseId: { lectureCompleted: [...] } }
          const progressMap = {};
          progressRes.data.progressData.forEach((progress) => {
            progressMap[progress.courseId] = progress;
          });
          setProgressData(progressMap);
        }
      } else {
        toast.error(enrolledRes.data.message || "Failed to fetch enrollments");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error(error.message || "Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  // Update course progress and refresh data
  const updateCourseProgress = async (courseId, lectureId) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/user/update-course-progress`,
        { courseId, lectureId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        // Update local progress state
        setProgressData((prev) => ({
          ...prev,
          [courseId]: {
            ...prev[courseId],
            lectureCompleted: [
              ...(prev[courseId]?.lectureCompleted || []),
              lectureId,
            ],
          },
        }));

        // Refresh enrolled courses to update progress
        await fetchUserEnrolledCourses();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Update progress error:", error);
      toast.error("Failed to update progress");
      return false;
    }
  };

  // Handle pending enrollments after payment
  useEffect(() => {
    const checkPendingEnrollment = async () => {
      const pendingCourseId = localStorage.getItem("pendingEnrollment");
      if (pendingCourseId && user) {
        try {
          await fetchUserEnrolledCourses();
          localStorage.removeItem("pendingEnrollment");
          toast.success("Enrollment processed successfully");
        } catch (error) {
          console.error("Enrollment sync failed:", error);
          toast.error("Failed to sync enrollment");
        }
      }
    };

    checkPendingEnrollment();
  }, [user]);

  // Calculate average course rating
  const calRating = (course) => {
    if (!course?.CourseRating?.length) return 0;
    const total = course.CourseRating.reduce(
      (sum, rating) => sum + rating.rating,
      0
    );
    return Math.round((total / course.CourseRating.length) * 10) / 10;
  };

  // Calculate chapter duration
  const calChapterTime = (chapter) => {
    if (!chapter?.chapterContent) return "0m";
    const totalMinutes = chapter.chapterContent.reduce(
      (sum, lecture) => sum + (lecture.lectureDuration || 0),
      0
    );
    return humanizeDuration(totalMinutes * 60 * 1000, {
      units: ["h", "m"],
      round: true,
    });
  };

  // Calculate total course duration
  const calCourseDuration = (course) => {
    if (!course?.courseContent) return "0m";
    let totalMinutes = 0;
    course.courseContent.forEach((chapter) => {
      chapter.chapterContent?.forEach((lecture) => {
        totalMinutes += lecture.lectureDuration || 0;
      });
    });
    return humanizeDuration(totalMinutes * 60 * 1000, {
      units: ["h", "m"],
      round: true,
    });
  };

  // Count total lectures in course
  const calNoOfLectures = (course) => {
    if (!course?.courseContent) return 0;
    return course.courseContent.reduce(
      (total, chapter) => total + (chapter.chapterContent?.length || 0),
      0
    );
  };

  // Calculate completion percentage for a course
  const getCourseCompletion = (courseId) => {
    if (!progressData[courseId]?.lectureCompleted) return 0;
    const course = enrolledCourses.find((c) => c._id === courseId);
    if (!course) return 0;

    const totalLectures = calNoOfLectures(course);
    const completed = progressData[courseId].lectureCompleted.length;
    return totalLectures > 0
      ? Math.round((completed * 100) / totalLectures)
      : 0;
  };

  // Initial data loading
  useEffect(() => {
    fetchAllCourses();
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchUserEnrolledCourses();
    }
  }, [user]);

  // Context value
  const value = {
    currency,
    AllCourses,
    navigate,
    calRating,
    isEducator,
    SetisEducator,
    calNoOfLectures,
    calCourseDuration,
    calChapterTime,
    enrolledCourses,
    fetchUserEnrolledCourses,
    userData,
    SetuserData,
    backendUrl,
    getToken,
    fetchAllCourses,
    isLoading,
    updateCourseProgress,
    progressData,
    getCourseCompletion,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
