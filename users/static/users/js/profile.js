// ==================== PROFILE PAGE ENHANCEMENTS ====================

document.addEventListener('DOMContentLoaded', function() {
    initProfileAnimations();
    initSocialLinkInteractions();
    initScrollAnimations();
});

// ==================== ANIMATIONS ====================
function initProfileAnimations() {
    // Animate profile avatar on load
    const avatar = document.querySelector('.profile-avatar');
    if (avatar) {
        avatar.style.animation = 'slideInDown 0.6s ease-out';
    }

    // Animate header info
    const headerInfo = document.querySelector('.header-info');
    if (headerInfo) {
        headerInfo.style.animation = 'slideInLeft 0.6s ease-out 0.2s both';
    }

    // Animate cards
    const cards = document.querySelectorAll('.content-card, .info-card');
    cards.forEach((card, index) => {
        card.style.animation = `slideInUp 0.5s ease-out ${0.1 * (index + 1)}s both`;
    });

    // Add keyframes dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInDown {
            from {
                opacity: 0;
                transform: translateY(-30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        @keyframes slideInLeft {
            from {
                opacity: 0;
                transform: translateX(-30px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
    `;
    document.head.appendChild(style);
}

// ==================== SOCIAL LINKS ====================
function initSocialLinkInteractions() {
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach(link => {
        // Ripple effect on click
        link.addEventListener('click', function(e) {
            createRipple(e, this);
        });

        // Copy to clipboard tooltip functionality
        link.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.className = 'social-tooltip';
            tooltip.textContent = this.getAttribute('title');
            this.appendChild(tooltip);
        });

        link.addEventListener('mouseleave', function() {
            const tooltip = this.querySelector('.social-tooltip');
            if (tooltip) tooltip.remove();
        });
    });
}

// Ripple effect function
function createRipple(event, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');

    // Add ripple styles if not already present
    if (!document.querySelector('style[data-ripple]')) {
        const style = document.createElement('style');
        style.setAttribute('data-ripple', 'true');
        style.textContent = `
            .social-link {
                position: relative;
                overflow: hidden;
            }
            .ripple {
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                transform: scale(0);
                animation: ripple-animation 0.6s ease-out;
            }
            @keyframes ripple-animation {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
            .social-tooltip {
                position: absolute;
                bottom: 100%;
                left: 50%;
                transform: translateX(-50%) translateY(-8px);
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 6px 12px;
                border-radius: 4px;
                font-size: 12px;
                white-space: nowrap;
                pointer-events: none;
                animation: tooltipFade 0.3s ease;
            }
            @keyframes tooltipFade {
                from {
                    opacity: 0;
                    transform: translateX(-50%) translateY(0);
                }
                to {
                    opacity: 1;
                    transform: translateX(-50%) translateY(-8px);
                }
            }
        `;
        document.head.appendChild(style);
    }

    element.appendChild(ripple);
}

// ==================== SCROLL ANIMATIONS ====================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe cards for scroll animations
    document.querySelectorAll('.content-card, .info-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.6s ease-out';
        observer.observe(card);
    });
}

// ==================== UTILITY FUNCTIONS ====================

// Toggle dark mode (optional)
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// Copy profile link to clipboard
function copyProfileLink() {
    const link = window.location.href;
    navigator.clipboard.writeText(link).then(() => {
        alert('Profile link copied to clipboard!');
    });
}

// Smooth scroll to section
function smoothScrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Enhanced image loading with lazy loading support
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        images.forEach(img => imageObserver.observe(img));
    }
}

// Add visual feedback for interactive elements
function addInteractionFeedback() {
    const buttons = document.querySelectorAll('.action-btn, .social-link');
    buttons.forEach(button => {
        button.addEventListener('mousedown', function() {
            this.style.transform = 'scale(0.95)';
        });
        button.addEventListener('mouseup', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

// ==================== INITIALIZATION ====================
window.addEventListener('load', function() {
    initLazyLoading();
    addInteractionFeedback();
});
