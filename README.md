# 📇 Contact Web App

A **full‑stack Contact Management Web Application** that allows users to **register, log in, and manage their contacts (friends)** with features like **add, edit, delete, search, and sort contacts**.

Built using **React + Vite** on the frontend and **Node.js + Express + MongoDB** on the backend.

---

## 🚀 Features

### 👤 Authentication

* User registration & login
* Secure authentication using JWT & cookies
* Protected routes

### 📇 Contact Management

* Add new contacts
* Edit existing contacts
* Delete contacts
* Store name, email, phone & message

### 🔍 Search & Sort

* Global search (search by name, email, phone, or message)
* Sort contacts by:

  * Name
  * Email
  * Phone
* Ascending & descending order

### 🎨 UI / UX

* Clean & responsive UI
* Dark mode support
* Reusable UI components
* Icons powered by **Lucide React**

---

## 🛠️ Tech Stack

### Frontend

* ⚛️ React (Vite)
* 🧠 Redux Toolkit
* 🌐 React Router DOM
* 🎨 Tailwind CSS
* 🧩 ShadCN UI
* 🎯 Lucide Icons

### Backend

* 🟢 Node.js
* 🚀 Express.js
* 🍃 MongoDB + Mongoose
* 🔐 JWT Authentication
* 📦 Multer (file uploads)
* ☁️ Cloudinary (image storage)

---

## 📁 Project Structure

```text
contact-web-app/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   ├── hooks/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── vite.config.js
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── utils/
│   └── server.js
│
└── README.md
```

---

## ⚙️ Environment Variables

Create a `.env` file in the **backend** folder:

```env
PORT=8000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=xxxx
CLOUDINARY_API_KEY=xxxx
CLOUDINARY_API_SECRET=xxxx
```

---

## ▶️ Getting Started

### 1️⃣ Clone the repository

```bash
git clone https://https://github.com/rahulsaha2005/ContactWebApp.git
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
npm run dev
```

Backend runs on:

```
http://localhost:5000
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

## 🔐 API Features

* Auth APIs (Register / Login / Logout)
* Add Contact
* Edit Contact
* Delete Contact
* Get All Contacts

---


## 🔮 Future Enhancements

* Contact groups & labels
* Import / Export contacts
* Profile image upload

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

---


### ✨ Contact Web App – Manage your contacts smartly
