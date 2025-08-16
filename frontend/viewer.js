async function loadIdeas() {
  try {
    const res = await fetch("http://localhost:6227/api/ideas");
    const ideas = await res.json();
    const contentDiv = document.getElementById("content");
    contentDiv.innerHTML = "";

    ideas.forEach(idea => {
      const p = document.createElement("p");
      p.innerHTML = idea.content;

      idea.links.forEach(linkId => {
        const linkedIdea = ideas.find(i => i.id === linkId);
        if (!linkedIdea) return;

        const regex = new RegExp(`(${linkedIdea.title})`, "gi");
        p.innerHTML = p.innerHTML.replace(regex, `
          <span class="highlight">$1
            <span class="popup">${linkedIdea.content}</span>
          </span>
        `);
      });

      contentDiv.appendChild(p);
    });
  } catch (err) {
    document.getElementById("content").textContent = "Failed to load ideas.";
    console.error(err);
  }
}

window.addEventListener("DOMContentLoaded", loadIdeas);