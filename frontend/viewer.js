document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(".xanadu-link");
  const popup = document.getElementById("popup");

  links.forEach(link => {
    link.addEventListener("mouseenter", async (e) => {
      const idea = link.dataset.idea;
      const res = await fetch(`http://localhost:3000/api/get/${idea}`);
      const data = await res.json();

      if (data.content) {
        popup.innerHTML = `<strong>${idea}</strong><br>${data.content}`;
        popup.style.display = "block";
        const rect = link.getBoundingClientRect();
        popup.style.top = `${rect.bottom + window.scrollY + 5}px`;
        popup.style.left = `${rect.left + window.scrollX}px`;
      }
    });

    link.addEventListener("mouseleave", () => {
      popup.style.display = "none";
    });
  });
});
