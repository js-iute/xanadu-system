const ideasContainer = document.getElementById("ideasContainer");

let ideas = [];

async function loadIdeas() {
  try {
    const res = await fetch("/api/ideas");
    const data = await res.json();
    ideas = Object.values(data);

    ideasContainer.innerHTML = "";

    if (ideas.length === 0) {
      ideasContainer.innerHTML = "<p>No ideas found. Try creating some!</p>";
      return;
    }

    ideas.forEach((idea) => {
      let contentHTML = idea.content;

      // Highlight linked ideas without including extra spaces
      idea.links.forEach((linkId) => {
        const linkedIdea = ideas.find(i => i.id === linkId);
        if (linkedIdea) {
          const regex = new RegExp(`\\b${linkedIdea.title}\\b`, "g");
          contentHTML = contentHTML.replace(
            regex,
            `<span class="highlight" data-id="${linkedIdea.id}">${linkedIdea.title}</span>`
          );
        }
      });

      const ideaDiv = document.createElement("div");
      ideaDiv.className = "idea";

      ideaDiv.innerHTML = `
        <h3>${idea.title}</h3>
        <p>${contentHTML}</p>
      `;

      ideasContainer.appendChild(ideaDiv);
    });

    // Add popup hover
    document.querySelectorAll(".highlight").forEach((span) => {
      span.addEventListener("mouseenter", async (e) => {
        const id = e.target.dataset.id;
        const linkedIdea = ideas.find(i => i.id == id);
        if (!linkedIdea) return;

        let popup = document.getElementById("popup");
        if (!popup) {
          popup = document.createElement("div");
          popup.id = "popup";
          document.body.appendChild(popup);
        }

        popup.innerHTML = `<strong>${linkedIdea.title}</strong><br>${linkedIdea.content}`;
        popup.style.display = "block";
        popup.style.left = e.pageX + 10 + "px";
        popup.style.top = e.pageY + 10 + "px";
      });

      span.addEventListener("mouseleave", () => {
        const popup = document.getElementById("popup");
        if (popup) popup.style.display = "none";
      });
    });

  } catch (err) {
    ideasContainer.innerHTML = "<p>Failed to load ideas</p>";
    console.error(err);
  }
}

loadIdeas();