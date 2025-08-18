const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 6227;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

const ideasPath = path.join(__dirname, "ideas.json");

// Load existing ideas
let ideas = [];
if (fs.existsSync(ideasPath)) {
  const data = fs.readFileSync(ideasPath, "utf8");
  try {
    ideas = JSON.parse(data);
  } catch {
    ideas = [];
  }
}

// Get all ideas
app.get("/api/ideas", (req, res) => {
  res.json(ideas);
});

// Create a new idea
app.post("/api/idea", (req, res) => {
  const { id, title, content, links } = req.body;
  if (!id || !title || !content) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (ideas.find((idea) => idea.id === id)) {
    return res.status(400).json({ message: "Idea with this ID already exists" });
  }

  const newIdea = { id, title, content, links: Array.isArray(links) ? links : [] };
  ideas.push(newIdea);
  fs.writeFileSync(ideasPath, JSON.stringify(ideas, null, 2));
  res.json({ message: "Idea created successfully", idea: newIdea });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));