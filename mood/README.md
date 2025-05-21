# Mood Journey

Mood Journey is my full-stack application, designed to create a seamless connection between the frontend and backend. It’s built to provide a smooth and efficient user experience while maintaining flexibility and scalability.

---

## 🔧 Frontend Overview

The frontend of Mood Journey is powered by Vite, offering a fast and modern development experience. It communicates with the backend through a configurable environment variable, making it adaptable to different deployment environments. By default, the backend operates on `http://localhost:4000`, but this can be adjusted to match the deployment URL.

---

## 🛠️ Backend Overview

The backend is the backbone of my application, built with Node.js and MongoDB. It handles database connectivity and email services, relying on environment variables for sensitive configurations. These variables, stored in the `.env` file, include:

- **MongoDB URI**: Ensures a secure connection to the database.
- **Mail Host and Credentials**: Powers the email services used in the application.

An example `.env` structure looks like this:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority
MAIL_HOST="mail.skillrextech.com"
MAIL_USER="info@skillrextech.com"
MAIL_PASSWORD="T3stP@ssw0rd!"
```

---

## 🚀 Running the Project

Mood Journey is designed to be easy to set up and run. The process is straightforward:

- For the **frontend**, dependencies are installed, and the development server is started to enable real-time updates during development.
- For the **backend**, dependencies are installed, and the server is launched to handle API requests and database interactions.

### Frontend

1. Navigate to the frontend directory:
   cd moodFrontend

2. Install dependencies:
   npm install

3. Start the development server:
   npm run dev

### Backend

1. Navigate to the backend directory:
   cd moodBackend

2. Install dependencies:
   npm install
3. Start the server:
   node index.js

---

Mood Journey represents my vision of a scalable and user-friendly application, combining modern tools and best practices to deliver a reliable and efficient experience.
