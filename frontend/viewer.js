const container = document.getElementById("ideas-container");
const popup = document.getElementById("popup");

// Fetch all ideas from the backend
async function loadIdeas() {
    try {
        const res = await fetch("/ideas");
        const ideas = await res.json();

        container.innerHTML = ""; // Clear container

        ideas.forEach(idea => {
            const ideaDiv = document.createElement("div");
            ideaDiv.className = "idea-block";

            // Highlight linked words in content
            let contentHTML = idea.content;
            if (idea.links && idea.links.length > 0) {
                idea.links.forEach(linkId => {
                    const linkedIdea = ideas.find(i => i.id === linkId);
                    if (linkedIdea) {
                        const regex = new RegExp(`\\b(${linkedIdea.title})\\b`, "g");
                        contentHTML = contentHTML.replace(regex, `<span class="highlight" data-id="${linkedIdea.id}">$1</span>`);
                    }
                });
            }

            ideaDiv.innerHTML = `<h2>${idea.title}</h2><p>${contentHTML}</p>`;
            container.appendChild(ideaDiv);
        });

        // Add hover popup functionality
        document.querySelectorAll(".highlight").forEach(span => {
            span.addEventListener("mouseenter", async (e) => {
                const id = parseInt(e.target.dataset.id);
                const linkedIdea = ideas.find(i => i.id === id);
                if (linkedIdea) {
                    popup.innerHTML = `<strong>${linkedIdea.title}</strong><br>${linkedIdea.content}`;
                    popup.style.display = "block";
                    popup.style.left = e.pageX + 10 + "px";
                    popup.style.top = e.pageY + 10 + "px";
                }
            });

            span.addEventListener("mouseleave", () => {
                popup.style.display = "none";
            });
        });

    } catch (err) {
        container.innerHTML = `Failed to load ideas: ${err.message}`;
        console.error(err);
    }
}

// Initial load
loadIdeas();