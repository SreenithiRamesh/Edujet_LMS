import React, { useContext, useEffect, useRef, useState } from "react";
import uniqid from "uniqid";
import Quill from "quill";
import { assets } from "../../assets/assets";
import { AppContext } from "../../Context/AppContext";

const AddCourse = () => {
  const { backendUrl, getToken } = useContext(AppContext);
  const quillRef = useRef(null);
  const editorRef = useRef(null);

  const [courseTitle, setCourseTitle] = useState("");
  const [coursePrice, setCoursePrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [image, setImage] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentChapterId, setCurrentChapterId] = useState(null);

  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: "",
    lectureDuration: "",
    lectureUrl: "",
    isPreviewFree: false,
  });

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, { theme: "snow" });
    }
  }, []);

  const handleChapter = (action, chapterId) => {
    if (action === "add") {
      const title = prompt("Enter Chapter Name:");
      if (title) {
        const newChapter = {
          chapterId: uniqid(),
          chapterTitle: title,
          chapterContent: [],
          collapsed: false,
          chapterOrder:
            chapters.length > 0 ? chapters.slice(-1)[0].chapterOrder + 1 : 1,
        };
        setChapters([...chapters, newChapter]);
      }
    } else if (action === "remove") {
      setChapters(chapters.filter((c) => c.chapterId !== chapterId));
    } else if (action === "toggle") {
      setChapters(
        chapters.map((c) =>
          c.chapterId === chapterId ? { ...c, collapsed: !c.collapsed } : c
        )
      );
    }
  };

  const handleLecture = (action, chapterId, lectureIndex) => {
    if (action === "add") {
      setCurrentChapterId(chapterId);
      setShowPopup(true);
    } else if (action === "remove") {
      setChapters(
        chapters.map((chapter) => {
          if (chapter.chapterId === chapterId) {
            chapter.chapterContent.splice(lectureIndex, 1);
          }
          return chapter;
        })
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const description = quillRef.current.root.innerHTML;

    const formData = new FormData();
    formData.append("title", courseTitle);
    formData.append("description", description);
    formData.append("price", coursePrice);
    formData.append("discount", discount);
    formData.append("thumbnail", image);
    formData.append("chapters", JSON.stringify(chapters));

    try {
      const response = await fetch(`${backendUrl}/api/course/add`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        alert("Course added successfully!");
        setCourseTitle("");
        setCoursePrice(0);
        setDiscount(0);
        setImage(null);
        setChapters([]);
        quillRef.current.root.innerHTML = "";
      } else {
        alert(" Failed to add course: " + data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Error submitting course");
    }
  };

  return (
    <div className="min-h-screen overflow-scroll bg-[#E3F2FD] p-6">
      <form
        className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-bold mb-6 text-[#0D47A1]">Add New Course</h1>

        <div className="mb-4">
          <label className="block font-medium mb-1 text-[#1976D2]">Course Title</label>
          <input
            type="text"
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            placeholder="Enter course title"
            className="w-full border border-gray-300 rounded-lg p-2 outline-blue-400"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1 text-[#1976D2]">Course Description</label>
          <div ref={editorRef} className="bg-white border rounded-lg h-40" />
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <label className="block font-medium mb-1 text-[#1976D2]">Price ($)</label>
            <input
              type="number"
              value={coursePrice}
              onChange={(e) => setCoursePrice(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 outline-blue-400"
              required
            />
          </div>

          <div className="flex-1">
            <label className="block font-medium mb-1 text-[#1976D2]">Thumbnail</label>
            <label htmlFor="thumbnailImage" className="flex items-center gap-3 cursor-pointer">
              <img src={assets.file_upload_icon} className="p-2 bg-[#2196F3] rounded w-10" />
              <input
                type="file"
                id="thumbnailImage"
                onChange={(e) => setImage(e.target.files[0])}
                accept="image/*"
                hidden
              />
              {image && (
                <img
                  className="h-10 rounded border border-gray-300"
                  src={URL.createObjectURL(image)}
                  alt="thumbnail"
                />
              )}
            </label>
          </div>
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1 text-[#1976D2]">Discount (%)</label>
          <input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            className="w-28 border border-gray-300 rounded-lg p-2 outline-blue-400"
            min={0}
            max={100}
            required
          />
        </div>

        {chapters.map((chapter, chapterIndex) => (
          <div key={chapter.chapterId} className="bg-[#F5F5F5] border border-[#BBDEFB] rounded-lg mb-4">
            <div className="flex justify-between items-center p-4 border-b">
              <div className="flex items-center gap-2">
                <img
                  src={assets.dropdown_icon}
                  alt=""
                  width={16}
                  onClick={() => handleChapter("toggle", chapter.chapterId)}
                  className={`cursor-pointer transition-transform ${chapter.collapsed ? "-rotate-90" : ""}`}
                />
                <h2 className="font-semibold text-[#1565C0]">
                  {chapterIndex + 1}. {chapter.chapterTitle}
                </h2>
              </div>
              <span className="text-sm text-gray-600">
                {chapter.chapterContent.length} Lectures
              </span>
              <img
                src={assets.cross_icon}
                alt="remove"
                className="cursor-pointer w-4"
                onClick={() => handleChapter("remove", chapter.chapterId)}
              />
            </div>

            {!chapter.collapsed && (
              <div className="p-4">
                {chapter.chapterContent.map((lecture, index) => (
                  <div key={index} className="flex justify-between items-center text-sm mb-2">
                    <span>
                      {index + 1}. {lecture.lectureTitle} - {lecture.lectureDuration} mins -{" "}
                      <a href={lecture.lectureUrl} className="text-[#1976D2]" target="_blank" rel="noopener noreferrer">
                        Link
                      </a>{" "}
                      - {lecture.isPreviewFree ? "Free" : "Paid"}
                    </span>
                    <img
                      src={assets.cross_icon}
                      alt="remove"
                      className="cursor-pointer w-4"
                      onClick={() => handleLecture("remove", chapter.chapterId, index)}
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleLecture("add", chapter.chapterId)}
                  className="text-sm mt-2 px-3 py-1 bg-[#90CAF9] hover:bg-[#64B5F6] rounded"
                >
                  + Add Lecture
                </button>
              </div>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={() => handleChapter("add")}
          className="flex w-full items-center justify-center cursor-pointer gap-2 text-xs sm:text-sm md:text-base bg-white text-[#0D47A1] font-semibold px-5 py-3 rounded-lg shadow-md border border-[#0D47A1] hover:bg-[#e3f2fd] transition duration-300"
        >
          + Add Chapter
        </button>

        {showPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#90CAF9] bg-opacity-30">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl relative">
              <img
                src={assets.cross_icon}
                alt="close"
                className="absolute top-3 right-4 w-4 cursor-pointer"
                onClick={() => setShowPopup(false)}
              />
              <h2 className="text-lg font-semibold mb-4 text-[#1976D2]">Add Lecture</h2>

              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Lecture Title"
                  className="w-full border rounded p-2"
                  value={lectureDetails.lectureTitle}
                  onChange={(e) =>
                    setLectureDetails({ ...lectureDetails, lectureTitle: e.target.value })
                  }
                />
                <input
                  type="number"
                  placeholder="Duration (mins)"
                  className="w-full border rounded p-2"
                  value={lectureDetails.lectureDuration}
                  onChange={(e) =>
                    setLectureDetails({ ...lectureDetails, lectureDuration: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Lecture URL"
                  className="w-full border rounded p-2"
                  value={lectureDetails.lectureUrl}
                  onChange={(e) =>
                    setLectureDetails({ ...lectureDetails, lectureUrl: e.target.value })
                  }
                />
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={lectureDetails.isPreviewFree}
                    onChange={(e) =>
                      setLectureDetails({
                        ...lectureDetails,
                        isPreviewFree: e.target.checked,
                      })
                    }
                  />
                  Free Preview
                </label>
              </div>

              <button
                onClick={() => {
                  setChapters((prev) =>
                    prev.map((chapter) =>
                      chapter.chapterId === currentChapterId
                        ? {
                            ...chapter,
                            chapterContent: [
                              ...chapter.chapterContent,
                              {
                                ...lectureDetails,
                                lectureId: uniqid(),
                                lectureOrder: chapter.chapterContent.length + 1,
                              },
                            ],
                          }
                        : chapter
                    )
                  );
                  setLectureDetails({
                    lectureTitle: "",
                    lectureDuration: "",
                    lectureUrl: "",
                    isPreviewFree: false,
                  });
                  setShowPopup(false);
                }}
                className="w-full bg-[#1976D2] hover:bg-[#1565C0] text-white mt-4 p-2 rounded"
              >
                Add Lecture
              </button>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="text-xs w-full mt-2 sm:text-sm md:text-base bg-gradient-to-r from-[#64B5F6] via-[#1E88E5] to-[#0D47A1] text-white font-semibold px-8 py-3 rounded-lg shadow-md hover:scale-3d cursor-pointer hover:shadow-xl transition duration-300"
        >
          Submit Course
        </button>
      </form>
    </div>
  );
};

export default AddCourse;
