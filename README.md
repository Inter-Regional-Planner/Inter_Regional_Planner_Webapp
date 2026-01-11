# **Inter-Regional Movement Planner – README**

## **Overview**

The **Inter Regional Moverment Planner** is a full-stack web application designed to help CARICOM nationals understand how to legally move to another Caribbean country for work under the **CARICOM Single Market and Economy (CSME)**.
The platform simplifies the Free Movement of Skills process by allowing users to:

* Select their **home country**, **target country**, and **professional category**
* Receive a **personalized guidance plan**
* View a **document checklist** tailored to their situation
* Understand key immigration notes and Competent Authority requirements

This project promotes safe, legal, and informed intra-regional mobility while supporting Caribbean integration and economic opportunity.

Google Doc for more design and functionality information: https://docs.google.com/document/d/1ye3nYQRRLvTwb_aQYq05UvZr_i9UvOYOFhHYkTfdPDY/edit?usp=sharing
---

## **Usage Guide**

### For Guests (No Registration Required)
1. Visit the homepage
2. Click "Plan my Move"
3. Select your home country, destination, and category
4. Generate your personalized plan
5. Use the checklist to track progress
6. Export your plan as PDF

### For Registered Users
1. Sign up for an account
2. Log in with your credentials
3. Create plans that are automatically saved
4. Access your plan history in "My Plan"
5. Track progress across multiple plans
6. Plans persist across sessions

### PDF Export
- Available to all users (guests and registered)
- Includes all plan details and checklist progress
- Professional formatting ready for printing
- Contains official resource links

---

# **Tech Stack**

### **Frontend**

- **React 19** with Vite build tool
- **React Router** for navigation
- **Context API** for state management
- **Vanilla CSS** for styling
- **Local Storage** for guest user persistence

### **Backend**

- **Node.js** with Express.js framework
- **PostgreSQL** database
- **Prisma** ORM for database management
- **JWT** for authentication
- **bcryptjs** for password hashing



Artificial intelligence tools were ** use for the basic frame work in the app’s functional logic and troubleshooting issues when connecting the backend to frontend and database integration challenges but still be further enhanced using my front-end development background and UI/UX design skiils**.


# **Project Structure**

```
Inter-Regional-planner-Webapp/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma      # Database schema
│   ├── package.json           # Backend dependencies
│   ├── server.js              # Main server file
│   └── .env                   # Environment variables 
├── frontend/
│   ├── public/
│   │   └── index.html         # HTML template
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx     # Navigation component
│   │   │   └── Footer.jsx     # Footer component
│   │   ├── pages/
│   │   │   ├── Home.jsx       # Homepage
│   │   │   ├── About.jsx      # About page
│   │   │   ├── Contact.jsx    # Contact page
│   │   │   ├── Resources.jsx  # Resources page
│   │   │   ├── CsmeBasics.jsx # CSME information
│   │   │   ├── Login.jsx      # Login page
│   │   │   ├── Signup.jsx     # Registration page
│   │   │   ├── Wizard.jsx     # Plan creation wizard
│   │   │   └── Plan.jsx       # My Plan page
│   │   ├── planner/
│   │   │   └── PlannerContext.jsx # Global state management
│   │   ├── utils/
│   │   │   └── pdfExport.js   # PDF export utility
│   │   ├── App.jsx            # Main app component
│   │   ├── main.jsx           # React entry point
│   │   └── index.css          # Global styles
│   ├── package.json           # Frontend dependencies
│   ├── vite.config.js         # Vite configuration
│   └── .env                   # Environment variables 
├── README.md                  # This file
└── .gitignore                 # Git ignore file

```

---

# **How to Run the Project Locally**

## **0. Requirements**

Ensure you have installed:

* Node.js (v18 or higher)
* PostgreSQL database
* npm or yarn package manager
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

# 5. API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User authentication

### Plans (Protected)
- `GET /api/user/plans` - Get user's saved plans
- `POST /api/plan` - Create new plan
- `PUT /api/plan/:id/checklist` - Update checklist progress
- `GET /api/plan/:id` - Get specific plan
- `DELETE /api/plan/:id` - Delete plan

### Public Data
- `GET /api/countries` - Get country list
- `GET /api/categories` - Get category list
- `GET /api/resources` - Get resource links

## Testing Checklist

### Authentication
- [ ] User can register with valid information
- [ ] User can login with correct credentials
- [ ] Session persists after page refresh
- [ ] Logout works correctly

### Plan Management
- [ ] Guest can create and view plans
- [ ] Guest checklist saves to localStorage
- [ ] Authenticated user can save plans to database
- [ ] Plans persist across sessions
- [ ] PDF export works correctly

### User Interface
- [ ] Navigation updates based on login state
- [ ] User greeting appears when logged in
- [ ] All pages load without errors
- [ ] Checklist interactions work smoothly

## Troubleshooting

### Common Issues

**Database Connection Error**
- Ensure PostgreSQL is running
- Check DATABASE_URL in backend .env
- Run `npx prisma migrate dev`

**CORS Error**
- Update FRONTEND_ORIGIN in backend .env
- Ensure frontend and backend URLs match

**Authentication Failures**
- Check JWT_SECRET is set
- Verify database migration completed
- Clear browser localStorage if needed

**PDF Export Not Working**
- Ensure popup blockers allow new windows
- Check browser console for errors
- Verify all plan data is loaded

# **6. Future Enhancements**

Possible future improvements include:

* Mobile app version
* Integration with government APIs for automatic verification
* PDF export of plans and customization
* Multi-language support (English + Caribbean Creoles)
* Job board integration across CARICOM states
* Document upload functionality
* Email notifications and confirmations

---

# **7. License**

© 2026 Joseann Boneo. All rights reserved.

This project is provided for **portfolio, educational, and demonstration purposes only**.

### Permitted Use
- Viewing and reviewing the code for learning and evaluation
- Referencing the project as part of a personal or academic portfolio
- Forking for **personal, non-commercial experimentation** (no redistribution)

### Prohibited Use
- Commercial use of any kind
- Redistribution or re-publication of the code or derivative works
- Use of the code in production systems or commercial products
- Claiming this work as your own or removing attribution

### Permissions
If you are interested in:
- Commercial use
- Collaboration
- Licensing this project for production

Please contact the author to request explicit written permission.

This repository does **not** grant any patent rights, trademark rights, or implied licenses.

