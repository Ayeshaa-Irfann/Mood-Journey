# Project Overview

The backend of Mood Journey is the core of my application, designed to handle user interactions and authentication effortlessly. It provides a reliable API structure that manages user data, authentication, and other essential functionalities.

---

## 🚀 Main Routes

At the heart of my backend are two primary routes:

- `/api/user` is where all user-related operations happen, including registration, login, and updating user data.
- `/api/auth` takes care of authentication, ensuring secure processes like OTP verification and JWT-based authentication.

---

## 🔧 Configuration Details

To keep my application secure and adaptable, I rely on environment variables for sensitive configurations. These include credentials for email services and the MongoDB URI, all stored in the `.env` file. This approach ensures that my backend can be deployed securely across different environments.

---

## 🗃️ MongoDB Schema

The database structure is defined in the `models/user.js` file. This schema is the backbone of my application, managing user data such as authentication details, mood tracking, goals, and tags.

---

## 🛠️ API Routes

### **Auth Routes** (`routes/auth.js`)

- `/verify` ensures secure user authentication through OTP verification.
- `/authenticate` processes JWT tokens to retrieve user data securely.

### **User Routes** (`routes/user.js`)

- `/register` handles user registration, saving data to the database and sending an OTP for verification.
- `/login` authenticates users and provides a JWT for secure access.
- `/update` allows users to update their mood data in the database, protected by JWT authentication.
- `/goal` enables users to set or update their personal goals.
- `/tag` manages user-defined tags, adding a layer of personalization to the experience.

---

Mood Journey's backend is my way of ensuring a scalable, secure, and efficient system for managing user interactions and data. It’s built to grow with the application and adapt to the needs of its users.
