// DESCRIPTION js sponsor page; event listeners


const steps = document.querySelectorAll(".step");
const indicators = document.querySelectorAll(".step-indicator");
const lines = document.querySelectorAll(".line");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");

let currentStep = 0;

showStep(currentStep); 

function showStep(stepIndex) {
    // hide all steps
    steps.forEach((step) => {
        step.classList.remove("active");
    });
    // show current step
    steps[stepIndex].classList.add("active");
    updateStepper();
    updateButtons();
}

function updateStepper() {
    if (indicators.length > 0) {
        indicators.forEach((indicator, index) => {
            indicator.classList.remove("active", "completed");
            if (index < currentStep) {
                indicator.classList.add("completed");
            } else if (index === currentStep) {
                indicator.classList.add("active");
            }
        });
    }

    if (lines.length > 0) {
        lines.forEach((line, index) => {
            if (index < currentStep) {
                line.classList.add("active");
            } else {
                line.classList.remove("active");
            }
        });
    }
}

function updateButtons() {
    if (!prevBtn || !nextBtn) return;

    // first step
    if (currentStep === 0) {
        prevBtn.style.display = "none";
    } else {
        prevBtn.style.display = "inline-block";
    }

    // last step
    if (currentStep === steps.length - 1) {
        nextBtn.textContent = "Submit Form";
    } else {
        nextBtn.textContent = "Continue";
    }
}
//next btn
if (nextBtn) {
    nextBtn.addEventListener("click", () => {
        // last step = submit change continue to submit
        if (currentStep === steps.length - 1) {
            document.getElementById("sponsorForm").submit();
            return;
        }

        if (!validateStep()) {
            return;
        }

        currentStep++;
        showStep(currentStep);
    });
}

// prev btn
if (prevBtn) {
    prevBtn.addEventListener("click", () => {
        if (currentStep > 0) {
            currentStep--;
            showStep(currentStep);
        }
    });
}

// validation
function validateStep() {
    const currentStepElement = steps[currentStep];
    if (!currentStepElement) return true;

    const requiredInputs = currentStepElement.querySelectorAll(
        "input[required], select[required]"
    );

    let valid = true;

    requiredInputs.forEach((input) => {
        input.classList.remove("input-error");
        if (!input.value.trim()) {
            valid = false;
            input.classList.add("input-error");
        }
    });

    const privacyCheckbox = currentStepElement.querySelector("#privacyPolicy, .privacy-checkbox, input[type='checkbox'][required]");
        
        if (privacyCheckbox) {

            privacyCheckbox.classList.remove("input-error");
            
            if (!privacyCheckbox.checked) {
                valid = false;
                privacyCheckbox.classList.add("input-error");
                alert("accept the Privacy Policy to continue.");
            }
        }

    return valid;
}

// sponsor type selection
const sponsorOptions = document.querySelectorAll(".sponsor-option");

sponsorOptions.forEach((option) => {
    option.addEventListener("click", () => {
        sponsorOptions.forEach((btn) => btn.classList.remove("selected"));
        option.classList.add("selected");

        const sponsorType = option.dataset.type;
        const hiddenInput = document.getElementById("sponsor-type-input");
        
        if (hiddenInput) {
            hiddenInput.value = sponsorType;
        }

        //show and hide selections
        const indSection = document.getElementById("fields-individual");
        const grpSection = document.getElementById("fields-group");
        const bizSection = document.getElementById("fields-business");

        if (indSection) indSection.style.display = "none";
        if (grpSection) grpSection.style.display = "none";
        if (bizSection) bizSection.style.display = "none";

        if (sponsorType === "individual" && indSection) indSection.style.display = "block";
        if (sponsorType === "group" && grpSection) grpSection.style.display = "block";
        if (sponsorType === "business" && bizSection) bizSection.style.display = "block";
    });
});

// month btns
function setMonth(button) {
    document.querySelectorAll('.month-btn').forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');
    
    const monthInput = document.getElementById('selected-month');
    if (monthInput) {
        monthInput.value = button.value;
    }
}

// prevent submitting when clicking enter in keyboard
const formElement = document.getElementById("sponsorForm");
if (formElement) {
    formElement.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
        }
    });
}
