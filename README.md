# 🎓 EduJet LMS

**EduJet LMS** is a full-stack Learning Management System built using the MERN stack (MongoDB, Express.js, React, Node.js) and styled with Tailwind CSS.
It provides a modern interface for students and educators to interact, manage courses, and track learning progress.

KEY FEATURES
- 🔐 **User Authentication**: Secure login and registration using JWT
- 🧑‍🏫 **Educator Dashboard**: Manage courses, view enrolled students, and update content
- 👩‍🎓 **Student Dashboard**: Browse courses, enroll, track progress
- 📚 **Course Management**: Create, edit, and organize course modules
- 🌐 **Responsive UI**: Built with Tailwind CSS and optimized for all screen sizes
- 🧠 **Role-based Component Architecture**: Organized for easy scaling and collaboration
---
TECH STACK

- **Frontend**: React (with Vite), Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **Authentication**: [Clerk.dev](https://clerk.dev) (User management, sessions, access control)


## 📁 Project Structure
LMS-WEBSITE/ ├── client/ 
# Frontend (React + Vite) │ 
├── public/ # Static files │
├── src/ │ │ ├── assets/ # Logos, icons, images │ │ ├── Components/ │ │ │ ├── Educators/ # Educator-specific UI components │ │ │ └── Students/ # Student-specific UI components │ │ ├── Pages/ │ │ │ ├── Educators/ # Educator pages (e.g., Dashboard, Courses) │ │ │ └── Students/ # Student pages (e.g., Enrollments, Profile) │ │ ├── Context/ # Global context providers │ │ ├── App.jsx # Root component │ │ ├── main.jsx # Entry point │ │ └── index.css # Tailwind/base styles │ ├── .env │ ├── index.html │ ├── vite.config.js │ ├── eslint.config.js │ ├── package.json │ └── README.md

├── server/ # Backend (Node + Express) │ 
├── routes/ # API route handlers │ ├── models/ # Mongoose models │ ├── controllers/ # Route logic/controllers │ ├── app.js # Express app │ └── .gitignore

🔮 Future Enhancements

Quiz and test support
Notification system
Realtime class scheduling

Built with 💙 by the SreenithiRamesh
