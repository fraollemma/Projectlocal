document.addEventListener('DOMContentLoaded', function() {
    initClock();
    initCurrentYear();
    initUnreadCount();
    initFormSubmissions();
    initButtonEffects();
    initLanguageAutoSubmit();
    initLanguagePopup();
    initMobileNavigation(); 
    initCategoryNavDropdowns();
    initDropdowns();
    initScrollEffects();
    initPageAnimations();
});

/* =========================================
   SCROLL EFFECTS & ANIMATIONS
   ========================================= */

function initScrollEffects() {
    let ticking = false;
    let lastScrollY = 0;
    const header = document.querySelector('.header');

    window.addEventListener('scroll', () => {
        lastScrollY = window.scrollY;
        if (!ticking) {
            window.requestAnimationFrame(() => {
                if (header) {
                    if (lastScrollY > 10) {
                        header.classList.add('scrolled');
                    } else {
                        header.classList.remove('scrolled');
                    }
                }
                ticking = false;
            });
            ticking = true;
        }
    });

    // Scroll-to-top button
    addScrollToTopButton();
}

function addScrollToTopButton() {
    const scrollBtn = document.createElement('button');
    scrollBtn.id = 'scrollToTopBtn';
    scrollBtn.setAttribute('aria-label', 'Scroll to top');
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 45px;
        height: 45px;
        border-radius: 50%;
        background: linear-gradient(135deg, #2563eb, #1e40af);
        color: white;
        border: none;
        cursor: pointer;
        display: none;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 15px rgba(37, 99, 235, 0.4);
        font-size: 18px;
        z-index: 999;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    `;

    document.body.appendChild(scrollBtn);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollBtn.style.display = 'flex';
            scrollBtn.style.animation = 'slideInUp 0.3s ease-out';
        } else {
            scrollBtn.style.display = 'none';
        }
    });

    scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    scrollBtn.addEventListener('mouseenter', () => {
        scrollBtn.style.transform = 'translateY(-5px) scale(1.1)';
        scrollBtn.style.boxShadow = '0 8px 25px rgba(37, 99, 235, 0.5)';
    });

    scrollBtn.addEventListener('mouseleave', () => {
        scrollBtn.style.transform = 'translateY(0) scale(1)';
        scrollBtn.style.boxShadow = '0 4px 15px rgba(37, 99, 235, 0.4)';
    });
}

function initPageAnimations() {
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeIn 0.6s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements with data-animate attribute
    document.querySelectorAll('[data-animate]').forEach(el => {
        observer.observe(el);
    });
}

function initClock() { 
    updateClock();
    setInterval(updateClock, 1000);
}

function updateClock() {
    const clock = document.getElementById("liveClock");
    if (!clock) return;

    const now = new Date();

    const date = now.toLocaleDateString();
    const time = now.toLocaleTimeString();

    clock.textContent = date + " " + time;
}
function initCurrentYear() {
    const currentYear = document.getElementById('current-year');
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }
}

function initUnreadCount() {
    function fetchUnreadCount() {
        if (!window.UNREAD_COUNT_API_URL) return;

        fetch(window.UNREAD_COUNT_API_URL, {
            credentials: 'include'
        })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {

            // ===== HEADER (TOP DROPDOWN) =====
            const notifBadge = document.getElementById("notificationBadge");
            const messageCount = document.getElementById("messageCount");
            const eggOrderCount = document.getElementById("eggOrderCount");
            const cartCount = document.getElementById("cartCount");
            const totalNotification = document.getElementById("totalNotification");

            // ===== SIDEBAR (USER MENU) =====
            const navbarMessages = document.getElementById("navbarMessages");
            const navbarEggOrders = document.getElementById("navbarEggOrders");
            const navbarCart = document.getElementById("navbarCart");

            // ===== SAFE VALUES =====
            const messages = data.total_unread || 0;
            const orders = data.egg_order_count || 0;
            const cart = data.cart_count || 0;

            const total = messages + orders + cart;

            // ===== UPDATE HEADER =====
            if (messageCount) messageCount.textContent = messages;
            if (eggOrderCount) eggOrderCount.textContent = orders;
            if (cartCount) cartCount.textContent = cart;
            if (totalNotification) totalNotification.textContent = total;

            if (notifBadge) {
                notifBadge.textContent = total;
                if (total > 0) {
                    notifBadge.style.display = 'flex';
                    notifBadge.classList.add('pulse');
                } else {
                    notifBadge.style.display = 'none';
                    notifBadge.classList.remove('pulse');
                }
            }

            // ===== UPDATE SIDEBAR =====
            if (navbarMessages) navbarMessages.textContent = messages;
            if (navbarEggOrders) navbarEggOrders.textContent = orders;
            if (navbarCart) navbarCart.textContent = cart;

        })
        .catch(error => {
            console.error('Error fetching unread count:', error);
        });
    }

    fetchUnreadCount();
    setInterval(fetchUnreadCount, 30000);
}

function initFormSubmissions() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.classList.add('loading');
                submitBtn.style.opacity = '0.7';
                
                const originalText = submitBtn.innerHTML;
                const originalContent = submitBtn.textContent;
                submitBtn.innerHTML = `
                    <span class="spinner" style="display: inline-block; animation: spin 1s linear infinite; margin-right: 8px;">
                        <i class="fas fa-spinner fa-spin"></i>
                    </span>
                    <span class="text">Processing...</span>
                `;
                
                if (form.dataset.ajax === "true") {
                    e.preventDefault();
                    handleAjaxForm(form, submitBtn, originalText);
                }
            }
        });

        // Add real-time validation feedback
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                validateField(input);
            });
            
            input.addEventListener('focus', () => {
                input.classList.remove('error');
            });
        });
    });
}

function validateField(field) {
    let isValid = true;
    
    if (field.hasAttribute('required') && !field.value.trim()) {
        isValid = false;
    }
    
    if (field.type === 'email' && field.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isValid = emailRegex.test(field.value);
    }
    
    if (!isValid) {
        field.classList.add('error');
        field.style.borderColor = '#ef4444';
    } else {
        field.classList.remove('error');
        field.style.borderColor = '';
    }
}

function handleAjaxForm(form, submitBtn, originalText) {
    const formData = new FormData(form);
    
    fetch(form.action, {
        method: form.method,
        body: formData,
        credentials: 'include'
    })
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
    })
    .then(data => {
        if (data.redirect) {
            window.location.href = data.redirect;
        } else if (data.success) {
            showToast('Success!', data.message || 'Operation completed successfully', 'success');
            form.reset();
        }
    })
    .catch(error => {
        showToast('Error', error.message || 'Something went wrong', 'error');
    })
    .finally(() => {
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        submitBtn.innerHTML = originalText;
    });
}

function initButtonEffects() {
    const buttons = document.querySelectorAll('.btn, button:not(.scroll-btn)');
    buttons.forEach(button => {
        // Add ripple effect
        button.addEventListener('click', (e) => {
            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: rgba(255, 255, 255, 0.5);
                border-radius: 50%;
                left: ${x}px;
                top: ${y}px;
                pointer-events: none;
                animation: ripple-animation 0.6s ease-out;
            `;

            if (!button.style.position || button.style.position === 'static') {
                button.style.position = 'relative';
                button.style.overflow = 'hidden';
            }

            button.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });

        // Add press animation
        button.addEventListener('mousedown', () => {
            button.style.transform = 'translateY(2px) scale(0.98)';
        });

        button.addEventListener('mouseup', () => {
            button.style.transform = 'translateY(0) scale(1)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0) scale(1)';
        });
    });
}

function initLanguagePopup() {
    const overlay = document.getElementById("language-overlay");
    if (!overlay) return;

    if (localStorage.getItem("languageSelected")) {
        overlay.classList.add("hidden");
    } else {
        setTimeout(() => {
            if (!localStorage.getItem("languageSelected")) {
                overlay.classList.remove("hidden");
            }
        }, 1000);
    }
}
function submitLanguage(selectElement) {
    localStorage.setItem("languageSelected", "true");
    const overlay = document.getElementById("language-overlay");
    if (overlay) overlay.classList.add("hidden");   
    selectElement.form.submit();
}
function skipPopup() {
    localStorage.setItem("languageSelected", "true");
    const overlay = document.getElementById("language-overlay");
    if (overlay) overlay.classList.add("hidden");    
}
function initLanguageAutoSubmit() {
    const languageSelects = document.querySelectorAll('#languageSelect, .language-select');
    languageSelects.forEach(select => {
        select.removeEventListener('change', autoSubmitHandler);
        select.addEventListener('change', autoSubmitHandler);
    });

    function autoSubmitHandler(e) {
        localStorage.setItem("languageSelected", "true");
        const overlay = document.getElementById("language-overlay");
        if (overlay) overlay.classList.add("hidden");   
        this.form.submit();
    }
}

function initMobileNavigation() {
    const navToggle = document.getElementById('navToggle');
    const categoryNav = document.getElementById('categoryNav');
    let navOverlay = document.querySelector('.nav-overlay');
    
    if (!navOverlay) {
        navOverlay = document.createElement('div');
        navOverlay.className = 'nav-overlay';
        document.body.appendChild(navOverlay);
    }
    
    function toggleCategoryNav() {
        const isActive = categoryNav.classList.contains('active');
        
        if (!isActive) {
            // Opening
            categoryNav.classList.add('active');
            navOverlay.classList.add('active');
            document.body.classList.add('no-scroll');
            categoryNav.style.animation = 'slideInLeft 0.4s ease-out';
            
            if (navToggle) {
                navToggle.setAttribute('aria-expanded', 'true');
                navToggle.querySelector('.nav-toggle-icon').innerHTML = '<i class="fas fa-times"></i>';
                navToggle.style.transform = 'rotate(90deg)';
            }
        } else {
            // Closing
            categoryNav.classList.remove('active');
            navOverlay.classList.remove('active');
            document.body.classList.remove('no-scroll');
            categoryNav.style.animation = 'slideOutLeft 0.4s ease-out';
            
            if (navToggle) {
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.querySelector('.nav-toggle-icon').innerHTML = '<i class="fas fa-bars"></i>';
                navToggle.style.transform = 'rotate(0deg)';
            }
        }
    }
    
    if (navToggle) {
        navToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleCategoryNav();
        });
    }
    
    const navCloseBtn = document.getElementById('navCloseBtn');
    if (navCloseBtn) {
        navCloseBtn.addEventListener('click', function() {
            categoryNav.classList.remove('active');
            navOverlay.classList.remove('active');
            document.body.classList.remove('no-scroll');
            
            if (navToggle) {
                navToggle.setAttribute('aria-expanded', 'false');
                const icon = navToggle.querySelector('.nav-toggle-icon');
                if (icon) icon.innerHTML = '<i class="fas fa-bars"></i>';
                navToggle.style.transform = 'rotate(0deg)';
            }
        });
    }
    
    navOverlay.addEventListener('click', function() {
        categoryNav.classList.remove('active');
        this.classList.remove('active');
        document.body.classList.remove('no-scroll');
        if (navToggle) {
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.querySelector('.nav-toggle-icon').innerHTML = '<i class="fas fa-bars"></i>';
            navToggle.style.transform = 'rotate(0deg)';
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && categoryNav.classList.contains('active')) {
            categoryNav.classList.remove('active');
            navOverlay.classList.remove('active');
            document.body.classList.remove('no-scroll');
            if (navToggle) {
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.querySelector('.nav-toggle-icon').innerHTML = '<i class="fas fa-bars"></i>';
                navToggle.style.transform = 'rotate(0deg)';
            }
        }
    });
    
    const categoryLinks = document.querySelectorAll('.category-nav-link:not(.dropdown-toggle)');
    categoryLinks.forEach(link => {
        link.addEventListener('click', function() {
            categoryNav.classList.remove('active');
            navOverlay.classList.remove('active');
            document.body.classList.remove('no-scroll');
            if (navToggle) {
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.querySelector('.nav-toggle-icon').innerHTML = '<i class="fas fa-bars"></i>';
                navToggle.style.transform = 'rotate(0deg)';
            }
        });
    });
}

function initDropdowns() {
    const dropdowns = document.querySelectorAll(".header-actions .dropdown");

    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector(".dropdown-toggle");

        if (!toggle) return;

        toggle.addEventListener("click", function (e) {
            e.stopPropagation();

            // Close other dropdowns with animation
            dropdowns.forEach(d => {
                if (d !== dropdown && d.classList.contains('open')) {
                    d.classList.remove("open");
                    const btn = d.querySelector(".dropdown-toggle");
                    if (btn) btn.setAttribute("aria-expanded", "false");
                }
            });

            const isOpen = dropdown.classList.toggle("open");
            toggle.setAttribute("aria-expanded", isOpen);
            
            if (isOpen) {
                toggle.style.transform = 'rotate(180deg)';
            } else {
                toggle.style.transform = 'rotate(0deg)';
            }
        });
    });

    // Close dropdowns on document click
    document.addEventListener("click", function (e) {
        // Don't close if clicking inside a dropdown
        if (!e.target.closest('.dropdown')) {
            dropdowns.forEach(d => {
                if (d.classList.contains('open')) {
                    d.classList.remove("open");
                    const btn = d.querySelector(".dropdown-toggle");
                    if (btn) {
                        btn.setAttribute("aria-expanded", "false");
                        btn.style.transform = 'rotate(0deg)';
                    }
                }
            });
        }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            dropdowns.forEach(d => {
                d.classList.remove("open");
                const btn = d.querySelector(".dropdown-toggle");
                if (btn) {
                    btn.setAttribute("aria-expanded", "false");
                    btn.style.transform = 'rotate(0deg)';
                }
            });
        }
    });
}

function initCategoryNavDropdowns() {
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const parentItem = this.closest('.category-nav-item');
            const dropdown = this.nextElementSibling;
            
            if (!parentItem || !dropdown) return;
            
            document.querySelectorAll('.category-nav-dropdown.active').forEach(openDropdown => {
                if (openDropdown !== dropdown) {
                    openDropdown.classList.remove('active');
                    openDropdown.closest('.category-nav-item').classList.remove('active');
                    openDropdown.previousElementSibling.setAttribute('aria-expanded', 'false');
                }
            });
            
            parentItem.classList.toggle('active');
            dropdown.classList.toggle('active');
            
            const isExpanded = dropdown.classList.contains('active');
            this.setAttribute('aria-expanded', isExpanded);
        });
    });
    
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.category-nav-item.has-dropdown')) {
            document.querySelectorAll('.category-nav-dropdown.active').forEach(dropdown => {
                dropdown.classList.remove('active');
                dropdown.closest('.category-nav-item').classList.remove('active');
                dropdown.previousElementSibling.setAttribute('aria-expanded', 'false');
            });
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.category-nav-dropdown.active').forEach(dropdown => {
                dropdown.classList.remove('active');
                dropdown.closest('.category-nav-item').classList.remove('active');
                dropdown.previousElementSibling.setAttribute('aria-expanded', 'false');
            });
        }
    });
    
    const navLinks = document.querySelectorAll('.category-nav-link:not(.dropdown-toggle)');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            const categoryNav = document.getElementById('categoryNav');
            const navOverlay = document.querySelector('.nav-overlay');
            
            if (categoryNav && navOverlay) {
                categoryNav.classList.remove('active');
                navOverlay.classList.remove('active');
                document.body.classList.remove('no-scroll');
                
                document.querySelectorAll('.category-nav-dropdown.active').forEach(dropdown => {
                    dropdown.classList.remove('active');
                    dropdown.closest('.category-nav-item').classList.remove('active');
                });
                
                const navToggle = document.getElementById('navToggle');
                if (navToggle) {
                    navToggle.setAttribute('aria-expanded', 'false');
                    const icon = navToggle.querySelector('.nav-toggle-icon');
                    if (icon) icon.innerHTML = '<i class="fas fa-bars"></i>';
                }
            }
        });
    });
}

function showToast(title, message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-header">
            <strong>${title}</strong>
            <button class="toast-close" aria-label="Close notification">&times;</button>
        </div>
        <div class="toast-body">${message}</div>
    `;
    
    document.body.appendChild(toast);
    
    // Add inline keyframes for ripple animation
    if (!document.getElementById('ripple-style')) {
        const style = document.createElement('style');
        style.id = 'ripple-style';
        style.textContent = `
            @keyframes ripple-animation {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Trigger animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Auto-close animation
    const timeoutId = setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%) scale(0.9)';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 5000);
    
    // Close button functionality
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
        clearTimeout(timeoutId);
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%) scale(0.9)';
        setTimeout(() => {
            toast.remove();
        }, 300);
    });
    
    // Pause auto-close on hover
    toast.addEventListener('mouseenter', () => {
        clearTimeout(timeoutId);
    });
}

function addPulseAnimation() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
        .pulse {
            animation: pulse 1s infinite;
        }
    `;
    document.head.appendChild(style);
}

addPulseAnimation();
