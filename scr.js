/**
 * scr.js
 *
 * This file contains the main JavaScript functionalities for the Muster Consultants website.
 * It handles:
 * 1. Mobile navigation toggle (hamburger menu).
 * 2. Global message display system.
 * 3. Highlighting the active link in the navigation bar.
 * 4. Form submissions for Callback, Contact, Need Help pages, and now Partnerships.
 * 5. Job search functionality for the Job Seeker page (client-side simulation).
 * 6. Admin Panel functionalities:
 * - Simple password-based login.
 * - CRUD operations (Create, Read, Update, Delete) for job listings, simulated using localStorage.
 * - Logout.
 *
 * NOTE: For a production environment, all form submissions and admin panel data
 * management (job listings) should be handled via a secure backend server and a
 * robust database (e.g., Firestore, as mentioned in guidelines, or a custom API).
 * The current implementation uses localStorage purely for front-end demonstration
 * purposes and is NOT secure or scalable for real-world data persistence.
 */

// --- Global Utility Functions ---

/**
 * Displays a global message box at the top of the screen.
 * @param {string} message - The message to display.
 * @param {string} type - 'success' or 'error' to determine background color.
 * @param {number} duration - How long the message should be visible in milliseconds.
 */
function showGlobalMessage(message, type = 'success', duration = 3000) {
    const messageBox = document.getElementById('globalMessageBox');
    if (!messageBox) return;

    messageBox.textContent = message;
    messageBox.className = 'global-message-box'; // Reset classes
    messageBox.classList.add('show');

    if (type === 'error') {
        messageBox.style.backgroundColor = '#DC3545'; // Bootstrap Danger Red
    } else {
        messageBox.style.backgroundColor = '#28A745'; // Bootstrap Success Green
    }

    // Force reflow to ensure transition plays
    void messageBox.offsetWidth;

    messageBox.style.opacity = '1';
    messageBox.style.display = 'block';

    setTimeout(() => {
        messageBox.style.opacity = '0';
        setTimeout(() => {
            messageBox.style.display = 'none';
        }, 500); // Wait for fade-out transition
    }, duration);
}

// --- Navbar Functionality ---

/**
 * Handles the mobile navigation toggle (hamburger menu).
 */
function setupMobileNavToggle() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links ul');
    const dropdownArrows = document.querySelectorAll('.dropdown .arrow-down');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active'); // For animating the hamburger icon
        });

        // Close nav when a link is clicked (for single page navigation)
        navLinks.querySelectorAll('a:not(.dropdown > a)').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    hamburger.classList.remove('active');
                }
            });
        });

        // Toggle dropdowns on click in mobile
        dropdownArrows.forEach(arrow => {
            arrow.parentElement.addEventListener('click', (e) => {
                // Prevent toggling if it's the dropdown-content itself
                if (!e.target.closest('.dropdown-content')) {
                    e.preventDefault(); // Prevent default link behavior
                    const dropdownContent = arrow.parentElement.nextElementSibling;
                    if (dropdownContent && dropdownContent.classList.contains('dropdown-content')) {
                        dropdownContent.classList.toggle('show-mobile'); // Use a different class for mobile display
                        arrow.classList.toggle('rotate'); // Rotate arrow for dropdown
                    }
                }
            });
        });
    }
}

/**
 * Highlights the active navigation link based on the current page URL.
 */
function highlightActiveNav() {
    const currentPath = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-links ul li a');

    navLinks.forEach(link => {
        // Handle dropdown links by checking if their parent is a dropdown
        if (link.closest('.dropdown-content')) {
            // For dropdown items, match their href exactly
            if (link.getAttribute('href') === currentPath) {
                link.classList.add('active');
                // Also add active to the parent dropdown link if a sub-link is active
                link.closest('.dropdown').querySelector('a').classList.add('active');
            }
        } else {
            // For top-level links, match the href or check if it's the home page
            if (link.getAttribute('href') === currentPath || (currentPath === '' && link.getAttribute('href') === 'home.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active'); // Ensure other links are not active
            }
        }
    });

    // Special handling for the "Request a Callback" button in nav-cta
    const navCtaBtn = document.querySelector('.nav-cta .btn');
    if (navCtaBtn && navCtaBtn.getAttribute('href') === currentPath) {
        navCtaBtn.classList.add('active');
    }
}


// --- Form Submission Handlers ---

/**
 * Handles generic form submission.
 * @param {HTMLFormElement} form - The form element.
 * @param {string} successMessage - Message to show on successful submission.
 * @param {string} errorMessage - Message to show on error.
 * @param {function} callback - Optional callback function to run on success.
 */
function handleFormSubmission(form, successMessage, errorMessage, callback = null) {
    if (!form) return;

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default form submission

        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';

        // Simulate API call delay
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));

            // In a real application, you would send data to a backend here.
            // Example: const response = await fetch('/api/submit', { method: 'POST', body: new FormData(form) });
            // const result = await response.json();

            // For now, simulate success
            showGlobalMessage(successMessage, 'success');
            form.reset(); // Clear form fields
            if (callback) callback(); // Run optional callback
        } catch (error) {
            console.error('Form submission error:', error);
            showGlobalMessage(errorMessage, 'error');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    });
}

// --- Admin Panel Specific Functionality ---

const ADMIN_PASSWORD = 'admin'; // VERY INSECURE: Hardcoded password for demonstration!
const LOCAL_STORAGE_JOBS_KEY = 'musterConsultantsJobs';

/**
 * Simulates fetching job listings from localStorage.
 * @returns {Array} An array of job listing objects.
 */
function getJobsFromLocalStorage() {
    try {
        const jobs = localStorage.getItem(LOCAL_STORAGE_JOBS_KEY);
        return jobs ? JSON.parse(jobs) : [];
    } catch (e) {
        console.error("Error parsing jobs from localStorage:", e);
        return [];
    }
}

/**
 * Simulates saving job listings to localStorage.
 * @param {Array} jobs - An array of job listing objects.
 */
function saveJobsToLocalStorage(jobs) {
    try {
        localStorage.setItem(LOCAL_STORAGE_JOBS_KEY, JSON.stringify(jobs));
    } catch (e) {
        console.error("Error saving jobs to localStorage:", e);
        showGlobalMessage("Failed to save data. Storage might be full.", "error");
    }
}

/**
 * Renders job listings in the admin panel.
 */
function renderAdminJobListings() {
    const jobListingsContainer = document.getElementById('adminJobListings');
    if (!jobListingsContainer) return;

    const jobs = getJobsFromLocalStorage();

    if (jobs.length === 0) {
        jobListingsContainer.innerHTML = '<p class="text-center py-4">No job listings found. Add a new job above!</p>';
        return;
    }

    jobListingsContainer.innerHTML = `
        <ul class="admin-list">
            ${jobs.map(job => `
                <li data-job-id="${job.id}">
                    <div>
                        <strong>${job.title}</strong><br>
                        <span>${job.company} - ${job.location}</span>
                    </div>
                    <div class="actions">
                        <button class="edit-btn" aria-label="Edit Job" title="Edit Job"><i class="fas fa-edit"></i></button>
                        <button class="delete-btn" aria-label="Delete Job" title="Delete Job"><i class="fas fa-trash-alt"></i></button>
                    </div>
                </li>
            `).join('')}
        </ul>
    `;

    // Add event listeners for edit and delete buttons
    jobListingsContainer.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const jobId = e.currentTarget.closest('li').dataset.jobId;
            editJob(jobId);
        });
    });

    jobListingsContainer.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const jobId = e.currentTarget.closest('li').dataset.jobId;
            // Instead of confirm(), use a custom modal for confirmation if needed.
            // For this example, we'll proceed directly.
            deleteJob(jobId);
        });
    });
}

/**
 * Handles the Add/Edit Job Form submission.
 */
function setupJobPostForm() {
    const jobPostForm = document.getElementById('jobPostForm');
    const jobIdInput = document.getElementById('jobId');
    const jobTitleInput = document.getElementById('jobTitle');
    const jobCompanyInput = document.getElementById('jobCompany');
    const jobLocationInput = document.getElementById('jobLocation');
    const jobDescriptionTextarea = document.getElementById('jobDescription');
    const jobPostedDateInput = document.getElementById('jobPostedDate');
    const jobFormSubmitBtn = document.getElementById('jobFormSubmitBtn');
    const jobFormClearBtn = document.getElementById('jobFormClearBtn');
    const jobFormMessage = document.getElementById('jobFormMessage');

    if (!jobPostForm) return;

    jobPostForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const jobs = getJobsFromLocalStorage();
        const isEditing = jobIdInput.value !== '';
        let message = '';

        const newJob = {
            id: isEditing ? jobIdInput.value : Date.now().toString(), // Simple unique ID
            title: jobTitleInput.value.trim(),
            company: jobCompanyInput.value.trim(),
            location: jobLocationInput.value.trim(),
            description: jobDescriptionTextarea.value.trim(),
            postedDate: jobPostedDateInput.value || new Date().toISOString().slice(0, 10) // Default to today if not set
        };

        if (isEditing) {
            const index = jobs.findIndex(job => job.id === newJob.id);
            if (index !== -1) {
                jobs[index] = newJob;
                message = 'Job listing updated successfully!';
            } else {
                message = 'Error: Job not found for update.';
                showGlobalMessage(message, 'error');
                return;
            }
        } else {
            jobs.push(newJob);
            message = 'Job listing added successfully!';
        }

        saveJobsToLocalStorage(jobs);
        showGlobalMessage(message, 'success');
        jobPostForm.reset(); // Clear form
        jobIdInput.value = ''; // Clear ID for next new job
        jobFormSubmitBtn.textContent = 'Post Job';
        jobFormClearBtn.style.display = 'none';
        renderAdminJobListings(); // Re-render the list
    });

    jobFormClearBtn.addEventListener('click', () => {
        jobPostForm.reset();
        jobIdInput.value = '';
        jobFormSubmitBtn.textContent = 'Post Job';
        jobFormClearBtn.style.display = 'none';
        showGlobalMessage('Form cleared.', 'success');
    });
}

/**
 * Populates the job form with data for editing.
 * @param {string} jobId - The ID of the job to edit.
 */
function editJob(jobId) {
    const jobs = getJobsFromLocalStorage();
    const jobToEdit = jobs.find(job => job.id === jobId);

    if (jobToEdit) {
        document.getElementById('jobId').value = jobToEdit.id;
        document.getElementById('jobTitle').value = jobToEdit.title;
        document.getElementById('jobCompany').value = jobToEdit.company;
        document.getElementById('jobLocation').value = jobToEdit.location;
        document.getElementById('jobDescription').value = jobToEdit.description;
        document.getElementById('jobPostedDate').value = jobToEdit.postedDate;

        document.getElementById('jobFormSubmitBtn').textContent = 'Update Job';
        document.getElementById('jobFormClearBtn').style.display = 'inline-block';
        showGlobalMessage(`Editing job: "${jobToEdit.title}"`, 'success', 2000);
    } else {
        showGlobalMessage('Job not found for editing.', 'error');
    }
}

/**
 * Deletes a job listing.
 * @param {string} jobId - The ID of the job to delete.
 */
function deleteJob(jobId) {
    let jobs = getJobsFromLocalStorage();
    const originalLength = jobs.length;
    jobs = jobs.filter(job => job.id !== jobId);

    if (jobs.length < originalLength) {
        saveJobsToLocalStorage(jobs);
        renderAdminJobListings();
        showGlobalMessage('Job listing deleted successfully!', 'success');
    } else {
        showGlobalMessage('Error: Job not found for deletion.', 'error');
    }
}

/**
 * Handles admin login.
 */
function setupAdminLogin() {
    const adminLoginForm = document.getElementById('adminLoginForm');
    const adminPasswordInput = document.getElementById('adminPassword');
    const loginMessage = document.getElementById('loginMessage');
    const adminLoginSection = document.getElementById('admin-login-section');
    const jobManagementSection = document.getElementById('job-management-section');
    const adminLogoutBtn = document.getElementById('adminLogoutBtn');

    // Check session on page load
    const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    if (isLoggedIn) {
        if (adminLoginSection && jobManagementSection) {
            adminLoginSection.style.display = 'none';
            jobManagementSection.style.display = 'block';
            renderAdminJobListings();
        }
    } else {
        if (adminLoginSection) adminLoginSection.style.display = 'block';
        if (jobManagementSection) jobManagementSection.style.display = 'none';
    }


    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (adminPasswordInput.value === ADMIN_PASSWORD) {
                localStorage.setItem('adminLoggedIn', 'true');
                if (adminLoginSection && jobManagementSection) {
                    adminLoginSection.style.display = 'none';
                    jobManagementSection.style.display = 'block';
                    renderAdminJobListings();
                    showGlobalMessage('Logged in successfully!', 'success');
                }
            } else {
                loginMessage.textContent = 'Invalid password. Please try again.';
                loginMessage.style.color = '#DC3545';
                loginMessage.style.display = 'block';
                showGlobalMessage('Login failed.', 'error');
            }
        });
    }

    if (adminLogoutBtn) {
        adminLogoutBtn.addEventListener('click', () => {
            localStorage.removeItem('adminLoggedIn');
            if (adminLoginSection && jobManagementSection) {
                adminLoginSection.style.display = 'block';
                jobManagementSection.style.display = 'none';
                adminPasswordInput.value = ''; // Clear password field
                if (loginMessage) {
                    loginMessage.style.display = 'none';
                }
                showGlobalMessage('Logged out successfully!', 'success');
            }
        });
    }
}

// --- Page Specific Initializations ---

/**
 * Initializes functionality specific to the home.html page.
 */
function initHomePage() {
    // No specific dynamic elements mentioned for home page yet, beyond global ones.
    // If you add sliders, carousels, or interactive elements, their initialization
    // would go here.
}

/**
 * Initializes functionality specific to the about.html page.
 */
function initAboutPage() {
    // No specific dynamic elements yet.
}

/**
 * Initializes functionality specific to the our_team.html page.
 */
function initOurTeamPage() {
    // No specific dynamic elements yet.
}

/**
 * Initializes functionality specific to the client_success_stories.html page.
 */
function initClientSuccessStoriesPage() {
    // No specific dynamic elements yet.
}

/**
 * Initializes functionality specific to the blog.html page.
 */
function initBlogPage() {
    // No specific dynamic elements yet.
}

/**
 * Initializes functionality specific to the partnerships.html page.
 */
function initPartnershipsPage() {
    const partnershipInquiryForm = document.getElementById('partnershipInquiryForm');
    handleFormSubmission(
        partnershipInquiryForm,
        'Your partnership inquiry has been sent! We will review it and get back to you shortly.',
        'There was an issue sending your inquiry. Please try again.'
    );
}

/**
 * Initializes functionality specific to the career_opportunities.html page.
 */
function initCareerOpportunitiesPage() {
    // No specific dynamic elements yet.
}

/**
 * Initializes functionality specific to the callback.html page.
 */
function initCallbackPage() {
    const callbackForm = document.getElementById('callbackForm');
    handleFormSubmission(
        callbackForm,
        'Your callback request has been sent! We will contact you soon.',
        'There was an issue sending your request. Please try again.'
    );
}

/**
 * Initializes functionality specific to the company-news.html page.
 */
function initCompanyNewsPage() {
    // You might load jobs/news dynamically here from a source if needed.
    // For now, content is static HTML.
}

/**
 * Initializes functionality specific to the contact.html page.
 */
function initContactPage() {
    const contactForm = document.getElementById('contactForm');
    handleFormSubmission(
        contactForm,
        'Your message has been sent successfully! We will get back to you shortly.',
        'There was an issue sending your message. Please try again.'
    );
}

/**
 * Initializes functionality specific to the need_help.html page.
 */
function initNeedHelpPage() {
    const helpForm = document.getElementById('helpForm');
    handleFormSubmission(
        helpForm,
        'Your query has been submitted! Our support team will review it and get back to you.',
        'There was an issue submitting your query. Please try again.'
    );
}

/**
 * Initializes functionality specific to the seeker.html page.
 */
function initJobSeekerPage() {
    const jobSearchForm = document.getElementById('jobSearchForm');

    if (jobSearchForm) {
        jobSearchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const keywords = document.getElementById('keywords').value.trim();
            const location = document.getElementById('location').value.trim();
            const industry = document.getElementById('industry').value;

            // In a real application, you would send these search parameters
            // to a backend API to fetch filtered job listings.
            console.log('Job Search Submitted:', { keywords, location, industry });
            showGlobalMessage('Searching for jobs (simulated)...', 'success', 2000);

            // You might redirect to a job results page or dynamically update results here.
            // For now, this is a client-side simulation.
        });
    }
}

/**
 * Initializes functionality specific to the admin.html page.
 */
function initAdminPage() {
    setupAdminLogin();
    setupJobPostForm();
    // renderAdminJobListings will be called by setupAdminLogin if already logged in
    // or after successful login.
}

/**
 * Initializes functionality specific to the services.html page.
 */
function initServicesPage() {
    // No specific dynamic elements yet.
    // If you add dynamic content loading or interactive elements, their initialization
    // would go here.
}


// --- Main Entry Point: DOMContentLoaded ---
document.addEventListener('DOMContentLoaded', () => {
    // Universal functionalities for all pages
    setupMobileNavToggle();
    highlightActiveNav();

    // Page-specific initializations
    const currentPage = window.location.pathname.split('/').pop();

    switch (currentPage) {
        case 'home.html':
        case '': // Handle root path if home.html is served as index.html
            initHomePage();
            break;
        case 'callback.html':
            initCallbackPage();
            break;
        case 'company-news.html':
            initCompanyNewsPage();
            break;
        case 'contact.html':
            initContactPage();
            break;
        case 'need_help.html':
            initNeedHelpPage();
            break;
        case 'seeker.html':
            initJobSeekerPage();
            break;
        case 'admin.html':
            initAdminPage();
            break;
        case 'services.html':
            initServicesPage();
            break;
        case 'about.html': // New page
            initAboutPage();
            break;
        case 'our_team.html': // New page
            initOurTeamPage();
            break;
        case 'client_success_stories.html': // New page
            initClientSuccessStoriesPage();
            break;
        case 'blog.html': // New page
            initBlogPage();
            break;
        case 'partnerships.html': // New page
            initPartnershipsPage();
            break;
        case 'career_opportunities.html': // New page
            initCareerOpportunitiesPage();
            break;
        default:
            console.warn('Unknown page or no specific JS initialization for this page.');
    }
});
