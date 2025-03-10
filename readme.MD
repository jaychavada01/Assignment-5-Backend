# 🚀 ASSIGNMENT-5 BACKEND WORK

## 📌 Project Overview

This project is a backend application built with **Node.js**, **Express.js**, and **Sequelize** (ORM for PostgreSQL). It includes user authentication, JWT-based authorization, a referral and rewards system, activity tracking, achievements, AWS integrations for S3 file storage and SQS messaging, and multilingual support.

---

## 📂 Project Structure

```
Assignment/
├─ .gitignore                              # Git ignore file
├─ readme.MD                               # Project documentation
├─ api/                                    # Main application directory
│  ├─ .env                                 # Environment variables
│  ├─ app.js                               # Application entry point
│  ├─ package.json                         # Project dependencies
│  ├─ package-lock.json                    # Dependency lock file
│  │
│  ├─ config/                              # Configuration files
│  │  ├─ aws.js                            # AWS configuration
│  │  ├─ constant.js                       # Application constants
│  │  ├─ database.js                       # Database configuration
│  │  ├─ firebase.js                       # Firebase configuration
│  │  ├─ serviceAccountKey.json            # Firebase service account key
│  │  ├─ stripe.js                         # Stripe payment configuration
│  │  └─ swagger.js                        # API documentation configuration
│  │
│  ├─ controller/                          # Request handlers
│  │  ├─ authController.js                 # Authentication controllers
│  │  ├─ awsController.js                  # AWS-related controllers
│  │  └─ stripeController.js               # Payment processing controllers
│  │
│  ├─ helpers/                             # Helper functions
│  │  └─ sqsworker.js                      # SQS message processing worker
│  │
│  ├─ locales/                             # Multilingual support files
│  │  ├─ de.json                           # German translations
│  │  ├─ en.json                           # English translations
│  │  ├─ fr.json                           # French translations
│  │  └─ hi.json                           # Hindi translations
│  │
│  ├─ middleware/                          # Middleware functions
│  │  ├─ auth.js                           # Authentication middleware
│  │  ├─ i18n.js                           # Internationalization middleware
│  │  └─ upload.js                         # File upload middleware
│  │
│  ├─ models/                              # Database models
│  │  ├─ activity.js                       # User activity tracking model
│  │  ├─ cardDetails.js                    # Payment card details model
│  │  ├─ notificationToken.js              # User notification tokens model
│  │  └─ user.js                           # User account model
│  │
│  ├─ routes/                              # API routes
│  │  ├─ paymentRoute.js                   # Payment endpoint routes
│  │  └─ userRoute.js                      # User endpoint routes
│  │
│  ├─ uploads/                             # Temporary file storage
│  │  ├─ 1741156197174-images.jpeg         # Uploaded image example
│  │  └─ 1741156262013-images.jpeg         # Uploaded image example
│  │
│  └─ utils/                               # Utility functions
│     ├─ activityCalculator.js             # User activity calculation logic
│     ├─ mailer.js                         # Email sending functionality
│     ├─ notification.js                   # Push notification services
│     ├─ s3.js                             # AWS S3 interaction utilities
│     └─ sqs.js                            # AWS SQS interaction utilities
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
✅ **API Documentation** (Swagger integration)

---

### **Multilingual Support**

- The application supports multiple languages: **English (default), Hindi, French, and German**.
- Language preference is detected from the request headers or query parameters (`?lang=fr`).
- Translations are stored in the `/locales/` directory.
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

### **Payment Processing**

| Method | Endpoint                | Description                      | Auth Required |
| ------ | ----------------------- | -------------------------------- | ------------- |
| POST   | `/payment/add-card`     | Add a new payment card           | ✅ Yes        |
| GET    | `/payment/cards`        | List all saved payment cards     | ✅ Yes        |
| POST   | `/payment/transaction`  | Process a payment transaction    | ✅ Yes        |

---

## 🚀 How It Works

### 1. **User Authentication & Referral**

- New users register and receive a unique **referral code**.
- If a user signs up using a referral code, both referrer and referred user get **50 coins**.

### 2. **Multilingual Support**

- Users can receive API responses in **English, Hindi, French, or German**.
- The system detects language preference from request headers or query parameters (`?lang=fr`).

### 3. **Daily Login Rewards**

- Users receive **10 coins** every day they log in.
- Activity logs are stored in the **Activity table**.

### 4. **AWS S3 & SQS Integration**

- Users can upload files to **AWS S3** for secure storage.
- Messages for events (e.g., notifications) are sent to **AWS SQS** for asynchronous processing.
- The SQS worker process handles background tasks and notifications.

### 5. **Stripe Payment Integration**

- Users can add payment cards and make transactions securely.
- Card details are stored using Stripe's token system for PCI compliance.

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
- **i18n** – Multilingual Support
- **Swagger** – API Documentation
- **Firebase** – Notifications (Optional)