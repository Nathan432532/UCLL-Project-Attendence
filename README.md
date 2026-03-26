# UCLL Attendance Project

This project is an attendance registration application, consisting of a Python backend for data processing and a modern web frontend.

---

## Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

Make sure the following software is installed on your system:

- **Node.js** (LTS version)
- **Python 3.x**

---

## Installation & Setup

### 1. Export Model Data

Before starting the web app, the model needs to generate the required data. Run this script once from the root of the project:

```bash
python model/export_model_output.py
```

### 2. Install Frontend Dependencies

Navigate to the frontend folder and install all dependencies:

```bash
cd ./UCLL_frontend
npm install
```

### 3. Start the Application

Start the local development server:

```bash
npm run dev
```

The application will be available at the URL shown in your terminal (usually `http://localhost:5173`).

---

## Project Structure

- `/model` — Contains the Python scripts for logic and data export.
- `/frontend` — Contains the source code of the user interface.
