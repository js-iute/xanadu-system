const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 6227;

app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

const ideasPath = path.join(__dirname, "ideas.json");

// Get all ideas
app.get("/ideas", (req, res) => {
  fs.readFile(ideasPath, "utf-8", (err, data) => {
    if (err) return res.status(500).json({ error: "Failed to read ideas" });
    try {
      const ideas = JSON.parse(data);
      res.json(ideas);
    } catch {
      res.status(500).json({ error: "Invalid JSON in ideas.json" });
    }
  });
});

// Create a new idea
app.post("/ideas", (req, res) => {
  const { title, content, links } = req.body;
  if (!title || !content) return res.status(400).json({ error: "Title and content required" });

  fs.readFile(ideasPath, "utf-8", (err, data) => {
    let ideas = [];
    if (!err) {
      try {
        ideas = JSON.parse(data);
      } catch {}
    }
    const id = ideas.length ? Math.max(...ideas.map(i => i.id)) + 1 : 1;
    const newIdea = { id, title, content, links: links || [] };
    ideas.push(newIdea);

    fs.writeFile(ideasPath, JSON.stringify(ideas, null, 2), err => {
      if (err) return res.status(500).json({ error: "Failed to save idea" });
      res.json({ message: "Idea created successfully", idea: newIdea });
    });
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));