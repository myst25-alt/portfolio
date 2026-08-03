// Portfolio JavaScript functionality - Consolidated & Optimized
document.addEventListener('DOMContentLoaded', function() {
    // 1.1 Mobile detection
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isAndroid = /Android/i.test(navigator.userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    
    if (isMobile) {
        document.body.classList.add('mobile-device');
    }
    if (isAndroid) {
        document.body.classList.add('android-device');
    }
    if (isIOS) {
        document.body.classList.add('ios-device');
    }
    
    // 1.4 Touch/zoom guard (Pinch guard only)
    if (isMobile) {
        document.addEventListener('touchstart', function(e) {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        }, { passive: false });
    }

    // 1.2 Sticky header setup
    const stickyHeader = document.getElementById('stickyHeader');
    const heroSection = document.getElementById('hero');
    
    if (stickyHeader) {
        stickyHeader.classList.remove('visible');
        stickyHeader.style.display = 'none';
        setTimeout(() => {
            sessionStorage.removeItem('navigating');
            stickyHeader.style.display = '';
        }, 750);
    }
    
    const navButtons = document.querySelectorAll('.nav-button');
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (stickyHeader) {
                stickyHeader.classList.remove('visible');
                sessionStorage.setItem('navigating', 'true');
            }
        }, { passive: true });
    });
    
    function handleScroll() {
        if (!stickyHeader) return;
        if (sessionStorage.getItem('navigating') === 'true') {
            stickyHeader.classList.remove('visible');
            return;
        }
        
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        const threshold = heroSection ? (heroSection.offsetTop + heroSection.offsetHeight) * 0.8 : 100;
        
        if (scrollPosition > threshold) {
            stickyHeader.classList.add('visible');
        } else {
            stickyHeader.classList.remove('visible');
        }
    }
    
    let ticking = false;
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick, { passive: true });
    window.addEventListener('wheel', requestTick, { passive: true });

    // 1.3 Mobile Video Optimization
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        video.setAttribute('playsinline', 'true');
        video.setAttribute('webkit-playsinline', 'true');
        video.setAttribute('preload', 'metadata');
        
        if (window.innerWidth <= 768) {
            video.setAttribute('preload', 'none');
        }
        
        video.addEventListener('error', function() {
            console.log('Video failed to load:', this.src);
        });
        
        video.addEventListener('loadedmetadata', function() {
            if (window.innerWidth <= 768) {
                this.style.maxHeight = '60vh';
                this.style.width = '100%';
                this.style.objectFit = 'contain';
            }
        });
    });
    
    window.addEventListener('orientationchange', function() {
        setTimeout(() => {
            videos.forEach(video => {
                if (window.innerWidth <= 768) {
                    video.style.maxHeight = '60vh';
                    video.style.width = '100%';
                }
            });
        }, 500);
    });

    // 1.5 In-page smooth scroll
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href').substring(1);
            if (!targetId) return;
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 1.5 Card hover effects (touch devices skip JS hovers)
    if (!window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    // 1.6 Section reveal animations
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const sections = document.querySelectorAll('section');

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
        sections.forEach(section => {
            section.style.opacity = '1';
            section.style.transform = 'none';
        });
    } else {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(section);
        });
    }

    // 1.7 Typewriter (index only)
    const nameElement = document.getElementById('typewriter-name');
    if (nameElement) {
        const nameText = 'FIRDOUS\nFATIMA';
        nameElement.innerHTML = '<span class="cursor">|</span>';
        
        setTimeout(() => {
            let i = 0;
            let currentText = '';
            const typeWriter = () => {
                if (i < nameText.length) {
                    if (nameText.charAt(i) === '\n') {
                        currentText += '<br>';
                    } else {
                        currentText += nameText.charAt(i);
                    }
                    nameElement.innerHTML = currentText + '<span class="cursor">|</span>';
                    i++;
                    setTimeout(typeWriter, 150);
                } else {
                    setTimeout(() => {
                        nameElement.innerHTML = currentText;
                    }, 2000);
                }
            };
            
            typeWriter();
        }, 500);
    }

    // 1.8 Slideshow engine rewrite
    function initSlideshow(container, index) {
        const slides = container.querySelectorAll('.slides > *');
        if (slides.length === 0) return;

        const prevBtn = container.querySelector('.prev');
        const nextBtn = container.querySelector('.next');
        const counter = container.parentElement ? container.parentElement.querySelector('.slide-counter') : null;
        
        let currentSlide = 0;
        let autoAdvanceInterval = null;
        let isVideoPaused = false;
        let touchStartX = 0;
        let touchEndX = 0;

        function updateCounter() {
            if (counter) {
                counter.textContent = `${currentSlide + 1} / ${slides.length}`;
            }
        }

        // Attach video listeners exactly once at init
        slides.forEach(slide => {
            if (slide.tagName === 'VIDEO') {
                slide.addEventListener('play', () => {
                    isVideoPaused = true;
                    clearInterval(autoAdvanceInterval);
                });
                slide.addEventListener('pause', () => {
                    if (!slide.ended) {
                        isVideoPaused = true;
                        clearInterval(autoAdvanceInterval);
                    }
                });
                slide.addEventListener('ended', function() {
                    if (slides[currentSlide] !== this) return;
                    setTimeout(() => {
                        currentSlide = (currentSlide + 1) % slides.length;
                        showSlide(currentSlide);
                    }, 1000);
                });
            }
        });

        function showSlide(i) {
            clearInterval(autoAdvanceInterval);
            slides.forEach(slide => {
                slide.classList.remove('active');
                slide.style.display = 'none';
                if (slide.tagName === 'VIDEO') {
                    slide.pause();
                    slide.currentTime = 0;
                }
            });

            currentSlide = i;
            slides[currentSlide].classList.add('active');
            slides[currentSlide].style.display = 'block';
            updateCounter();

            if (slides[currentSlide].tagName === 'VIDEO') {
                isVideoPaused = true;
            } else {
                isVideoPaused = false;
                startAutoAdvance();
            }
        }

        function startAutoAdvance() {
            clearInterval(autoAdvanceInterval);
            if (!isVideoPaused) {
                autoAdvanceInterval = setInterval(() => {
                    if (slides[currentSlide] && slides[currentSlide].tagName !== 'VIDEO') {
                        currentSlide = (currentSlide + 1) % slides.length;
                        showSlide(currentSlide);
                    }
                }, 5000);
            }
        }

        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                showSlide((currentSlide - 1 + slides.length) % slides.length);
            });

            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                showSlide((currentSlide + 1) % slides.length);
            });
        }

        if (isMobile) {
            const slidesContainer = container.querySelector('.slides');
            if (slidesContainer) {
                slidesContainer.addEventListener('touchstart', function(e) {
                    touchStartX = e.changedTouches[0].screenX;
                }, { passive: true });

                slidesContainer.addEventListener('touchend', function(e) {
                    touchEndX = e.changedTouches[0].screenX;
                    const swipeThreshold = 50;
                    const swipeDistance = touchEndX - touchStartX;
                    if (Math.abs(swipeDistance) > swipeThreshold) {
                        if (swipeDistance > 0) {
                            showSlide((currentSlide - 1 + slides.length) % slides.length);
                        } else {
                            showSlide((currentSlide + 1) % slides.length);
                        }
                    }
                }, { passive: true });
            }
        }

        showSlide(0);
    }

    const slideshowContainers = document.querySelectorAll('.slideshow-container, .video-slideshow-container');
    slideshowContainers.forEach((container, index) => {
        initSlideshow(container, index);
    });
});
