/**
 * GAULA BYGG AS - Main JavaScript
 * Handles navigation, smooth scrolling, form validation, and FAQ accordion
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initMobileNavigation();
    initHeaderScroll();
    initSmoothScroll();
    initContactForm();
    initFAQ();
});

/**
 * Mobile Navigation Toggle
 */
function initMobileNavigation() {
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
    const body = document.body;

    if (!mobileToggle || !mobileNav) return;

    mobileToggle.addEventListener('click', function() {
        const isActive = this.classList.toggle('active');
        mobileNav.classList.toggle('active');
        if (mobileNavOverlay) {
            mobileNavOverlay.classList.toggle('active');
        }
        body.style.overflow = isActive ? 'hidden' : '';
        this.setAttribute('aria-expanded', isActive);
    });

    // Close mobile menu when clicking on a nav link
    const navLinks = mobileNav.querySelectorAll('.mobile-nav__link');
    navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            closeMobileNav();
        });
    });

    // Close mobile menu when clicking overlay
    if (mobileNavOverlay) {
        mobileNavOverlay.addEventListener('click', function() {
            closeMobileNav();
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (mobileNav.classList.contains('active') &&
            !mobileNav.contains(e.target) &&
            !mobileToggle.contains(e.target)) {
            closeMobileNav();
        }
    });

    // Close mobile menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
            closeMobileNav();
        }
    });

    function closeMobileNav() {
        mobileToggle.classList.remove('active');
        mobileNav.classList.remove('active');
        if (mobileNavOverlay) {
            mobileNavOverlay.classList.remove('active');
        }
        body.style.overflow = '';
        mobileToggle.setAttribute('aria-expanded', 'false');
    }
}

/**
 * Header Scroll Effect
 */
function initHeaderScroll() {
    const header = document.getElementById('header');
    if (!header) return;

    const scrollThreshold = 50;

    function handleScroll() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    // Throttle scroll events for performance
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Initial check
    handleScroll();
}

/**
 * Smooth Scrolling for Anchor Links
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(function(link) {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Skip if it's just "#" or empty
            if (href === '#' || href === '') return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();

            const headerHeight = document.getElementById('header')?.offsetHeight || 80;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // Update URL without triggering scroll
            history.pushState(null, null, href);
        });
    });
}

/**
 * Contact Form Validation and Submission
 */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const successMessage = document.getElementById('form-success');

    // Form fields
    const nameField = document.getElementById('name');
    const phoneField = document.getElementById('phone');
    const emailField = document.getElementById('email');
    const locationField = document.getElementById('location');
    const projectTypeField = document.getElementById('project-type');
    const messageField = document.getElementById('message');

    // Error messages
    const nameError = document.getElementById('name-error');
    const phoneError = document.getElementById('phone-error');
    const emailError = document.getElementById('email-error');
    const locationError = document.getElementById('location-error');
    const projectTypeError = document.getElementById('project-type-error');
    const messageError = document.getElementById('message-error');

    // Validation functions
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function isValidPhone(phone) {
        // Norwegian phone number validation (8 digits, optionally with country code)
        const phoneRegex = /^(\+47)?[2-9]\d{7}$/;
        const cleanPhone = phone.replace(/[\s-]/g, '');
        return phoneRegex.test(cleanPhone) || cleanPhone.length >= 8;
    }

    function showError(field, errorElement) {
        if (field && errorElement) {
            field.classList.add('error');
            errorElement.classList.add('visible');
        }
    }

    function hideError(field, errorElement) {
        if (field && errorElement) {
            field.classList.remove('error');
            errorElement.classList.remove('visible');
        }
    }

    function validateField(field, errorElement, validationFn) {
        if (!field) return true;

        const value = field.value.trim();

        if (!value) {
            showError(field, errorElement);
            return false;
        }

        if (validationFn && !validationFn(value)) {
            showError(field, errorElement);
            return false;
        }

        hideError(field, errorElement);
        return true;
    }

    // Real-time validation
    if (nameField && nameError) {
        nameField.addEventListener('blur', function() {
            validateField(this, nameError);
        });
        nameField.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this, nameError);
            }
        });
    }

    if (phoneField && phoneError) {
        phoneField.addEventListener('blur', function() {
            validateField(this, phoneError, isValidPhone);
        });
        phoneField.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this, phoneError, isValidPhone);
            }
        });
    }

    if (emailField && emailError) {
        emailField.addEventListener('blur', function() {
            validateField(this, emailError, isValidEmail);
        });
        emailField.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this, emailError, isValidEmail);
            }
        });
    }

    if (locationField && locationError) {
        locationField.addEventListener('change', function() {
            validateField(this, locationError);
        });
    }

    if (projectTypeField && projectTypeError) {
        projectTypeField.addEventListener('change', function() {
            validateField(this, projectTypeError);
        });
    }

    if (messageField && messageError) {
        messageField.addEventListener('blur', function() {
            validateField(this, messageError);
        });
        messageField.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this, messageError);
            }
        });
    }

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Validate all fields
        let isValid = true;

        if (nameField && nameError) {
            if (!validateField(nameField, nameError)) {
                isValid = false;
            }
        }

        if (phoneField && phoneError) {
            if (!validateField(phoneField, phoneError, isValidPhone)) {
                isValid = false;
            }
        }

        if (emailField && emailError) {
            if (!validateField(emailField, emailError, isValidEmail)) {
                isValid = false;
            }
        }

        if (locationField && locationError) {
            if (!validateField(locationField, locationError)) {
                isValid = false;
            }
        }

        if (projectTypeField && projectTypeError) {
            if (!validateField(projectTypeField, projectTypeError)) {
                isValid = false;
            }
        }

        if (messageField && messageError) {
            if (!validateField(messageField, messageError)) {
                isValid = false;
            }
        }

        if (!isValid) {
            // Focus on the first error field
            const firstError = form.querySelector('.form-input.error, .form-select.error, .form-textarea.error');
            if (firstError) {
                firstError.focus();
            }
            return;
        }

        // Collect form data
        const formData = {
            name: nameField?.value.trim(),
            phone: phoneField?.value.trim(),
            email: emailField?.value.trim(),
            location: locationField?.value,
            projectType: projectTypeField?.value,
            message: messageField?.value.trim()
        };

        // Here you would normally send the data to a server
        console.log('Form submitted:', formData);

        // Hide form and show success message
        form.style.display = 'none';
        if (successMessage) {
            successMessage.classList.remove('hidden');
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        // Reset form (for when it's shown again)
        form.reset();

        // Show form again after 10 seconds
        setTimeout(function() {
            form.style.display = 'block';
            if (successMessage) {
                successMessage.classList.add('hidden');
            }
        }, 10000);
    });
}

/**
 * FAQ Accordion
 */
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    if (!faqItems.length) return;

    faqItems.forEach(function(item) {
        const question = item.querySelector('.faq-question');

        if (!question) return;

        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');

            // Close all other items
            faqItems.forEach(function(otherItem) {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    const otherQuestion = otherItem.querySelector('.faq-question');
                    if (otherQuestion) {
                        otherQuestion.setAttribute('aria-expanded', 'false');
                    }
                }
            });

            // Toggle current item
            item.classList.toggle('active');
            this.setAttribute('aria-expanded', !isActive);
        });

        // Keyboard accessibility
        question.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

/**
 * Utility: Debounce function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = function() {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Utility: Throttle function
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(function() {
                inThrottle = false;
            }, limit);
        }
    };
}

/**
 * Click-to-call tracking (for analytics)
 */
document.addEventListener('click', function(e) {
    const link = e.target.closest('a[href^="tel:"]');
    if (link) {
        // You can add analytics tracking here
        console.log('Phone click:', link.getAttribute('href'));
    }
});

/**
 * Email link tracking (for analytics)
 */
document.addEventListener('click', function(e) {
    const link = e.target.closest('a[href^="mailto:"]');
    if (link) {
        // You can add analytics tracking here
        console.log('Email click:', link.getAttribute('href'));
    }
});

/**
 * Scroll Animations (optional enhancement)
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in-on-scroll');

    if (!animatedElements.length) return;

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(function(el) {
        observer.observe(el);
    });
}

/**
 * Service Worker Registration (optional for PWA)
 */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Uncomment to enable service worker
        // navigator.serviceWorker.register('/sw.js');
    });
}
