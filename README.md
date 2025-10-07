# 🧠 Quiz Web Application (Admin + User)

A **full-stack quiz management system** built using **Node.js**, **Express**, and **Prisma ORM**.  
This project provides two separate interfaces — one for **Admins** to create and manage quizzes, and another for **Users** to take quizzes and view their results.

---

## 🚀 Features

### 👨‍🏫 Admin
- Secure authentication using JWT  
- Create quizzes with multiple questions and options  
- Define the correct answer for each question  
- View all quiz submissions and user scores  

### 👩‍🎓 User
- Secure login & signup  
- Attempt quizzes created by admins  
- Automatic evaluation of submissions  
- View scores and performance summary  

---

## 🛠️ Tech Stack

| Category | Technology |
|-----------|-------------|
| **Backend** | Node.js, Express.js |
| **Database** | PostgreSQL / MySQL (via Prisma ORM) |
| **Authentication** | JWT (JSON Web Tokens) |
| **Validation** | Zod |
| **Frontend** | React.js (separate frontend for Admin & User) |
| **Server** | Express API (Port: 9000) |


---

## ⚙️ API Endpoints

### 🔐 Authentication
| Method | Endpoint | Description |
|---------|-----------|-------------|
| POST | `/signup` | Register as Admin or User |
| POST | `/signin` | Login and receive JWT token |
| GET | `/profile` | Fetch current user profile (Protected) |

### 🧩 Quiz Management
| Method | Endpoint | Description |
|---------|-----------|-------------|
| POST | `/quiz` | Create a new quiz (Admin only) |
| GET | `/quiz/:quizId` | Get quiz questions and options (User) |
| POST | `/quiz/:quizId/submit` | Submit answers and evaluate |
| GET | `/result/:quizId` | Get quiz results and scores |

---

## 🧾 Example Flow

1. **Admin Signup / Signin**  
   → Receives JWT Token  
2. **Admin Creates a Quiz**  
   → Sends quiz title + question set  
3. **User Signs In and Takes Quiz**  
   → Answers are submitted via `/quiz/:quizId/submit`  
4. **System Evaluates Answers Automatically**  
   → User’s score stored in database  
5. **Admin Views Results**  
   → `/result/:quizId` shows all participants’ scores  

---

## 🧩 Prisma Schema (Overview)

```prisma
model User {
  id          String   @id @default(uuid())
  name        String
  email       String   @unique
  password    String
  role        String
  quizzes     Quiz[]
  submissions UserSubmission[]
  results     QuizResult[]
}

model Quiz {
  id        String     @id @default(uuid())
  title     String
  userId    String
  user      User        @relation(fields: [userId], references: [id])
  questions Question[]
}

model Question {
  id        String    @id @default(uuid())
  title     String
  quizId    String
  quiz      Quiz      @relation(fields: [quizId], references: [id])
  options   Option[]
  answer    Answer?
}

model Option {
  id         String   @id @default(uuid())
  option     String
  questionId String
  question   Question @relation(fields: [questionId], references: [id])
}

model Answer {
  id         String   @id @default(uuid())
  questionId String
  optionId   String
}

model UserSubmission {
  id         String   @id @default(uuid())
  userId     String
  quizId     String
  questionId String
  optionId   String
  isCorrect  Boolean
}

model QuizResult {
  userId  String
  quizId  String
  score   Int
  user    User @relation(fields: [userId], references: [id])
  quiz    Quiz @relation(fields: [quizId], references: [id])
  @@id([userId, quizId])
}
```

---

## 🧰 Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/quiz-app-backend.git
cd quiz-app-backend
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Configure Prisma
Update your `.env` file with your database URL:
```bash
DATABASE_URL="postgresql://user:password@localhost:5432/quizapp"
```

Run migrations:
```bash
npx prisma migrate dev --name init
```

### 4️⃣ Start the Server
```bash
npm start
```
Server runs at **http://localhost:9000**


---

## 🔒 Authentication Note

All protected routes require an `Authorization` header:
```
Authorization: <JWT_TOKEN>
```

---

## 🧠 Future Improvements
- Password hashing (e.g., bcrypt)  
- Leaderboard system  
- Quiz categories and difficulty levels  
- Timed quizzes  
- Detailed analytics dashboard for admins  

---

## 🤝 Contributing
Feel free to fork this repository, submit issues, or open pull requests.  
Contributions are welcome!

---

## 📜 License
This project is licensed under the **MIT License**.

---
