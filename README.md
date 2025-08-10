🎓 EduConnect
EduConnect is a comprehensive web application designed to foster a collaborative learning environment within an educational institute. It seamlessly connects Students, Teachers, and Heads of Department (HODs), streamlining content management, query resolution, and performance tracking.

✨ Key Features
🧑‍🏫 For Teachers
Subject Management: Full CRUD (Create, Read, Update, Delete) functionality for subject content.

Q&A Interaction: Provide, view, and modify answers to student questions.

Performance Analytics: Track points earned, and see views and likes for their answers to gauge engagement.

👩‍🎓 For Students
Content Access: View subject materials uploaded by teachers.

Ask Questions: Post subject-related questions to all relevant teachers.

Community Learning: View all questions and answers within a subject to learn from peers' doubts.

Feedback: View and Like helpful answers.

Manage Questions: Ability to delete their own questions.

👨‍💼 For HODs (Head of Department)
Performance Monitoring: Track teacher performance based on a point system, rewarding quality interaction and engagement.

🛠️ Technology Stack
The application is built using a modern technology stack:

Frontend: React – A JavaScript library for building user interfaces.

Backend: Spring Boot – An open-source, Java-based framework used to create microservices.

Database: MySQL – A popular open-source relational database management system.

🚀 Getting Started
Follow these instructions to get a local copy of the project up and running for development and testing.

Prerequisites
Make sure you have the following software installed:

Java Development Kit (JDK) 17 or later

Apache Maven

Node.js and npm

MySQL Server

Installation & Setup
1️⃣ Clone the repository
git clone https://github.com/Pachpileaditya/EduConnect.git
cd EduConnect
2️⃣ Backend Setup (Spring Boot)
Navigate to the backend directory:
cd backend
Set up your database in MySQL.

Update the src/main/resources/application.properties file with your database credentials:

properties
spring.datasource.url=jdbc:mysql://localhost:3306/educonnect_db
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
Run the Spring Boot application:

mvn spring-boot:run
The backend server will start at: http://localhost:8080

3️⃣ Frontend Setup (React)
Open a new terminal and navigate to the frontend directory:

cd frontend
Install dependencies:

npm install
Start the development server:

npm start
The application will be available at: http://localhost:3000

🤝 Contributing
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions are greatly appreciated.

Fork the project

Create your Feature Branch (git checkout -b feature/AmazingFeature)

Commit your Changes (git commit -m 'Add some AmazingFeature')

Push to the Branch (git push origin feature/AmazingFeature)

Open a Pull Request

