// Mobile Navigation
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// FAQ Accordion
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const faqItem = question.parentElement;
        const isActive = faqItem.classList.contains('active');
        
        // Close all FAQ items
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Open clicked item if it wasn't active
        if (!isActive) {
            faqItem.classList.add('active');
        }
    });
});

// Form handling with Resend integration
const signupForm = document.getElementById('signupForm');
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

// Signup form submission
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitButton = signupForm.querySelector('.submit-button');
    const buttonText = submitButton.querySelector('.button-text');
    const buttonLoading = submitButton.querySelector('.button-loading');
    
    // Show loading state
    buttonText.style.display = 'none';
    buttonLoading.style.display = 'inline-block';
    submitButton.disabled = true;
    
    try {
        const formData = new FormData(signupForm);
        const data = Object.fromEntries(formData);
        
        // Send email using Resend
        const response = await fetch('/api/send-signup-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                to: 'info@aroundtheclockrun.nl', // Your email address
                subject: `New Team Registration: ${data.teamName}`,
                html: generateSignupEmailHTML(data),
                teamData: data
            })
        });
        
        if (response.ok) {
            showMessage('Thank you for your registration! We\'ll be in touch soon with more details.', 'success');
            signupForm.reset();
        } else {
            throw new Error('Failed to send email');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('Sorry, there was an error submitting your registration. Please try again or contact us directly.', 'error');
    } finally {
        // Reset button state
        buttonText.style.display = 'inline-block';
        buttonLoading.style.display = 'none';
        submitButton.disabled = false;
    }
});

// Contact form submission
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitButton = contactForm.querySelector('.submit-button');
    const originalText = submitButton.textContent;
    
    // Show loading state
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    try {
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Send email using Resend
        const response = await fetch('/api/send-contact-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                to: 'info@aroundtheclockrun.nl', // Your email address
                subject: `Contact Form: ${data.subject}`,
                html: generateContactEmailHTML(data),
                contactData: data
            })
        });
        
        if (response.ok) {
            showMessage('Thank you for your message! We\'ll get back to you soon.', 'success');
            contactForm.reset();
        } else {
            throw new Error('Failed to send email');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('Sorry, there was an error sending your message. Please try again or contact us directly.', 'error');
    } finally {
        // Reset button state
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
});

// Helper function to show messages
function showMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    formMessage.style.display = 'block';
    
    // Scroll to message
    formMessage.scrollIntoView({ behavior: 'smooth' });
    
    // Hide message after 5 seconds
    setTimeout(() => {
        formMessage.style.display = 'none';
    }, 5000);
}

// Generate HTML for signup email
function generateSignupEmailHTML(data) {
    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2563eb;">New Team Registration - Around the Clock Run</h2>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <h3 style="color: #1e293b; margin-bottom: 15px;">Team Information</h3>
                <p><strong>Team Name:</strong> ${data.teamName}</p>
                <p><strong>Team Captain:</strong> ${data.teamCaptain}</p>
                <p><strong>Email:</strong> ${data.email}</p>
                <p><strong>Phone:</strong> ${data.phone}</p>
                <p><strong>Team Size:</strong> ${data.teamSize} runners</p>
                <p><strong>Accommodation:</strong> ${data.accommodation || 'Not specified'}</p>
            </div>
            
            ${data.teamMembers ? `
            <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <h3 style="color: #1e293b; margin-bottom: 15px;">Team Members</h3>
                <p style="white-space: pre-line;">${data.teamMembers}</p>
            </div>
            ` : ''}
            
            ${data.experience ? `
            <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <h3 style="color: #1e293b; margin-bottom: 15px;">Running Experience</h3>
                <p style="white-space: pre-line;">${data.experience}</p>
            </div>
            ` : ''}
            
            ${data.fundraising ? `
            <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <h3 style="color: #1e293b; margin-bottom: 15px;">Fundraising Plans</h3>
                <p style="white-space: pre-line;">${data.fundraising}</p>
            </div>
            ` : ''}
            
            ${data.additionalInfo ? `
            <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <h3 style="color: #1e293b; margin-bottom: 15px;">Additional Information</h3>
                <p style="white-space: pre-line;">${data.additionalInfo}</p>
            </div>
            ` : ''}
            
            <div style="background: #e0f2fe; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0; color: #0369a1;"><strong>Next Steps:</strong> Please review this registration and contact the team to confirm participation and provide further details about the event.</p>
            </div>
        </div>
    `;
}

// Generate HTML for contact email
function generateContactEmailHTML(data) {
    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2563eb;">New Contact Form Submission</h2>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <p><strong>Name:</strong> ${data.name}</p>
                <p><strong>Email:</strong> ${data.email}</p>
                <p><strong>Subject:</strong> ${data.subject}</p>
            </div>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <h3 style="color: #1e293b; margin-bottom: 15px;">Message</h3>
                <p style="white-space: pre-line;">${data.message}</p>
            </div>
        </div>
    `;
}

// Hero video - ensure it plays all the way through
document.addEventListener('DOMContentLoaded', () => {
    const heroVideo = document.querySelector('.hero-video');
    if (heroVideo) {
        heroVideo.addEventListener('loadedmetadata', () => {
            heroVideo.play().catch(error => {
                console.log('Video autoplay prevented:', error);
            });
        });
        
        // Ensure video plays through completely
        heroVideo.addEventListener('pause', (e) => {
            if (!heroVideo.ended) {
                heroVideo.play();
            }
        });
        
        // Prevent any interruptions
        heroVideo.addEventListener('ended', () => {
            // Video has finished playing completely
            console.log('Video finished playing');
        });
    }
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.detail-card, .rule-category, .faq-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Form validation
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = '#ef4444';
            isValid = false;
        } else {
            field.style.borderColor = '#e5e7eb';
        }
    });
    
    // Email validation
    const emailField = form.querySelector('input[type="email"]');
    if (emailField && emailField.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value)) {
            emailField.style.borderColor = '#ef4444';
            isValid = false;
        }
    }
    
    return isValid;
}

// Add validation to forms
signupForm.addEventListener('submit', (e) => {
    if (!validateForm(signupForm)) {
        e.preventDefault();
        showMessage('Please fill in all required fields correctly.', 'error');
    }
});

contactForm.addEventListener('submit', (e) => {
    if (!validateForm(contactForm)) {
        e.preventDefault();
        showMessage('Please fill in all required fields correctly.', 'error');
    }
});

// Remove error styling on input
document.querySelectorAll('input, textarea, select').forEach(field => {
    field.addEventListener('input', () => {
        field.style.borderColor = '#e5e7eb';
    });
});
