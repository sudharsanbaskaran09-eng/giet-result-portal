# GIET Student Result Portal

A simple web portal built to help students quickly check their exam results when the **Anna University results portal** became slow or unavailable.

This portal allows students to enter their **register number** and instantly view their **semester-wise results**.

---

# Live Demo

https://giet-result-portal.onrender.com

---

# Problem

When the **Anna University results portal** went down, many students in our college were unable to access their results.

Instead of waiting for the portal to come back online, I built a lightweight **Results Portal** so students could check their grades without depending on the overloaded university website.

---

# Features

- Search results using **Register Number**
- Displays **Semester-wise subjects and grades**
- Handles **755+ student records**
- Fast lookup using structured JSON data
- Simple and responsive UI
- Deployed on the cloud for easy access

---

# Tech Stack

- Node.js
- Express.js
- HTML
- CSS
- JavaScript
- JSON (data storage)

### Deployment

- Render (Cloud Hosting)
- GitHub (Version Control)

---

# Project Structure

```
result-portal/

│

├── public/
│   ├── index.html
│   ├── script.js
│   └── style.css

├── server.js
├── results.json
├── parsePdf.js
├── package.json
└── package-lock.json
```

---

# How It Works

1. Student enters their **register number**
2. Frontend sends request to the server
3. Server searches the result in **results.json**
4. If found, it returns:

   - Student Name
   - Register Number
   - Department
   - Semester
   - Subject Codes
   - Grades

5. Results are displayed instantly on the UI.

---

# Run Locally

Clone the repository

```
git clone https://github.com/sudharsanbaskaran09-eng/giet-result-portal.git
```

Go into project folder

```
cd giet-result-portal
```

Install dependencies

```
npm install
```

Start the server

```
node server.js
```

Open in browser

```
http://localhost:3000
```

---

# Data Source

The result data was shared by our professor and structured into JSON format for fast lookup.

Dataset includes:

- 755 students
- 8500+ grade entries
- Multiple semesters and subjects

---

# Learning Outcomes

This project helped me learn:

- Building a **Node.js backend**
- Creating APIs with **Express**
- Structuring and querying JSON data
- Rapid development using **AI-assisted coding**
- Deploying web applications to the cloud

---

# Acknowledgement

Special thanks to our **HOD and professors** who appreciated and encouraged the initiative to build a quick solution for students.

---

# Author

Sudharsan B  
B.E Computer Science Engineering  
Global Institute of Engineering and Technology

GitHub - https://github.com/sudharsanbaskaran09-eng/giet-result-portal
