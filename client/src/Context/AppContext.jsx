import { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";
import { Form, useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";
import {useAuth,useUser} from "@clerk/clerk-react";

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();

  const{getToken}=useAuth()
  const {user}=useUser()

  const [AllCourses, SetAllCourses] = useState([]);
  const [isEducator, SetisEducator] = useState(true);
  const [enrolledCourses, SetenrolledCourses] = useState([]);

  // fetch all dummy courses
  const fetchAllCourses = async () => {
    SetAllCourses(dummyCourses);
  };

  const calRating = (course) => {
    if (course.courseRatings.length === 0) {
      return 0;
    }
    let TotalRating = 0;
    course.courseRatings.forEach((rating) => {
      TotalRating += rating.rating;
    });
    return TotalRating / course.courseRatings.length;
  };

  const calChapterTime = (chapter) => {
    let time = 0;
    chapter.chapterContent.map(
      (lecture) => (time += lecture.lectureDuration)
    );
    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  const calCourseDuration = (course) => {
    let time = 0;
    course.courseContent.map((chapter) =>
      chapter.chapterContent.map(
        (lecture) => (time += lecture.lectureDuration)
      )
    );
    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  const calNoOfLectures = (course) => {
    let totalLectures = 0;
    course.courseContent.forEach((chapter) => {
      if (Array.isArray(chapter.chapterContent)) {
        totalLectures += chapter.chapterContent.length;
      }
    });
    return totalLectures;
  };

  const fetchUserenrolledCourses = async () => {
    // simulate enrolled courses using dummy
    SetenrolledCourses(dummyCourses);
  };

  useEffect(() => {
    fetchAllCourses();
    fetchUserenrolledCourses();
  }, []);

  const logToken=async ()=>{
    console.log(await getToken());
  }

useEffect(()=>{
  if(user){ 
    logToken()
   }

},[user])


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
    fetchUserenrolledCourses,
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};
