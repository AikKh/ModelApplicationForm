// --- Get All Form-Related Elements ---
const form = document.getElementById('model-form');
const submitButton = document.getElementById('submit-btn');
const buttonText = document.getElementById('submit-btn-text');
const successMessage = document.getElementById('feedback-success');
const errorMessage = document.getElementById('feedback-error');
const errorMessageText = document.getElementById('error-message-text');

// --- Smooth Scroll for CTA ---
document.getElementById('apply-btn').addEventListener('click', (e) => {
    e.preventDefault(); // Prevent default anchor jump
    const targetId = e.currentTarget.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
        targetElement.scrollIntoView({
            behavior: 'smooth'
        });
    }
});

// --- Form Submission Handling ---
form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent default form submission
    
    // 1. Show Loading State
    submitButton.disabled = true;
    buttonText.innerHTML = `
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Submitting...`;
    errorMessage.classList.add('hidden');
    successMessage.classList.add('hidden');

    // 2. Get Form Data
    // Note: Since we are not uploading a file, this automatically collects all text inputs.
    const formData = new FormData(form);

    // 3. Send Data to Formspree
    try {
        const response = await fetch('https://formspree.io/f/xgvdadkr', { // <-- PASTE YOUR URL HERE
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json' // Tells Formspree you want a JSON response
            }
        });

        if (response.ok) {
            // 4. Handle Success
            form.classList.add('hidden'); // Hide form
            successMessage.classList.remove('hidden'); // Show success message
            // Scroll to success message
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            // 5. Handle Formspree Server Error (Validation/General Failure)
            const errorData = await response.json();
            const errorText = errorData.errors ? errorData.errors.map(err => err.message).join(', ') : 'Form submission failed.';
            
            // Generic error message for submission failure
            errorMessageText.innerHTML = `❌ **Submission Failed.** Please ensure your fields are correctly filled and try again.`;
            
            throw new Error(errorText);
        }

    } catch (error) {
        // 6. Handle Network Error or the error thrown above
        console.error("Submission Error:", error);
        errorMessage.classList.remove('hidden'); // Show error message
        // Reset button
        submitButton.disabled = false;
        buttonText.innerHTML = 'Submit Application';
        // Scroll to error message
        errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
});