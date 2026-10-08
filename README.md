# MediCare – Hospital Management System

A complete, modern, and responsive **Hospital Management System (HMS)** web application built for college web programming projects. MediCare connects **Patients**, **Doctors**, **Receptionists**, and **Administrators** in a unified digital healthcare ecosystem.

---

## 🚀 Key Features & Role Capabilities

### 1. 🔑 Administrator
* **Admin Login & Dashboard**: Real-time statistical metrics for Total Patients, Total Doctors, Today's Appointments, Pending Appointments, Total Revenue, and Available Bed Capacity.
* **Interactive Charts**: Monthly appointment trends, revenue growth, and department-wise patient distribution powered by Chart.js.
* **Doctor Management**: Add, view, edit, and delete doctor profiles.
* **Patient & Staff Management**: View patient records and manage hospital staff (nurses, lab tech, administrative personnel).
* **Appointment & Billing Control**: Oversee all hospital appointments and financial invoicing.

### 2. 🩺 Doctor
* **Doctor Console**: View today's scheduled appointments and patient queues.
* **Clinical Diagnosis**: Record patient symptoms, medical diagnosis, treatment plans, and doctor notes.
* **Digital Prescriptions**: Prescribe medicines with dosage, duration, and usage instructions.
* **Medical History**: Access comprehensive patient medical history and previous clinical records.
* **Appointment Status Updates**: Mark appointments as `Confirmed`, `Completed`, or `Cancelled`.

### 3. 👤 Patient
* **Patient Portal & Registration**: Secure account registration and authentication.
* **Doctor Search & Filter**: Filter doctors by specialization, clinical department, and experience.
* **Smart Appointment Booking**: Real-time slot selection with **double-booking prevention**.
* **Prescription & Medical Records**: Access digital prescriptions and diagnosis records anytime.
* **Billing & Online Payments**: View invoices and process instant payments.

### 4. 📋 Receptionist
* **Front Desk Desk**: Register walk-in patients quickly.
* **Real-time Schedule Tracker**: View doctor availability schedules and daily appointments.
* **Invoice Generation**: Issue custom billing invoices for treatments and consultations.

---

## 🛠️ Technology Stack

* **Frontend**: HTML5, CSS3 (Modern Medical Design System), JavaScript (ES6+), Bootstrap 5.3, FontAwesome 6, Chart.js
* **Backend**: Node.js, Express.js
* **Database**: MySQL (`mysql2/promise`), standard SQL Schema (`database/schema.sql`) and Seed Data (`database/seed.sql`)
* **Authentication**: JSON Web Tokens (JWT), Passwords hashed with `bcryptjs`
* **Architecture**: REST API architecture with clean MVC separation (`routes`, `controllers`, `models`, `database`).

---

## 📁 Project Folder Structure

```
Hospital management system/
├── database/
│   ├── db.js                 # MySQL Pool connection & database fallback handler
│   ├── schema.sql            # MySQL DDL Table creation script
│   ├── seed.sql              # Database seed data with hashed demo credentials
│   └── init_db.js            # Database auto-initializer
├── middleware/
│   ├── auth.js               # JWT Auth & Role-Based Access Control (RBAC)
│   └── errorHandler.js       # Centralized API error handler
├── models/
│   ├── User.js               # User auth model
│   ├── Patient.js            # Patient profile model
│   ├── Doctor.js             # Doctor profile model
│   ├── Department.js         # Department model
│   ├── Appointment.js        # Appointment booking & conflict prevention model
│   ├── MedicalRecord.js      # Diagnosis & history model
│   ├── Prescription.js       # Prescription model
│   ├── Billing.js            # Invoicing & revenue model
│   └── Staff.js              # Hospital staff model
├── controllers/
│   ├── authController.js
│   ├── adminController.js
│   ├── doctorController.js
│   ├── patientController.js
│   ├── receptionistController.js
│   ├── departmentController.js
│   ├── appointmentController.js
│   ├── medicalRecordController.js
│   ├── prescriptionController.js
│   └── billingController.js
├── routes/
│   ├── authRoutes.js
│   ├── adminRoutes.js
│   ├── doctorRoutes.js
│   ├── patientRoutes.js
│   ├── receptionistRoutes.js
│   ├── departmentRoutes.js
│   ├── appointmentRoutes.js
│   ├── medicalRecordRoutes.js
│   ├── prescriptionRoutes.js
│   └── billingRoutes.js
├── public/
│   ├── index.html            # Main SPA HTML structure
│   ├── css/
│   │   └── style.css         # Modern medical styling & responsive layout
│   └── js/
│       ├── utils.js          # Toast alerts & formatters
│       ├── home.js           # Public section & doctor search logic
│       ├── auth.js           # Auth & demo credential quick-fill
│       ├── dashboards.js     # Admin, Doctor, Patient, Receptionist dashboard renderers
│       └── app.js            # Main router & form event listeners
├── .env.example              # Environment variables template
├── .env                      # Application configuration
├── package.json
├── server.js                 # Express application server entry point
└── README.md
```

---

## 🔑 Demo Login Credentials

You can use the **⚡ Quick Fill Demo Logins** buttons on the Login page or enter these credentials manually:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@medicare.com` | `Admin@123` |
| **Doctor** | `dr.smith@medicare.com` | `Doctor@123` |
| **Patient** | `john.doe@gmail.com` | `Patient@123` |
| **Receptionist** | `reception@medicare.com` | `Reception@123` |

---

## ⚡ Quick Start & Installation

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Database Setup (MySQL)
Ensure your MySQL server is running (e.g. via XAMPP, WampServer, or standalone MySQL Server).

Configure `.env` file if necessary:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=medicare_db
```

Initialize the MySQL database and sample seed data:
```bash
npm run init-db
```

### Step 3: Run Application
```bash
npm start
```
Open your browser and navigate to:
👉 **`http://localhost:5000`**

---

## 🛡️ Security Features
- **Input Validation & Parameterized SQL**: All queries use parameterized placeholders (`?`) to prevent SQL Injection attacks.
- **Password Hashing**: Passwords stored using `bcryptjs` salt rounds.
- **JWT Authorization**: API routes are protected by role-based access control tokens.
