const createBtn = document.getElementById("createIdeaBtn");
const status = document.getElementById("status");

createBtn.addEventListener("click", async () => {
  const id = document.getElementById("ideaId").value.trim();
  const title = document.getElementById("ideaTitle").value.trim();
  const content = document.getElementById("ideaContent").value.trim();
  const links = document.getElementById("ideaLinks").value
    .split(",")
    .map((l) => l.trim())
    .filter((l) => l !== "");

  if (!id || !title || !content) {
    status.textContent = "All fields required!";
    return;
  }

  const res = await fetch("/api/idea", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, title, content, links })
  });

  const data = await res.json();
  status.textContent = data.message;
});