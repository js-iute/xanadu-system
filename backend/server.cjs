const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 6227;

const ideasPath = path.join(__dirname, "ideas.json");

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

if (!fs.existsSync(ideasPath)) {
  fs.writeFileSync(ideasPath, JSON.stringify([]));
}

// Get all ideas
app.get("/api/ideas", (req, res) => {
  const ideas = JSON.parse(fs.readFileSync(ideasPath));
  res.json(ideas);
});

// Create a new idea
app.post("/api/ideas", (req, res) => {
  const { title, content, linkIds } = req.body; // linkIds optional
  if (!title || !content) return res.status(400).json({ message: "Missing data" });

  const ideas = JSON.parse(fs.readFileSync(ideasPath));
  const id = ideas.length ? Math.max(...ideas.map(i => i.id)) + 1 : 1;
  const newIdea = { id, title, content, links: linkIds || [] };

  // Update linked ideas
  if (linkIds && linkIds.length) {
    linkIds.forEach(linkId => {
      const linkedIdea = ideas.find(i => i.id === linkId);
      if (linkedIdea && !linkedIdea.links.includes(id)) {
        linkedIdea.links.push(id);
      }
    });
  }

  ideas.push(newIdea);
  fs.writeFileSync(ideasPath, JSON.stringify(ideas, null, 2));
  res.json(newIdea);
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));