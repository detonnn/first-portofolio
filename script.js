// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Loading Screen with simulated loading delay
        const loader = document.getElementById('loader');
        if (loader) {
            // Keep loader visible for 2 seconds to simulate loading resources
            setTimeout(() => {
                loader.classList.add('hide');
            }, 2000);
        }

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });

    // Mobile Nav Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        this.classList.toggle('active');
    });

    // Close menu on link click
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Skill bar animation on scroll
    const skillBars = document.querySelectorAll('.skill-progress');
    
    function animateSkillBars() {
        skillBars.forEach(bar => {
            const rect = bar.getBoundingClientRect();
            if (rect.top < window.innerHeight - 50) {
                const width = bar.style.width;
                bar.style.width = '0%';
                setTimeout(() => {
                    bar.style.width = width;
                }, 300);
            }
        });
    }

    // Initial animation after loader
    setTimeout(animateSkillBars, 2500);

    // Re-animate on scroll
    let skillAnimated = false;
    window.addEventListener('scroll', function() {
        if (!skillAnimated) {
            const skillsSection = document.querySelector('.skills');
            const rect = skillsSection.getBoundingClientRect();
            if (rect.top < window.innerHeight - 100) {
                animateSkillBars();
                skillAnimated = true;
            }
        }
    });

    // Contact Form
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const btn = this.querySelector('button');
        const originalText = btn.textContent;
        btn.textContent = 'Terkirim! ✅';
        btn.style.background = '#4CAF50';
        btn.style.boxShadow = 'none';
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
            btn.style.boxShadow = '';
            this.reset();
        }, 3000);
    });

    // Smooth reveal animation for sections with children staggering
        const sections = document.querySelectorAll('section');
    
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    // If it is the about section, trigger counters
                    if (entry.target.id === 'about') {
                        animateCounters();
                    }
                }
            });
        }, {
            threshold: 0.15
        });

        sections.forEach(section => {
            section.classList.add('reveal-init');
            revealObserver.observe(section);
        });

        // Stat Counter Animation
        function animateCounters() {
            const counters = document.querySelectorAll('.stat-number');
            counters.forEach(counter => {
                if (counter.classList.contains('counted')) return;
                const target = +counter.getAttribute('data-target');
                const duration = 2000; // ms
                const stepTime = Math.max(Math.floor(duration / target), 30);
                let start = 0;
            
                const timer = setInterval(() => {
                    start += 1;
                    if (counter.getAttribute('data-target') === '4') {
                        counter.textContent = start;
                    } else {
                        counter.textContent = start + '+';
                    }
                
                    if (start >= target) {
                        clearInterval(timer);
                        counter.classList.add('counted');
                    }
                }, stepTime);
            });
        }

    // Show hero with a smooth delay after the loader fades out
        const hero = document.querySelector('.hero');
        if (hero) {
            // Set initial state
            hero.style.opacity = '0';
            hero.style.transform = 'translateY(30px)';
            hero.style.transition = 'opacity 1.2s cubic-bezier(0.25, 1, 0.5, 1), transform 1.2s cubic-bezier(0.25, 1, 0.5, 1)';
        
            // Animate after loader starts fading (2.2s delay)
            setTimeout(() => {
                hero.style.opacity = '1';
                hero.style.transform = 'translateY(0)';
            }, 2200);
        }
});