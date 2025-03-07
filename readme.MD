# 🚀 ASSIGNMENT-5 BACKEND WORK

## 📌 Project Overview

This project is a backend application built with **Node.js**, **Express.js**, and **Sequelize** (ORM for PostgreSQL). It includes user authentication, JWT-based authorization, a referral and rewards system, activity tracking, achievements, AWS integrations for S3 file storage and SQS messaging, and multilingual support.

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
│  │  ├─ serviceAccountKey.json
│  │  └─ stripe.js
│  ├─ controller/
│  │  ├─ authController.js
│  │  ├─ awsController.js
│  │  └─ stripeController.js
│  ├─ locales/
│  │  ├─ de.json
│  │  ├─ en.json
│  │  ├─ fr.json
│  │  └─ hi.json
│  ├─ middleware/
│  │  ├─ auth.js
│  │  ├─ i18n.js
│  │  └─ upload.js
│  ├─ models/
│  │  ├─ activity.js
│  │  ├─ cardDetails.js
│  │  ├─ notificationToken.js
│  │  └─ user.js
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ routes/
│  │  ├─ paymentRoute.js
│  │  └─ userRoute.js
│  ├─ utils/
│     ├─ activityCalculator.js
│     ├─ mailer.js
│     ├─ notification.js
│     ├─ s3.js
│     └─ sqs.js
└─ readme.MD

```

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```sh
git clone https://github.com/jaychavada01/Assignment-5-Backend.git
cd api
```

### 2. Install Dependencies

```sh
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the `api/` directory and add the following values:

```
PORT=3000
JWT_SECRET=your_jwt_secret
DB_NAME=your_db_name
DB_USER=your_user
DB_PASSWORD=your_pass
DB_HOST=localhost
DB_DIALECT=postgres
MAILTRAP_HOST=smtp.mailtrap.io
MAILTRAP_PORT=2525
MAILTRAP_USER=your_mailtrap_username
MAILTRAP_PASS=your_mailtrap_password
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
S3_BUCKET_NAME=your_s3_bucket_name
SQS_QUEUE_URL=your_sqs_queue_url
STRIPE_SECRET_KEY=your_key
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
✅ **Stripe Payment Integration** (Card management & transactions)  
✅ **Multilingual Support** (English, Hindi, French, German)

---

### **Multilingual Support**

- The application supports multiple languages: **English (default), Hindi, French, and German**.
- Language preference is detected from the request headers or defaults to English (`en`).
- Translations are stored in `/locales/` directory.
- Example usage in API response:
  ```js
  res.t("auth.signup_success"); // Retrieves translated message based on user's language preference
  ```

---

## 🔗 API Endpoints

### **Authentication**

| Method | Endpoint                 | Description                                                              | Auth Required |
| ------ | ------------------------ | ------------------------------------------------------------------------ | ------------- |
| POST   | `/users/signup`          | Register a new user. If a referral code is used, both users get rewards. | ❌ No         |
| POST   | `/users/login`           | Log in and get JWT token. Tracks daily login rewards.                    | ❌ No         |
| POST   | `/users/logout`          | Log out and blacklist token.                                             | ✅ Yes        |
| POST   | `/users/reset-password`  | Reset password.                                                          | ❌ No         |
| POST   | `/users/forgot-password` | Send password reset email.                                               | ❌ No         |
| POST   | `/users/change-password` | Change password.                                                         | ✅ Yes        |

### **AWS Integrations**

| Method | Endpoint              | Description                     | Auth Required |
| ------ | --------------------- | ------------------------------- | ------------- |
| POST   | `/users/upload-aws`   | Upload files to AWS S3          | ✅ Yes        |
| POST   | `/users/send-message` | Send a message to AWS SQS queue | ✅ Yes        |

---

## 🚀 How It Works

### 1. **User Authentication & Referral**

- New users register and receive a unique **referral code**.
- If a user signs up using a referral code, both referrer and referred user get **50 coins**.

### 2. **Multilingual Support**

- Users can receive API responses in **English, Hindi, French, or German**.
- The system detects it from query `?lang='fr'` for new language

### 3. **Daily Login Rewards**

- Users receive **10 coins** every day they log in.
- Logs are stored in the **Activity table**.

### 4. **AWS S3 & SQS Integration**

- Users can upload files to **AWS S3**.
- Messages for events (e.g., notifications) are sent to **AWS SQS** for processing.

### 5. **Stripe Payment Integration**

- Users can add payment cards and make transactions.
- Transaction details are stored securely.

---

## ✨ Technologies Used

- **Node.js** & **Express.js** – Backend Framework
- **Sequelize** – ORM for PostgreSQL
- **JWT (JSON Web Token)** – Authentication
- **Bcrypt.js** – Password Hashing
- **Nodemailer & Mailtrap** – Email Notifications
- **AWS S3** – File Storage
- **AWS SQS** – Message Queue Service
- **Stripe** – Payment Processing
- **i18n for Multilingual Support** – Supports English, Hindi, French, and German
