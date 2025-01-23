document.addEventListener("DOMContentLoaded", function() {
    // Smooth transition effect
    document.body.classList.remove("fade-out");

    document.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", function(event) {
            event.preventDefault();
            const href = this.getAttribute("href");
            document.body.classList.add("fade-out");
            setTimeout(() => {
                window.location.href = href;
            }, 400);
        });
    });

    // Add Back to Home link in compare.html
    if (window.location.pathname.includes("compare.html")) {
        const backToHome = document.createElement("a");
        backToHome.href = "index.html";
        backToHome.textContent = "Back to Home";
        backToHome.style.display = "block";
        backToHome.style.marginTop = "20px";
        backToHome.style.color = "#ff7300";
        document.body.appendChild(backToHome);
    }
});
    