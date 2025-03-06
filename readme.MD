# 🚀 ASSIGNMENT-5 BACKEND WORK

## 📌 Project Overview

This project is a backend application built with **Node.js**, **Express.js**, and **Sequelize** (ORM for PostgreSQL). It includes user authentication, JWT-based authorization, a referral and rewards system, activity tracking, achievements, and AWS integrations for S3 file storage and SQS messaging.

---

## 📂 Project Structure

```
Assignment/
├─ .gitignore
├─ api/
│  ├─ .env
│  ├─ app.js
│  ├─ config/
│  │  ├─ aws.js
│  │  ├─ constant.js
│  │  ├─ database.js
│  │  ├─ firebase.js
│  │  └─ serviceAccountKey.json
│  ├─ controller/
│  │  ├─ authController.js
│  │  └─ awsController.js
│  ├─ helpers/
│  │  └─ sqsworker.js
│  ├─ middleware/
│  │  ├─ auth.js
│  │  └─ upload.js
│  ├─ models/
│  │  ├─ activity.js
│  │  ├─ notificationToken.js
│  │  └─ user.js
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ routes/
│  │  └─ userRoute.js
│  ├─ uploads/
│  │  ├─ (image files)
│  └─ utils/
│     ├─ activityCalculator.js
│     ├─ mailer.js
│     ├─ notification.js
│     ├─ s3.js
│     └─ sqs.js
└─ readme.MD
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```sh
git clone https://github.com/jaychavada01/Assignment-5-Backend.git
cd api
```

### 2️⃣ Install Dependencies

```sh
npm install
```

### 3️⃣ Configure Environment Variables

Create a `.env` file in the `api/` directory and add the following values:

```
PORT=3000
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
MAILTRAP_HOST=smtp.mailtrap.io
MAILTRAP_PORT=2525
MAILTRAP_USER=your_mailtrap_username
MAILTRAP_PASS=your_mailtrap_password
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
S3_BUCKET_NAME=your_s3_bucket_name
SQS_QUEUE_URL=your_sqs_queue_url
```

---

## 🛠️ Features

✅ **User Authentication** (Signup/Login/Logout)  
✅ **JWT-based Authorization**  
✅ **Referral System** (Users refer others and earn rewards)  
✅ **Daily Login Rewards** (Users earn 10 coins for logging in daily)  
✅ **Profile Completion Rewards** (Users get 30 coins for 100% completion)  
✅ **Activity Tracking** (Logs user activities like login, referrals, profile updates)  
✅ **Achievements System** (Users unlock rewards based on activities)  
✅ **Forgot Password & Reset Password** (Secure password recovery)  
✅ **AWS S3 Integration** (File uploads & storage)  
✅ **AWS SQS Integration** (Message queuing for notifications & tasks)  

---

## 🔗 API Endpoints

### **Authentication**

| Method | Endpoint                | Description                                                    | Auth Required |
| ------ | ----------------------- | -------------------------------------------------------------- | ------------- |
| POST   | `/users/signup`          | Register a new user if Applied referral code then reward users | ❌ No         |
| POST   | `/users/login`           | Log in and get JWT token & Track daily login and reward user   | ❌ No         |
| POST   | `/users/logout`          | Log out and clear token cookie                                 | ✅ Yes        |
| POST   | `/users/reset-password`  | Reset password (Authenticated)                                 | ✅ Yes        |
| POST   | `/users/forgot-password` | Send password reset email                                      | ❌ No         |

### **AWS Integrations**

| Method | Endpoint             | Description                                  | Auth Required |
| ------ | -------------------- | -------------------------------------------- | ------------- |
| POST   | `/upload`            | Upload files to AWS S3                       | ✅ Yes        |
| GET    | `/files/:filename`   | Get file from S3 bucket                      | ✅ Yes        |
| POST   | `/sqs/send`          | Send a message to AWS SQS queue              | ✅ Yes        |

---

## 🏆 Achievements & Rewards

| Achievement          | Requirement                   | Reward |
| -------------------- | ----------------------------- | ------ |
| **Early Bird**       | Log in for 3 consecutive days | 10 pts |
| **Networker**        | Successfully refer 5 friends  | 50 pts |
| **Verified Profile** | Complete 100% of profile      | 30 pts |

---

## ✨ Technologies Used

- **Node.js** & **Express.js** – Backend Framework
- **Sequelize** – ORM for PostgreSQL
- **JWT (JSON Web Token)** – Authentication
- **Bcrypt.js** – Password Hashing
- **Nodemailer & Mailtrap** – Email Notifications
- **ValidatorJs** – Validation Credentials
- **AWS S3** – File Storage
- **AWS SQS** – Message Queue Service

---

## 🚀 How It Works

### 1️⃣ **User Authentication & Referral**

- New users register and receive a unique **referral code**.
- If a user signs up using a referral code, both referrer and referred user get **50 coins**.

### 2️⃣ **Daily Login Rewards**

- Users receive **10 coins** every day they log in.
- Logs are stored in the **Activity table**.

### 3️⃣ **Profile Completion Rewards**

- Users completing 100% of their profile get **30 coins**.

### 4️⃣ **Achievements System**

- Users unlock **Early Bird** if they log in for 3 consecutive days.
- Users unlock **Networker** if they refer 5 friends.
- Users unlock **Verified Profile** after completing 100% of their profile.

### 5️⃣ **AWS S3 & SQS Integration**

- Users can upload files to **AWS S3**.
- Messages for events (e.g., notifications) are sent to **AWS SQS** for processing.