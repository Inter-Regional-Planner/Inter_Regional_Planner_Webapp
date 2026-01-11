// Enhanced backend server with authentication middleware and new endpoints
// Enhanced backend server with authentication middleware and new endpoints
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET =
  process.env.JWT_SECRET || "fedd24de-91fd-40e1-8637-1e33e4b3c74c";

// ====== Basic middleware ======
app.use(express.json());

// Allow CORS from your frontend
const allowedOrigin = process.env.FRONTEND_ORIGIN || "*";
app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);

// ====== Authentication Middleware ======
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Access token required" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        surname: true,
        email: true,
        country: true,
        dob: true,
        createdAt: true,
      },
    });

    if (!user) return res.status(401).json({ error: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

// ====== API Endpoints ======

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Countries from DB
app.get("/api/countries", async (req, res) => {
  try {
    const countries = await prisma.country.findMany({
      orderBy: { name: "asc" },
    });
    res.json(countries);
  } catch (err) {
    console.error("countries error:", err);
    res.status(500).json({ error: "Failed to load countries." });
  }
});

// Categories from DB
app.get("/api/categories", async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { label: "asc" },
    });
    res.json(categories);
  } catch (err) {
    console.error("categories error:", err);
    res.status(500).json({ error: "Failed to load categories." });
  }
});

// Resources from DB (reuse Country table)
app.get("/api/resources", async (req, res) => {
  try {
    const resources = await prisma.country.findMany({
      select: {
        code: true,
        name: true,
        immigrationUrl: true,
        competentAuthorityUrl: true,
        formsUrl: true,
        notes: true,
      },
      orderBy: { name: "asc" },
    });
    res.json(resources);
  } catch (err) {
    console.error("resources error:", err);
    res.status(500).json({ error: "Failed to load resources." });
  }
});

// Generate plan and save to database (UPDATED for new Prisma schema)
app.post("/api/plan", async (req, res) => {
  try {
    const { fromCountry, toCountry, category, userId } = req.body || {};

    const fromCode = String(fromCountry || "").trim();
    const toCode = String(toCountry || "").trim();

    // category should be Category.id (Int) from your new schema
    const categoryId = Number(category);

    if (!fromCode || !toCode || !Number.isInteger(categoryId)) {
      return res.status(400).json({
        error: "Missing or invalid required fields (fromCountry, toCountry, category).",
      });
    }

    const [fromC, toC, cat] = await Promise.all([
      prisma.country.findUnique({ where: { code: fromCode } }),
      prisma.country.findUnique({ where: { code: toCode } }),
      prisma.category.findUnique({ where: { id: categoryId } }),
    ]);

    if (!fromC || !toC || !cat) {
      return res.status(400).json({ error: "Invalid country or category." });
    }

    // Create plan content
    const summary = `This plan outlines the steps for a ${cat.label} moving from ${fromC.name} to ${toC.name} under the CSME Free Movement of Skills.`;

    const planData = {
      summary,
      notes:
        "Always verify requirements with official websites, as procedures and documents can change.",
      checklist: [
        {
          id: "passport",
          label: "Valid passport",
          description: "Ensure your passport is valid for at least 6–12 months beyond your planned stay.",
        },
        {
          id: "qualifications",
          label: "Certified copies of qualifications",
          description: `Gather original and certified copies of your ${cat.label} qualifications (degree, diploma, trade certificate, etc.).`,
        },
        {
        id: "passport-photos",
        label: "Passport photos",
        description: "Prepare the number and size of passport photos required by the Skills Certificate application form.",
        },
        {
        id: "police-record",
        label: "Police record / Certificate of character",
        description:
          "Obtain a recent police record (typically less than 6 months old) from your home country.",
      },
        {
        id: "medical-certificate",
        label: "Medical certificate",
        description:
          "Complete a medical examination and obtain the required health certificate.",
      },
        {
        id: "birth-certificate",
        label: "Birth certificate",
        description:
          "Provide an official birth certificate (original or certified copy).",
      },
        {
        id: "marriage-certificate",
        label: "Marriage certificate (if applicable)",
        description:
          "If married or divorced, provide relevant certificates to verify name changes.",
      },
        {
        id: "employment-contract",
        label: "Employment contract or job offer",
        description:
          "If you already have employment lined up, include your contract or offer letter.",
      },
      {
        id: "bank-statements",
        label: "Bank statements / Proof of funds",
        description:
          "Show you can support yourself initially (amount varies by country).",
      },
      {
        id: "skills-certificate-application",
        label: "CSME Skills Certificate application",
        description:
          "Complete and submit the Skills Certificate application to your home country's Competent Authority.",
      },
      ],
      timeline: {
        documents: "2–6 weeks to gather documents, depending on processing time for police records and transcripts.",
        skillsCertificate: "2–8 weeks for Skills Certificate application processing, depending on the competent authority.",
        verification: "1–4 weeks for verification checks in the destination country after arrival, if required.",
      },
      officialLinks: {
        immigration: toC.immigrationUrl,
        competentAuthority: toC.competentAuthorityUrl,
        forms: toC.formsUrl,
      },
    };

    // Save plan (optional for guest)
    const saved = await prisma.plan.create({
      data: {
        userId: userId || null,
        fromCountryCode: fromC.code,
        toCountryCode: toC.code,
        categoryId: cat.id,
        summary: planData.summary,
        notes: planData.notes,
        checklistJson: planData.checklist,
        timelineJson: planData.timeline,
      },
    });

    res.json({ ...planData, planId: saved.id });
  } catch (err) {
    console.error("Error generating plan:", err);
    res.status(500).json({ error: "Failed to generate plan." });
  }
});

// Get user's saved plans (protected route) - UPDATED
app.get("/api/user/plans", authenticateToken, async (req, res) => {
  try {
    const plans = await prisma.plan.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        fromCountry: { select: { code: true, name: true } },
        toCountry: {
          select: {
            code: true,
            name: true,
            immigrationUrl: true,
            competentAuthorityUrl: true,
            formsUrl: true,
          },
        },
        category: { select: { id: true, code: true, label: true } },
      },
    });

    res.json(plans);
  } catch (err) {
    console.error("Fetch user plans error:", err);
    res.status(500).json({ error: "Failed to load plans." });
  }
});

// Update plan checklist (protected route)
app.put("/api/plan/:planId/checklist", authenticateToken, async (req, res) => {
  try {
    const { planId } = req.params;
    const { checklistJson } = req.body;

    const plan = await prisma.plan.findUnique({
      where: { id: parseInt(planId, 10) },
    });

    if (!plan) return res.status(404).json({ error: "Plan not found" });
    if (plan.userId !== req.user.id) {
      return res.status(403).json({ error: "Not authorized to update this plan" });
    }

    const updatedPlan = await prisma.plan.update({
      where: { id: parseInt(planId, 10) },
      data: { checklistJson },
    });

    res.json(updatedPlan);
  } catch (err) {
    console.error("Update checklist error:", err);
    res.status(500).json({ error: "Failed to update checklist" });
  }
});

// Get specific plan (protected route)
app.get("/api/plan/:planId", authenticateToken, async (req, res) => {
  try {
    const { planId } = req.params;

    const plan = await prisma.plan.findUnique({
      where: { id: parseInt(planId, 10) },
      include: {
        fromCountry: { select: { code: true, name: true } },
        toCountry: {
          select: {
            code: true,
            name: true,
            immigrationUrl: true,
            competentAuthorityUrl: true,
            formsUrl: true,
          },
        },
        category: { select: { id: true, code: true, label: true } },
      },
    });

    if (!plan) return res.status(404).json({ error: "Plan not found" });
    if (plan.userId !== req.user.id) {
      return res.status(403).json({ error: "Not authorized to view this plan" });
    }

    res.json(plan);
  } catch (err) {
    console.error("Fetch plan error:", err);
    res.status(500).json({ error: "Failed to load plan" });
  }
});

// Delete plan (protected route)
app.delete("/api/plan/:planId", authenticateToken, async (req, res) => {
  try {
    const { planId } = req.params;

    const plan = await prisma.plan.findUnique({
      where: { id: parseInt(planId, 10) },
    });

    if (!plan) return res.status(404).json({ error: "Plan not found" });
    if (plan.userId !== req.user.id) {
      return res.status(403).json({ error: "Not authorized to delete this plan" });
    }

    await prisma.plan.delete({
      where: { id: parseInt(planId, 10) },
    });

    res.json({ message: "Plan deleted successfully" });
  } catch (err) {
    console.error("Delete plan error:", err);
    res.status(500).json({ error: "Failed to delete plan" });
  }
});

// Get current user profile (protected route)
app.get("/api/user/profile", authenticateToken, (req, res) => {
  res.json(req.user);
});

// Update user profile (protected route)
app.put("/api/user/profile", authenticateToken, async (req, res) => {
  try {
    const { name, surname, country, dob } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        name: name || req.user.name,
        surname: surname ?? req.user.surname,
        country: country ?? req.user.country,
        dob: dob ? new Date(dob) : req.user.dob,
      },
      select: {
        id: true,
        name: true,
        surname: true,
        email: true,
        country: true,
        dob: true,
        createdAt: true,
      },
    });

    res.json(updatedUser);
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

// ====== Authentication Endpoints ======

// Sign up
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, surname, email, password, country, dob } = req.body || {};

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Name, email, and password are required." });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: "Email is already registered." });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        surname: surname || "",
        email,
        password: hashed,
        country: country || null,
        dob: dob ? new Date(dob) : null,
      },
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        country: user.country,
        dob: user.dob,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Failed to sign up." });
  }
});

// Log in
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: "Invalid credentials." });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Invalid credentials." });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        country: user.country,
        dob: user.dob,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Failed to log in." });
  }
});

// ====== Start server ======
app.listen(PORT, () => {
  console.log(`Backend API listening on http://localhost:${PORT}`);
});
