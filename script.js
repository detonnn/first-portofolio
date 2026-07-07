document.addEventListener('DOMContentLoaded', function() {
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        smoothTouch: false
    });

    // ==========================================
    // JANTUNG PENDETEKSI SCROLL (DI-TUNING HALUS)
    // ==========================================
    window.lenis = lenis; 
    window.targetVelocity = 0;
    window.currentVelocity = 0;
    window.scrollVelocity = 0;

    lenis.on('scroll', (e) => {
        // Pengali dikecilkan jadi 0.6 biar gak over-sensitive/terlalu kencang
        window.targetVelocity = e.velocity * 0.6; 
    });
    // ==========================================

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
    const tickSound = document.getElementById('tickSound');
    
    if (tickSound) tickSound.volume = 0.2; 

    counters.forEach(counter => {
        if (counter.classList.contains('counting')) return;

        counter.classList.add('counting');
        const target = +counter.getAttribute('data-target');
        const duration = 1500;
        const stepTime = Math.max(Math.floor(duration / target), 30);
        let start = 0;

        const timer = setInterval(() => {
            start += 1;
            
            if (tickSound) {
                tickSound.currentTime = 0;
                tickSound.play().catch(e => {});
            }

            counter.textContent = (counter.getAttribute('data-target') === '4') ? start : start + '+';

            if (start >= target) {
                clearInterval(timer);
                counter.classList.remove('counting');
                
                if (tickSound) {
                    tickSound.pause();
                    tickSound.currentTime = 0;
                }
            }
        }, stepTime);

        counter.dataset.timer = timer;
    });
}

const aboutBox = document.querySelector('.about-text');
if (aboutBox) {
    const tickSound = document.getElementById('tickSound');

    aboutBox.addEventListener('mouseenter', function() {
        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            counter.classList.remove('counted');
        });
        animateCounters();
    });

    aboutBox.addEventListener('mouseleave', function() {
        const counters = document.querySelectorAll('.stat-number');
        const tickSound = document.getElementById('tickSound');
        
        counters.forEach(counter => {
            clearInterval(counter.dataset.timer);
            counter.classList.remove('counting');
        });
        
        if (tickSound) {
            tickSound.pause();
            tickSound.currentTime = 0;
        }
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

document.addEventListener('DOMContentLoaded', () => {
    const hoverSoundElement = document.getElementById('hoverSound');
    if (!hoverSoundElement) return;

    let audioCtx = null;
    let audioBuffer = null;
    let isAudioReady = false;
    const volumeValue = 0.3;
    let pendingPlays = [];

    async function preloadHoverSound() {
        try {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const response = await fetch(hoverSoundElement.src);
            const arrayBuffer = await response.arrayBuffer();
            audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
            isAudioReady = true;
            console.log('[hov Sound] Siap diputar');

            while (pendingPlays.length) {
                const fn = pendingPlays.shift();
                fn();
            }
        } catch (err) {
            console.error('[hov Sound] Gagal preload:', err);
        }
    }

    preloadHoverSound();

    function playHoverSound() {
        if (!isAudioReady || !audioCtx || !audioBuffer) {
            pendingPlays.push(() => playHoverSound());
            return;
        }

        if (audioCtx.state === 'suspended') {
            audioCtx.resume().then(() => {
                executePlay();
            }).catch(() => {});
            return;
        }

        executePlay();
    }

    function executePlay() {
        if (!audioCtx || audioCtx.state !== 'running') return;
        const source = audioCtx.createBufferSource();
        const gain = audioCtx.createGain();
        gain.gain.value = volumeValue;
        source.buffer = audioBuffer;
        source.connect(gain);
        gain.connect(audioCtx.destination);
        source.start(0);
    }

    const HOVER_SELECTORS = [
        '.skill-card',
        '.project-card',
        '.hero-buttons .btn',
        '.hero-social a',
        '.profile-wrapper'
    ].join(', ');

    document.querySelectorAll(HOVER_SELECTORS).forEach(el => {
        el.removeEventListener('mouseenter', playHoverSound);
        el.addEventListener('mouseenter', playHoverSound);
    });

    let warmupDone = false;
    function warmupAudioContext() {
        if (warmupDone) return;
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume().then(() => {
                while (pendingPlays.length && isAudioReady) {
                    const fn = pendingPlays.shift();
                    fn();
                }
            }).catch(() => {});
        }
        warmupDone = true;
        ['mousemove', 'click', 'touchstart', 'scroll', 'keydown'].forEach(evt => {
            document.removeEventListener(evt, warmupAudioContext);
        });
    }

    const warmupEvents = ['mousemove', 'click', 'touchstart', 'scroll', 'keydown'];
    warmupEvents.forEach(evt => {
        document.addEventListener(evt, warmupAudioContext, { passive: true, once: false });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const bgMusic = document.getElementById('bgMusic');
    const musicToggle = document.getElementById('musicToggle');
    const volumeSlider = document.getElementById('volumeSlider');

    if (!bgMusic || !musicToggle || !volumeSlider) return;

    bgMusic.volume = volumeSlider.value;

    let musicUnlocked = false;
    const startMusicOnInteraction = () => {
        if (musicUnlocked) return;
        bgMusic.play().then(() => {
            musicUnlocked = true;
            removeUnlockListeners();
        }).catch(() => {});
    };
    const unlockEvents = ['click', 'mousemove', 'scroll', 'touchstart', 'keydown'];
    function removeUnlockListeners() {
        unlockEvents.forEach(evt => document.removeEventListener(evt, startMusicOnInteraction));
    }
    unlockEvents.forEach(evt => {
        document.addEventListener(evt, startMusicOnInteraction, { passive: true });
    });

    musicToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        
        if (bgMusic.muted) {
            bgMusic.muted = false;
            musicToggle.classList.remove('muted');
            musicToggle.innerHTML = '<i class="fas fa-music"></i>';
            volumeSlider.value = bgMusic.volume;
        } else {
            bgMusic.muted = true;
            musicToggle.classList.add('muted');
            musicToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
            volumeSlider.value = 0;
        }
    });

    volumeSlider.addEventListener('input', (e) => {
        const targetVolume = parseFloat(e.target.value);
        bgMusic.volume = targetVolume;

        if (targetVolume === 0) {
            bgMusic.muted = true;
            musicToggle.classList.add('muted');
            musicToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
        } else {
            bgMusic.muted = false;
            musicToggle.classList.remove('muted');
            musicToggle.innerHTML = '<i class="fas fa-music"></i>';
        }
    });

    const navbar = document.querySelector('.navbar');
    const navCat = document.getElementById('navCat');

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
            if (navCat) {
                navCat.classList.add('visible');
            }
        } else {
            navbar.classList.remove('scrolled');
            if (navCat) {
                navCat.classList.remove('visible');
            }
        }
    });

    const navLogo = document.querySelector('.nav-logo');
    const contactLink = document.querySelector('.nav-menu a[href="#contact"]');
    const navbarContainer = document.querySelector('.nav-container');

    if (navCat && navLogo && contactLink && navbarContainer) {
        let currentX = 0;
        let direction = 1; 
        const speed = 1.5; 

        function animateNavCat() {
            const containerRect = navbarContainer.getBoundingClientRect();
            const minX = navLogo.getBoundingClientRect().left - containerRect.left;
            const maxX = contactLink.getBoundingClientRect().left - containerRect.left;

            if (currentX <= 0) {
                currentX = minX || 10; 
            }

            currentX += speed * direction;

            if (currentX >= maxX && direction === 1) {
                direction = -1;
                navCat.style.transform = `translateX(${currentX}px) scaleX(-1)`;
            } 
            else if (currentX <= minX && direction === -1) {
                direction = 1;
                navCat.style.transform = `translateX(${currentX}px) scaleX(1)`;
            } 
            else {
                navCat.style.transform = `translateX(${currentX}px) scaleX(${direction === 1 ? 1 : -1})`;
            }

            requestAnimationFrame(animateNavCat);
        }

        animateNavCat();
    }

    try {
        const leftToggleBtn = document.getElementById('leftPlayerToggle');
        const leftPlayerBox = document.querySelector('.left-music-player');
        const playlistItems = Array.from(document.querySelectorAll('#musicPlaylist li'));

        const audioUtama = document.getElementById('bgMusic');
        const teksJudulLaguKanan = document.getElementById('miniTrackTitle');
        const volumeSliderKanan = document.getElementById('volumeSlider');

        const npTitle = document.getElementById('npTitle');
        const npArtist = document.getElementById('npArtist');
        const npPlayPauseBtn = document.getElementById('npPlayPause');
        const npPrevBtn = document.getElementById('npPrev');
        const npNextBtn = document.getElementById('npNext');
        const npProgressBar = document.getElementById('npProgressBar');
        const npProgressFill = document.getElementById('npProgressFill');
        const npCurrentTime = document.getElementById('npCurrentTime');
        const npDuration = document.getElementById('npDuration');
        const npVolumeSlider = document.getElementById('npVolumeSlider');

        if (!audioUtama || playlistItems.length === 0) throw new Error('Elemen musik tidak lengkap');

        let currentIndex = playlistItems.findIndex(li => li.classList.contains('active'));
        if (currentIndex === -1) currentIndex = 0;

        function formatTime(seconds) {
            if (!isFinite(seconds) || isNaN(seconds) || seconds < 0) return '0:00';
            const m = Math.floor(seconds / 60);
            const s = Math.floor(seconds % 60);
            return `${m}:${s < 10 ? '0' : ''}${s}`;
        }

        function updatePlayIcon(isPlaying) {
            if (npPlayPauseBtn) {
                const icon = npPlayPauseBtn.querySelector('i');
                if (icon) {
                    icon.classList.toggle('fa-pause', isPlaying);
                    icon.classList.toggle('fa-play', !isPlaying);
                }
            }
            if (leftPlayerBox) leftPlayerBox.classList.toggle('paused', !isPlaying);
        }

        function loadTrack(index, autoplay = true) {
            const item = playlistItems[index];
            if (!item) return;
            currentIndex = index;

            const src = item.getAttribute('data-src');
            const title = item.getAttribute('data-title') || item.textContent.trim();
            const artist = item.getAttribute('data-artist') || '';

            playlistItems.forEach(li => li.classList.remove('active'));
            item.classList.add('active');

            audioUtama.src = src;

            if (npTitle) npTitle.textContent = title;
            if (npArtist) npArtist.textContent = artist;
            if (teksJudulLaguKanan) teksJudulLaguKanan.textContent = artist ? `${title} - ${artist}` : title;
            if (npProgressFill) npProgressFill.style.width = '0%';
            if (npCurrentTime) npCurrentTime.textContent = '0:00';
            if (npDuration) npDuration.textContent = '-0:00';

            if (autoplay) {
                audioUtama.play().catch(err => console.log('Gagal play:', err));
            }
        }

        if (leftToggleBtn && leftPlayerBox) {
            leftToggleBtn.addEventListener('click', () => {
                leftPlayerBox.classList.toggle('open');
            });
        }

        playlistItems.forEach((item, index) => {
            item.addEventListener('click', () => loadTrack(index, true));
        });

        if (npPlayPauseBtn) {
            npPlayPauseBtn.addEventListener('click', () => {
                if (audioUtama.paused) {
                    audioUtama.play().catch(err => console.log('Gagal play:', err));
                } else {
                    audioUtama.pause();
                }
            });
        }

        if (npPrevBtn) {
            npPrevBtn.addEventListener('click', () => {
                const newIndex = (currentIndex - 1 + playlistItems.length) % playlistItems.length;
                loadTrack(newIndex, true);
            });
        }
        if (npNextBtn) {
            navNextBtn = npNextBtn; 
            navNextBtn.addEventListener('click', () => {
                const newIndex = (currentIndex + 1) % playlistItems.length;
                loadTrack(newIndex, true);
            });
        }

        audioUtama.addEventListener('timeupdate', () => {
            if (!audioUtama.duration) return;
            const percent = (audioUtama.currentTime / audioUtama.duration) * 100;
            if (npProgressFill) npProgressFill.style.width = `${percent}%`;
            if (npCurrentTime) npCurrentTime.textContent = formatTime(audioUtama.currentTime);
            if (npDuration) npDuration.textContent = `-${formatTime(audioUtama.duration - audioUtama.currentTime)}`;
        });

        audioUtama.addEventListener('loadedmetadata', () => {
            if (npDuration) npDuration.textContent = `-${formatTime(audioUtama.duration)}`;
        });

        audioUtama.addEventListener('play', () => updatePlayIcon(true));
        audioUtama.addEventListener('pause', () => updatePlayIcon(false));

        audioUtama.addEventListener('ended', () => {
            const newIndex = (currentIndex + 1) % playlistItems.length;
            loadTrack(newIndex, true);
        });

        if (npProgressBar) {
            npProgressBar.addEventListener('click', (e) => {
                if (!audioUtama.duration) return;
                const rect = npProgressBar.getBoundingClientRect();
                const percent = (e.clientX - rect.left) / rect.width;
                audioUtama.currentTime = percent * audioUtama.duration;
            });
        }

        if (npVolumeSlider) {
            npVolumeSlider.value = audioUtama.volume;
            npVolumeSlider.addEventListener('input', (e) => {
                const v = parseFloat(e.target.value);
                audioUtama.volume = v;
                audioUtama.muted = v === 0;
                if (volumeSliderKanan) volumeSliderKanan.value = v;
            });
        }
        if (volumeSliderKanan && npVolumeSlider) {
            volumeSliderKanan.addEventListener('input', () => {
                npVolumeSlider.value = volumeSliderKanan.value;
            });
        }

        loadTrack(currentIndex, false);

    } catch (error) {
        console.error("Ada masalah di script music player:", error);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const commentForm = document.getElementById('commentForm');
    const commentsList = document.getElementById('commentsList');

    if (commentForm && commentsList) {
        commentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nameInput = document.getElementById('commentName');
            const textInput = document.getElementById('commentText');
            
            const name = nameInput.value.trim();
            const text = textInput.value.trim();
            
            if (name && text) {
                const commentCard = document.createElement('div');
                commentCard.className = 'comment-card';
                
                commentCard.innerHTML = `
                    <div class="comment-avatar"><i class="fas fa-user-astronaut"></i></div>
                    <div class="comment-body">
                        <h4>${name}</h4>
                        <p>${text}</p>
                        <span class="comment-time">Baru saja</span>
                    </div>
                `;
                
                commentsList.insertBefore(commentCard, commentsList.firstChild);
                this.reset();
                
                const btn = this.querySelector('button');
                const originalHTML = btn.innerHTML;
                
                btn.innerHTML = 'Komentar Terkirim! <i class="fas fa-check-circle"></i>';
                btn.style.backgroundColor = '#4CAF50';
                btn.style.color = '#fff';
                btn.style.borderColor = '#4CAF50';
                
                setTimeout(() => {
                    btn.innerHTML = originalHTML;
                    btn.style = '';
                }, 3000);
            }
        });
    
        // ======================================================================
        // EFFECT PARTICLES LEAVES (RE-TUNED: ELEGANT, FEWER, LARGER & CINEMATIC)
        // ======================================================================
        (function () {
            const canvasBack = document.getElementById('particleCanvas');
            const canvasFront = document.getElementById('particleCanvasFront');
            if (!canvasBack) return;

            const ctxBack = canvasBack.getContext('2d');
            const ctxFront = canvasFront ? canvasFront.getContext('2d') : null;

            let backParticles = [];
            let frontParticles = [];

            function setAllCanvasSizes() {
                canvasBack.width = window.innerWidth;
                canvasBack.height = window.innerHeight;
                if (canvasFront) {
                    canvasFront.width = window.innerWidth;
                    canvasFront.height = window.innerHeight;
                }
            }
            setAllCanvasSizes();
            window.addEventListener('resize', setAllCanvasSizes);

            class Particle {
                constructor(canvas, options) {
                    this.canvas = canvas;
                    this.x = Math.random() * canvas.width;
                    this.y = Math.random() * canvas.height;

                    this.baseSize = options.baseSize || 10; 
                    this.size = this.baseSize;
                    
                    const baseSpeed = (Math.random() * options.speedRange) + options.minSpeed;
                    const randomAngle = Math.random() * Math.PI * 2;
                    this.vx = Math.cos(randomAngle) * baseSpeed;
                    this.vy = Math.sin(randomAngle) * baseSpeed;

                    this.opacity = (Math.random() * options.opacityRange) + options.minOpacity;
                    this.glow = options.glow || 0;
                    this.noiseSeed = Math.random() * 100;

                    this.angle = Math.random() * Math.PI * 2;
                    this.spinSpeed = (Math.random() * 0.02 - 0.01);
                }

                update() {
                    // 1. Gerakan melayang ambient biasa pas diam (super santai)
                    this.x += this.vx;
                    this.y += this.vy;
                    this.angle += this.spinSpeed;

                    // 2. Respon Interaksi Kecepatan Scroll (Capped & Lembut)
                    if (window.scrollVelocity) {
                        const velocity = window.scrollVelocity;
                        
                        // BATASI kecepatan maksimal yang masuk ke perhitungan daun biar gak melesat hilang
                        const cappedVelocity = Math.max(-2.5, Math.min(2.5, velocity));
                        
                        // Tarikan Parallax Vertikal dibuat jauh lebih anggun (di-nerf nilainya)
                        const parallaxFactor = this.baseSize * 0.04; 
                        this.y -= cappedVelocity * parallaxFactor;
                        
                        // Efek liukan horizontal tertiup angin juga diperhalus
                        const swirlStrength = this.baseSize * 0.02;
                        this.x += Math.sin(this.y * 0.005 + this.noiseSeed) * cappedVelocity * swirlStrength;
                    }

                    // Pembatas layar loop agar kembali masuk rapi
                    const padding = this.size * 2 + 40;
                    if (this.y < -padding) this.y = this.canvas.height + padding;
                    if (this.y > this.canvas.height + padding) this.y = -padding;
                    if (this.x < -padding) this.x = this.canvas.width + padding;
                    if (this.x > this.canvas.width + padding) this.x = -padding;
                }

                draw(ctx) {
                    ctx.save();
                    ctx.translate(this.x, this.y);
                    
                    const velocity = window.scrollVelocity || 0;
                    
                    // Batasi efek kemiringan & stretch secara ketat agar daun tidak berubah jadi garis tipis
                    const clampedVelocityForEffect = Math.max(-1.2, Math.min(1.2, velocity));
                    const absVelocityForEffect = Math.abs(clampedVelocityForEffect);

                    if (absVelocityForEffect > 0.02) {
                        const windTilt = clampedVelocityForEffect * 0.15 + Math.sin(this.y * 0.005 + this.noiseSeed) * 0.2;
                        ctx.rotate(this.angle + windTilt);
                        
                        // Stretch factor maksimal cuma melebar proporsional sedikit (~1.18x), daun tetap solid berbentuk daun!
                        const stretchFactor = 1 + (absVelocityForEffect * 0.15); 
                        ctx.scale(stretchFactor, 1 / Math.sqrt(stretchFactor));
                    } else {
                        ctx.rotate(this.angle);
                    }

                    if (this.glow > 0) {
                        ctx.shadowBlur = this.glow;
                        ctx.shadowColor = `rgba(255, 255, 255, ${this.opacity * 0.6})`;
                    }

                    // Bentuk Geometri Daun Premium yang Berbobot
                    ctx.beginPath();
                    ctx.moveTo(-this.size, 0); 
                    ctx.quadraticCurveTo(0, -this.size * 0.48, this.size, 0); 
                    ctx.quadraticCurveTo(0, this.size * 0.48, -this.size, 0);  
                    
                    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
                    ctx.fill();
                    ctx.restore();
                }
            }

            // Daun Latar Belakang (DIPERDIKIT: Cuma 12, Anggun & Bersih)
            function initBackParticles() {
                backParticles = [];
                const count = 12; 
                for (let i = 0; i < count; i++) {
                    backParticles.push(new Particle(canvasBack, {
                        baseSize: Math.random() * 4 + 7, // 7px - 11px
                        speedRange: 0.2,
                        minSpeed: 0.05,
                        opacityRange: 0.15,
                        minOpacity: 0.1,
                        glow: 0
                    }));
                }
            }

            // Daun Latar Depan (DIPERDIKIT & DIPERBESAR EKSTREM: Cuma 5 Biji, Kelihatan Mewah)
            function initFrontParticles() {
                frontParticles = [];
                if (!canvasFront) return;
                const count = 5; 
                for (let i = 0; i < count; i++) {
                    frontParticles.push(new Particle(canvasFront, {
                        baseSize: Math.random() * 10 + 16, // Ukuran di-boost besar biar keliatan enak (16px - 26px)
                        speedRange: 0.15,
                        minSpeed: 0.04,
                        opacityRange: 0.25,
                        minOpacity: 0.2,
                        glow: 12 // Efek glow premium di depan hero section
                    }));
                }
            }
            
            initBackParticles();
            initFrontParticles();

            function animateParticles() {
                // LOGIK SMOOTHING VELOCITY (Meredam hentakan scroll kasar)
                const target = window.targetVelocity || 0;
                const current = window.currentVelocity || 0;
                
                const lerpFactor = Math.abs(target) > Math.abs(current) ? 0.15 : 0.04;
                window.currentVelocity += (target - current) * lerpFactor;
                window.scrollVelocity = window.currentVelocity;

                window.targetVelocity *= 0.92; // Redam target secara perlahan

                ctxBack.clearRect(0, 0, canvasBack.width, canvasBack.height);
                if (ctxFront) {
                    ctxFront.clearRect(0, 0, canvasFront.width, canvasFront.height);
                }

                for (let p of backParticles) {
                    p.update();
                    p.draw(ctxBack);
                }

                for (let p of frontParticles) {
                    p.update();
                    p.draw(ctxFront);
                }

                requestAnimationFrame(animateParticles);
            }
            animateParticles();
        })();
    }
});