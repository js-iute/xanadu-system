const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const ideas = {};

app.post("/api/link", (req, res) => {
  const { idea1, idea2 } = req.body;

  if (!idea1 || !idea2) {
    return res.status(400).json({ message: "Missing ideas" });
  }

  if (!ideas[idea1]) ideas[idea1] = { links: [] };
  if (!ideas[idea2]) ideas[idea2] = { links: [] };

  if (!ideas[idea1].links.includes(idea2)) {
    ideas[idea1].links.push(idea2);
  }
  if (!ideas[idea2].links.includes(idea1)) {
    ideas[idea2].links.push(idea1);
  }

  res.json({ message: "Link created", ideas });
});

app.get("/api/ideas", (req, res) => {
  res.json(ideas);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
