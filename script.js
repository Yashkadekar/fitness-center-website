// DOM Elements
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const themeSwitch = document.getElementById('theme-switch');
const navLinks = document.querySelectorAll('.nav-link');
const parallaxElements = document.querySelectorAll('.parallax-bg');

// Theme Management
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.setTheme(this.currentTheme);
        this.bindEvents();
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        themeSwitch.checked = theme === 'dark';
        localStorage.setItem('theme', theme);
        this.currentTheme = theme;
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    bindEvents() {
        themeSwitch.addEventListener('change', () => {
            this.toggleTheme();
        });
    }
}

// Navigation Management
class NavigationManager {
    constructor() {
        this.isMenuOpen = false;
        this.init();
    }

    init() {
        this.bindEvents();
        this.handleScroll();
    }

    bindEvents() {
        // Hamburger menu toggle
        hamburger.addEventListener('click', () => {
            this.toggleMenu();
        });

        // Close menu when clicking on nav links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMenu();
                this.setActiveLink(link);
            });
        });

        // Handle scroll events
        window.addEventListener('scroll', () => {
            this.handleScroll();
            this.updateActiveLink();
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navbar.contains(e.target) && this.isMenuOpen) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
    }

    closeMenu() {
        this.isMenuOpen = false;
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }

    handleScroll() {
        const scrolled = window.scrollY > 50;
        navbar.classList.toggle('scrolled', scrolled);
    }

    setActiveLink(activeLink) {
        navLinks.forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
    }

    updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (correspondingLink) {
                    correspondingLink.classList.add('active');
                }
            }
        });
    }
}

// Parallax Effect Manager
class ParallaxManager {
    constructor() {
        this.elements = Array.from(parallaxElements);
        this.init();
    }

    init() {
        if (this.elements.length === 0) return;
        
        // Check if user prefers reduced motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        this.bindEvents();
        this.updateParallax();
    }

    bindEvents() {
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateParallax();
                    ticking = false;
                });
                ticking = true;
            }
        });

        // Handle resize
        window.addEventListener('resize', () => {
            this.updateParallax();
        });
    }

    updateParallax() {
        const scrollTop = window.pageYOffset;

        this.elements.forEach(element => {
            const container = element.closest('.parallax-container');
            if (!container) return;

            const containerTop = container.offsetTop;
            const containerHeight = container.offsetHeight;
            const speed = parseFloat(element.dataset.speed) || 0.5;

            // Check if element is in viewport
            if (scrollTop + window.innerHeight > containerTop && 
                scrollTop < containerTop + containerHeight) {
                
                const yPos = -(scrollTop - containerTop) * speed;
                element.style.transform = `translate3d(0, ${yPos}px, 0)`;
            }
        });
    }
}

// Smooth Scrolling Manager
class SmoothScrollManager {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // Handle anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    this.scrollToElement(targetElement);
                }
            });
        });
    }

    scrollToElement(element) {
        const offsetTop = element.offsetTop - 70; // Account for fixed navbar
        
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Animation Observer
class AnimationObserver {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        this.init();
    }

    init() {
        if (!('IntersectionObserver' in window)) return;

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, this.observerOptions);

        // Observe elements that should animate
        this.observeElements();
    }

    observeElements() {
        const elementsToObserve = document.querySelectorAll(`
            .service-card,
            .testimonial-card,
            .membership-card,
            .contact-item,
            .section-header
        `);

        elementsToObserve.forEach(element => {
            this.observer.observe(element);
        });
    }
}

// Form Handler
class FormHandler {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // Newsletter form
        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleNewsletterSubmit(e.target);
            });
        }

        // Membership buttons
        document.querySelectorAll('.membership-card .btn').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleMembershipSelection(e.target);
            });
        });

        // CTA buttons
        document.querySelectorAll('.hero-buttons .btn').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleCTAClick(e.target);
            });
        });
    }

    handleNewsletterSubmit(form) {
        const email = form.querySelector('input[type="email"]').value;
        const button = form.querySelector('button');
        const originalText = button.textContent;

        // Simulate form submission
        button.textContent = 'Subscribing...';
        button.disabled = true;

        setTimeout(() => {
            button.textContent = 'Subscribed!';
            button.style.background = '#28a745';
            
            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
                button.style.background = '';
                form.reset();
            }, 2000);
        }, 1000);

        // Here you would typically send the data to your server
        console.log('Newsletter subscription:', email);
    }

    handleMembershipSelection(button) {
        const card = button.closest('.membership-card');
        const planName = card.querySelector('h3').textContent;
        
        // Simulate membership selection
        const originalText = button.textContent;
        button.textContent = 'Processing...';
        button.disabled = true;

        setTimeout(() => {
            button.textContent = 'Selected!';
            button.style.background = '#28a745';
            
            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
                button.style.background = '';
            }, 2000);
        }, 1000);

        console.log('Membership selected:', planName);
    }

    handleCTAClick(button) {
        const buttonText = button.textContent;
        
        if (buttonText.includes('Journey')) {
            // Scroll to membership section
            const membershipSection = document.getElementById('membership');
            if (membershipSection) {
                membershipSection.scrollIntoView({ behavior: 'smooth' });
            }
        } else if (buttonText.includes('Story')) {
            // Scroll to testimonials section
            const testimonialsSection = document.getElementById('testimonials');
            if (testimonialsSection) {
                testimonialsSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }
}

// Performance Monitor
class PerformanceMonitor {
    constructor() {
        this.init();
    }

    init() {
        // Monitor scroll performance
        this.monitorScrollPerformance();
        
        // Monitor image loading
        this.monitorImageLoading();
    }

    monitorScrollPerformance() {
        let scrollTimeout;
        let isScrolling = false;

        window.addEventListener('scroll', () => {
            if (!isScrolling) {
                document.body.classList.add('scrolling');
                isScrolling = true;
            }

            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                document.body.classList.remove('scrolling');
                isScrolling = false;
            }, 150);
        });
    }

    monitorImageLoading() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => {
                imageObserver.observe(img);
            });
        }
    }
}

// Accessibility Manager
class AccessibilityManager {
    constructor() {
        this.init();
    }

    init() {
        this.handleKeyboardNavigation();
        this.handleFocusManagement();
        this.handleReducedMotion();
    }

    handleKeyboardNavigation() {
        // Handle escape key for mobile menu
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const navManager = window.navigationManager;
                if (navManager && navManager.isMenuOpen) {
                    navManager.closeMenu();
                }
            }
        });

        // Handle tab navigation for theme toggle
        themeSwitch.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                themeSwitch.click();
            }
        });
    }

    handleFocusManagement() {
        // Ensure focus is visible
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    handleReducedMotion() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (prefersReducedMotion.matches) {
            document.body.classList.add('reduced-motion');
        }

        prefersReducedMotion.addEventListener('change', (e) => {
            if (e.matches) {
                document.body.classList.add('reduced-motion');
            } else {
                document.body.classList.remove('reduced-motion');
            }
        });
    }
}

// Initialize all managers when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize core managers
    window.themeManager = new ThemeManager();
    window.navigationManager = new NavigationManager();
    window.parallaxManager = new ParallaxManager();
    window.smoothScrollManager = new SmoothScrollManager();
    window.animationObserver = new AnimationObserver();
    window.formHandler = new FormHandler();
    window.performanceMonitor = new PerformanceMonitor();
    window.accessibilityManager = new AccessibilityManager();
    
    // Initialize feature managers
    window.bmiCalculator = new BMICalculator();
    window.trainerBooking = new TrainerBooking();
    window.scheduleManager = new ScheduleManager();
    window.galleryManager = new GalleryManager();
    window.progressTracker = new ProgressTracker();
    window.chatWidget = new ChatWidget();
    
    // Initialize new advanced features
    window.workoutGenerator = new WorkoutGenerator();
    window.nutritionCalculator = new NutritionCalculator();
    window.virtualTour = new VirtualTour();
    window.weatherWidget = new WeatherWidget();
    window.gymStats = new GymStats();
    window.workoutTimer = new WorkoutTimer();

    // Add loaded class to body for CSS animations
    document.body.classList.add('loaded');
    
    // Add some demo interactions
    setTimeout(() => {
        if (window.chatWidget && window.chatWidget.notification) {
            window.chatWidget.notification.style.display = 'flex';
        }
    }, 3000);

    // Add CSS animations for achievement notifications
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes fadeOut {
            from {
                opacity: 1;
            }
            to {
                opacity: 0;
                transform: translateX(100%);
            }
        }
        
        .achievement-notification {
            animation: slideInRight 0.5s ease, fadeOut 0.5s ease 4s forwards;
        }
        
        .achievement-notification .notification-content {
            text-align: center;
        }
        
        .achievement-notification i {
            font-size: 2rem;
            margin-bottom: 0.5rem;
            display: block;
        }
        
        .achievement-notification h4 {
            margin: 0 0 0.5rem 0;
            color: white;
        }
        
        .achievement-notification p {
            margin: 0;
            color: rgba(255, 255, 255, 0.9);
        }
    `;
    document.head.appendChild(style);
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when page is not visible
        document.body.classList.add('page-hidden');
    } else {
        // Resume animations when page becomes visible
        document.body.classList.remove('page-hidden');
    }
});

// Handle window resize
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Recalculate parallax positions
        if (window.parallaxManager) {
            window.parallaxManager.updateParallax();
        }
        
        // Close mobile menu on resize to desktop
        if (window.innerWidth > 768 && window.navigationManager) {
            window.navigationManager.closeMenu();
        }
    }, 250);
});

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// BMI Calculator Manager
class BMICalculator {
    constructor() {
        this.form = document.getElementById('bmi-form');
        this.result = document.getElementById('bmi-result');
        this.init();
    }

    init() {
        if (!this.form) {
            console.error('BMI Calculator: Form element not found');
            return;
        }
        if (!this.result) {
            console.error('BMI Calculator: Result element not found');
            return;
        }
        this.bindEvents();
    }

    bindEvents() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.calculateBMI();
        });
        
        // Ensure radio buttons work properly
        this.setupRadioButtons();
    }

    setupRadioButtons() {
        const radioButtons = document.querySelectorAll('input[name="gender"]');
        const radioLabels = document.querySelectorAll('.radio-label');
        
        // Make labels clickable
        radioLabels.forEach((label) => {
            label.addEventListener('click', (e) => {
                const radio = label.querySelector('input[type="radio"]');
                if (radio && !radio.checked) {
                    radioButtons.forEach(r => r.checked = false);
                    radio.checked = true;
                }
            });
        });
    }

    calculateBMI() {
        const heightInput = document.getElementById('height');
        const weightInput = document.getElementById('weight');
        const ageInput = document.getElementById('age');
        const genderInput = document.querySelector('input[name="gender"]:checked');
        const heightUnitSelect = document.getElementById('height-unit');
        const weightUnitSelect = document.getElementById('weight-unit');

        // Validate inputs exist
        if (!heightInput || !weightInput || !ageInput || !genderInput || !heightUnitSelect || !weightUnitSelect) {
            console.error('BMI Calculator: Missing form elements');
            return;
        }

        const height = parseFloat(heightInput.value);
        const weight = parseFloat(weightInput.value);
        const age = parseInt(ageInput.value);
        const gender = genderInput.value;
        const heightUnit = heightUnitSelect.value;
        const weightUnit = weightUnitSelect.value;

        // Validate input values
        if (!height || !weight || !age || height <= 0 || weight <= 0 || age <= 0) {
            this.showError('Please enter valid positive numbers for all fields');
            return;
        }

        // Validate reasonable ranges
        if (heightUnit === 'cm' && (height < 50 || height > 300)) {
            this.showError('Please enter a height between 50-300 cm');
            return;
        }
        if (heightUnit === 'ft' && (height < 2 || height > 10)) {
            this.showError('Please enter a height between 2-10 feet');
            return;
        }
        if (weightUnit === 'kg' && (weight < 20 || weight > 500)) {
            this.showError('Please enter a weight between 20-500 kg');
            return;
        }
        if (weightUnit === 'lbs' && (weight < 40 || weight > 1100)) {
            this.showError('Please enter a weight between 40-1100 lbs');
            return;
        }

        // Convert to metric if needed
        let heightInM = height;
        let weightInKg = weight;

        if (heightUnit === 'ft') {
            heightInM = height * 0.3048; // feet to meters
        } else {
            heightInM = height / 100; // cm to meters
        }

        if (weightUnit === 'lbs') {
            weightInKg = weight * 0.453592; // lbs to kg
        }

        // Calculate BMI
        const bmi = weightInKg / (heightInM * heightInM);
        
        // Validate BMI result
        if (isNaN(bmi) || !isFinite(bmi)) {
            this.showError('Unable to calculate BMI. Please check your inputs.');
            return;
        }

        this.displayResult(bmi, age, gender);
    }

    showError(message) {
        const bmiValue = document.getElementById('bmi-value');
        const bmiCategory = document.getElementById('bmi-category');
        const bmiRecommendation = document.getElementById('bmi-recommendation');

        if (bmiValue) bmiValue.textContent = 'Error';
        if (bmiCategory) bmiCategory.textContent = message;
        if (bmiRecommendation) {
            bmiRecommendation.innerHTML = `
                <h4>Please Try Again</h4>
                <p>Check your input values and try calculating again.</p>
            `;
        }

        // Show error styling
        const chartBars = document.querySelectorAll('.chart-bar');
        chartBars.forEach(bar => bar.classList.remove('active'));
    }

    displayResult(bmi, age, gender) {
        const bmiValue = document.getElementById('bmi-value');
        const bmiCategory = document.getElementById('bmi-category');
        const bmiRecommendation = document.getElementById('bmi-recommendation');
        const chartBars = document.querySelectorAll('.chart-bar');

        if (!bmiValue || !bmiCategory || !bmiRecommendation) {
            console.error('BMI Calculator: Missing result elements');
            return;
        }

        // Update BMI value
        bmiValue.textContent = bmi.toFixed(1);

        // Determine category
        let category, categoryClass, recommendation;
        
        if (bmi < 18.5) {
            category = 'Underweight';
            categoryClass = 'underweight';
            recommendation = 'Consider a weight gain program with strength training and increased caloric intake. Consult with our nutrition experts.';
        } else if (bmi >= 18.5 && bmi < 25) {
            category = 'Normal Weight';
            categoryClass = 'normal';
            recommendation = 'Great job! Maintain your current weight with regular exercise and a balanced diet. Our maintenance programs can help.';
        } else if (bmi >= 25 && bmi < 30) {
            category = 'Overweight';
            categoryClass = 'overweight';
            recommendation = 'Consider a weight loss program combining cardio and strength training. Our HIIT classes are perfect for you!';
        } else {
            category = 'Obese';
            categoryClass = 'obese';
            recommendation = 'We recommend starting with low-impact exercises and working with a personal trainer. Our beginner programs are ideal.';
        }

        bmiCategory.textContent = category;

        // Highlight appropriate chart bar
        chartBars.forEach(bar => bar.classList.remove('active'));
        const targetBar = document.querySelector(`.chart-bar.${categoryClass}`);
        if (targetBar) {
            targetBar.classList.add('active');
        }

        // Update recommendation
        bmiRecommendation.innerHTML = `
            <h4>Recommendation for ${gender === 'male' ? 'Men' : 'Women'}, Age ${age}</h4>
            <p>${recommendation}</p>
            <button class="btn btn-primary" onclick="document.getElementById('membership').scrollIntoView({behavior: 'smooth'})">
                View Our Programs
            </button>
        `;

        // Animate the result
        this.result.style.opacity = '0';
        setTimeout(() => {
            this.result.style.opacity = '1';
        }, 100);

        // Log success for debugging
        console.log(`BMI calculated successfully: ${bmi.toFixed(1)} (${category})`);
    }
}

// Trainer Booking Manager
class TrainerBooking {
    constructor() {
        this.modal = document.getElementById('booking-modal');
        this.init();
    }

    init() {
        if (!this.modal) return;
        this.bindEvents();
    }

    bindEvents() {
        // Trainer booking buttons
        document.querySelectorAll('.trainer-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const trainerName = e.target.dataset.trainer;
                this.openBookingModal(trainerName);
            });
        });

        // Class booking buttons
        document.querySelectorAll('.class-item .btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const classItem = e.target.closest('.class-item');
                const className = classItem.querySelector('h4').textContent;
                const classTime = classItem.querySelector('.class-time').textContent;
                this.openBookingModal(null, className, classTime);
            });
        });

        // Modal close events
        document.getElementById('booking-close').addEventListener('click', () => {
            this.closeBookingModal();
        });

        this.modal.querySelector('.modal-overlay').addEventListener('click', () => {
            this.closeBookingModal();
        });

        // Form submission
        document.getElementById('booking-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleBookingSubmission();
        });
    }

    openBookingModal(trainerName = null, className = null, classTime = null) {
        const serviceSelect = document.getElementById('booking-service');
        
        if (trainerName) {
            serviceSelect.value = 'personal-training';
            // You could also pre-fill trainer preference
        } else if (className) {
            serviceSelect.value = 'group-class';
            // Pre-fill class details in message
            const messageField = document.getElementById('booking-message');
            messageField.value = `I'd like to book the ${className} class at ${classTime}.`;
        }

        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeBookingModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
        document.getElementById('booking-form').reset();
    }

    handleBookingSubmission() {
        const formData = new FormData(document.getElementById('booking-form'));
        const bookingData = Object.fromEntries(formData);

        // Simulate booking submission
        const submitBtn = document.querySelector('#booking-form .btn');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Booking...';
        submitBtn.disabled = true;

        setTimeout(() => {
            submitBtn.textContent = 'Booked Successfully!';
            submitBtn.style.background = '#28a745';
            
            setTimeout(() => {
                this.closeBookingModal();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.style.background = '';
                
                // Show success message
                this.showSuccessMessage('Booking confirmed! We\'ll contact you soon.');
            }, 2000);
        }, 1500);

        console.log('Booking submitted:', bookingData);
    }

    showSuccessMessage(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `
            <div class="success-content">
                <i class="fas fa-check-circle"></i>
                <p>${message}</p>
            </div>
        `;
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            z-index: 3000;
            animation: slideInRight 0.3s ease;
        `;

        document.body.appendChild(successDiv);

        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    }
}

// Schedule Manager
class ScheduleManager {
    constructor() {
        this.tabs = document.querySelectorAll('.tab-btn');
        this.schedules = document.querySelectorAll('.day-schedule');
        this.init();
    }

    init() {
        if (this.tabs.length === 0) return;
        this.bindEvents();
        this.populateScheduleData();
    }

    bindEvents() {
        this.tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const day = e.target.dataset.day;
                this.switchDay(day);
            });
        });
    }

    switchDay(day) {
        // Update active tab
        this.tabs.forEach(tab => tab.classList.remove('active'));
        document.querySelector(`[data-day="${day}"]`).classList.add('active');

        // Update active schedule
        this.schedules.forEach(schedule => schedule.classList.remove('active'));
        const targetSchedule = document.getElementById(day);
        if (targetSchedule) {
            targetSchedule.classList.add('active');
        }
    }

    populateScheduleData() {
        const scheduleData = {
            wednesday: [
                { time: '6:30 AM', class: 'Morning Stretch', trainer: 'Sarah Martinez', location: 'Studio A', duration: '45 min', difficulty: 'beginner' },
                { time: '9:00 AM', class: 'Strength Circuit', trainer: 'Alex Johnson', location: 'Weight Room', duration: '60 min', difficulty: 'intermediate' },
                { time: '6:00 PM', class: 'HIIT Express', trainer: 'Mike Thompson', location: 'Main Floor', duration: '30 min', difficulty: 'advanced' }
            ],
            thursday: [
                { time: '7:00 AM', class: 'Yoga Flow', trainer: 'Sarah Martinez', location: 'Studio B', duration: '60 min', difficulty: 'beginner' },
                { time: '12:30 PM', class: 'Lunch Pump', trainer: 'Alex Johnson', location: 'Weight Room', duration: '45 min', difficulty: 'intermediate' },
                { time: '7:30 PM', class: 'Cardio Blast', trainer: 'Mike Thompson', location: 'Cardio Zone', duration: '45 min', difficulty: 'advanced' }
            ],
            friday: [
                { time: '6:00 AM', class: 'Power Yoga', trainer: 'Sarah Martinez', location: 'Studio A', duration: '60 min', difficulty: 'intermediate' },
                { time: '8:30 AM', class: 'Functional Training', trainer: 'Alex Johnson', location: 'Functional Area', duration: '50 min', difficulty: 'intermediate' },
                { time: '6:30 PM', class: 'Friday Night Burn', trainer: 'Mike Thompson', location: 'Main Floor', duration: '60 min', difficulty: 'advanced' }
            ],
            saturday: [
                { time: '8:00 AM', class: 'Weekend Warrior', trainer: 'Alex Johnson', location: 'CrossFit Box', duration: '75 min', difficulty: 'advanced' },
                { time: '10:00 AM', class: 'Family Yoga', trainer: 'Sarah Martinez', location: 'Studio A', duration: '45 min', difficulty: 'beginner' },
                { time: '4:00 PM', class: 'Saturday Sweat', trainer: 'Mike Thompson', location: 'Main Floor', duration: '60 min', difficulty: 'intermediate' }
            ],
            sunday: [
                { time: '9:00 AM', class: 'Sunday Stretch', trainer: 'Sarah Martinez', location: 'Studio B', duration: '60 min', difficulty: 'beginner' },
                { time: '11:00 AM', class: 'Recovery Session', trainer: 'Alex Johnson', location: 'Recovery Room', duration: '45 min', difficulty: 'beginner' },
                { time: '5:00 PM', class: 'Sunday Strength', trainer: 'Mike Thompson', location: 'Weight Room', duration: '50 min', difficulty: 'intermediate' }
            ]
        };

        // Populate missing days
        Object.keys(scheduleData).forEach(day => {
            const dayElement = document.getElementById(day);
            if (dayElement && scheduleData[day]) {
                dayElement.innerHTML = scheduleData[day].map(classItem => `
                    <div class="class-item">
                        <div class="class-time">${classItem.time}</div>
                        <div class="class-info">
                            <h4>${classItem.class}</h4>
                            <p>${classItem.trainer} • ${classItem.location} • ${classItem.duration}</p>
                            <span class="difficulty ${classItem.difficulty}">${classItem.difficulty}</span>
                        </div>
                        <button class="btn btn-sm btn-primary">Book Now</button>
                    </div>
                `).join('');

                // Re-bind booking events for new elements
                dayElement.querySelectorAll('.btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const classItem = e.target.closest('.class-item');
                        const className = classItem.querySelector('h4').textContent;
                        const classTime = classItem.querySelector('.class-time').textContent;
                        window.trainerBooking.openBookingModal(null, className, classTime);
                    });
                });
            }
        });
    }
}

// Gallery Manager
class GalleryManager {
    constructor() {
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.galleryItems = document.querySelectorAll('.gallery-item');
        this.modal = document.getElementById('gallery-modal');
        this.currentImageIndex = 0;
        this.images = [];
        this.init();
    }

    init() {
        if (this.filterBtns.length === 0) return;
        this.bindEvents();
        this.collectImages();
        this.setupCheckboxes();
    }

    setupCheckboxes() {
        // Ensure all checkboxes are clickable
        const checkboxLabels = document.querySelectorAll('.checkbox-label');
        
        checkboxLabels.forEach(label => {
            label.addEventListener('click', (e) => {
                const checkbox = label.querySelector('input[type="checkbox"]');
                if (checkbox && e.target !== checkbox) {
                    e.preventDefault();
                    checkbox.checked = !checkbox.checked;
                    checkbox.dispatchEvent(new Event('change'));
                }
            });
        });

        // Style checked checkboxes
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                const label = checkbox.closest('.checkbox-label');
                if (label) {
                    if (checkbox.checked) {
                        label.classList.add('checked');
                    } else {
                        label.classList.remove('checked');
                    }
                }
            });
        });
    }

    bindEvents() {
        // Filter buttons
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                this.filterGallery(filter);
                this.updateActiveFilter(e.target);
            });
        });

        // Gallery items
        this.galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                this.openModal(index);
            });
        });

        // Modal controls
        if (this.modal) {
            document.getElementById('modal-close').addEventListener('click', () => {
                this.closeModal();
            });

            document.getElementById('modal-overlay').addEventListener('click', () => {
                this.closeModal();
            });

            document.getElementById('modal-prev').addEventListener('click', () => {
                this.previousImage();
            });

            document.getElementById('modal-next').addEventListener('click', () => {
                this.nextImage();
            });

            // Keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (!this.modal.classList.contains('active')) return;
                
                if (e.key === 'Escape') this.closeModal();
                if (e.key === 'ArrowLeft') this.previousImage();
                if (e.key === 'ArrowRight') this.nextImage();
            });
        }
    }

    collectImages() {
        this.images = Array.from(this.galleryItems).map(item => {
            const img = item.querySelector('img');
            const btn = item.querySelector('.gallery-btn');
            return {
                src: btn ? btn.dataset.image : img.src,
                alt: img.alt,
                element: item
            };
        });
    }

    filterGallery(filter) {
        this.galleryItems.forEach(item => {
            const category = item.dataset.category;
            const shouldShow = filter === 'all' || category === filter;
            
            item.style.display = shouldShow ? 'block' : 'none';
            
            // Add animation
            if (shouldShow) {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 100);
            }
        });

        // Update visible images array
        this.collectImages();
        this.images = this.images.filter(img => 
            img.element.style.display !== 'none'
        );
    }

    updateActiveFilter(activeBtn) {
        this.filterBtns.forEach(btn => btn.classList.remove('active'));
        activeBtn.classList.add('active');
    }

    openModal(index) {
        this.currentImageIndex = index;
        this.updateModalImage();
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    updateModalImage() {
        const modalImage = document.getElementById('modal-image');
        const currentImage = this.images[this.currentImageIndex];
        
        if (currentImage) {
            modalImage.src = currentImage.src;
            modalImage.alt = currentImage.alt;
        }
    }

    previousImage() {
        this.currentImageIndex = (this.currentImageIndex - 1 + this.images.length) % this.images.length;
        this.updateModalImage();
    }

    nextImage() {
        this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
        this.updateModalImage();
    }
}

// Progress Tracker Manager
class ProgressTracker {
    constructor() {
        this.canvas = document.getElementById('progress-chart-canvas');
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
        this.stats = {
            caloriesBurned: document.getElementById('calories-burned'),
            workoutsCompleted: document.getElementById('workouts-completed'),
            totalTime: document.getElementById('total-time'),
            achievements: document.getElementById('achievements')
        };
        this.init();
    }

    init() {
        if (!this.canvas) return;
        this.animateStats();
        this.drawChart();
    }

    animateStats() {
        const targetValues = {
            caloriesBurned: 2450,
            workoutsCompleted: 12,
            totalTime: 18,
            achievements: 5
        };

        Object.keys(targetValues).forEach(key => {
            if (this.stats[key]) {
                this.animateNumber(this.stats[key], targetValues[key], 2000);
            }
        });
    }

    animateNumber(element, target, duration) {
        const start = 0;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(start + (target - start) * easeOutQuart);
            
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = target;
            }
        };

        requestAnimationFrame(animate);
    }

    drawChart() {
        if (!this.ctx) return;

        const data = [65, 78, 82, 88, 92, 85, 90]; // Weekly progress data
        const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        
        const canvas = this.canvas;
        const ctx = this.ctx;
        
        // Set canvas size
        canvas.width = 400;
        canvas.height = 200;
        
        // Chart dimensions
        const padding = 40;
        const chartWidth = canvas.width - padding * 2;
        const chartHeight = canvas.height - padding * 2;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Set styles
        ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim() + '20';
        ctx.lineWidth = 3;
        ctx.font = '12px Poppins, sans-serif';
        ctx.textAlign = 'center';
        
        // Draw grid lines
        ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim();
        ctx.lineWidth = 1;
        
        for (let i = 0; i <= 5; i++) {
            const y = padding + (chartHeight / 5) * i;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(canvas.width - padding, y);
            ctx.stroke();
        }
        
        // Draw chart line
        ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        data.forEach((value, index) => {
            const x = padding + (chartWidth / (data.length - 1)) * index;
            const y = padding + chartHeight - (value / 100) * chartHeight;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
        
        // Draw data points
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();
        data.forEach((value, index) => {
            const x = padding + (chartWidth / (data.length - 1)) * index;
            const y = padding + chartHeight - (value / 100) * chartHeight;
            
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();
        });
        
        // Draw labels
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim();
        labels.forEach((label, index) => {
            const x = padding + (chartWidth / (data.length - 1)) * index;
            const y = canvas.height - 10;
            ctx.fillText(label, x, y);
        });
    }
}

// Chat Widget Manager
class ChatWidget {
    constructor() {
        this.widget = document.getElementById('chat-widget');
        this.toggle = document.getElementById('chat-toggle');
        this.window = document.getElementById('chat-window');
        this.messages = document.getElementById('chat-messages');
        this.input = document.getElementById('chat-input');
        this.sendBtn = document.getElementById('chat-send');
        this.closeBtn = document.getElementById('chat-close');
        this.notification = document.getElementById('chat-notification');
        this.isOpen = false;
        this.init();
    }

    init() {
        if (!this.widget) return;
        this.bindEvents();
        this.setupBotResponses();
    }

    bindEvents() {
        this.toggle.addEventListener('click', () => {
            this.toggleChat();
        });

        this.closeBtn.addEventListener('click', () => {
            this.closeChat();
        });

        this.sendBtn.addEventListener('click', () => {
            this.sendMessage();
        });

        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        this.input.addEventListener('input', () => {
            this.sendBtn.style.opacity = this.input.value.trim() ? '1' : '0.5';
        });
    }

    toggleChat() {
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }

    openChat() {
        this.window.classList.add('active');
        this.isOpen = true;
        this.notification.style.display = 'none';
        this.input.focus();
        
        // Scroll to bottom
        setTimeout(() => {
            this.messages.scrollTop = this.messages.scrollHeight;
        }, 100);
    }

    closeChat() {
        this.window.classList.remove('active');
        this.isOpen = false;
    }

    sendMessage() {
        const message = this.input.value.trim();
        if (!message) return;

        this.addMessage(message, 'user');
        this.input.value = '';
        this.sendBtn.style.opacity = '0.5';

        // Simulate bot response
        setTimeout(() => {
            this.generateBotResponse(message);
        }, 1000);
    }

    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = sender === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
        
        const content = document.createElement('div');
        content.className = 'message-content';
        content.innerHTML = `
            <p>${text}</p>
            <span class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
        `;
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);
        this.messages.appendChild(messageDiv);
        
        // Scroll to bottom
        this.messages.scrollTop = this.messages.scrollHeight;
    }

    setupBotResponses() {
        this.responses = {
            greetings: [
                "Hello! How can I help you with your fitness journey today?",
                "Hi there! What questions do you have about our gym services?",
                "Welcome to FitZone! I'm here to assist you."
            ],
            membership: [
                "We have three membership tiers: Basic ($29/month), Premium ($59/month), and Elite ($99/month). Which would you like to know more about?",
                "Our Premium membership is most popular - it includes 24/7 access, unlimited classes, and 2 personal training sessions per month!"
            ],
            classes: [
                "We offer various classes including HIIT, Yoga, Pilates, Strength Training, and more! Check our schedule section for times.",
                "Our group classes are led by certified trainers and suitable for all fitness levels. Would you like to book a class?"
            ],
            trainers: [
                "Our expert trainers specialize in different areas: Alex (Strength & Conditioning), Sarah (Yoga & Pilates), and Mike (HIIT & Cardio).",
                "All our trainers are certified professionals with years of experience. Would you like to book a session?"
            ],
            hours: [
                "We're open Monday-Sunday, 5AM-11PM. Premium and Elite members get 24/7 access!",
                "Our peak hours are 6-9AM and 5-8PM. Off-peak times are great for a less crowded experience."
            ],
            default: [
                "That's a great question! For detailed information, I'd recommend speaking with our staff. You can call us at (555) 123-4567.",
                "I'd be happy to help! Could you be more specific about what you're looking for?",
                "For the best assistance with that, please contact our front desk or book a consultation with one of our trainers."
            ]
        };
    }

    generateBotResponse(userMessage) {
        const message = userMessage.toLowerCase();
        let responses;

        if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
            responses = this.responses.greetings;
        } else if (message.includes('membership') || message.includes('price') || message.includes('cost')) {
            responses = this.responses.membership;
        } else if (message.includes('class') || message.includes('schedule') || message.includes('yoga') || message.includes('hiit')) {
            responses = this.responses.classes;
        } else if (message.includes('trainer') || message.includes('personal') || message.includes('coach')) {
            responses = this.responses.trainers;
        } else if (message.includes('hours') || message.includes('open') || message.includes('time')) {
            responses = this.responses.hours;
        } else {
            responses = this.responses.default;
        }

        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        this.addMessage(randomResponse, 'bot');
    }
}

// Workout Generator Manager
class WorkoutGenerator {
    constructor() {
        this.form = document.getElementById('workout-form');
        this.result = document.getElementById('workout-result');
        this.workoutDatabase = this.initializeWorkoutDatabase();
        this.init();
    }

    init() {
        if (!this.form) return;
        this.bindEvents();
        this.setupCheckboxes();
    }

    setupCheckboxes() {
        // Ensure all checkboxes in workout generator are clickable
        const workoutCheckboxLabels = document.querySelectorAll('#workout-generator .checkbox-label');
        
        workoutCheckboxLabels.forEach(label => {
            label.addEventListener('click', (e) => {
                const checkbox = label.querySelector('input[type="checkbox"]');
                if (checkbox && e.target !== checkbox) {
                    e.preventDefault();
                    checkbox.checked = !checkbox.checked;
                    checkbox.dispatchEvent(new Event('change'));
                    
                    // Update visual state
                    if (checkbox.checked) {
                        label.classList.add('checked');
                    } else {
                        label.classList.remove('checked');
                    }
                }
            });
        });

        // Handle direct checkbox clicks
        const workoutCheckboxes = document.querySelectorAll('#workout-generator input[type="checkbox"]');
        workoutCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                const label = checkbox.closest('.checkbox-label');
                if (label) {
                    if (checkbox.checked) {
                        label.classList.add('checked');
                    } else {
                        label.classList.remove('checked');
                    }
                }
            });
        });
    }

    bindEvents() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.generateWorkout();
        });
    }

    initializeWorkoutDatabase() {
        return {
            beginner: {
                'weight-loss': {
                    none: [
                        { name: 'Jumping Jacks', description: 'Full body cardio exercise', reps: '30 seconds', rest: '30s rest' },
                        { name: 'Bodyweight Squats', description: 'Lower body strength', reps: '15 reps', rest: '45s rest' },
                        { name: 'Push-ups (Modified)', description: 'Upper body strength', reps: '8-12 reps', rest: '60s rest' },
                        { name: 'Mountain Climbers', description: 'Core and cardio', reps: '20 seconds', rest: '40s rest' },
                        { name: 'Plank Hold', description: 'Core stability', reps: '20-30 seconds', rest: '60s rest' }
                    ],
                    basic: [
                        { name: 'Dumbbell Squats', description: 'Lower body with resistance', reps: '12-15 reps', rest: '60s rest' },
                        { name: 'Resistance Band Rows', description: 'Back and biceps', reps: '12-15 reps', rest: '45s rest' },
                        { name: 'Dumbbell Press', description: 'Chest and shoulders', reps: '10-12 reps', rest: '60s rest' },
                        { name: 'Band Pull-Aparts', description: 'Rear delts and upper back', reps: '15-20 reps', rest: '30s rest' },
                        { name: 'Dumbbell Deadlifts', description: 'Posterior chain', reps: '10-12 reps', rest: '60s rest' }
                    ],
                    full: [
                        { name: 'Treadmill Walk/Jog', description: 'Cardio warm-up', reps: '5 minutes', rest: '2min rest' },
                        { name: 'Leg Press', description: 'Lower body strength', reps: '12-15 reps', rest: '90s rest' },
                        { name: 'Chest Press Machine', description: 'Upper body push', reps: '10-12 reps', rest: '60s rest' },
                        { name: 'Lat Pulldown', description: 'Back and biceps', reps: '12-15 reps', rest: '60s rest' },
                        { name: 'Stationary Bike', description: 'Low-impact cardio', reps: '10 minutes', rest: 'Cool down' }
                    ]
                },
                'muscle-gain': {
                    none: [
                        { name: 'Push-ups', description: 'Chest, shoulders, triceps', reps: '8-12 reps', rest: '60s rest' },
                        { name: 'Bodyweight Squats', description: 'Legs and glutes', reps: '15-20 reps', rest: '60s rest' },
                        { name: 'Pike Push-ups', description: 'Shoulders and triceps', reps: '6-10 reps', rest: '60s rest' },
                        { name: 'Lunges', description: 'Legs and glutes', reps: '10 each leg', rest: '60s rest' },
                        { name: 'Plank to Push-up', description: 'Core and upper body', reps: '5-8 reps', rest: '90s rest' }
                    ],
                    basic: [
                        { name: 'Dumbbell Bench Press', description: 'Chest development', reps: '8-12 reps', rest: '90s rest' },
                        { name: 'Dumbbell Rows', description: 'Back thickness', reps: '10-12 reps', rest: '60s rest' },
                        { name: 'Goblet Squats', description: 'Leg development', reps: '12-15 reps', rest: '90s rest' },
                        { name: 'Dumbbell Shoulder Press', description: 'Shoulder development', reps: '8-12 reps', rest: '60s rest' },
                        { name: 'Dumbbell Curls', description: 'Bicep development', reps: '12-15 reps', rest: '45s rest' }
                    ],
                    full: [
                        { name: 'Barbell Squats', description: 'Compound leg movement', reps: '8-12 reps', rest: '2-3min rest' },
                        { name: 'Bench Press', description: 'Chest development', reps: '8-12 reps', rest: '2-3min rest' },
                        { name: 'Bent-over Rows', description: 'Back development', reps: '10-12 reps', rest: '90s rest' },
                        { name: 'Overhead Press', description: 'Shoulder development', reps: '8-10 reps', rest: '90s rest' },
                        { name: 'Deadlifts', description: 'Full body strength', reps: '5-8 reps', rest: '3min rest' }
                    ]
                }
            },
            intermediate: {
                'weight-loss': {
                    none: [
                        { name: 'Burpees', description: 'Full body HIIT', reps: '8-12 reps', rest: '45s rest' },
                        { name: 'Jump Squats', description: 'Explosive lower body', reps: '15-20 reps', rest: '60s rest' },
                        { name: 'Push-up to T', description: 'Upper body + core', reps: '10-12 reps', rest: '60s rest' },
                        { name: 'High Knees', description: 'Cardio intensity', reps: '45 seconds', rest: '30s rest' },
                        { name: 'Plank Jacks', description: 'Core + cardio', reps: '20-30 reps', rest: '45s rest' }
                    ],
                    basic: [
                        { name: 'Dumbbell Thrusters', description: 'Full body compound', reps: '12-15 reps', rest: '60s rest' },
                        { name: 'Renegade Rows', description: 'Core + back', reps: '8-10 each arm', rest: '90s rest' },
                        { name: 'Bulgarian Split Squats', description: 'Single leg strength', reps: '10-12 each leg', rest: '60s rest' },
                        { name: 'Band-Assisted Pull-ups', description: 'Back and biceps', reps: '6-10 reps', rest: '90s rest' },
                        { name: 'Dumbbell Swings', description: 'Posterior chain power', reps: '15-20 reps', rest: '60s rest' }
                    ],
                    full: [
                        { name: 'HIIT Treadmill', description: 'Interval cardio', reps: '20min intervals', rest: '2min rest' },
                        { name: 'Barbell Squats', description: 'Lower body strength', reps: '12-15 reps', rest: '90s rest' },
                        { name: 'Cable Rows', description: 'Back development', reps: '12-15 reps', rest: '60s rest' },
                        { name: 'Incline Dumbbell Press', description: 'Upper chest', reps: '10-12 reps', rest: '90s rest' },
                        { name: 'Battle Ropes', description: 'HIIT finisher', reps: '30 seconds', rest: '30s rest' }
                    ]
                }
            },
            advanced: {
                'strength': {
                    full: [
                        { name: 'Barbell Back Squats', description: 'Heavy compound movement', reps: '5-6 reps', rest: '3-4min rest' },
                        { name: 'Deadlifts', description: 'Posterior chain strength', reps: '3-5 reps', rest: '4-5min rest' },
                        { name: 'Bench Press', description: 'Upper body power', reps: '5-6 reps', rest: '3-4min rest' },
                        { name: 'Weighted Pull-ups', description: 'Back and bicep strength', reps: '6-8 reps', rest: '3min rest' },
                        { name: 'Overhead Press', description: 'Shoulder strength', reps: '5-8 reps', rest: '3min rest' }
                    ]
                }
            }
        };
    }

    generateWorkout() {
        const formData = new FormData(this.form);
        const level = formData.get('fitness-level');
        const goal = formData.get('workout-goal');
        const duration = parseInt(formData.get('workout-duration'));
        const equipment = formData.get('equipment');
        const targetAreas = formData.getAll('target-areas');

        // Get exercises based on criteria
        let exercises = this.getExercises(level, goal, equipment, targetAreas);
        
        // Adjust for duration
        exercises = this.adjustForDuration(exercises, duration);

        this.displayWorkout(exercises, level, goal, duration, equipment);
    }

    getExercises(level, goal, equipment, targetAreas) {
        const levelData = this.workoutDatabase[level];
        if (!levelData || !levelData[goal] || !levelData[goal][equipment]) {
            // Fallback to basic exercises
            return this.workoutDatabase.beginner['weight-loss']['none'].slice(0, 5);
        }
        
        return levelData[goal][equipment];
    }

    adjustForDuration(exercises, duration) {
        const baseExercises = [...exercises];
        
        if (duration <= 15) {
            return baseExercises.slice(0, 3);
        } else if (duration <= 30) {
            return baseExercises.slice(0, 5);
        } else if (duration <= 45) {
            return baseExercises.slice(0, 7);
        } else if (duration <= 60) {
            return baseExercises;
        } else {
            // Add extra exercises or rounds for longer workouts
            return [...baseExercises, ...baseExercises.slice(0, 3)];
        }
    }

    displayWorkout(exercises, level, goal, duration, equipment) {
        const resultDiv = this.result;
        
        resultDiv.innerHTML = `
            <div class="workout-plan active">
                <div class="workout-header">
                    <h3>${this.capitalizeFirst(level)} ${this.capitalizeFirst(goal.replace('-', ' '))} Workout</h3>
                    <div class="workout-meta">
                        <div class="meta-item">
                            <span class="meta-value">${duration}</span>
                            <span class="meta-label">Minutes</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-value">${exercises.length}</span>
                            <span class="meta-label">Exercises</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-value">${this.capitalizeFirst(equipment === 'none' ? 'Bodyweight' : equipment)}</span>
                            <span class="meta-label">Equipment</span>
                        </div>
                    </div>
                </div>
                <ul class="exercise-list">
                    ${exercises.map((exercise, index) => `
                        <li class="exercise-item">
                            <div class="exercise-number">${index + 1}</div>
                            <div class="exercise-details">
                                <h4>${exercise.name}</h4>
                                <p>${exercise.description}</p>
                            </div>
                            <div class="exercise-reps">
                                <span class="reps">${exercise.reps}</span>
                                <span class="rest">${exercise.rest}</span>
                            </div>
                        </li>
                    `).join('')}
                </ul>
                <div style="text-align: center; margin-top: 2rem;">
                    <button class="btn btn-primary" onclick="window.trainerBooking.openBookingModal()">
                        Book Personal Training
                    </button>
                </div>
            </div>
        `;

        // Animate the result
        resultDiv.style.opacity = '0';
        setTimeout(() => {
            resultDiv.style.opacity = '1';
        }, 100);
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

// Nutrition Calculator Manager
class NutritionCalculator {
    constructor() {
        this.form = document.getElementById('nutrition-form');
        this.result = document.getElementById('nutrition-result');
        this.init();
    }

    init() {
        if (!this.form) return;
        this.bindEvents();
    }

    bindEvents() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.calculateNutrition();
        });
    }

    calculateNutrition() {
        const formData = new FormData(this.form);
        const age = parseInt(formData.get('n-age'));
        const gender = formData.get('n-gender');
        const height = parseInt(formData.get('n-height'));
        const weight = parseInt(formData.get('n-weight'));
        const activityLevel = parseFloat(formData.get('activity-level'));
        const goal = formData.get('nutrition-goal');

        // Calculate BMR using Mifflin-St Jeor Equation
        let bmr;
        if (gender === 'male') {
            bmr = 10 * weight + 6.25 * height - 5 * age + 5;
        } else {
            bmr = 10 * weight + 6.25 * height - 5 * age - 161;
        }

        // Calculate TDEE
        const tdee = bmr * activityLevel;

        // Adjust for goal
        let targetCalories = tdee;
        if (goal === 'lose') {
            targetCalories = tdee - 500;
        } else if (goal === 'gain') {
            targetCalories = tdee + 500;
        }

        // Calculate macros (40% carbs, 30% protein, 30% fat)
        const protein = Math.round((targetCalories * 0.30) / 4); // 4 cal per gram
        const carbs = Math.round((targetCalories * 0.40) / 4); // 4 cal per gram
        const fat = Math.round((targetCalories * 0.30) / 9); // 9 cal per gram

        this.displayNutritionPlan(targetCalories, protein, carbs, fat, goal, gender);
    }

    displayNutritionPlan(calories, protein, carbs, fat, goal, gender) {
        const tips = this.getNutritionTips(goal, gender);
        
        this.result.innerHTML = `
            <div class="nutrition-plan active">
                <div class="nutrition-summary">
                    <div class="calorie-display">${Math.round(calories)}</div>
                    <div class="calorie-label">Daily Calories</div>
                </div>
                <div class="macro-breakdown">
                    <div class="macro-item">
                        <h4>Protein</h4>
                        <span class="macro-amount">${protein}g</span>
                        <span class="macro-percentage">30%</span>
                    </div>
                    <div class="macro-item">
                        <h4>Carbs</h4>
                        <span class="macro-amount">${carbs}g</span>
                        <span class="macro-percentage">40%</span>
                    </div>
                    <div class="macro-item">
                        <h4>Fat</h4>
                        <span class="macro-amount">${fat}g</span>
                        <span class="macro-percentage">30%</span>
                    </div>
                </div>
                <div class="nutrition-tips">
                    <h4>Nutrition Tips</h4>
                    <ul>
                        ${tips.map(tip => `<li>${tip}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;

        // Animate the result
        this.result.style.opacity = '0';
        setTimeout(() => {
            this.result.style.opacity = '1';
        }, 100);
    }

    getNutritionTips(goal, gender) {
        const baseTips = [
            'Drink at least 8 glasses of water daily',
            'Eat protein with every meal',
            'Include vegetables in most meals',
            'Time your carbs around workouts'
        ];

        const goalTips = {
            lose: [
                'Create a moderate calorie deficit',
                'Focus on high-protein, low-calorie foods',
                'Eat more fiber to stay full longer'
            ],
            maintain: [
                'Focus on nutrient-dense whole foods',
                'Maintain consistent meal timing',
                'Listen to your hunger cues'
            ],
            gain: [
                'Eat frequent, nutrient-dense meals',
                'Include healthy fats like nuts and avocado',
                'Consider post-workout protein shakes'
            ]
        };

        return [...baseTips, ...goalTips[goal]];
    }
}

// Virtual Tour Manager
class VirtualTour {
    constructor() {
        this.tourBtns = document.querySelectorAll('.tour-btn');
        this.tourImage = document.getElementById('tour-main-image');
        this.tourTitle = document.getElementById('tour-title');
        this.tourDescription = document.getElementById('tour-description');
        this.tourFeatures = document.getElementById('tour-features');
        this.hotspots = document.querySelectorAll('.hotspot');
        this.tourData = this.initializeTourData();
        this.init();
    }

    init() {
        if (this.tourBtns.length === 0) return;
        this.bindEvents();
    }

    bindEvents() {
        this.tourBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tour = e.target.dataset.tour;
                this.switchTour(tour);
                this.updateActiveButton(e.target);
            });
        });

        this.hotspots.forEach(hotspot => {
            hotspot.addEventListener('click', (e) => {
                const tour = e.target.closest('.hotspot').dataset.tour;
                this.switchTour(tour);
                this.updateActiveButton(document.querySelector(`[data-tour="${tour}"]`));
            });
        });
    }

    initializeTourData() {
        return {
            main: {
                image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=400&fit=crop',
                title: 'Main Gym Floor',
                description: 'Welcome to our spacious main gym floor featuring state-of-the-art equipment and an open, energizing atmosphere perfect for all your fitness needs.',
                features: [
                    '24/7 Access Available',
                    'Climate Controlled',
                    'Professional Sound System'
                ]
            },
            cardio: {
                image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&h=400&fit=crop',
                title: 'Cardio Zone',
                description: 'Our dedicated cardio area features the latest treadmills, ellipticals, and bikes, all equipped with personal entertainment systems.',
                features: [
                    'Latest Cardio Equipment',
                    'Personal Entertainment Systems',
                    'Heart Rate Monitoring',
                    'Towel Service Available'
                ]
            },
            weights: {
                image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&h=400&fit=crop',
                title: 'Weight Training Area',
                description: 'Complete free weight section with dumbbells, barbells, and specialized strength training equipment for serious lifters.',
                features: [
                    'Full Range of Free Weights',
                    'Olympic Lifting Platform',
                    'Specialized Strength Equipment',
                    'Spotting Available'
                ]
            },
            studio: {
                image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=400&fit=crop',
                title: 'Group Fitness Studio',
                description: 'Spacious studio designed for group classes including yoga, pilates, HIIT, and dance fitness with premium sound and lighting.',
                features: [
                    'Premium Sound System',
                    'Mirrored Walls',
                    'Yoga Props Available',
                    'Climate Controlled'
                ]
            },
            locker: {
                image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&h=400&fit=crop',
                title: 'Locker Rooms',
                description: 'Clean, spacious locker rooms with modern amenities including showers, lockers, and grooming stations.',
                features: [
                    'Individual Shower Stalls',
                    'Secure Lockers',
                    'Hair Dryers Available',
                    'Towel Service'
                ]
            }
        };
    }

    switchTour(tourType) {
        const tourInfo = this.tourData[tourType];
        if (!tourInfo) return;

        // Update image with fade effect
        this.tourImage.style.opacity = '0';
        setTimeout(() => {
            this.tourImage.src = tourInfo.image;
            this.tourImage.alt = tourInfo.title;
            this.tourImage.style.opacity = '1';
        }, 300);

        // Update content
        this.tourTitle.textContent = tourInfo.title;
        this.tourDescription.textContent = tourInfo.description;
        
        // Update features
        this.tourFeatures.innerHTML = tourInfo.features.map(feature => `
            <div class="feature-item">
                <i class="fas fa-check"></i>
                <span>${feature}</span>
            </div>
        `).join('');
    }

    updateActiveButton(activeBtn) {
        this.tourBtns.forEach(btn => btn.classList.remove('active'));
        activeBtn.classList.add('active');
    }
}

// Weather Widget Manager
class WeatherWidget {
    constructor() {
        this.weatherIcon = document.getElementById('weather-icon');
        this.weatherTemp = document.getElementById('weather-temp');
        this.weatherDesc = document.getElementById('weather-desc');
        this.weatherVisibility = document.getElementById('weather-visibility');
        this.weatherHumidity = document.getElementById('weather-humidity');
        this.weatherWind = document.getElementById('weather-wind');
        this.workoutSuggestion = document.getElementById('workout-suggestion');
        this.init();
    }

    init() {
        if (!this.weatherIcon) return;
        this.updateWeather();
        // Update weather every 30 minutes
        setInterval(() => this.updateWeather(), 30 * 60 * 1000);
    }

    updateWeather() {
        // Simulate weather data (in a real app, you'd fetch from a weather API)
        const weatherConditions = [
            { temp: 22, desc: 'Sunny', icon: 'fas fa-sun', visibility: '10km', humidity: '45%', wind: '12 km/h', suggestion: 'Perfect weather for outdoor running! Try our outdoor bootcamp class.' },
            { temp: 18, desc: 'Cloudy', icon: 'fas fa-cloud', visibility: '8km', humidity: '65%', wind: '15 km/h', suggestion: 'Great day for indoor workouts. Join our HIIT class!' },
            { temp: 25, desc: 'Partly Cloudy', icon: 'fas fa-cloud-sun', visibility: '12km', humidity: '55%', wind: '8 km/h', suggestion: 'Ideal conditions for any workout. How about some strength training?' },
            { temp: 15, desc: 'Rainy', icon: 'fas fa-cloud-rain', visibility: '5km', humidity: '85%', wind: '20 km/h', suggestion: 'Stay dry with our indoor cycling class or yoga session.' }
        ];

        const currentWeather = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
        
        this.weatherIcon.className = currentWeather.icon;
        this.weatherTemp.textContent = `${currentWeather.temp}°C`;
        this.weatherDesc.textContent = currentWeather.desc;
        this.weatherVisibility.textContent = currentWeather.visibility;
        this.weatherHumidity.textContent = currentWeather.humidity;
        this.weatherWind.textContent = currentWeather.wind;
        this.workoutSuggestion.textContent = currentWeather.suggestion;
    }
}

// Gym Statistics Manager
class GymStats {
    constructor() {
        this.statsElements = {
            currentMembers: document.getElementById('current-members'),
            workoutsToday: document.getElementById('workouts-today'),
            caloriesToday: document.getElementById('calories-today'),
            avgWorkout: document.getElementById('avg-workout'),
            peakHours: document.getElementById('peak-hours'),
            achievementsUnlocked: document.getElementById('achievements-unlocked')
        };
        this.activityFeed = document.getElementById('activity-feed');
        this.init();
    }

    init() {
        if (!this.statsElements.currentMembers) return;
        this.updateStats();
        this.updateActivityFeed();
        
        // Update stats every 5 minutes
        setInterval(() => this.updateStats(), 5 * 60 * 1000);
        // Update activity feed every 30 seconds
        setInterval(() => this.updateActivityFeed(), 30 * 1000);
    }

    updateStats() {
        // Simulate real-time stats updates
        const baseStats = {
            currentMembers: 1247,
            workoutsToday: 89,
            caloriesToday: 45230,
            avgWorkout: 52,
            peakHours: '6-8 PM',
            achievementsUnlocked: 156
        };

        // Add some random variation
        const variation = {
            currentMembers: Math.floor(Math.random() * 10) - 5,
            workoutsToday: Math.floor(Math.random() * 20) - 10,
            caloriesToday: Math.floor(Math.random() * 2000) - 1000,
            avgWorkout: Math.floor(Math.random() * 10) - 5,
            achievementsUnlocked: Math.floor(Math.random() * 10) - 5
        };

        Object.keys(baseStats).forEach(key => {
            if (this.statsElements[key] && key !== 'peakHours') {
                const newValue = baseStats[key] + (variation[key] || 0);
                this.animateNumber(this.statsElements[key], newValue, 1000);
            }
        });
    }

    animateNumber(element, target, duration) {
        const start = parseInt(element.textContent.replace(/,/g, '')) || 0;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(start + (target - start) * easeOutQuart);
            
            element.textContent = current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    updateActivityFeed() {
        const activities = [
            { user: 'Sarah M.', action: 'completed a 45-min HIIT workout', time: '2 minutes ago' },
            { user: 'Mike R.', action: 'unlocked "Strength Master" achievement', time: '5 minutes ago' },
            { user: 'Emma L.', action: 'joined the Morning Yoga class', time: '8 minutes ago' },
            { user: 'John D.', action: 'set a new personal record in deadlifts', time: '12 minutes ago' },
            { user: 'Lisa K.', action: 'completed their 50th workout', time: '15 minutes ago' },
            { user: 'Alex P.', action: 'burned 500 calories in spin class', time: '18 minutes ago' }
        ];

        // Shuffle and take first 3
        const shuffled = activities.sort(() => 0.5 - Math.random()).slice(0, 3);
        
        this.activityFeed.innerHTML = shuffled.map(activity => `
            <div class="activity-item">
                <div class="activity-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div class="activity-content">
                    <p><strong>${activity.user}</strong> ${activity.action}</p>
                    <span class="activity-time">${activity.time}</span>
                </div>
            </div>
        `).join('');
    }
}

// Achievement System Manager
class AchievementSystem {
    constructor() {
        this.achievementCards = document.querySelectorAll('.achievement-card');
        this.init();
    }

    init() {
        if (this.achievementCards.length === 0) return;
        this.bindEvents();
        this.simulateProgress();
    }

    bindEvents() {
        this.achievementCards.forEach(card => {
            card.addEventListener('click', () => {
                this.showAchievementDetails(card);
            });
        });
    }

    simulateProgress() {
        // Simulate achievement progress updates
        setInterval(() => {
            this.achievementCards.forEach(card => {
                if (card.classList.contains('locked')) {
                    const progressFill = card.querySelector('.progress-fill');
                    const progressText = card.querySelector('.progress-text');
                    
                    if (progressFill && progressText) {
                        const currentWidth = parseInt(progressFill.style.width) || 0;
                        const increment = Math.random() * 5; // Random progress increment
                        const newWidth = Math.min(currentWidth + increment, 100);
                        
                        progressFill.style.width = `${newWidth}%`;
                        
                        // Update progress text based on achievement type
                        const achievementType = card.dataset.achievement;
                        this.updateProgressText(card, achievementType, newWidth);
                        
                        // Check if achievement should be unlocked
                        if (newWidth >= 100) {
                            this.unlockAchievement(card);
                        }
                    }
                }
            });
        }, 10000); // Update every 10 seconds
    }

    updateProgressText(card, achievementType, progress) {
        const progressText = card.querySelector('.progress-text');
        const progressMap = {
            'first-workout': { max: 1, unit: '' },
            'week-warrior': { max: 5, unit: '' },
            'strength-master': { max: 1000, unit: 'kg' },
            'cardio-king': { max: 10000, unit: '' },
            'consistency-champion': { max: 30, unit: '' }
        };
        
        const config = progressMap[achievementType];
        if (config) {
            const current = Math.floor((progress / 100) * config.max);
            progressText.textContent = `${current}/${config.max}${config.unit}`;
        }
    }

    unlockAchievement(card) {
        card.classList.remove('locked');
        card.classList.add('unlocked');
        
        // Show unlock animation
        this.showUnlockNotification(card);
    }

    showUnlockNotification(card) {
        const achievementName = card.querySelector('h4').textContent;
        
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-trophy"></i>
                <h4>Achievement Unlocked!</h4>
                <p>${achievementName}</p>
            </div>
        `;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #00ff88, #00cc6a);
            color: white;
            padding: 1.5rem;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            z-index: 3000;
            animation: slideInRight 0.5s ease, fadeOut 0.5s ease 4s forwards;
            max-width: 300px;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    showAchievementDetails(card) {
        const achievementName = card.querySelector('h4').textContent;
        const achievementDesc = card.querySelector('p').textContent;
        const isUnlocked = card.classList.contains('unlocked');
        
        // Create modal or tooltip with achievement details
        console.log(`Achievement: ${achievementName} - ${achievementDesc} - ${isUnlocked ? 'Unlocked' : 'Locked'}`);
    }
}

// Workout Timer Manager
class WorkoutTimer {
    constructor() {
        this.startBtn = document.getElementById('start-timer');
        this.pauseBtn = document.getElementById('pause-timer');
        this.resetBtn = document.getElementById('reset-timer');
        this.timerTime = document.getElementById('timer-time');
        this.timerPhase = document.getElementById('timer-phase');
        this.timerProgress = document.getElementById('timer-progress');
        this.currentRound = document.getElementById('current-round');
        this.totalRounds = document.getElementById('total-rounds');
        this.totalTime = document.getElementById('total-time');
        this.workTimeInput = document.getElementById('work-time');
        this.restTimeInput = document.getElementById('rest-time');
        this.roundsInput = document.getElementById('rounds');
        
        this.isRunning = false;
        this.isPaused = false;
        this.currentPhase = 'ready'; // ready, work, rest, complete
        this.currentRoundNum = 1;
        this.timeRemaining = 0;
        this.totalTimeElapsed = 0;
        this.intervalId = null;
        this.audioContext = null;
        
        this.init();
    }

    init() {
        if (!this.startBtn) return;
        this.bindEvents();
        this.updateDisplay();
        this.setupAudio();
    }

    bindEvents() {
        this.startBtn.addEventListener('click', () => this.startTimer());
        this.pauseBtn.addEventListener('click', () => this.pauseTimer());
        this.resetBtn.addEventListener('click', () => this.resetTimer());
        
        // Update total time when settings change
        [this.workTimeInput, this.restTimeInput, this.roundsInput].forEach(input => {
            input.addEventListener('input', () => this.updateTotalTime());
        });
    }

    setupAudio() {
        // Create audio context for beep sounds
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Audio not supported');
        }
    }

    playBeep(frequency = 800, duration = 200) {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration / 1000);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration / 1000);
    }

    startTimer() {
        if (this.isPaused) {
            this.resumeTimer();
            return;
        }

        // Initialize timer
        this.isRunning = true;
        this.isPaused = false;
        this.currentPhase = 'ready';
        this.currentRoundNum = 1;
        this.timeRemaining = 5; // 5 second get ready period
        this.totalTimeElapsed = 0;

        this.updateButtons();
        this.updateDisplay();
        this.startCountdown();
        
        // Play start beep
        this.playBeep(1000, 300);
    }

    pauseTimer() {
        this.isPaused = true;
        this.isRunning = false;
        clearInterval(this.intervalId);
        this.updateButtons();
        this.timerPhase.textContent = 'Paused';
    }

    resumeTimer() {
        this.isPaused = false;
        this.isRunning = true;
        this.updateButtons();
        this.startCountdown();
    }

    resetTimer() {
        this.isRunning = false;
        this.isPaused = false;
        this.currentPhase = 'ready';
        this.currentRoundNum = 1;
        this.timeRemaining = 0;
        this.totalTimeElapsed = 0;
        
        clearInterval(this.intervalId);
        this.updateButtons();
        this.updateDisplay();
        this.resetProgress();
    }

    startCountdown() {
        this.intervalId = setInterval(() => {
            this.timeRemaining--;
            this.totalTimeElapsed++;
            
            this.updateDisplay();
            this.updateProgress();
            
            // Phase transitions
            if (this.timeRemaining <= 0) {
                this.nextPhase();
            }
            
            // Beep on last 3 seconds
            if (this.timeRemaining <= 3 && this.timeRemaining > 0) {
                this.playBeep(600, 150);
            }
            
        }, 1000);
    }

    nextPhase() {
        const workTime = parseInt(this.workTimeInput.value);
        const restTime = parseInt(this.restTimeInput.value);
        const totalRounds = parseInt(this.roundsInput.value);

        switch (this.currentPhase) {
            case 'ready':
                this.currentPhase = 'work';
                this.timeRemaining = workTime;
                this.playBeep(1200, 500); // High beep for work
                break;
                
            case 'work':
                if (this.currentRoundNum >= totalRounds) {
                    this.completeWorkout();
                    return;
                }
                this.currentPhase = 'rest';
                this.timeRemaining = restTime;
                this.playBeep(400, 300); // Low beep for rest
                break;
                
            case 'rest':
                this.currentRoundNum++;
                this.currentPhase = 'work';
                this.timeRemaining = workTime;
                this.playBeep(1200, 500); // High beep for work
                break;
        }
    }

    completeWorkout() {
        this.isRunning = false;
        this.currentPhase = 'complete';
        this.timeRemaining = 0;
        
        clearInterval(this.intervalId);
        this.updateButtons();
        this.updateDisplay();
        
        // Play completion sound
        this.playBeep(1500, 1000);
        
        // Show completion message
        setTimeout(() => {
            alert('🎉 Workout Complete! Great job!');
        }, 500);
    }

    updateDisplay() {
        // Update timer display
        const minutes = Math.floor(this.timeRemaining / 60);
        const seconds = this.timeRemaining % 60;
        this.timerTime.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Update phase display
        const phaseText = {
            'ready': 'Get Ready',
            'work': 'WORK!',
            'rest': 'Rest',
            'complete': 'Complete!'
        };
        this.timerPhase.textContent = phaseText[this.currentPhase] || 'Ready';
        
        // Update round display
        this.currentRound.textContent = this.currentRoundNum;
        this.totalRounds.textContent = this.roundsInput.value;
        
        // Update total time
        this.updateTotalTime();
        
        // Update phase colors
        this.updatePhaseColors();
    }

    updatePhaseColors() {
        const timerCircle = document.querySelector('.timer-circle');
        const timerTimeEl = this.timerTime;
        const timerPhaseEl = this.timerPhase;
        
        // Remove existing phase classes
        timerCircle.classList.remove('work-phase', 'rest-phase', 'ready-phase', 'complete-phase');
        
        // Add current phase class
        timerCircle.classList.add(`${this.currentPhase}-phase`);
        
        // Update text colors based on phase
        switch (this.currentPhase) {
            case 'work':
                timerTimeEl.style.color = '#ff4757';
                timerPhaseEl.style.color = '#ff4757';
                break;
            case 'rest':
                timerTimeEl.style.color = '#00ff88';
                timerPhaseEl.style.color = '#00ff88';
                break;
            case 'complete':
                timerTimeEl.style.color = '#ffa500';
                timerPhaseEl.style.color = '#ffa500';
                break;
            default:
                timerTimeEl.style.color = 'white';
                timerPhaseEl.style.color = '#00ff88';
        }
    }

    updateProgress() {
        if (!this.timerProgress) return;
        
        let totalPhaseTime;
        const workTime = parseInt(this.workTimeInput.value);
        const restTime = parseInt(this.restTimeInput.value);
        
        switch (this.currentPhase) {
            case 'ready':
                totalPhaseTime = 5;
                break;
            case 'work':
                totalPhaseTime = workTime;
                break;
            case 'rest':
                totalPhaseTime = restTime;
                break;
            default:
                totalPhaseTime = 1;
        }
        
        const progress = ((totalPhaseTime - this.timeRemaining) / totalPhaseTime) * 283;
        this.timerProgress.style.strokeDashoffset = 283 - progress;
    }

    resetProgress() {
        if (this.timerProgress) {
            this.timerProgress.style.strokeDashoffset = 283;
        }
    }

    updateTotalTime() {
        const workTime = parseInt(this.workTimeInput.value) || 30;
        const restTime = parseInt(this.restTimeInput.value) || 10;
        const rounds = parseInt(this.roundsInput.value) || 8;
        
        const totalSeconds = (workTime + restTime) * rounds;
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        
        this.totalTime.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    updateButtons() {
        if (this.isRunning) {
            this.startBtn.disabled = true;
            this.pauseBtn.disabled = false;
            this.resetBtn.disabled = false;
            this.startBtn.textContent = 'Running...';
            this.pauseBtn.textContent = 'Pause';
        } else if (this.isPaused) {
            this.startBtn.disabled = false;
            this.pauseBtn.disabled = true;
            this.resetBtn.disabled = false;
            this.startBtn.textContent = 'Resume';
            this.pauseBtn.textContent = 'Paused';
        } else {
            this.startBtn.disabled = false;
            this.pauseBtn.disabled = true;
            this.resetBtn.disabled = false;
            this.startBtn.textContent = 'Start Timer';
            this.pauseBtn.textContent = 'Pause';
        }
    }
}

// Export for testing purposes
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ThemeManager,
        NavigationManager,
        ParallaxManager,
        SmoothScrollManager,
        AnimationObserver,
        FormHandler,
        PerformanceMonitor,
        AccessibilityManager,
        BMICalculator,
        TrainerBooking,
        ScheduleManager,
        GalleryManager,
        ProgressTracker,
        ChatWidget,
        WorkoutGenerator,
        NutritionCalculator,
        VirtualTour,
        WeatherWidget,
        GymStats,
        WorkoutTimer
    };
}
