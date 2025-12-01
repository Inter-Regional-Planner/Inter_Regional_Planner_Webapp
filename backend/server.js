const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const countries = require('./data/countries.json');
const categories = require('./data/categories.json');
const rules = require('./data/rules.json');

app.get('/', (req, res) => {
  res.json({ message: 'CSME Move Planner API is running' });
});

app.get('/api/countries', (req, res) => {
  res.json(countries);
});

app.get('/api/categories', (req, res) => {
  res.json(categories);
});

/**
 * GET /api/rules?from=TT&to=BB&category=university_graduate
 */
app.get('/api/rules', (req, res) => {
  const { from, to, category } = req.query;

  if (!from || !to || !category) {
    return res.status(400).json({
      error: 'Missing query parameters: from, to, and category are required.'
    });
  }

  const rule = rules.find(
    r =>
      r.from === from.toUpperCase() &&
      r.to === to.toUpperCase() &&
      r.category === category
  );

  if (!rule) {
    // Generic fallback
    return res.json({
      eligible: true,
      summary:
        'General CSME guidance: You may be eligible to move for work under the Free Movement of Skills regime if you fall within an approved category and obtain a valid CARICOM Skills Certificate.',
      notes: [
        'Confirm whether your specific category is eligible in both your home and host Member States.',
        'You must apply for a Certificate of Recognition of CARICOM Skills Qualification (Skills Certificate).',
        'Free movement of skills does NOT automatically grant permanent residency or citizenship.',
        'You must comply with the immigration laws and entry requirements of the host country.'
      ],
      checklist: [
        'Valid CARICOM passport',
        'Evidence of qualification for your category (degree, diploma, certificate, etc.)',
        'Police Certificate of Character',
        'Passport-sized photographs',
        'Completed Skills Certificate application form'
      ],
      competentAuthorityHint:
        'Check the official government or CARICOM website to identify the current Competent Authority for your host country.'
    });
  }

  res.json(rule);
});

app.listen(PORT, () => {
  console.log(`Backend API listening on http://localhost:${PORT}`);
});
