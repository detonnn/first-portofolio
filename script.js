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
// =======================================================
// AUDIO HOVER - WEB AUDIO API (ANTI DELAY & ANTI BLOCK)
// =======================================================
document.addEventListener('DOMContentLoaded', () => {
    const hoverSoundElement = document.getElementById('hoverSound');
    if (!hoverSoundElement) return;
    const HOVER_SELECTOR = [
        '.skill-card',          // kolom keahlian
        '.project-card',        // kolom proyek
        '.hero-buttons .btn',   // tombol "Lihat Proyek" & "Hubungi Saya"
        '.hero-social a',       // icon IG, TikTok, WA
        '.about-stats .stat',   // kotak statistik (Proyek/Klien/Tahun)
        '.about-text'           // kotak teks "amateur nya tangerang"
    ].join(', ');

    let audioCtx = null;
    let audioBuffer = null;
    let activeHoverTarget = null;
    const volumeValue = 0.3; // Atur volume di sini (0.0 sampai 1.0)

    // Fungsi untuk setup Web Audio API dan download audio ke memory buffer
    async function initAudio() {
        if (audioCtx) return; // Mencegah init ganda

        // Buat Audio Context
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        
        try {
            // Ambil file audio dari element <audio src="...">
            const response = await fetch(hoverSoundElement.src);
            const arrayBuffer = await response.arrayBuffer();
            // Decode agar siap dimainkan instan tanpa loading lagi
            audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
        } catch (err) {
            console.error("Gagal me-load audio hover:", err);
        }
    }

    // Fungsi untuk memainkan suara (Tanpa delay karena diambil dari buffer)
    function playHoverSound() {
        if (!audioCtx || !audioBuffer) return;

        // Jika browser mematikan audio (suspend), paksa aktifkan kembali
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        // Buat source node baru tiap kali play (sangat ringan via Audio API)
        const soundSource = audioCtx.createBufferSource();
        const gainNode = audioCtx.createGain();

        soundSource.buffer = audioBuffer;
        gainNode.gain.value = volumeValue;

        soundSource.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        soundSource.start(0);
    }

    // Trigger interaksi pertama: Begitu user gerak/klik, audio langsung siap di latar belakang
    const unlockAudio = () => {
        initAudio().then(() => {
            if (audioCtx && audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
        });
        // Hapus listener jika sudah ter-unlock agar hemat memori
        ['click', 'mousemove', 'scroll', 'touchstart', 'keydown'].forEach(evt => {
            document.removeEventListener(evt, unlockAudio);
        });
    };
    ['click', 'mousemove', 'scroll', 'touchstart', 'keydown'].forEach(evt => {
        document.addEventListener(evt, unlockAudio, { passive: true });
    });

    // Event Mouse Over (Deteksi hover kolom)
    document.addEventListener('mouseover', (e) => {
        const target = e.target.closest(HOVER_SELECTOR);
        if (!target) return;

        const from = e.relatedTarget;
        if (from && target.contains(from)) return;

        // Anti double sound
        if (target === activeHoverTarget) return;
        activeHoverTarget = target;

        playHoverSound();
    });

    // Event Mouse Out (Reset flag kolom)
    document.addEventListener('mouseout', (e) => {
        const target = e.target.closest(HOVER_SELECTOR);
        if (!target) return;

        const to = e.relatedTarget;
        if (!to || !target.contains(to)) {
            if (target === activeHoverTarget) {
                activeHoverTarget = null;
            }
        }
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