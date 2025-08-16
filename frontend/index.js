async function loadLinkOptions() {
  const res = await fetch("http://localhost:6227/api/ideas");
  const ideas = await res.json();
  const select = document.getElementById("links");
  select.innerHTML = "";

  ideas.forEach(idea => {
    const option = document.createElement("option");
    option.value = idea.id;
    option.textContent = idea.title;
    select.appendChild(option);
  });
}

document.getElementById("ideaForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value.trim();
  const content = document.getElementById("content").value.trim();
  const select = document.getElementById("links");
  const linkIds = Array.from(select.selectedOptions).map(opt => parseInt(opt.value));

  const res = await fetch("http://localhost:6227/api/ideas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content, linkIds })
  });

  if (res.ok) {
    document.getElementById("status").textContent = "Created!";
    document.getElementById("title").value = "";
    document.getElementById("content").value = "";
    await loadLinkOptions();
  } else {
    document.getElementById("status").textContent = "Failed to create idea.";
  }
});

loadLinkOptions();