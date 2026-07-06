document.addEventListener('DOMContentLoaded', function() {
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        smoothTouch: false
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                lenis.scrollTo(target, {
                    offset: -80,
                    duration: 1.2
                });
            }
            this.blur();
        });
    });

    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hide');
        }, 2000);
    }

    const cursorFollower = document.querySelector('.cursor-follower');
    let cursorX = 0;
    let cursorY = 0;
    let followerX = 0;
    let followerY = 0;
    let animationFrameId;

    function updateCursorPosition(e) {
        cursorX = e.clientX;
        cursorY = e.clientY;
    }

    function animateCursorFollower() {
        const lerpFactor = 0.15;
        followerX += (cursorX - followerX) * lerpFactor;
        followerY += (cursorY - followerY) * lerpFactor;

        if (cursorFollower) {
            cursorFollower.style.transform = `translate(${followerX - cursorFollower.offsetWidth / 2}px, ${followerY - cursorFollower.offsetHeight / 2}px)`;
        }

        animationFrameId = requestAnimationFrame(animateCursorFollower);
    }

    if (!('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
        window.addEventListener('mousemove', updateCursorPosition);
        animationFrameId = requestAnimationFrame(animateCursorFollower);

        document.addEventListener('mouseenter', () => {
            if (cursorFollower) cursorFollower.style.opacity = '1';
        });

        document.addEventListener('mouseleave', () => {
            if (cursorFollower) cursorFollower.style.opacity = '0';
        });
    } else {
        if (cursorFollower) {
            cursorFollower.style.display = 'none';
        }
    }

    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        this.classList.toggle('active');
    });

    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

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

    setTimeout(animateSkillBars, 2500);

    let skillAnimated = false;
    window.addEventListener('scroll', function() {
        if (!skillAnimated) {
            const skillsSection = document.querySelector('.skills');
            if (skillsSection) {
                const rect = skillsSection.getBoundingClientRect();
                if (rect.top < window.innerHeight - 100) {
                    animateSkillBars();
                    skillAnimated = true;
                }
            }
        }
    });

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
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
    }

    const sections = document.querySelectorAll('section');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                if (entry.target.id === 'about') {
                    animateCounters();
                }
            }
        });
    }, { threshold: 0.15 });

    sections.forEach(section => {
        section.classList.add('reveal-init');
        revealObserver.observe(section);
    });

    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            if (counter.classList.contains('counting')) return;

            counter.classList.add('counting');
            const target = +counter.getAttribute('data-target');
            const duration = 1500;
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
                    counter.classList.remove('counting');
                    counter.classList.add('counted');
                }
            }, stepTime);
        });
    }

    const aboutBox = document.querySelector('.about-text');
    if (aboutBox) {
        aboutBox.addEventListener('mouseenter', function() {
            const counters = document.querySelectorAll('.stat-number');
            counters.forEach(counter => {
                counter.classList.remove('counted');
            });
            animateCounters();
        });
    }

    const menuLinks = document.querySelectorAll('.nav-menu a');
    const sectionsToWatch = document.querySelectorAll('section[id]');
    const indicator = document.querySelector('.nav-indicator');

    function moveIndicator(activeLink) {
        if (!activeLink || !indicator) return;

        const leftPos = activeLink.offsetLeft;
        const topPos = activeLink.offsetTop;
        const width = activeLink.offsetWidth;
        const height = activeLink.offsetHeight;

        indicator.style.width = `${width}px`;
        indicator.style.height = `${height}px`;
        indicator.style.left = `${leftPos}px`;
        indicator.style.top = `${topPos}px`;
    }

    const observerOptions = {
        root: null,
        rootMargin: '-30% 0px -50% 0px',
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');

                menuLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${activeId}`) {
                        link.classList.add('active');
                        moveIndicator(link);
                    }
                });
            }
        });
    }, observerOptions);

    sectionsToWatch.forEach(section => {
        sectionObserver.observe(section);
    });

    window.addEventListener('resize', () => {
        const activeLink = document.querySelector('.nav-menu a.active');
        if (activeLink) moveIndicator(activeLink);
    });

    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.opacity = '0';
        hero.style.transform = 'translateY(30px)';
        hero.style.transition = 'opacity 1.2s cubic-bezier(0.25, 1, 0.5, 1), transform 1.2s cubic-bezier(0.25, 1, 0.5, 1)';

        setTimeout(() => {
            hero.style.opacity = '1';
            hero.style.transform = 'translateY(0)';
        }, 2200);
    }
});
