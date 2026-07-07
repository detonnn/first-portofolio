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
    const tickSound = document.getElementById('tickSound');
    
    // Atur volume (0.0 sampai 1.0), misal 0.2 agar pelan
    if (tickSound) tickSound.volume = 0.2; 

    counters.forEach(counter => {
        // Cek jika sudah teranimasi, lewati
        if (counter.classList.contains('counting')) return;

        counter.classList.add('counting');
        const target = +counter.getAttribute('data-target');
        const duration = 1500;
        const stepTime = Math.max(Math.floor(duration / target), 30);
        let start = 0;

        const timer = setInterval(() => {
            start += 1;
            
            // Play Sound
            if (tickSound) {
                tickSound.currentTime = 0;
                tickSound.play().catch(e => {});
            }

            counter.textContent = (counter.getAttribute('data-target') === '4') ? start : start + '+';

            // Kondisi saat animasi selesai
            if (start >= target) {
                clearInterval(timer);
                counter.classList.remove('counting');
                
                // Hentikan suara seketika saat hitungan selesai
                if (tickSound) {
                    tickSound.pause();
                    tickSound.currentTime = 0;
                }
            }
        }, stepTime);

        counter.dataset.timer = timer;
    });
}
// Update Event Listener pada aboutBox
const aboutBox = document.querySelector('.about-text');
if (aboutBox) {
    const tickSound = document.getElementById('tickSound');

    // Trigger saat masuk (mouseenter)
    aboutBox.addEventListener('mouseenter', function() {
        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            counter.classList.remove('counted');
        });
        animateCounters();
    });

    // Stop saat keluar (mouseleave)
    aboutBox.addEventListener('mouseleave', function() {
        const counters = document.querySelectorAll('.stat-number');
        const tickSound = document.getElementById('tickSound');
        
        // Hentikan interval
        counters.forEach(counter => {
            clearInterval(counter.dataset.timer);
            counter.classList.remove('counting');
        });
        
        // Hentikan suara
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

    // 1. Preload audio segera
    async function preloadHoverSound() {
        try {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const response = await fetch(hoverSoundElement.src);
            const arrayBuffer = await response.arrayBuffer();
            audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
            isAudioReady = true;
            console.log('[hov Sound] Siap diputar');

            // 2. Eksekusi semua antrian
            while (pendingPlays.length) {
                const fn = pendingPlays.shift();
                fn();
            }
        } catch (err) {
            console.error('[hov Sound] Gagal preload:', err);
        }
    }

    preloadHoverSound();

    // 3. Fungsi play utama
    function playHoverSound() {
        if (!isAudioReady || !audioCtx || !audioBuffer) {
            pendingPlays.push(() => playHoverSound());
            return;
        }

        // Jika context suspended, resume dulu
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

    // 4. Daftar elemen hover (pastikan semua termasuk home & about)
    const HOVER_SELECTORS = [
        '.skill-card',
        '.project-card',
        '.hero-buttons .btn',
        '.hero-social a',
        '.profile-wrapper'
    ].join(', ');

    document.querySelectorAll(HOVER_SELECTORS).forEach(el => {
        // Hapus listener lama (kalau ada) untuk menghindari duplikasi
        el.removeEventListener('mouseenter', playHoverSound);
        el.addEventListener('mouseenter', playHoverSound);
    });

    // 5. Warmup: resume context & eksekusi antrian di interaksi pertama
    let warmupDone = false;
    function warmupAudioContext() {
        if (warmupDone) return;
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume().then(() => {
                // Setelah resume, jalankan antrian yang tertunda
                while (pendingPlays.length && isAudioReady) {
                    const fn = pendingPlays.shift();
                    fn();
                }
            }).catch(() => {});
        }
        warmupDone = true;
        // Lepas listener
        ['mousemove', 'click', 'touchstart', 'scroll', 'keydown'].forEach(evt => {
            document.removeEventListener(evt, warmupAudioContext);
        });
    }

    // Pasang listener warmup dengan prioritas tinggi
    const warmupEvents = ['mousemove', 'click', 'touchstart', 'scroll', 'keydown'];
    warmupEvents.forEach(evt => {
        document.addEventListener(evt, warmupAudioContext, { passive: true, once: false });
    });
});

// =======================================================
document.addEventListener('DOMContentLoaded', () => {
    const bgMusic = document.getElementById('bgMusic');
    const musicToggle = document.getElementById('musicToggle');
    const volumeSlider = document.getElementById('volumeSlider');

    if (!bgMusic || !musicToggle || !volumeSlider) return;

    // Set Volume Awal lagu (0.4)
    bgMusic.volume = volumeSlider.value;

    // Trigger play saat ada interaksi pertama kali di layar web
    // Dengerin BANYAK jenis interaksi (bukan cuma klik) biar musik kerasa langsung nyala
    let musicUnlocked = false;
    const startMusicOnInteraction = () => {
        if (musicUnlocked) return;
        bgMusic.play().then(() => {
            musicUnlocked = true;
            removeUnlockListeners();
        }).catch(() => {
            // Ditahan browser sampai interaksi user terdeteksi penuh
        });
    };
    const unlockEvents = ['click', 'mousemove', 'scroll', 'touchstart', 'keydown'];
    function removeUnlockListeners() {
        unlockEvents.forEach(evt => document.removeEventListener(evt, startMusicOnInteraction));
    }
    unlockEvents.forEach(evt => {
        document.addEventListener(evt, startMusicOnInteraction, { passive: true });
    });

    // Mute / Unmute lagu tanpa merusak sound hover web
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

    // Geser volume slider langsung sesuaikan musik latar belakang
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

  // =======================================================
    // LOGIC SCROLL NAVBAR & KUCING PUDAR (FIXED LOOP)
    // =======================================================
    const navbar = document.querySelector('.navbar');
    const navCat = document.getElementById('navCat');

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
            if (navCat) {
                navCat.classList.add('visible'); // Menggunakan class CSS agar lebih stabil
            }
        } else {
            navbar.classList.remove('scrolled');
            if (navCat) {
                navCat.classList.remove('visible');
            }
        }
    });

    // =======================================================
    // LOGIC KUCING BERJALAN INSTAN DI NAVBAR (FIXED ANIMATION)
    // =======================================================
    const navLogo = document.querySelector('.nav-logo');
    const contactLink = document.querySelector('.nav-menu a[href="#contact"]');
    const navbarContainer = document.querySelector('.nav-container');

    if (navCat && navLogo && contactLink && navbarContainer) {
        let currentX = 0;
        let direction = 1; // 1 = Kanan, -1 = Kiri
        const speed = 1.5; // Kecepatan jalan

        function animateNavCat() {
            const containerRect = navbarContainer.getBoundingClientRect();
            
            // Ambil koordinat batas kiri dan kanan
            const minX = navLogo.getBoundingClientRect().left - containerRect.left;
            const maxX = contactLink.getBoundingClientRect().left - containerRect.left;

            // Jika posisi awal belum di-set atau bernilai aneh, taruh di minX
            if (currentX <= 0) {
                currentX = minX || 10; 
            }

            currentX += speed * direction;

            // Mentok kanan -> Balik kiri
            if (currentX >= maxX && direction === 1) {
                direction = -1;
                navCat.style.transform = `translateX(${currentX}px) scaleX(-1)`;
            } 
            // Mentok kiri -> Balik kanan
            else if (currentX <= minX && direction === -1) {
                direction = 1;
                navCat.style.transform = `translateX(${currentX}px) scaleX(1)`;
            } 
            // Jalan normal
            else {
                navCat.style.transform = `translateX(${currentX}px) scaleX(${direction === 1 ? 1 : -1})`;
            }

            requestAnimationFrame(animateNavCat);
        }

        // Jalankan animasinya secara konstan di background
        animateNavCat();
    }

// ==========================================
    // LOGIC NOW PLAYING WIDGET KIRI (SPOTIFY-STYLE)
    // ==========================================
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

        // Update ikon play/pause di widget kiri sesuai status audio
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

        // Load & (opsional) langsung mainkan lagu berdasarkan index playlist
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

        // 1. Buka/tutup kartu Now Playing
        if (leftToggleBtn && leftPlayerBox) {
            leftToggleBtn.addEventListener('click', () => {
                leftPlayerBox.classList.toggle('open');
            });
        }

        // 2. Klik lagu di daftar playlist -> ganti lagu
        playlistItems.forEach((item, index) => {
            item.addEventListener('click', () => loadTrack(index, true));
        });

        // 3. Tombol Play/Pause
        if (npPlayPauseBtn) {
            npPlayPauseBtn.addEventListener('click', () => {
                if (audioUtama.paused) {
                    audioUtama.play().catch(err => console.log('Gagal play:', err));
                } else {
                    audioUtama.pause();
                }
            });
        }

        // 4. Tombol Sebelumnya / Berikutnya (ganti-ganti lagu)
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

        // 5. Progress bar berjalan otomatis
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

        // Lagu selesai -> otomatis lanjut ke lagu berikutnya di playlist
        audioUtama.addEventListener('ended', () => {
            const newIndex = (currentIndex + 1) % playlistItems.length;
            loadTrack(newIndex, true);
        });

        // 6. Klik di progress bar buat seek/geser posisi lagu
        if (npProgressBar) {
            npProgressBar.addEventListener('click', (e) => {
                if (!audioUtama.duration) return;
                const rect = npProgressBar.getBoundingClientRect();
                const percent = (e.clientX - rect.left) / rect.width;
                audioUtama.currentTime = percent * audioUtama.duration;
            });
        }

        // 7. Volume slider di widget kiri, disinkronkan sama slider kanan bawah
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

        // Sinkronkan info lagu awal (tanpa autoplay, biar ga kena blokir browser)
        loadTrack(currentIndex, false);

    } catch (error) {
        console.error("Ada masalah di script music player:", error);
    }
    
});

// =======================================================
// FIX HOVER SOUND DI PFP & TENTANG SAYA (SPESIAL)
// =======================================================
document.addEventListener('DOMContentLoaded', function() {
    // Ambil referensi audio context dari kode sebelumnya (biar satu)
    let hoverAudioCtx = null;
    let hoverAudioBuffer = null;
    let hoverIsReady = false;
    let hoverPending = [];

    // Cari elemen audio
    const soundEl = document.getElementById('hoverSound');
    if (!soundEl) return;

    // Inisialisasi ulang tapi pake variabel global
    async function initHoverSound() {
        try {
            hoverAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const response = await fetch(soundEl.src);
            const arrayBuffer = await response.arrayBuffer();
            hoverAudioBuffer = await hoverAudioCtx.decodeAudioData(arrayBuffer);
            hoverIsReady = true;
            console.log('[hov Sound PFP] Siap!');

            // Eksekusi antrian
            while (hoverPending.length) {
                const fn = hoverPending.shift();
                fn();
            }
        } catch (err) {
            console.error('[hov Sound PFP] Gagal:', err);
        }
    }

    initHoverSound();

    // Fungsi play untuk PFP & About
    function playHoverSoundSpesial() {
        if (!hoverIsReady || !hoverAudioCtx || !hoverAudioBuffer) {
            hoverPending.push(() => playHoverSoundSpesial());
            return;
        }

        if (hoverAudioCtx.state === 'suspended') {
            hoverAudioCtx.resume().then(() => {
                const source = hoverAudioCtx.createBufferSource();
                const gain = hoverAudioCtx.createGain();
                gain.gain.value = 0.3;
                source.buffer = hoverAudioBuffer;
                source.connect(gain);
                gain.connect(hoverAudioCtx.destination);
                source.start(0);
            }).catch(() => {});
            return;
        }

        const source = hoverAudioCtx.createBufferSource();
        const gain = hoverAudioCtx.createGain();
        gain.gain.value = 0.3;
        source.buffer = hoverAudioBuffer;
        source.connect(gain);
        gain.connect(hoverAudioCtx.destination);
        source.start(0);
    }

    // === TARGET SPESIAL: PFP & ABOUT ===
const targetElements = [
    document.querySelector('.profile-wrapper') 
    // .about-text sudah dihapus agar suara hover hilang
];

targetElements.forEach(el => {
    if (!el) return;

    // Hapus listener lama (kalau ada duplikat)
    el.removeEventListener('mouseenter', playHoverSoundSpesial);
    el.removeEventListener('mouseover', playHoverSoundSpesial);

    // PAKAI mouseover (lebih responsif daripada mouseenter)
    el.addEventListener('mouseover', function(e) {
        // Pastikan targetnya benar (bukan anak elemen)
        if (e.target.closest('.profile-wrapper')) {
            playHoverSoundSpesial();
        }
    }, { passive: true });
});

    // === WARMUP: BIKIN CONTEXT LANGSUNG ACTIVE SAAT HOVER PERTAMA ===
    function warmupContext() {
        if (hoverAudioCtx && hoverAudioCtx.state === 'suspended') {
            hoverAudioCtx.resume().catch(() => {});
        }
        while (hoverPending.length && hoverIsReady) {
            const fn = hoverPending.shift();
            fn();
        }
        document.removeEventListener('mousemove', warmupContext);
        document.removeEventListener('click', warmupContext);
        document.removeEventListener('touchstart', warmupContext);
    }

    document.addEventListener('mousemove', warmupContext, { passive: true, once: true });
    document.addEventListener('click', warmupContext, { passive: true, once: true });
    document.addEventListener('touchstart', warmupContext, { passive: true, once: true });
});

// =======================================================
// FITUR KOMENTAR PENGUNJUNG (LIVE ADD)
// =======================================================
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
                // Buat elemen komentar baru
                const commentCard = document.createElement('div');
                commentCard.className = 'comment-card';
                
                // Tambahkan elemen HTML di dalamnya
                commentCard.innerHTML = `
                    <div class="comment-avatar"><i class="fas fa-user-astronaut"></i></div>
                    <div class="comment-body">
                        <h4>${name}</h4>
                        <p>${text}</p>
                        <span class="comment-time">Baru saja</span>
                    </div>
                `;
                
                // Masukkan komentar baru ke paling atas daftar
                commentsList.insertBefore(commentCard, commentsList.firstChild);
                
                // Reset Input form
                this.reset();
                
                // Ubah gaya tombol sebentar jadi sukses
                const btn = this.querySelector('button');
                const originalHTML = btn.innerHTML;
                const originalClass = btn.className;
                
                btn.innerHTML = 'Komentar Terkirim! <i class="fas fa-check-circle"></i>';
                btn.style.backgroundColor = '#4CAF50';
                btn.style.color = '#fff';
                btn.style.borderColor = '#4CAF50';
                
                // Balikkan tombol setelah 3 detik
                setTimeout(() => {
                    btn.innerHTML = originalHTML;
                    btn.style = '';
                }, 3000);
            }
        });
    }
});