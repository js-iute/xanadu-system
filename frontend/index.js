const createBtn = document.getElementById("create-idea");
const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const statusText = document.getElementById("status");
const ideasList = document.getElementById("ideas-list");

// Fetch and display existing ideas
async function loadIdeas() {
    ideasList.innerHTML = "";
    try {
        const res = await fetch("/ideas");
        if (!res.ok) throw new Error("Failed to fetch ideas");
        const ideas = await res.json();
        ideas.forEach(idea => {
            const li = document.createElement("li");
            li.textContent = `${idea.id} - ${idea.title}`;
            ideasList.appendChild(li);
        });
    } catch (err) {
        console.error(err);
        statusText.textContent = "Failed to load ideas.";
    }
}

// Create a new idea
createBtn.addEventListener("click", async () => {
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    if (!title || !content) {
        statusText.textContent = "Title and content are required.";
        return;
    }

    try {
        const res = await fetch("/ideas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ title, content }),
        });

        if (!res.ok) throw new Error("Failed to create idea");
        const data = await res.json();

        statusText.textContent = `Idea created successfully! ID: ${data.id}`;
        titleInput.value = "";
        contentInput.value = "";
        loadIdeas();
    } catch (err) {
        console.error(err);
        statusText.textContent = "Failed to create idea.";
    }
});

// Initial load
loadIdeas();