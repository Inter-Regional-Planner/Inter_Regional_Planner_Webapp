require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

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

// ====== Static data (still used by buildPlan) ======

// CSME participating countries (subset – add more if needed)
const countries = [
  { code: "TT", name: "Trinidad and Tobago" },
  { code: "BB", name: "Barbados" },
  { code: "JM", name: "Jamaica" },
  { code: "GY", name: "Guyana" },
  { code: "LC", name: "Saint Lucia" },
  { code: "GD", name: "Grenada" },
  { code: "DM", name: "Dominica" },
  { code: "VC", name: "St. Vincent and the Grenadines" },
  { code: "KN", name: "St. Kitts and Nevis" },
  { code: "AG", name: "Antigua and Barbuda" },
  { code: "SR", name: "Suriname" },
  { code: "BZ", name: "Belize" },
];

const categories = [
  {
    id: "university-graduate",
    label: "University Graduate",
    description:
      "Holds at least a bachelor’s degree or equivalent from a recognized institution.",
  },
  {
    id: "nurse",
    label: "Nurse",
    description: "Registered nurse with recognized qualifications.",
  },
  {
    id: "teacher",
    label: "Teacher",
    description: "Trained teacher with approved teaching qualifications.",
  },
  {
    id: "artisan",
    label: "Artisan",
    description: "Certified skilled worker in an approved trade.",
  },
  {
    id: "media-worker",
    label: "Media Worker",
    description: "Journalists and other media professionals.",
  },
  {
    id: "sportsperson",
    label: "Sportsperson",
    description: "Professional athletes recognized by a sporting body.",
  },
  {
    id: "musician-artiste",
    label: "Musician / Artiste",
    description: "Musicians, performers and creative artistes.",
  },
  {
    id: "assoc-degree",
    label: "Holder of Associate Degree",
    description: "Holds an associate degree or comparable qualification.",
  },
  {
    id: "domestic-worker",
    label: "Domestic Worker",
    description: "Household and domestic workers under the approved scheme.",
  },
  {
    id: "agricultural-worker",
    label: "Agricultural Worker",
    description: "Workers in approved agricultural occupations.",
  },
  {
    id: "private-security",
    label: "Private Security Officer",
    description: "Trained private security and protective services personnel.",
  },
];

// Resources for the Resources page (used by buildPlan only)
const resources = [
  {
    id: 1,
    code: "TT",
    name: "Trinidad and Tobago",
    immigrationUrl: "https://www.immigration.gov.tt/",
    competentAuthorityUrl: "https://tradeind.gov.tt/",
    formsUrl: "https://www.ttbizlink.gov.tt/",
    notes:
      "Check the Ministry of Labour / Trade and Industry websites for Skills Certificate and CSME information.",
  },
  {
    id: 2,
    code: "BB",
    name: "Barbados",
    immigrationUrl: "https://immigration.gov.bb/",
    competentAuthorityUrl:
      "https://caricom.org/caricom-single-market-and-economy-csme/",
    formsUrl: "https://www.gov.bb/Online-Services",
    notes:
      "Barbados usually processes Skills Certificates through designated government offices. Confirm latest forms and fees.",
  },
  {
    id: 3,
    code: "JM",
    name: "Jamaica",
    immigrationUrl: "https://www.pica.gov.jm/",
    competentAuthorityUrl: "https://www.mlss.gov.jm/",
    formsUrl: "https://www.mlss.gov.jm/departments/work-permit/",
    notes:
      "For CSME Skills Certificates, check the Ministry of Labour & Social Security and relevant immigration pages.",
  },
];

// Helper to find country label
function getCountryLabel(code) {
  const c = countries.find((c) => c.code === code);
  return c ? c.name : code;
}

// Helper to find category label
function getCategoryLabel(id) {
  const cat = categories.find((c) => c.id === id);
  return cat ? cat.label : id;
}

// Build a very simple plan object. You can expand this for Finals.
function buildPlan({ fromCountry, toCountry, category }) {
  const fromLabel = getCountryLabel(fromCountry);
  const toLabel = getCountryLabel(toCountry);
  const categoryLabel = getCategoryLabel(category);

  const summary = `This plan outlines the typical steps for a ${categoryLabel} moving from ${fromLabel} to ${toLabel} under the CSME Free Movement of Skills.`;
  const notes =
    "Always verify requirements with the official immigration and competent authority websites for both your home and destination countries, as procedures and documents can change.";

  const checklist = [
    {
      id: "passport",
      label: "Valid passport",
      description:
        "Ensure your passport is valid for at least 6–12 months beyond your planned stay.",
    },
    {
      id: "qualifications",
      label: "Certified copies of qualifications",
      description: `Gather original and certified copies of your ${categoryLabel} qualifications (degree, diploma, trade certificate, etc.).`,
    },
    {
      id: "passport-photos",
      label: "Passport photos",
      description:
        "Prepare the number and size of passport photos required by the Skills Certificate application form.",
    },
    {
      id: "police-certificate",
      label: "Police certificate of character",
      description:
        "Request a recent police certificate or background check, as required by the destination country.",
    },
    {
      id: "application-form",
      label: "Completed Skills Certificate application form",
      description:
        "Download or collect the official CSME Skills Certificate form and complete all sections accurately.",
    },
    {
      id: "fees",
      label: "Application fees and receipts",
      description:
        "Confirm the fee amount, acceptable payment methods, and keep all receipts for your records.",
    },
  ];

  const timeline = {
    documents:
      "2–6 weeks to gather documents, depending on processing time for police records and transcripts.",
    skillsCertificate:
      "2–8 weeks for Skills Certificate application processing, depending on the competent authority.",
    verification:
      "1–4 weeks for verification checks in the destination country after arrival, if required.",
  };

  const resourceForTo = resources.find((r) => r.code === toCountry);
  const officialLinks = {
    immigration: resourceForTo ? resourceForTo.immigrationUrl : null,
    competentAuthority: resourceForTo
      ? resourceForTo.competentAuthorityUrl
      : null,
    forms: resourceForTo ? resourceForTo.formsUrl : null,
  };

  return {
    summary,
    notes,
    checklist,
    timeline,
    officialLinks,
  };
}

// ====== Routes ======

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "CSME Planner API is running" });
});

// Countries from DB
app.get("/api/countries", async (req, res) => {
  try {
    const countriesFromDb = await prisma.country.findMany({
      orderBy: { name: "asc" },
    });
    res.json(countriesFromDb);
  } catch (err) {
    console.error("Error fetching countries:", err);
    res.status(500).json({ error: "Failed to load countries." });
  }
});

// Categories (still from static array)
app.get("/api/categories", (req, res) => {
  res.json(categories);
});

// Plan generator + save to DB
app.post("/api/plan", async (req, res) => {
  try {
    const { fromCountry, toCountry, category, userId } = req.body || {};

    if (!fromCountry || !toCountry || !category) {
      return res.status(400).json({
        error:
          "Missing required fields. Please send fromCountry, toCountry and category.",
      });
    }

    const planData = buildPlan({ fromCountry, toCountry, category });

    let savedPlan;
    try {
      savedPlan = await prisma.plan.create({
        data: {
          userId: userId || null,
          fromCountry,
          toCountry,
          category,
          summary: planData.summary,
          notes: planData.notes,
          checklistJson: planData.checklist,
          timelineJson: planData.timeline,
        },
      });
    } catch (dbErr) {
      console.error("Error saving plan:", dbErr);
    }

    res.json({
      ...planData,
      id: savedPlan?.id,
    });
  } catch (err) {
    console.error("Error generating plan:", err);
    res.status(500).json({
      error: "An error occurred while generating the plan.",
    });
  }
});

// Resources from DB
app.get("/api/resources", async (req, res) => {
  try {
    const resourcesFromDb = await prisma.country.findMany({
      orderBy: { name: "asc" },
    });
    res.json(resourcesFromDb);
  } catch (err) {
    console.error("Error fetching resources:", err);
    res.status(500).json({ error: "Failed to load resources." });
  }
});

// Get all plans for a user (simple version)
app.get("/api/my-plans", async (req, res) => {
  const userId = Number(req.query.userId);
  if (!userId) {
    return res.status(400).json({ error: "Missing userId." });
  }

  try {
    const plans = await prisma.plan.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    res.json(plans);
  } catch (err) {
    console.error("Error fetching plans:", err);
    res.status(500).json({ error: "Failed to load plans." });
  }
});

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
      return res
        .status(400)
        .json({ error: "Email and password are required." });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

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


