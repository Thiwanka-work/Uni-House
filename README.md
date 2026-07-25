<div align="center">

# 🏠 Uni-House — Student Boarding & Accommodation Platform

[![React](https://img.shields.io/badge/Frontend-React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Build-Vite_4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![PHP](https://img.shields.io/badge/Backend-PHP_8-777BB4?style=for-the-badge&logo=php&logoColor=white)](https://www.php.net/)
[![MySQL](https://img.shields.io/badge/Database-MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)

<p align="center">
  <b>A modern web platform connecting university students with verified boarding places, student housing, and local support services.</b>
</p>

[Key Features](#-key-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Folder Structure](#-project-structure) • [Database Setup](#-database-setup)

---

</div>

## 📌 About The Project

Finding reliable, comfortable, and affordable boarding places near universities can be challenging for students. **Uni-House** bridges the gap between **students**, **property owners**, and **service providers** by delivering a centralized, easy-to-use digital marketplace.

With smart search filtering, direct owner communication, and utility service listings, Uni-House simplifies university accommodation setup.

---

## ✨ Key Features

### 🎓 For Students
* **Smart Search & Filters:** Find boarding places by university, price range, room type, and essential amenities (Wi-Fi, attached bathrooms, meals, security).
* **Detailed Listings:** High-quality photo galleries, location details, pricing, and owner contact information.
* **Favorites System:** Save preferred listings to view later.

### 🏠 For Boarding Owners
* **Property Management:** Easily list new boarding houses, upload multiple property photos, and update details.
* **Owner Dashboard:** Monitor active listings, inquiries, and student views.

### 🔧 For Service Providers
* **Local Services Marketplace:** List maintenance, cleaning, catering, laundry, and internet support services targeted directly at students and property owners.

### 🛡️ Admin Oversight
* Comprehensive admin dashboard for platform monitoring, user role management, and content moderation.

---

## 🛠️ Tech Stack

| Domain | Technologies |
| :--- | :--- |
| **Frontend Framework** | React 18, React Router DOM v6 |
| **Styling & UI** | Tailwind CSS, Framer Motion, Lucide Icons |
| **Build Tool** | Vite |
| **Backend API** | PHP (RESTful API Architecture) |
| **Database** | MySQL |
| **Server Environment** | Apache / XAMPP Built-in PHP Server |

---

## 🚀 Getting Started

### Prerequisites
Make sure you have the following installed on your system:
* [Node.js](https://nodejs.org/) (v16.0 or higher)
* [XAMPP](https://www.apachefriends.org/) or PHP 8+ with MySQL

---

### 📥 Installation & Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/your-username/Uni-House.git
cd Uni-House
```

#### 2. Database Configuration
1. Open **XAMPP Control Panel** and start **Apache** and **MySQL**.
2. Go to `http://localhost/phpmyadmin/`.
3. Create a new database named **`boarding_finder`**.
4. Import the provided SQL dump file:
   ```path
   boarding_finder.sql
   ```

#### 3. Frontend Setup
Navigate to the `frontend` folder and install NPM packages:
```bash
cd frontend
npm install
```

#### 4. Running the Application

##### Option A: Quick Launch (Windows)
Simply double-click or execute the included batch script at the root directory:
```bash
start-app.bat
```
*(This automatically boots the PHP API server at `localhost:8000` and launches the Vite React frontend).*

##### Option B: Manual Launch
* **Start PHP API Backend:**
  ```bash
  php -S localhost:8000 -t boarding-finder/backend
  ```
* **Start React Frontend:**
  ```bash
  cd frontend
  npm run dev
  ```
  Open `http://localhost:5173` in your browser.

---

## 📁 Project Structure

```text
Uni-House/
├── 📂 boarding-finder/         # PHP Backend & Database REST API
│   └── 📂 backend/
│       ├── 📂 api/             # API Endpoints (Auth, Boardings, Services)
│       ├── 📂 config/          # Database connection setup
│       ├── 📂 objects/         # PHP Data Access Objects
│       └── 📂 uploads/         # Stored property & service images
├── 📂 frontend/                # React Frontend Application
│   ├── 📂 src/
│   │   ├── 📂 components/      # Reusable UI Components & Navigation
│   │   ├── 📂 contexts/        # Authentication & State Contexts
│   │   ├── 📂 pages/           # Application Views (Home, Search, Dashboards)
│   │   └── App.jsx             # Main Routing Configuration
│   ├── package.json
│   └── tailwind.config.js
├── boarding_finder.sql          # Database Schema & Seed Data
└── start-app.bat               # One-click startup script for Windows
```

---

## 🤝 Contributing

Contributions make the open-source community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

<div align="center">
  <sub>Built with ❤️ for University Students</sub>
</div>
