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
});
    