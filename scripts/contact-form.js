(function () {
    const form = document.querySelector("[data-lead-form]");
    const messageContainer = document.querySelector("[data-form-message]");
    const submitButton = document.querySelector("[data-cta='lead-form']");

    if (!form || !messageContainer || !submitButton) return;

    const originalButtonText = submitButton.textContent;

    function showMessage(type, text) {
        messageContainer.textContent = text;
        messageContainer.className = `form-message form-message--${type}`;
        messageContainer.style.display = "block";

        // Auto-hide success message after 5 seconds
        if (type === "success") {
            setTimeout(() => {
                messageContainer.style.display = "none";
            }, 8000);
        }
    }

    function setLoading(isLoading) {
        if (isLoading) {
            submitButton.disabled = true;
            submitButton.textContent = "Skickar...";
            submitButton.classList.add("is-loading");
        } else {
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
            submitButton.classList.remove("is-loading");
        }
    }

    form.addEventListener("submit", async function (e) {
        e.preventDefault();
        setLoading(true);
        messageContainer.style.display = "none";

        const formData = new FormData(form);

        try {
            const response = await fetch(form.action, {
                method: "POST",
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                showMessage("success", "Tack! Vi har mottagit din förfrågan och återkommer inom kort.");
                form.reset();
            } else {
                const data = await response.json();
                if (data.message) {
                    showMessage("error", `Ett fel uppstod: ${data.message}`);
                } else {
                    showMessage("error", "Ett fel uppstod när meddelandet skulle skickas. Försök igen senare eller maila oss direkt.");
                }
            }
        } catch (error) {
            console.error("Form submission error:", error);
            showMessage("error", "Kunde inte skicka meddelandet. Kontrollera din anslutning eller maila oss direkt.");
        } finally {
            setLoading(false);
        }
    });
})();
