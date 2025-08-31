# Teacher Student Platform - Project Index

## 🎓 Project Overview

The **Teacher Student Platform** is a comprehensive Learning Management System (LMS) built with a modern tech stack featuring a Spring Boot backend and React frontend. The platform facilitates interaction between teachers and students through content sharing, Q&A systems, and real-time communication.

## 🏗️ Architecture

### Backend Architecture
- **Framework**: Spring Boot 3.4.2 with Java 21
- **Database**: MySQL 8.0.33
- **Security**: Spring Security with JWT authentication
- **Real-time Communication**: WebSocket with STOMP
- **File Storage**: Cloudinary integration
- **Email Service**: Spring Mail with Gmail SMTP
- **API Documentation**: SpringDoc OpenAPI

### Frontend Architecture
- **Framework**: React 19.0.0 with Vite
- **Routing**: React Router DOM 7.2.0
- **UI Components**: Material-UI 6.4.6, Bootstrap 5.3.3
- **Styling**: Tailwind CSS 4.0.9, CSS3
- **HTTP Client**: Axios 1.8.1
- **Charts**: Chart.js 4.5.0 with react-chartjs-2
- **Icons**: Lucide React, React Icons
- **AI Integration**: Gemini API for chatbot functionality

## 📁 Project Structure

```
Teacher Student Platform/
├── backend/lms/lms/                    # Spring Boot Backend
│   ├── src/main/java/com/project/lms/
│   │   ├── config/                     # Configuration classes
│   │   ├── controller/                 # REST API controllers
│   │   ├── DTO/                       # Data Transfer Objects
│   │   ├── entity/                    # JPA entities
│   │   ├── exception/                 # Custom exceptions
│   │   ├── repo/                      # Repository interfaces
│   │   ├── security/                  # Security configuration
│   │   └── service/                   # Business logic services
│   ├── src/main/resources/
│   │   └── application.properties     # Application configuration
│   └── uploads/                       # File upload directory
└── frontend/frontendapp/              # React Frontend
    ├── src/
    │   ├── Component/
    │   │   ├── auth/                  # Authentication components
    │   │   ├── Student/               # Student-specific components
    │   │   ├── Teacher/               # Teacher-specific components
    │   │   └── comman/                # Common/shared components
    │   ├── assets/                    # Static assets
    │   └── App.jsx                    # Main application component
    └── public/                        # Public assets
```

## 👥 User Roles & Features

### 🔐 Authentication System
- **JWT-based authentication** with token expiration
- **Role-based access control** (ADMIN, TEACHER, STUDENT)
- **Password reset** via email OTP
- **Secure password encoding** with BCrypt

### 👨‍🏫 Teacher Features
- **Dashboard**: Overview of subjects, content, and student interactions
- **Content Management**: Upload and manage educational content by subject/unit
- **Q&A System**: Answer student questions and earn points
- **Subject Assignment**: Manage multiple subjects and years
- **Profile Management**: Update personal information and expertise
- **Real-time Chat**: Communicate with students via WebSocket

### 👨‍🎓 Student Features
- **Dashboard**: View enrolled subjects and recent activities
- **Content Access**: Browse and download educational materials
- **Question System**: Ask questions to teachers
- **Subject Enrollment**: Register for subjects
- **Profile Management**: Update personal information
- **Real-time Chat**: Communicate with teachers

### 🤖 AI-Powered Chatbot
- **Gemini API Integration**: Intelligent responses to user queries
- **Floating Chat Interface**: Accessible from any page
- **Real-time Communication**: Instant message exchange

## 🗄️ Database Schema

### Core Entities
1. **User**: Base user information (name, email, password, role)
2. **Student**: Student-specific data (year, subjects, questions)
3. **Teacher**: Teacher-specific data (expertise, points, subjects, years)
4. **Subject**: Academic subjects with year associations
5. **Content**: Educational materials (title, description, file URL)
6. **Question**: Student queries with timestamps
7. **Answer**: Teacher responses with point system
8. **Unit**: Content organization structure
9. **Year**: Academic year management

### Key Relationships
- **Many-to-Many**: Teacher-Subject, Teacher-Year, Student-Subject
- **One-to-Many**: Teacher-Content, Student-Question, Subject-Content
- **One-to-One**: User-Student, User-Teacher

## 🔌 API Endpoints

### Authentication (`/api/auth`)
- `POST /register/teacher` - Teacher registration
- `POST /register/student` - Student registration
- `POST /login` - User authentication
- `POST /request-password-reset` - Password reset request
- `POST /verify-reset-otp` - OTP verification
- `POST /reset-password` - Password reset

### Content Management (`/api/content`)
- `GET /{teacherId}/{subjectId}` - Get teacher's content by subject
- `POST /add` - Add new content
- `PUT /update/{id}` - Update content
- `DELETE /{id}` - Delete content

### Student Management (`/api/student`)
- `GET /subjects/{studentId}` - Get student's subjects
- `POST /add-subject` - Enroll in subject
- `GET /profile/{studentId}` - Get student profile

### Teacher Management (`/api/teacher`)
- `GET /subjects/{teacherId}` - Get teacher's subjects
- `GET /profile/{teacherId}` - Get teacher profile
- `POST /add-subject` - Assign subject to teacher

### Q&A System (`/api/questions`)
- `POST /add` - Add new question
- `GET /subject/{subjectId}` - Get questions by subject
- `POST /answer` - Add answer to question

### Real-time Communication (`/ws-chat`)
- WebSocket endpoint for real-time messaging

## 🛡️ Security Features

### Authentication & Authorization
- **JWT Token-based authentication**
- **Role-based access control**
- **Password encryption** with BCrypt
- **Token expiration** (1 hour default)

### CORS Configuration
- **Cross-origin resource sharing** enabled
- **Frontend origin** whitelisted (localhost:5173)
- **Secure headers** configuration

### Input Validation
- **Request validation** with Spring Validation
- **SQL injection prevention** with JPA
- **XSS protection** with proper encoding

## 🎨 Frontend Features

### Modern UI/UX
- **Responsive design** with Bootstrap and Material-UI
- **Gradient backgrounds** and modern styling
- **Smooth animations** and transitions
- **Mobile-friendly** interface

### Component Architecture
- **Modular components** for reusability
- **State management** with React hooks
- **Route protection** based on authentication
- **Error handling** and loading states

### Real-time Features
- **WebSocket integration** for live chat
- **Real-time updates** for Q&A system
- **Instant notifications** for new content

## 🚀 Deployment & Configuration

### Environment Configuration
- **Database**: MySQL on localhost:3306
- **Email**: Gmail SMTP for notifications
- **File Storage**: Cloudinary for content uploads
- **AI Service**: Gemini API for chatbot

### Development Setup
1. **Backend**: Maven project with Spring Boot
2. **Frontend**: Node.js with Vite build tool
3. **Database**: MySQL with provided schema
4. **Dependencies**: All managed via Maven and npm

## 🔧 Key Technologies & Libraries

### Backend Stack
- **Spring Boot 3.4.2** - Main framework
- **Spring Security** - Authentication & authorization
- **Spring Data JPA** - Database operations
- **Spring WebSocket** - Real-time communication
- **Spring Mail** - Email services
- **MySQL Connector** - Database connectivity
- **JWT** - Token-based authentication
- **Lombok** - Code generation
- **ModelMapper** - Object mapping

### Frontend Stack
- **React 19.0.0** - UI framework
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Material-UI** - Component library
- **Bootstrap** - CSS framework
- **Axios** - HTTP client
- **Chart.js** - Data visualization
- **Tailwind CSS** - Utility-first CSS

### External Services
- **Cloudinary** - Cloud file storage
- **Gmail SMTP** - Email delivery
- **Gemini API** - AI chatbot functionality

## 📊 Features Summary

### ✅ Implemented Features
- [x] User authentication and authorization
- [x] Role-based access control
- [x] Content management system
- [x] Q&A platform with point system
- [x] Real-time chat functionality
- [x] File upload and storage
- [x] Email notifications
- [x] AI-powered chatbot
- [x] Responsive web interface
- [x] Database management
- [x] API documentation

### 🔄 Real-time Features
- [x] WebSocket-based chat
- [x] Live Q&A updates
- [x] Instant notifications
- [x] Real-time content updates

### 📱 User Experience
- [x] Modern, responsive design
- [x] Intuitive navigation
- [x] Mobile-friendly interface
- [x] Smooth animations
- [x] Error handling
- [x] Loading states

## 🎯 Project Goals

This Teacher Student Platform aims to:
1. **Facilitate Learning**: Provide easy access to educational content
2. **Enable Communication**: Bridge the gap between teachers and students
3. **Streamline Management**: Organize content and interactions efficiently
4. **Enhance Engagement**: Use modern UI and real-time features
5. **Ensure Security**: Protect user data and maintain privacy
6. **Scale Effectively**: Support multiple users and content types

## 📈 Future Enhancements

Potential areas for improvement:
- **Video conferencing** integration
- **Assignment submission** system
- **Grade management** features
- **Analytics dashboard** for insights
- **Mobile app** development
- **Advanced AI** features
- **Multi-language** support
- **Advanced reporting** capabilities

---

*This index provides a comprehensive overview of the Teacher Student Platform project, covering all major components, features, and technical details.*


