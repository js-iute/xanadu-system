const express = require('express');
const router = express.Router();

// In-memory storage for ideas and links
let ideas = {};  // key: ideaName, value: { links: [linkedIdea1, linkedIdea2] }

// Create or link two ideas
router.post('/link', (req, res) => {
  const { idea1, idea2 } = req.body;

  if (!idea1 || !idea2) {
    return res.status(400).json({ error: 'Both ideas must be provided' });
  }

  // Add idea1 → idea2
  if (!ideas[idea1]) ideas[idea1] = { links: [] };
  if (!ideas[idea1].links.includes(idea2)) ideas[idea1].links.push(idea2);

  // Add idea2 → idea1 (bidirectional)
  if (!ideas[idea2]) ideas[idea2] = { links: [] };
  if (!ideas[idea2].links.includes(idea1)) ideas[idea2].links.push(idea1);

  res.json({ message: `Linked ${idea1} <--> ${idea2}`, ideas });
});

// View all ideas
router.get('/ideas', (req, res) => {
  res.json(ideas);
});

module.exports = router;
