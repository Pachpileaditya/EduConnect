📚 EduConnect – Institute App
EduConnect is a full-stack web application designed for seamless collaboration between Teachers and Students.
It enables teachers to share subject content, answer student questions, and manage content efficiently, while students can learn, interact, and engage with subject experts in real time.

🚀 Tech Stack
🔹 Frontend
	• React.js
	• React Router
	• Axios
	• CSS
🔹 Backend
	• Spring Boot
	• Spring Security (JWT Authentication)
	• Spring Data JPA
	• Hibernate
	• Maven
🔹 Database
	• MySQL

✨ Features
👩‍🏫 Teacher
	• Choose subjects.
	• Add, update, delete subject content.
	• View subject content.
	• Answer student questions.
	• Update/delete answers.
	• Track points earned.
	• View likes answers.
🎓 Student
	• View subject content.
	• Ask questions to subject teachers.
	• Delete own questions.
	• View answers given by teachers.
	• Like and view answers.
	• Access subject-specific Q&A.
	
📂 Project Structure

EduConnect/
├── backend/                # Spring Boot backend
│   ├── src/main/java/...   # Source code (controllers, services, configs, security)
│   ├── src/main/resources/ # application.properties
│   └── pom.xml             # Maven dependencies
│
├── frontend/frontendapp/   # React frontend
│   ├── public/             # Static assets
│   ├── src/                # Source code
│   │   ├── Component/      
│   │   │   ├── Student/    # Student dashboard components
│   │   │   ├── Teacher/    # Teacher dashboard components
│   │   │   ├── auth/       # Login/Register components
│   │   │   ├── comman/     # Common reusable components
│   │   │   └── LandingPage.js
│   │   ├── assets/         # Images, icons
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   └── package.json        # Frontend dependencies


⚙️ Installation & Setup
🔧 Prerequisites
	• Java 17+
	• Node.js (v16+)
	• MySQL
	• Maven

▶️ Backend Setup
	1. Clone the repository:

git clone https://github.com/Pachpileaditya/EduConnect.git
cd EduConnect/backend
	2. Configure MySQL Database in application.properties:

spring.datasource.url=jdbc:mysql://localhost:3306/educonnect
spring.datasource.username=root
spring.datasource.password=yourpassword
spring.jpa.hibernate.ddl-auto=update
	3. Build and run the backend:

mvn clean install
mvn spring-boot:run
Backend will run at: http://localhost:8080

▶️ Frontend Setup
	1. Navigate to frontend:

cd ../frontend/frontendapp
	2. Install dependencies:

npm install
	3. Run the React app:

npm run dev
Frontend will run at: http://localhost:5173

🔐 Authentication & Security
	• Secure access using JWT (JSON Web Token).
	• Role-based access:
		○ Teacher – Manage content & answer student questions.
		○ Student – Access content & interact with teachers.

🌟 Future Enhancements
	• Real-time notifications using WebSockets.
	• Admin dashboard for better insights
	• AI-powered chatbot for instant student help.

🤝 Contributing
Contributions are welcome! Feel free to open issues and submit pull requests.

