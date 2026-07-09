import React, { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import './app.css';

function App() {
  useEffect(() => {
    console.log("React Portofolio Ibnu Dexton Berhasil Jalan!");

    console.log('[PORTAL] DOM siap, memuat semua modul...');
    (function() {

      const loader = document.getElementById('loader');
      const enterBtn = document.getElementById('enterBtn');

      let siteEntered = false;

      const swiperSound = new Audio();
      swiperSound.src = '/swiper.MP3';
      swiperSound.preload = 'auto';
      swiperSound.load(); // Paksa Brave untuk langsung download file audio di awal

      let isAudioUnlocked = false;

      function unlockAudioContext() {
          if (isAudioUnlocked) return;
          
          swiperSound.play()
              .then(() => {
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
              new Audio('/enter.MP3').play().catch(err => console.log('[AUDIO] Enter sound error:', err));

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
              btn.textContent = 'Terkirim!';
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
      const bgMusic = document.getElementById('bgMusic');
      const musicToggle = document.getElementById('musicToggle');
      const volumeSlider = document.getElementById('volumeSlider');

      if (bgMusic && musicToggle && volumeSlider) {
          bgMusic.volume = volumeSlider.value;
          
          let musicUnlocked = false;
          const startMusicOnInteraction = () => {
              if (!siteEntered || musicUnlocked || !bgMusic) return; 
              bgMusic.play().then(() => {
                  musicUnlocked = true;
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

          let currentIndex = Math.floor(Math.random() * playlistItems.length);

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
              const cover = item.getAttribute('data-cover') || '/default-cover.jpg';

              playlistItems.forEach(li => li.classList.remove('active'));
              item.classList.add('active');

              audioUtama.src = src;

              const coverImg = document.getElementById('npCoverImg');
              if (coverImg) coverImg.src = cover;

              if (npTitle) npTitle.textContent = title;
              if (npArtist) npArtist.textContent = artist;
              if (teksJudulLaguKanan) teksJudulLaguKanan.textContent = artist ? `${title} - ${artist}` : title;
              
              if (npProgressBar) npProgressBar.value = 0; 
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

      // ================================================================
      // 12. COMMENT SECTION & PARTICLE LEAVES (RE-TUNED)
      // ================================================================
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
      const canvasBack = document.getElementById('particleCanvas');
      const canvasFront = document.getElementById('particleCanvasFront');
      if (canvasBack) {
          const ctxBack = canvasBack.getContext('2d');
          const ctxFront = canvasFront ? canvasFront.getContext('2d') : null;

          let backParticles = [], frontParticles = [];

          const setAllCanvasSizes = () => {
              canvasBack.width = window.innerWidth;
              canvasBack.height = window.innerHeight;
              if (canvasFront) {
                  canvasFront.width = window.innerWidth;
                  canvasFront.height = window.innerHeight;
              }
          };
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

          const initBackParticles = () => {
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
          };

          const initFrontParticles = () => {
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
          };

          initBackParticles();
          initFrontParticles();

          const animateParticles = () => {
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
          };
          animateParticles();
      }

      console.log('[PORTAL] Semua modul selesai dimuat!');

      window.startMusicAfterEnter = function() {
          const bgMusic = document.getElementById('bgMusic'); 
          if (bgMusic) {
              console.log('[AUDIO] Memutar musik utama secara instan setelah Enter...');
              bgMusic.muted = false; 
              bgMusic.play()
                  .then(() => console.log('[AUDIO] Musik utama berhasil berputar!'))
                  .catch(error => console.log('[AUDIO] Playback terblokir:', error));
          } else {
              console.warn('[AUDIO] Elemen #bgMusic tidak ditemukan!');
          }
      };

    })();
  }, []);

  return (
    <>
      {/* Background Ferrofluid dihapus, ga cocok sama tema web */}

      <canvas id="particleCanvas"></canvas>
      <canvas id="particleCanvasFront"></canvas>

      <div className="cursor-follower">
        <img src="/money-cash.gif" alt="Cursor Follower" />
      </div>
      
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
        <div className="blob blob-4"></div>
      </div>

      {/* Loading Screen */}
      <div id="loader">
        <div className="loader-content">
          <h2 className="loader-title">Ibnu dexton</h2>
          <button id="enterBtn" className="enter-btn">
            <span>enter</span>
            <span className="enter-btn-icon"><i className="fas fa-arrow-right"></i></span>
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <img src="/16bit-80s.gif" alt="Walking Cat" className="nav-cat-walking" id="navCat" />

          <div className="nav-logo" data-aos="fade-right">
            <span>Ibnu dexton</span>
          </div>
          <ul className="nav-menu">
            <li><a href="#home" className="active">Home</a></li>
            <li><a href="#about">Tentang</a></li>
            <li><a href="#skills">Keahlian</a></li>
            <li><a href="#projects">Proyek</a></li>
            <li><a href="#contact">Kontak</a></li>
            <div className="nav-indicator"></div>
          </ul>
          <div className="nav-toggle" id="mobile-menu" data-aos="fade-left">
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="hero-container">
          <div className="hero-content">
            {/* === KOTAK TEKS (SISI KIRI) === */}
            <div className="hero-text">
              <p className="hero-greeting">Halo, Saya</p>
              <h1 className="hero-title">Ibnu Dexton</h1>
              <p className="hero-subtitle">Desainer Komunikasi Visual | Lulusan SMKN 5 Kota Tangerang</p>
              <p className="hero-desc">Menciptakan karya visual yang impactful dan estetis untuk berbagai client ternama.</p>
              <div className="hero-buttons">
                <a href="#projects" className="btn btn-primary">Lihat Proyek</a>
                <a href="#contact" className="btn btn-secondary">Hubungi Saya</a>
              </div>
              <div className="hero-social">
                <a href="https://www.instagram.com/dxtnn_" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
                <a href="https://www.tiktok.com/@risemss" target="_blank" rel="noopener noreferrer"><i className="fab fa-tiktok"></i></a>
                <a href="https://wa.me/6285281144792" target="_blank" rel="noopener noreferrer"><i className="fab fa-whatsapp"></i></a>
              </div>
            </div>

            {/* === KOTAK FOTO PROFIL (SISI KANAN) === */}
            <div className="hero-image">
              <div className="profile-wrapper">
                <img src="/newpfp.png" alt="Ibnu Dexton" className="profile-img" id="profile-img" />
                <div className="profile-ring"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="scroll-indicator">
          <span>Scroll</span>
          <i className="fas fa-chevron-down"></i>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="container">
          <div className="section-header">
                <h2>Tentang Saya</h2>
                <div className="underline"></div>
          </div>
          <div className="about-content">
            <div className="about-text">
              <h3>amateur nya tangerang</h3>
              <p>Saya Ibnu Dexton, lulusan SMKN 5 Kota Tangerang dengan jurusan Desain Komunikasi Visual. Dengan passion dalam menciptakan desain yang bermakna, saya telah bekerja dengan berbagai klien dari berbagai industri.</p>
              <p>Pendekatan saya adalah menggabungkan estetika modern dengan fungsi yang jelas, memastikan setiap proyek tidak hanya terlihat indah tetapi juga efektif dalam menyampaikan pesan.</p>
              <div className="about-stats">
                <div className="stat">
                  <span className="stat-number" data-target="20">0+</span>
                  <span className="stat-label">Proyek Selesai</span>
                </div>
                <div className="stat">
                  <span className="stat-number" data-target="15">0+</span>
                  <span className="stat-label">Klien Puas</span>
                </div>
                <div className="stat">
                  <span className="stat-number" data-target="4">0</span>
                  <span className="stat-label">Tahun Pengalaman</span>
                </div>
              </div>
            </div>
            <div className="about-image">
              <img src="/black-cat.gif" alt="Black Cat" className="about-cat-gif" />
              <div className="about-img-wrapper">
                <img src="/GARUDA PS 2026.jpg" alt="About Ibnu" />
              </div>
            </div>
          </div>
          <audio id="tickSound" src="/counting.MP3" preload="auto"></audio>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="skills">
        <div className="container">
          <div className="section-header">
            <h2>Keahlian</h2>
            <div className="underline"></div>
          </div>
          <div className="skills-grid">
            <div className="skill-card">
              <div className="skill-icon"><i className="fab fa-figma"></i></div>
              <h3>UI/UX Design</h3>
              <p>Mendesain antarmuka yang intuitif dan pengalaman pengguna yang engaging.</p>
              <div className="skill-bar"><div className="skill-progress" style={{ width: '90%' }}></div></div>
            </div>
            <div className="skill-card">
              <div className="skill-icon"><i className="fas fa-pen-nib"></i></div>
              <h3>Graphic Design</h3>
              <p>Desain grafis untuk branding, marketing, dan kebutuhan visual lainnya.</p>
              <div className="skill-bar"><div className="skill-progress" style={{ width: '95%' }}></div></div>
            </div>
            <div className="skill-card">
              <div className="skill-icon"><i className="fas fa-mobile-alt"></i></div>
              <h3>Motion Design</h3>
              <p>Animasi dan motion graphics untuk konten digital yang dinamis.</p>
              <div className="skill-bar"><div className="skill-progress" style={{ width: '80%' }}></div></div>
            </div>
            <div className="skill-card">
              <div className="skill-icon"><i className="fas fa-code"></i></div>
              <h3>Frontend Dev</h3>
              <p>Membangun website responsif dengan HTML, CSS, dan JavaScript.</p>
              <div className="skill-bar"><div className="skill-progress" style={{ width: '75%' }}></div></div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="projects">
        <div className="container">
          <div className="section-header">
            <h2>Proyek Unggulan</h2>
            <div className="underline"></div>
          </div>
          <div className="projects-grid">
            <a href="https://www.behance.net/gallery/142999433/SENADA-COFFEE-Identity-Packaging-Branding" target="_blank" rel="noopener noreferrer" className="project-card-link">
              <div className="project-card">
                <div className="project-img" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80')" }}></div>
                <div className="project-info">
                  <h3>Brand Identity - Kopi Local Tangerang</h3>
                  <p>Rebranding lengkap identitas visual kafe lokal Tangerang, meliputi logo, tipografi, kemasan cup, serta desain merchandise.</p>
                  <span className="project-tag tag-amber">Branding</span>
                  <span className="view-project">Lihat Proyek <i className="fas fa-arrow-right"></i></span>
                </div>
              </div>
            </a>
            <a href="https://www.behance.net/gallery/135048123/Tangerang-Smart-City-Mobile-App-UIUX-Case-Study" target="_blank" rel="noopener noreferrer" className="project-card-link">
              <div className="project-card">
                <div className="project-img" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=600&auto=format&fit=crop&q=80')" }}></div>
                <div className="project-info">
                  <h3>UI/UX - Tangerang Smart Citizen App</h3>
                  <p>Prototipe aplikasi layanan publik masyarakat Tangerang yang mempermudah pelaporan fasilitas kota dan administrasi warga.</p>
                  <span className="project-tag tag-cyan">UI/UX</span>
                  <span className="view-project">Lihat Proyek <i className="fas fa-arrow-right"></i></span>
                </div>
              </div>
            </a>
            <a href="https://www.youtube.com/watch?v=FstQ_tPszq4" target="_blank" rel="noopener noreferrer" className="project-card-link">
              <div className="project-card">
                <div className="project-img" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=600&auto=format&fit=crop&q=80')" }}></div>
                <div className="project-info">
                  <h3>Profile Video - SMKN 5 Kota Tangerang</h3>
                  <p>Produksi video profil sekolah dengan editing sinematik serta integrasi motion graphics 2D untuk informasi jurusan DKV.</p>
                  <span className="project-tag tag-lime">Motion Graphics</span>
                  <span className="view-project">Lihat Proyek <i className="fas fa-arrow-right"></i></span>
                </div>
              </div>
            </a>
            <a href="https://www.behance.net/gallery/117953609/Local-Pride-Indonesian-Streetwear-Brand-Catalog" target="_blank" rel="noopener noreferrer" className="project-card-link">
              <div className="project-card">
                <div className="project-img" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80')" }}></div>
                <div className="project-info">
                  <h3>Zine & Catalog - Local Fashion Pride</h3>
                  <p>Desain layout katalog dan majalah visual berskala cetak untuk mempromosikan brand fashion lokal asal Tangerang.</p>
                  <span className="project-tag tag-amber">Layout & Cetak</span>
                  <span className="view-project">Lihat Proyek <i className="fas fa-arrow-right"></i></span>
                </div>
              </div>
            </a>
            <a href="https://www.behance.net/gallery/103215571/Tempeh-Chips-Packaging-Design" target="_blank" rel="noopener noreferrer" className="project-card-link">
              <div className="project-card">
                <div className="project-img" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80')" }}></div>
                <div className="project-info">
                  <h3>Packaging Design - Keripik Tempe Modern</h3>
                  <p>Desain kemasan makanan ringan lokal dengan ilustrasi modern dan ramah lingkungan agar bersaing di pasar modern.</p>
                  <span className="project-tag tag-lime">Packaging</span>
                  <span className="view-project">Lihat Proyek <i className="fas fa-arrow-right"></i></span>
                </div>
              </div>
            </a>
            <a href="https://www.behance.net/gallery/121115321/Sneakers-Brand-Social-Media-Campaign-Design" target="_blank" rel="noopener noreferrer" className="project-card-link">
              <div className="project-card">
                <div className="project-img" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80')" }}></div>
                <div className="project-info">
                  <h3>Social Media Kit - Campaign Launch</h3>
                  <p>Pembuatan aset visual promosi Instagram feeds dan story untuk produk sepatu lokal berkolaborasi dengan seniman mural.</p>
                  <span className="project-tag tag-cyan">Social Media</span>
                  <span className="view-project">Lihat Proyek <i className="fas fa-arrow-right"></i></span>
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact reveal-init">
        <div className="container">
          <div className="section-header">
            <h2>Hubungi Saya</h2>
            <div className="underline"></div>
          </div>
          
          <div className="contact-content">
            <div className="contact-info">
              <div className="contact-item">
                <i className="fas fa-envelope"></i>
                <span>ibnudexton@gmail.com</span>
              </div>
              <div className="contact-item">
                <i className="fas fa-phone"></i>
                <span>+62 852 8114 4792</span>
              </div>
              <div className="contact-item">
                <i className="fas fa-map-marker-alt"></i>
                <span>Tangerang, Indonesia</span>
              </div>
              <div className="contact-social">
                <a href="https://www.instagram.com/dxtnn_" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
                <a href="https://www.tiktok.com/@risemss" target="_blank" rel="noopener noreferrer"><i className="fab fa-tiktok"></i></a>
                <a href="https://github.com/detonnn" target="_blank" rel="noopener noreferrer"><i className="fab fa-github"></i></a>
                <a href="https://wa.me/6285281144792" target="_blank" rel="noopener noreferrer"><i className="fab fa-whatsapp"></i></a>
              </div>
            </div>

            <form className="contact-form" id="contactForm">
              <div className="input-group">
                <input type="text" id="contactName" placeholder=" " required />
                <label htmlFor="contactName">Nama Lengkap</label>
              </div>
              <div className="input-group">
                <input type="email" id="contactEmail" placeholder=" " required />
                <label htmlFor="contactEmail">Email</label>
              </div>
              <div className="input-group">
                <input type="text" id="contactSubject" placeholder=" " />
                <label htmlFor="contactSubject">Subjek</label>
              </div>
              <div className="input-group">
                <textarea id="contactMessage" rows="5" placeholder=" " required></textarea>
                <label htmlFor="contactMessage">Pesan Anda...</label>
              </div>
              <button type="submit" className="btn btn-primary btn-animate">Kirim Pesan <i className="fas fa-paper-plane"></i></button>
            </form>
          </div>

          {/* Comments Section */}
          <div className="comments-section reveal-init">
            <h3>Apa Kata Pengunjung</h3>
            <div className="comments-list" id="commentsList">
              <div className="comment-card">
                <div className="comment-avatar"><i className="fas fa-user-astronaut"></i></div>
                <div className="comment-body">
                  <h4>Rangga Desainer</h4>
                  <p>Gila, interfacenya smooth banget bro! Terutama efek transisi pas ngescroll. Semangat terus karyanya 🔥</p>
                  <span className="comment-time">1 jam yang lalu</span>
                </div>
              </div>
            </div>

            <form id="commentForm" className="comment-form">
              <h4>Tinggalkan Jejakmu</h4>
              <div className="form-row">
                <div className="input-group">
                  <input type="text" id="commentName" placeholder=" " required />
                  <label htmlFor="commentName">Nama Kamu</label>
                </div>
              </div>
              <div className="input-group">
                <textarea id="commentText" rows="2" placeholder=" " required></textarea>
                <label htmlFor="commentText">Komentar mantapmu...</label>
              </div>
              <button type="submit" className="btn btn-secondary btn-animate">Kirim Komentar <i className="fas fa-comment-dots"></i></button>
            </form>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2026 Ibnu Dexton. All rights reserved.</p>
        </div>
      </footer>

      {/* AUDIO SOUNDTRACK */}
      <audio id="bgMusic" src="/clai_obscur.mp3" preload="auto" />

      {/* TOMBOL MUSIK (KANAN BAWAH) */}
      <div className="music-controller">
        <div className="volume-popover">
          <span className="track-title" id="miniTrackTitle">Clair Obscur: Expedition 33 - Alicia</span>
          <input type="range" id="volumeSlider" min="0" max="1" step="0.05" defaultValue="0.4" />
        </div>
        <button id="musicToggle" className="music-btn" title="Mute/Unmute Musik">
          <i className="fas fa-music"></i>
        </button>
      </div>

      {/* LEFT MUSIC PLAYER PANEL */}
      <div className="left-music-player" id="leftMusicPlayer">
        <div className="now-playing-card" id="leftPlayerPanel">
          <div className="np-cover-wrapper">
            <img id="npCoverImg" src="/default-cover.jpg" alt="Cover Art" />
          </div>

          <div className="np-header">
            <div className="np-art"><i className="fas fa-compact-disc"></i></div>
            <div className="np-info">
              <span className="np-eyebrow">NOW PLAYING</span>
              <h3 id="npTitle" className="np-title">Clair Obscur: Expedition 33</h3>
              <p id="npArtist" className="np-artist">Alicia</p>
            </div>
          </div> 
          
          <div className="np-progress-container" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <span id="npCurrentTime" style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>0:00</span>
            <input type="range" id="npProgressBar" min="0" max="100" defaultValue="0" style={{ flex: 1 }} />
            <span id="npDuration" style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>0:00</span>
          </div>

          <div className="np-controls">
            <button className="np-ctrl-btn" id="npPrev"><i className="fas fa-step-backward"></i></button>
            <button className="np-ctrl-btn np-play" id="npPlayPause"><i className="fas fa-play"></i></button>
            <button className="np-ctrl-btn" id="npNext"><i className="fas fa-step-forward"></i></button>
          </div>

          <div className="np-volume">
            <i className="fas fa-volume-down"></i>
            <input type="range" id="npVolumeSlider" min="0" max="1" step="0.05" defaultValue="0.4" />
            <i className="fas fa-volume-up"></i>
          </div>

          <ul id="musicPlaylist" className="np-playlist" data-lenis-prevent>
            <li data-src="/neymar.mp3" data-title="TAKA LA DENTRO" data-artist="unique vibes" data-cover="/brazil.jpg">TAKA LA DENTRO - unique vibes</li>
            <li data-src="/pole.mp3" data-title="no pole" data-artist="Don Toliver" data-cover="/nop.jpg">no pole - Don Toliver</li>
            <li data-src="/ariana.mp3" data-title="bye" data-artist="ariana grande" data-cover="/r34.jpg">bye - ariana grande</li>
            <li data-src="/legacy.mp3" data-title="legacy slowed" data-artist="PIXY" data-cover="/lega.jpg">legacy slowed - PIXY</li>
            <li data-src="/russian.mp3" data-title="Базовый минимум" data-artist="SABI" data-cover="/Thumbnailrus.jpg">Базовый минимум - SABI</li>
            <li data-src="/mortemor.mp3" data-title="Мой мармеладный" data-artist="Катя Лель" data-cover="/mor1.jpg">КАТЯ ЛЕЛЬ - Мой мармеладный</li>
            <li data-src="/naruto.mp3" data-title="i have seen much" data-artist="obito uciha" data-cover="/obito.jpg">i have seen much - obito uciha</li>
            <li data-src="/cow.mp3" data-title="crash of world" data-artist="red dead redemption 2" data-cover="/arthur.jpg">crash of world - red dead redemption 2</li>
            <li data-src="/clai_obscur.mp3" data-title="Clair Obscur: Expedition 33" data-artist="Alicia" data-cover="/Thumbnailexp.jpg" className="active">Clair Obscur: Expedition 33 - Alicia</li>
          </ul>
        </div>

        <button className="left-player-toggle" id="leftPlayerToggle" title="Buka Music Player">
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>

      <audio id="hoverSound" src="/hov.MP3" preload="auto" />
    </>
  );
}

export default App;