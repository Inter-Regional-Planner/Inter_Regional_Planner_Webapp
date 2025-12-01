# **CSME Move Planner – README**

## **Overview**

The **CSME Move Planner** is a full-stack web application designed to help CARICOM nationals understand how to legally move to another Caribbean country for work under the **CARICOM Single Market and Economy (CSME)**.
The platform simplifies the Free Movement of Skills process by allowing users to:

* Select their **home country**, **target country**, and **professional category**
* Receive a **personalized guidance plan**
* View a **document checklist** tailored to their situation
* Understand key immigration notes and Competent Authority requirements

This project promotes safe, legal, and informed intra-regional mobility while supporting Caribbean integration and economic opportunity.

Google Doc for more design and fucntionality information: https://docs.google.com/document/d/1ye3nYQRRLvTwb_aQYq05UvZr_i9UvOYOFhHYkTfdPDY/edit?usp=sharing
---

## **Features**

### ✅ Move Planner Wizard

Collects user inputs (home country, target country, category) and generates a custom plan.

### ✅ Rule-Based Guidance Engine

The backend matches country/category combinations with stored rules and returns tailored instructions.

### ✅ Document Checklist

Interactive checklist stored in browser localStorage.

### ✅ CSME Education Section

Explains Free Movement of Skills, eligibility categories, and limitations.

### ✅ Resources Page

Lists participating CSME Member States and research tips.

### ✅ Fully Modular & Expandable

New countries, categories, or rules can easily be added by editing JSON files.

---

# **Tech Stack**

### **Frontend**

* React (Vite)
* React Router
* JavaScript (ES6+)
* CSS

### **Backend**

* Node.js
* Express.js
* CORS
* JSON data structure

### **Storage**

* JSON files (countries, categories, rules)
* Browser localStorage (checklist tracking)

Artificial intelligence tools were ** use for the basic frame work in the app’s functional logic but still be further enhanced using my front-end development background and UI/UX design skiils**.


# **Project Structure**

```
Inter-Regional-planner-Webapp/
│── backend/
│     ├── server.js
│     ├── package.json
│     └── data/
│         ├── countries.json
│         ├── categories.json
│         └── rules.json
│
│── frontend/
      ├── src/
      │    ├── App.jsx
      │    ├── main.jsx
      │    ├── index.css
      │    ├── planner/
      │    │     └── PlannerContext.jsx
      │    └── pages/
      │          ├── Home.jsx
      │          ├── CsmeBasics.jsx
      │          ├── Wizard.jsx
      │          ├── Plan.jsx
      │          └── Resources.jsx
      ├── package.json
```

---

# **How to Run the Project Locally**

## **0. Requirements**

Ensure you have installed:

* Node.js (v18+)
* npm (comes with Node)
* A web browser (Chrome, Edge, Firefox, etc.)

---

# **1. Running the Backend Server**

### Step 1 — Navigate to the backend folder

```
cd backend
```

### Step 2 — Install backend dependencies

```
npm install
```

### Step 3 — Start the backend server

```
npm start
```

You should see:

```
Backend API listening on http://localhost:4000
```

Do **not** close this terminal.

---

# **2. Running the Frontend (React App)**

### Step 1 — Open a new terminal window

### Step 2 — Navigate to the frontend folder

```
cd frontend
```

### Step 3 — Install frontend dependencies

```
npm install
```

### Step 4 — Start the frontend dev server

```
npm run dev
```

You will see:

```
VITE vX.X.X ready
Local: http://localhost:5173/
```

Open:

👉 **[http://localhost:5173](http://localhost:5173)**

---

# **3. Application Behavior**

Once running:

* Frontend runs on **[http://localhost:5173](http://localhost:5173)**
* Backend runs on **[http://localhost:4000](http://localhost:4000)**
* The frontend communicates with the backend through REST API calls
* The Move Planner wizard generates:

  * Personalized summary
  * Notes
  * Checklist
  * Competent Authority guidance

Checklist progress is saved locally on the user’s browser.

---

# **4. Stopping the Application**

Press:

```
CTRL + C
```

in each terminal window.

---

# **5. Future Enhancements**

Possible future improvements include:

* Mobile app version
* Integration with government APIs for automatic verification
* PDF export of plans
* Multi-language support (English + Caribbean Creoles)
* Job board integration across CARICOM states

---

# **6. License**


