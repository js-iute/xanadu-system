const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontend')));

// Load existing data or create empty object
let ideas = {};
const dataFile = path.join(__dirname, 'data.json');

if (fs.existsSync(dataFile)) {
  try {
    const rawData = fs.readFileSync(dataFile);
    ideas = JSON.parse(rawData);
  } catch (err) {
    console.error('Error reading data.json:', err);
    ideas = {};
  }
} else {
  fs.writeFileSync(dataFile, JSON.stringify(ideas, null, 2));
}

// GET all ideas
app.get('/api/ideas', (req, res) => {
  res.json(ideas);
});

// POST new idea
app.post('/api/idea', (req, res) => {
  const { name, links } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Idea name is required' });
  }

  ideas[name] = {
    links: links || []
  };

  try {
    fs.writeFileSync(dataFile, JSON.stringify(ideas, null, 2));
    res.json({ status: 'saved', idea: ideas[name] });
  } catch (err) {
    console.error('Error writing to data.json:', err);
    res.status(500).json({ error: 'Failed to save idea' });
  }
});

// Fallback for unknown routes
app.use((req, res) => {
  res.status(404).send('Not found');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
