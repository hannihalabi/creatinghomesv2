(function () {
    const form = document.querySelector("[data-lead-form]");
    const messageContainer = document.querySelector("[data-form-message]");
    const submitButton = document.querySelector("[data-cta='lead-form']");
    const formTarget = document.querySelector("[data-form-target]");

    if (!form || !messageContainer || !submitButton || !formTarget) return;

    const originalButtonText = submitButton.textContent;
    let isSubmitting = false;

    function showMessage(type, text) {
        messageContainer.textContent = text;
        messageContainer.className = `form-message form-message--${type}`;
        messageContainer.style.display = "block";

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

    form.addEventListener("submit", function () {
        isSubmitting = true;
        setLoading(true);
        messageContainer.style.display = "none";
    });

    formTarget.addEventListener("load", function () {
        if (!isSubmitting) return;
        isSubmitting = false;
        setLoading(false);
        showMessage("success", "Tack! Vi har mottagit din förfrågan och återkommer inom kort.");
        form.reset();
    });
})();
