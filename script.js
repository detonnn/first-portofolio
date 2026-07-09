// ================================================================
// SATU-SATUNYA DOMContentLoaded - GABUNGAN SEMUA EVENT
// ================================================================
document.addEventListener('DOMContentLoaded', function() {

    console.log('[PORTAL] DOM siap, memuat semua modul...');

// ================================================================
// 1. LOADER & TOMBOL ENTER (VERSI ANTI-DELAY & ANTI-BLOKIR BRAVE)
// ================================================================
const loader = document.getElementById('loader');
const enterBtn = document.getElementById('enterBtn');

// Flag global: true setelah user klik Enter. Sebelum ini, TIDAK ADA sound apapun
// yang boleh keluar (musik, tick counter, dst) kecuali swiperSound di judul loader.
let siteEntered = false;

// Inisialisasi Sound Effect Swiper dengan settingan audio performa tinggi
const swiperSound = new Audio();
swiperSound.src = 'swiper.MP3';
swiperSound.preload = 'auto';
swiperSound.load(); // Paksa Brave untuk langsung download file audio di awal

// Flag untuk memastikan audio sudah siap dan aman diputar
let isAudioUnlocked = false;

// Fungsi untuk membuka kunci audio dari proteksi browser (Cukup dipicu sekali oleh gerakan/klik apapun)
function unlockAudioContext() {
    if (isAudioUnlocked) return;
    
    swiperSound.play()
        .then(() => {
            // Jika berhasil masuk sini, artinya Brave sudah mengizinkan audio berjalan
            swiperSound.pause();
            swiperSound.currentTime = 0;
            isAudioUnlocked = true;
            console.log('[AUDIO] Berhasil di-unlock & siap digunakan!');
            
            // Hapus event penangkap agar hemat memori
            window.removeEventListener('click', unlockAudioContext);
            window.removeEventListener('mousemove', unlockAudioContext);
            window.removeEventListener('touchstart', unlockAudioContext);
        })
        .catch(err => {
            console.log('[AUDIO] Menunggu interaksi pertama untuk unlock:', err);
        });
}

// Tangkap interaksi pertama user apa saja (gerak mouse, klik, atau sentuh layar) untuk unlock audio
window.addEventListener('click', unlockAudioContext);
window.addEventListener('mousemove', unlockAudioContext, { once: true });
window.addEventListener('touchstart', unlockAudioContext);


// --- PROSES ANIMASI TEXT MENCAR ---
const loaderTitle = document.querySelector('.loader-title');
if (loaderTitle) {
    loaderTitle.innerHTML = loaderTitle.textContent
        .split('')
        .map(char => char === ' ' ? '<span class="space">&nbsp;</span>' : `<span>${char}</span>`)
        .join('');

    const spans = loaderTitle.querySelectorAll('span');

    loaderTitle.addEventListener('mouseenter', () => {
        // Mainkan sound effect (Aman dari delay karena sudah di-load dan di-unlock di awal)
        swiperSound.currentTime = 0; 
        swiperSound.play().catch(err => console.log('[AUDIO] Gagal putar karena aturan browser:', err));

        const shardData = [];
        spans.forEach((span, index) => {
            if (span.classList.contains('space')) return;

            const tx = Math.random() * 300 - 150;
            const ty = Math.random() * 200 - 100;
            const tz = Math.random() * 200 - 50;
            const rx = Math.random() * 100 - 50;
            const ry = Math.random() * 100 - 50;
            const rz = Math.random() * 100 - 50;

            const speedX = (Math.random() * 0.15 - 0.075);
            const speedY = (Math.random() * 0.15 - 0.075);
            const speedZ = (Math.random() * 0.15 - 0.075);
            const rotSpeedX = (Math.random() * 0.05 - 0.025);
            const rotSpeedY = (Math.random() * 0.05 - 0.025);
            const rotSpeedZ = (Math.random() * 0.05 - 0.025);
            const delay = index * 25; // Delay ripple antar-huruf agar sinematik

            shardData.push({
                element: span,
                currentX: 0, currentY: 0, currentZ: 0,
                currentRX: 0, currentRY: 0, currentRZ: 0,
                targetX: tx, targetY: ty, targetZ: tz,
                targetRX: rx, targetRY: ry, targetRZ: rz,
                speedX, speedY, speedZ,
                rotSpeedX, rotSpeedY, rotSpeedZ,
                delay, exploded: false, startTime: null
            });
        });

        loaderTitle.classList.add('shattered');
        const explosionStartTime = performance.now();

        function animateShatter(timestamp) {
            shardData.forEach(shard => {
                const elapsed = timestamp - explosionStartTime;
                if (elapsed >= shard.delay) {
                    if (!shard.startTime) shard.startTime = timestamp;
                    const progressTime = timestamp - shard.startTime;

                    if (!shard.exploded) {
                        const duration = 1200; // Durasi sinkron penuh dengan sound swiper (1.2 detik)
                        const t = Math.min(progressTime / duration, 1);
                        const ease = 1 - Math.pow(1 - t, 4);

                        shard.currentX = shard.targetX * ease;
                        shard.currentY = shard.targetY * ease;
                        shard.currentZ = shard.targetZ * ease;
                        shard.currentRX = shard.targetRX * ease;
                        shard.currentRY = shard.targetRY * ease;
                        shard.currentRZ = shard.targetRZ * ease;

                        if (t === 1) shard.exploded = true;
                    } else {
                        shard.currentX += shard.speedX;
                        shard.currentY += shard.speedY;
                        shard.currentZ += shard.speedZ;
                        shard.currentRX += shard.rotSpeedX;
                        shard.currentRY += shard.rotSpeedY;
                        shard.currentRZ += shard.rotSpeedZ;
                    }

                    shard.element.style.transform = `
                        translate3d(${shard.currentX}px, ${shard.currentY}px, ${shard.currentZ}px)
                        rotateX(${shard.currentRX}deg)
                        rotateY(${shard.currentRY}deg)
                        rotateZ(${shard.currentRZ}deg)
                    `;
                    shard.element.style.opacity = '0.85';
                }
            });
            requestAnimationFrame(animateShatter);
        }
        requestAnimationFrame(animateShatter);
    }, { once: true });
}

function hideLoader() {
    if (!loader) return;
    // ... sisa kode hideLoader kamu ...
    // ... sisa kode hideLoader kamu ...
        loader.classList.add('hide');
        console.log('[LOADER] Tersembunyi!');

        // Trigger animasi hero setelah loader hilang
        const hero = document.querySelector('.hero');
        if (hero) {
            setTimeout(() => {
                hero.style.opacity = '1';
                hero.style.transform = 'translateY(0)';
            }, 900);
        }
    }

    if (enterBtn) {
    enterBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();

        // Tandai user sudah masuk ke situs, baru dari sini sound lain boleh keluar
        siteEntered = true;

        // Mainkan sound enter.MP3 begitu tombol Enter ditekan
        new Audio('enter.MP3').play().catch(err => console.log('[AUDIO] Enter sound error:', err));

        // 2. KUNCI UTAMA: Putar musik utama SEGERA tanpa delay saat klik enter
        if (typeof startMusicAfterEnter === 'function') {
            startMusicAfterEnter();
        }

        // 3. Panggil fungsi bawaan template kamu untuk nutup loader
        if (typeof hideLoader === 'function') {
            hideLoader();
        }
    });

    // Fallback: Tekan tombol Enter di keyboard
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && loader && !loader.classList.contains('hide')) {
            e.preventDefault();
            hideLoader();
        }
    });

    console.log('[LOADER] Event listener tombol enter terpasang.');
} else {
    console.warn('[LOADER] Tombol enter tidak ditemukan!');
}

    // ================================================================
    // 2. LENIS SMOOTH SCROLL (DIBUNGKUS TRY-CATCH)
    // ================================================================
    try {
        if (typeof Lenis !== 'undefined') {
            const lenis = new Lenis({
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                orientation: 'vertical',
                smoothWheel: true,
                wheelMultiplier: 0.8,
                touchMultiplier: 1.2,
            });

            window.lenis = lenis;
            window.targetVelocity = 0;
            window.currentVelocity = 0;
            window.scrollVelocity = 0;

            lenis.on('scroll', (e) => {
                window.targetVelocity = e.velocity * 0.6;
            });

            function raf(time) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }
            requestAnimationFrame(raf);

            // Smooth scroll untuk anchor links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
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

            console.log('[LENIS] Smooth scroll berhasil diinisialisasi.');
        } else {
            console.warn('[LENIS] Library tidak ditemukan, gunakan fallback native scroll.');
        }
    } catch (error) {
        console.warn('[LENIS] Error inisialisasi (dilewati):', error.message);
    }

    // ================================================================
    // 3. CURSOR FOLLOWER
    // ================================================================
    const cursorFollower = document.querySelector('.cursor-follower');
    let cursorX = 0, cursorY = 0, followerX = 0, followerY = 0;
    let animFrameId = null;

    function updateCursor(e) {
        cursorX = e.clientX;
        cursorY = e.clientY;
    }

    function animateFollower() {
        const lerp = 0.15;
        followerX += (cursorX - followerX) * lerp;
        followerY += (cursorY - followerY) * lerp;

        if (cursorFollower) {
            cursorFollower.style.transform =
                `translate(${followerX - cursorFollower.offsetWidth/2}px, ${followerY - cursorFollower.offsetHeight/2}px)`;
        }
        animFrameId = requestAnimationFrame(animateFollower);
    }

    if (!('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
        window.addEventListener('mousemove', updateCursor);
        animFrameId = requestAnimationFrame(animateFollower);
        document.addEventListener('mouseenter', () => {
            if (cursorFollower) cursorFollower.style.opacity = '1';
        });
        document.addEventListener('mouseleave', () => {
            if (cursorFollower) cursorFollower.style.opacity = '0';
        });
    } else {
        if (cursorFollower) cursorFollower.style.display = 'none';
    }

    // ================================================================
    // 4. NAVBAR SCROLL EFFECT & TOGGLE
    // ================================================================
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;
        navbar.classList.toggle('scrolled', scrollY > 50);
    });

    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    if (navToggle && navMenu) {
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
    }

    // ================================================================
    // 5. SKILL BARS
    // ================================================================
    const skillBars = document.querySelectorAll('.skill-progress');
    let skillAnimated = false;

    function animateSkillBars() {
        skillBars.forEach(bar => {
            const rect = bar.getBoundingClientRect();
            if (rect.top < window.innerHeight - 50) {
                const width = bar.style.width;
                bar.style.width = '0%';
                setTimeout(() => { bar.style.width = width; }, 300);
            }
        });
    }

    setTimeout(animateSkillBars, 2500);

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

    // ================================================================
    // 6. CONTACT FORM
    // ================================================================
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

    // ================================================================
    // 7. SECTION REVEAL OBSERVER
    // ================================================================
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

    // ================================================================
    // 8. COUNTER ANIMATION
    // ================================================================
    function animateCounters() {
        if (!siteEntered) return; // jangan bunyi sebelum user masuk situs
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
                    tickSound.play().catch(() => {});
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
            document.querySelectorAll('.stat-number').forEach(c => c.classList.remove('counted'));
            animateCounters();
        });
        aboutBox.addEventListener('mouseleave', function() {
            document.querySelectorAll('.stat-number').forEach(counter => {
                clearInterval(counter.dataset.timer);
                counter.classList.remove('counting');
            });
            if (tickSound) {
                tickSound.pause();
                tickSound.currentTime = 0;
            }
        });
    }

    // ================================================================
    // 9. NAV INDICATOR
    // ================================================================
    const menuLinks = document.querySelectorAll('.nav-menu a');
    const sectionsToWatch = document.querySelectorAll('section[id]');
    const indicator = document.querySelector('.nav-indicator');

    function moveIndicator(activeLink) {
        if (!activeLink || !indicator) return;
        indicator.style.width = activeLink.offsetWidth + 'px';
        indicator.style.height = activeLink.offsetHeight + 'px';
        indicator.style.left = activeLink.offsetLeft + 'px';
        indicator.style.top = activeLink.offsetTop + 'px';
    }

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                menuLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === '#' + activeId);
                    if (link.classList.contains('active')) moveIndicator(link);
                });
            }
        });
    }, { root: null, rootMargin: '-30% 0px -50% 0px', threshold: 0 });

    sectionsToWatch.forEach(section => sectionObserver.observe(section));

    window.addEventListener('resize', () => {
        const activeLink = document.querySelector('.nav-menu a.active');
        if (activeLink) moveIndicator(activeLink);
    });

    // ================================================================
    // 10. HOVER SOUND (DENGAN AUDIO CONTEXT)
    // ================================================================
    const hoverSoundElement = document.getElementById('hoverSound');
    if (hoverSoundElement) {
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
                console.log('[HOV] Siap diputar');
                while (pendingPlays.length) pendingPlays.shift()();
            } catch (err) {
                console.warn('[HOV] Gagal preload:', err);
            }
        }
        preloadHoverSound();

        function playHoverSound() {
            if (!isAudioReady || !audioCtx || !audioBuffer) {
                pendingPlays.push(() => playHoverSound());
                return;
            }
            if (audioCtx.state === 'suspended') {
                audioCtx.resume().then(executePlay).catch(() => {});
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
            '.skill-card', '.project-card', '.hero-buttons .btn',
            '.hero-social a', '.profile-wrapper'
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
                    while (pendingPlays.length && isAudioReady) pendingPlays.shift()();
                }).catch(() => {});
            }
            warmupDone = true;
            ['mousemove', 'click', 'touchstart', 'scroll', 'keydown'].forEach(evt => {
                document.removeEventListener(evt, warmupAudioContext);
            });
        }
        ['mousemove', 'click', 'touchstart', 'scroll', 'keydown'].forEach(evt => {
            document.addEventListener(evt, warmupAudioContext, { passive: true, once: false });
        });
    }

    // ================================================================
    // 11. MUSIC PLAYER (KANAN & KIRI) + PLAYLIST
    // ================================================================
    (function() {
    const bgMusic = document.getElementById('bgMusic');
    const musicToggle = document.getElementById('musicToggle');
    const volumeSlider = document.getElementById('volumeSlider');

    if (bgMusic && musicToggle && volumeSlider) {
        bgMusic.volume = volumeSlider.value;
        
        // FIX: dulu `musicUnlocked` tidak pernah di-declare, jadi flag ini gagal
        // ke-set true dan listener di bawah TERUS memanggil bgMusic.play()
        // setiap kali user klik/scroll/gerak mouse -> itu sebabnya lagu tidak
        // bisa di-pause dari player kiri (auto-play lagi begitu ada interaksi).
        let musicUnlocked = false;
        const startMusicOnInteraction = () => {
            if (!siteEntered || musicUnlocked || !bgMusic) return; // diam sebelum Enter
            bgMusic.play().then(() => {
                musicUnlocked = true;
                // Setelah berhasil unlock sekali, lepas semua listener supaya
                // interaksi berikutnya (termasuk klik pause) tidak memicu play lagi.
                unlockEvents.forEach(evt => document.removeEventListener(evt, startMusicOnInteraction));
            }).catch(() => {});
        };
        const unlockEvents = ['click', 'mousemove', 'scroll', 'touchstart', 'keydown'];
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
            const val = parseFloat(e.target.value);
            bgMusic.volume = val;
            if (val === 0) {
                bgMusic.muted = true;
                musicToggle.classList.add('muted');
                musicToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
            } else {
                bgMusic.muted = false;
                musicToggle.classList.remove('muted');
                musicToggle.innerHTML = '<i class="fas fa-music"></i>';
            }
        });
    }

    // NavCat walking animation
        const navCat = document.getElementById('navCat');
        const navLogo = document.querySelector('.nav-logo');
        const contactLink = document.querySelector('.nav-menu a[href="#contact"]');
        const navbarContainer = document.querySelector('.nav-container');

        if (navCat && navLogo && contactLink && navbarContainer) {
            let currentX = 0, direction = 1, speed = 1.5;
            function animateNavCat() {
                const containerRect = navbarContainer.getBoundingClientRect();
                const minX = navLogo.getBoundingClientRect().left - containerRect.left;
                const maxX = contactLink.getBoundingClientRect().left - containerRect.left;
                if (currentX <= 0) currentX = minX || 10;
                currentX += speed * direction;
                if (currentX >= maxX && direction === 1) {
                    direction = -1;
                    navCat.style.transform = `translateX(${currentX}px) scaleX(-1)`;
                } else if (currentX <= minX && direction === -1) {
                    direction = 1;
                    navCat.style.transform = `translateX(${currentX}px) scaleX(1)`;
                } else {
                    navCat.style.transform = `translateX(${currentX}px) scaleX(${direction === 1 ? 1 : -1})`;
                }
                requestAnimationFrame(animateNavCat);
            }
            animateNavCat();

            window.addEventListener('scroll', function() {
                const scrollY = window.pageYOffset || document.documentElement.scrollTop;
                navCat.classList.toggle('visible', scrollY > 50);
            });
        }

        // LEFT MUSIC PLAYER (Now Playing Widget)
       // LEFT MUSIC PLAYER (Now Playing Widget)
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
            const npCurrentTime = document.getElementById('npCurrentTime');
            const npDuration = document.getElementById('npDuration');
            const npVolumeSlider = document.getElementById('npVolumeSlider');

            if (!audioUtama || playlistItems.length === 0) throw new Error('Elemen musik tidak lengkap');

            // KODE BARU (FITUR RANDOM PLAYING SAAT MASUK):
// 1. Acak indeks awal saat user pertama kali masuk halaman
let currentIndex = Math.floor(Math.random() * playlistItems.length);

// 2. Atur class 'active' di HTML agar pindah ke lagu yang terpilih secara acak tersebut
playlistItems.forEach(li => li.classList.remove('active'));
if (playlistItems[currentIndex]) {
    playlistItems[currentIndex].classList.add('active');
}
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
                const title = item.getAttribute('data-title') || 'Unknown Title';
                const artist = item.getAttribute('data-artist') || 'Unknown Artist';
                const cover = item.getAttribute('data-cover') || 'default-cover.jpg';

                playlistItems.forEach(li => li.classList.remove('active'));
                item.classList.add('active');

                audioUtama.src = src;

                const coverImg = document.getElementById('npCoverImg');
                if (coverImg) coverImg.src = cover;

                if (npTitle) npTitle.textContent = title;
                if (npArtist) npArtist.textContent = artist;
                if (teksJudulLaguKanan) teksJudulLaguKanan.textContent = artist ? `${title} - ${artist}` : title;
                
                if (npProgressBar) npProgressBar.value = 0; // Fix slider bulatan mereset
                if (npCurrentTime) npCurrentTime.textContent = '0:00';
                if (npDuration) npDuration.textContent = '-0:00';

                if (autoplay) {
                    audioUtama.play().catch(err => console.log('Gagal play:', err));
                }
            }

            if (leftToggleBtn && leftPlayerBox) {
                leftToggleBtn.addEventListener('click', () => leftPlayerBox.classList.toggle('open'));
            }

            playlistItems.forEach((item, index) => {
                item.addEventListener('click', () => loadTrack(index, true));
            });

            if (npPlayPauseBtn) {
                npPlayPauseBtn.addEventListener('click', () => {
                    if (audioUtama.paused) audioUtama.play().catch(err => console.log('Gagal play:', err));
                    else audioUtama.pause();
                });
            }

            if (npPrevBtn) {
                npPrevBtn.addEventListener('click', () => {
                    const newIndex = (currentIndex - 1 + playlistItems.length) % playlistItems.length;
                    loadTrack(newIndex, true);
                });
            }
            if (npNextBtn) {
                npNextBtn.addEventListener('click', () => {
                    const newIndex = (currentIndex + 1) % playlistItems.length;
                    loadTrack(newIndex, true);
                });
            }

            // Fix supaya bar buletan ngikutin menit lagu berjalan
            audioUtama.addEventListener('timeupdate', () => {
                if (!audioUtama.duration) return;
                const percent = (audioUtama.currentTime / audioUtama.duration) * 100;
                if (npProgressBar) npProgressBar.value = percent; 
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

            // Fix supaya buletan bisa di-drag/ditarik (seek)
            if (npProgressBar) {
                npProgressBar.addEventListener('input', (e) => {
                    if (!audioUtama.duration) return;
                    const percent = e.target.value / 100;
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
            console.log('[MUSIC] Player kiri berhasil diinisialisasi.');
        } catch (error) {
            console.warn('[MUSIC] Error pada player kiri:', error.message);
        }
    })();

    // ================================================================
    // 12. COMMENT SECTION & PARTICLE LEAVES (RE-TUNED)
    // ================================================================
    (function() {
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
        }

        // ================================================================
        // EFFECT PARTICLES LEAVES (ELEGANT, FEWER, LARGER & CINEMATIC)
        // ================================================================
        (function() {
            const canvasBack = document.getElementById('particleCanvas');
            const canvasFront = document.getElementById('particleCanvasFront');
            if (!canvasBack) return;

            const ctxBack = canvasBack.getContext('2d');
            const ctxFront = canvasFront ? canvasFront.getContext('2d') : null;

            let backParticles = [], frontParticles = [];

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
                    this.x += this.vx;
                    this.y += this.vy;
                    this.angle += this.spinSpeed;

                    if (window.scrollVelocity) {
                        const velocity = window.scrollVelocity;
                        const cappedVelocity = Math.max(-2.5, Math.min(2.5, velocity));
                        const parallaxFactor = this.baseSize * 0.04;
                        this.y -= cappedVelocity * parallaxFactor;
                        const swirlStrength = this.baseSize * 0.02;
                        this.x += Math.sin(this.y * 0.005 + this.noiseSeed) * cappedVelocity * swirlStrength;
                    }

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
                    const clampedVelocityForEffect = Math.max(-1.2, Math.min(1.2, velocity));
                    const absVelocityForEffect = Math.abs(clampedVelocityForEffect);

                    if (absVelocityForEffect > 0.02) {
                        const windTilt = clampedVelocityForEffect * 0.15 + Math.sin(this.y * 0.005 + this.noiseSeed) * 0.2;
                        ctx.rotate(this.angle + windTilt);
                        const stretchFactor = 1 + (absVelocityForEffect * 0.15);
                        ctx.scale(stretchFactor, 1 / Math.sqrt(stretchFactor));
                    } else {
                        ctx.rotate(this.angle);
                    }

                    if (this.glow > 0) {
                        ctx.shadowBlur = this.glow;
                        ctx.shadowColor = `rgba(255, 255, 255, ${this.opacity * 0.6})`;
                    }

                    ctx.beginPath();
                    ctx.moveTo(-this.size, 0);
                    ctx.quadraticCurveTo(0, -this.size * 0.48, this.size, 0);
                    ctx.quadraticCurveTo(0, this.size * 0.48, -this.size, 0);
                    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
                    ctx.fill();
                    ctx.restore();
                }
            }

            function initBackParticles() {
                backParticles = [];
                for (let i = 0; i < 12; i++) {
                    backParticles.push(new Particle(canvasBack, {
                        baseSize: Math.random() * 4 + 7,
                        speedRange: 0.2,
                        minSpeed: 0.05,
                        opacityRange: 0.15,
                        minOpacity: 0.1,
                        glow: 0
                    }));
                }
            }

            function initFrontParticles() {
                frontParticles = [];
                if (!canvasFront) return;
                for (let i = 0; i < 5; i++) {
                    frontParticles.push(new Particle(canvasFront, {
                        baseSize: Math.random() * 10 + 16,
                        speedRange: 0.15,
                        minSpeed: 0.04,
                        opacityRange: 0.25,
                        minOpacity: 0.2,
                        glow: 12
                    }));
                }
            }

            initBackParticles();
            initFrontParticles();

            function animateParticles() {
                const target = window.targetVelocity || 0;
                const current = window.currentVelocity || 0;
                const lerpFactor = Math.abs(target) > Math.abs(current) ? 0.15 : 0.04;
                window.currentVelocity += (target - current) * lerpFactor;
                window.scrollVelocity = window.currentVelocity;
                window.targetVelocity *= 0.92;

                ctxBack.clearRect(0, 0, canvasBack.width, canvasBack.height);
                if (ctxFront) ctxFront.clearRect(0, 0, canvasFront.width, canvasFront.height);

                backParticles.forEach(p => { p.update(); p.draw(ctxBack); });
                frontParticles.forEach(p => { p.update(); p.draw(ctxFront); });

                requestAnimationFrame(animateParticles);
            }
            animateParticles();
        })();

    console.log('[PORTAL] Semua modul selesai dimuat!');

    window.startMusicAfterEnter = function() {
    const bgMusic = document.getElementById('bgMusic'); // Ambil element audio asli
    if (bgMusic) {
        console.log('[AUDIO] Memutar musik utama secara instan setelah Enter...');
        bgMusic.muted = false; // Pastikan tidak ter-mute
        bgMusic.play()
            .then(() => console.log('[AUDIO] Musik utama berhasil berputar!'))
            .catch(error => console.log('[AUDIO] Playback terblokir:', error));
    } else {
        console.warn('[AUDIO] Elemen #bgMusic tidak ditemukan!');
}
};
})(jQuery);
});