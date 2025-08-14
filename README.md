#  EduJet LMS - Learning Management System

<div align="center">

![EduJet LMS](https://img.shields.io/badge/EduJet-LMS-blue?style=for-the-badge)
![MERN Stack](https://img.shields.io/badge/Stack-MERN-green?style=for-the-badge)
[![Made with MERN Stack](https://img.shields.io/badge/Made%20with-MERN%20Stack-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

**A modern, full-featured Learning Management System built with the MERN stack**
</div>

## About EduJet LMS

**EduJet LMS** is a comprehensive Learning Management System designed to bridge the gap between educators and students. Built with modern web technologies, it provides a seamless experience for course creation, enrollment, payment processing, and progress tracking.

The platform features a unified login system that adapts to user roles, comprehensive course management tools, integrated payment processing via Stripe, and automated certificate generation upon course completion.

---
<img width="1920" height="1035" alt="image" src="https://github.com/user-attachments/assets/986e0310-d81a-4579-883e-e8963ad09853" />


## ✨ Key Features

### 🔐 Authentication & Security
- **Secure Authentication** powered by Clerk.dev
- **Role-based Access Control** (Educator/Student)

### 👨‍🏫 Educator Features
- **Course Creation & Management**
  - Create comprehensive courses with Chapters and lectures
  - Upload multimedia content (videos, images)
  - Set course pricing and discount and course durations
- **Student Management**
  - View enrolled students
  - Remove students from courses
  - Access detailed student profiles
- **Revenue Dashboard**
  - Real-time earnings tracking
  - Payment history and analytics
  - Courses created count
- **Course Analytics**
  - Enrollment statistics

### 👩‍🎓 Student Features
- **Course Discovery**
  - Browse available courses
  - Search and filter functionality
  - Course previews and detailed descriptions
- **Enrollment & Payment**
  - Secure course enrollment via Stripe
  - Multiple payment methods support
  - Instant course access post-payment
- **Learning Experience**
  - Interactive course player
  - Progress tracking per lesson
  - Mark lessons as complete
  - Resume from last position
- **Achievements**
  - Download completion certificates as PDF
  - Track overall learning progress
---

## 🛠️ Tech Stack

### Frontend
- **React.js 18** - Modern UI library with hooks
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls
- **React Query** - Server state management
- **Lucide React** - Beautiful icons library

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling

### Authentication & Payments
- **Clerk.dev** - Complete authentication solution
- **Stripe API** - Payment processing
- **Webhooks** - Real-time payment notifications

### File Management & Generation
- **Multer** - File upload handling
- **Cloudinary** - Media storage and optimization
- **PDFKit** - Certificate PDF generation

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Nodemon** - Auto-restart development server
- **Cors** - Cross-origin resource sharing

---

## 📁 Project Structure

```
EduJet-LMS/
├── 📁 client/                    # Frontend React Application
│   ├── 📁 public/
│   │   ├── favicon.ico
│   │   └── index.html
│   ├── 📁 src/
│   │   ├── 📁 assets/            # Images, logos, static files
│   │   ├── 📁 components/        # Reusable UI components
│   │   │   ├── 📁 common/        # Shared components
│   │   │   ├── 📁 educators/     # Educator-specific components
│   │   │   └── 📁 students/      # Student-specific components
│   │   ├── 📁 pages/             # Page components
│   │   │   ├── 📁 educators/     # Educator dashboard pages
│   │   │   ├── 📁 students/      # Student dashboard pages
│   │   │   └── 📁 auth/          # Authentication pages
│   │   ├── 📁 context/           # React Context providers
│   │   ├── 📁 utils/             # Utility functions
│   │   ├── App.jsx               # Main App component
│   │   ├── main.jsx              # Entry point
│   │   └── index.css             # Global styles
│   ├── .env                      # Environment variables
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── 📁 server/                    # Backend Node.js Application
│   ├── 📁 controllers/           # Route controllers
│   │   ├── authController.js
│   │   ├── courseController.js
│   │   ├── userController.js
│   │   └── paymentController.js
│   ├── 📁 models/                # Database models
│   │   ├── User.js
│   │   ├── Course.js
│   │   ├── Enrollment.js
│   │   └── Payment.js
│   ├── 📁 routes/                # API routes
│   │   ├── auth.js
│   │   ├── courses.js
│   │   ├── users.js
│   │   └── payments.js
│   ├── 📁 middleware/            # Custom middleware
│   │   ├── auth.js
│   │   ├── validation.js
│   │   └── errorHandler.js
│   ├── 📁 utils/                 # Utility functions
│   │   ├── pdfGenerator.js
│   │   └── emailService.js
│   ├── 📁 uploads/               # File uploads directory
│   ├── app.js                    # Express app configuration
│   ├── server.js                 # Server entry point
│   └── package.json
│
├── 📁 docs/                      # Documentation
├── .gitignore
|── README.md
```

## 🎯 User Roles & Permissions

### 👨‍🏫 Educator Permissions
- ✅ Create and manage courses
- ✅ View enrolled students
- ✅ Access earnings dashboard
- ✅ Manage course content
- ❌ Enroll in courses

### 👩‍🎓 Student Permissions
- ✅ Browse and search courses
- ✅ Enroll in courses
- ✅ Access purchased content
- ✅ Track learning progress
- ✅ Download certificates
- ❌ Create courses
- ❌ Access educator dashboard

---
## 📸 **Application Screenshots**

<div align="center">

### 🖥️ **Educator Dashboard**
<img width="1915" height="939" alt="image" src="https://github.com/user-attachments/assets/4aad3e65-d41d-4be5-a1cc-10b2c57a63b4" />


### 🖥️ **Educator Add Course Page**
<img width="1911" height="944" alt="image" src="https://github.com/user-attachments/assets/a6eec696-3b91-4c8b-a9a0-ef8ade896362" />



### 👥 **Course Listing Interface**
<img width="1911" height="942" alt="image" src="https://github.com/user-attachments/assets/9d5c5af5-0ea5-4f53-891a-897d0432ee4c" />



### 📊 **Course Preview page**
<img width="1910" height="940" alt="image" src="https://github.com/user-attachments/assets/b770a9eb-549f-4d5b-a778-e48d17b5c330" />

### 📊 **Enrolled course process tracking  page**
<img width="1912" height="948" alt="image" src="https://github.com/user-attachments/assets/447292d9-ec87-447e-b415-87d697757004" />


</div>

## 💳 Payment Integration

### Stripe Features Implemented
- **Secure Payment Processing**
- **Multiple Payment Methods** (Cards, Digital Wallets)
- **Instant Course Access** post-payment
- **Webhook Integration** for real-time updates

### Payment Flow
1. Student selects course
2. Redirected to Stripe Checkout
3. Payment processed securely
4. Webhook confirms payment
5. Course access granted instantly

---

## 📄 Certificate Generation

### Features
- **Automated PDF Generation** upon course completion
- **Personalized Certificates** with student name and course details
- **Secure Download Links**
- **Certificate Verification** system
- **Custom Branding** and design
---

## 🔮 Future Enhancements

### Planned Features
- [ ] **Live Video Classes** with WebRTC
- [ ] **Discussion Forums** for each course
- [ ] **Quiz and Assessment** system
- [ ] **Mobile App** (React Native)
---

## 👥 Authors

### 🚀 Lead Developer
**Sreenith Ramesh**
- GitHub: [@SreenithiRamesh](https://github.com/SreenithiRamesh)
- LinkedIn: [Sreenith Ramesh](https://www.linkedin.com/in/sreenithi28/)
- Email: [sreenithiramesh2@gmail.com]

---

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **Tailwind CSS** for the utility-first CSS framework
- **Clerk.dev** for seamless authentication
- **Stripe** for secure payment processing
- **MongoDB** for the flexible database solution
- **Vite** for the blazing fast build tool
- **Open Source Community** for continuous inspiration

---

<div align="center">

### ⭐ Don't forget to star this repository if you found it helpful!

**Built with ❤️ by the SreenithiRamesh**

**[Live Demo](https://memoryboostergame-frontend.onrender.com/)**
</div>
