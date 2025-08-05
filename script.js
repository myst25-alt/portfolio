// Portfolio JavaScript functionality - Enhanced Mobile Support
document.addEventListener('DOMContentLoaded', function() {
    // Mobile detection
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isAndroid = /Android/i.test(navigator.userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    
    // Add mobile class to body for CSS targeting
    if (isMobile) {
        document.body.classList.add('mobile-device');
    }
    if (isAndroid) {
        document.body.classList.add('android-device');
    }
    if (isIOS) {
        document.body.classList.add('ios-device');
    }
    
    // Prevent zoom on form elements (mobile)
    if (isMobile) {
        document.addEventListener('touchstart', function(e) {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        }, { passive: false });
        
        let lastTouchEnd = 0;
        document.addEventListener('touchend', function(e) {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, { passive: false });
    }
    
    // Sticky header functionality
    const stickyHeader = document.getElementById('stickyHeader');
    const heroSection = document.getElementById('hero');
    
    // Function to handle scroll events
    function handleScroll() {
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        
        // Show header when scrolled past 80% of hero section
        if (scrollPosition > heroBottom * 0.8) {
            stickyHeader.classList.add('visible');
        } else {
            stickyHeader.classList.remove('visible');
        }
    }
    
    // Multiple scroll event listeners for better Windows compatibility
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('wheel', handleScroll, { passive: true });
    document.addEventListener('scroll', handleScroll, { passive: true });
    
    // Throttle scroll events for better performance
    let ticking = false;
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(handleScroll);
            ticking = true;
            setTimeout(() => { ticking = false; }, 16); // ~60fps
        }
    }
    
    window.addEventListener('scroll', requestTick, { passive: true });
    window.addEventListener('wheel', requestTick, { passive: true });
    
    // Additional Windows-specific scroll detection
    document.addEventListener('mousewheel', requestTick, { passive: true }); // IE/Edge
    document.addEventListener('DOMMouseScroll', requestTick, { passive: true }); // Firefox
    
    // Intersection Observer for sticky header as backup
    const headerObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                stickyHeader.classList.add('visible');
            } else {
                stickyHeader.classList.remove('visible');
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -20% 0px'
    });
    
    headerObserver.observe(heroSection);

    // Smooth scrolling for internal links
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add intersection observer for animations
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

    // Observe all sections for animation
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // Card hover effects
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add typewriter effect to the name
    const nameElement = document.getElementById('typewriter-name');
    if (nameElement) {
        const nameText = 'FIRDOUS\nFATIMA';
        nameElement.innerHTML = '<span class="cursor">|</span>'; // Start with just cursor
        
        // After a short delay, start the typewriter effect
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
                    // Remove cursor after typing is complete
                    setTimeout(() => {
                        nameElement.innerHTML = currentText;
                    }, 2000);
                }
            };
            
            typeWriter();
        }, 500);
    }

    // Removed gradient animation to improve performance
    // The hero section now uses static styling

    // Slideshow functionality for images and videos - Enhanced Mobile Support
    function initSlideshow(container) {
        const slides = container.querySelectorAll('.slides > *');
        const prevBtn = container.querySelector('.prev');
        const nextBtn = container.querySelector('.next');
        let currentSlide = 0;
        let autoAdvanceInterval;
        let isVideoPaused = false;
        let touchStartX = 0;
        let touchEndX = 0;

        if (slides.length === 0) return;

        // Add touch/swipe support for mobile
        if (isMobile) {
            const slidesContainer = container.querySelector('.slides');
            
            slidesContainer.addEventListener('touchstart', function(e) {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });
            
            slidesContainer.addEventListener('touchend', function(e) {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            }, { passive: true });
            
            function handleSwipe() {
                const swipeThreshold = 50;
                const swipeDistance = touchEndX - touchStartX;
                
                if (Math.abs(swipeDistance) > swipeThreshold) {
                    if (swipeDistance > 0) {
                        // Swipe right - previous slide
                        isVideoPaused = false;
                        clearInterval(autoAdvanceInterval);
                        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
                        showSlide(currentSlide);
                    } else {
                        // Swipe left - next slide
                        isVideoPaused = false;
                        clearInterval(autoAdvanceInterval);
                        currentSlide = (currentSlide + 1) % slides.length;
                        showSlide(currentSlide);
                    }
                }
            }
        }

        // Show first slide
        slides[0].classList.add('active');
        slides[0].style.display = 'block';

        function showSlide(index) {
            slides.forEach((slide, idx) => {
                slide.classList.remove('active');
                slide.style.display = 'none';
                
                // Pause videos when not active
                if (slide.tagName === 'VIDEO') {
                    slide.pause();
                    slide.currentTime = 0;
                }
            });
            
            slides[index].classList.add('active');
            slides[index].style.display = 'block';
            
            // Handle video events for the current slide
            if (slides[index].tagName === 'VIDEO') {
                const video = slides[index];
                
                // Add mobile-specific video attributes
                if (isMobile) {
                    video.setAttribute('playsinline', 'true');
                    video.setAttribute('webkit-playsinline', 'true');
                    video.muted = false; // Allow unmuted on mobile
                }
                
                // Add event listeners for video control
                video.addEventListener('play', () => {
                    isVideoPaused = true;
                    clearInterval(autoAdvanceInterval);
                });
                
                video.addEventListener('pause', () => {
                    if (!video.ended) {
                        isVideoPaused = true;
                        clearInterval(autoAdvanceInterval);
                    }
                });
                
                video.addEventListener('ended', () => {
                    isVideoPaused = false;
                    startAutoAdvance();
                    // Auto advance to next slide when video ends
                    setTimeout(() => {
                        if (!isVideoPaused) {
                            currentSlide = (currentSlide + 1) % slides.length;
                            showSlide(currentSlide);
                        }
                    }, 1000);
                });
            } else {
                // For images, ensure auto-advance is running
                isVideoPaused = false;
                startAutoAdvance();
            }
        }

        function startAutoAdvance() {
            clearInterval(autoAdvanceInterval);
            if (!isVideoPaused) {
                autoAdvanceInterval = setInterval(() => {
                    if (!isVideoPaused) {
                        currentSlide = (currentSlide + 1) % slides.length;
                        showSlide(currentSlide);
                    }
                }, 5000);
            }
        }

        if (prevBtn && nextBtn) {
            // Enhanced button handling for mobile
            const handlePrevClick = () => {
                isVideoPaused = false;
                clearInterval(autoAdvanceInterval);
                currentSlide = (currentSlide - 1 + slides.length) % slides.length;
                showSlide(currentSlide);
            };
            
            const handleNextClick = () => {
                isVideoPaused = false;
                clearInterval(autoAdvanceInterval);
                currentSlide = (currentSlide + 1) % slides.length;
                showSlide(currentSlide);
            };
            
            prevBtn.addEventListener('click', handlePrevClick);
            nextBtn.addEventListener('click', handleNextClick);
            
            // Add touch event handlers for better mobile responsiveness
            if (isMobile) {
                prevBtn.addEventListener('touchend', function(e) {
                    e.preventDefault();
                    handlePrevClick();
                }, { passive: false });
                
                nextBtn.addEventListener('touchend', function(e) {
                    e.preventDefault();
                    handleNextClick();
                }, { passive: false });
            }
        }

        // Start auto advance for the initial slide
        if (slides[0] && slides[0].tagName === 'IMG') {
            startAutoAdvance();
        }
        
        // Handle initial slide if it's a video
        if (slides[0] && slides[0].tagName === 'VIDEO') {
            const video = slides[0];
            video.addEventListener('play', () => {
                isVideoPaused = true;
                clearInterval(autoAdvanceInterval);
            });
            
            video.addEventListener('pause', () => {
                if (!video.ended) {
                    isVideoPaused = true;
                    clearInterval(autoAdvanceInterval);
                }
            });
            
            video.addEventListener('ended', () => {
                isVideoPaused = false;
                startAutoAdvance();
                setTimeout(() => {
                    if (!isVideoPaused) {
                        currentSlide = (currentSlide + 1) % slides.length;
                        showSlide(currentSlide);
                    }
                }, 1000);
            });
        }
    }

    // Initialize all slideshows
    const slideshowContainers = document.querySelectorAll('.slideshow-container, .video-slideshow-container');
    slideshowContainers.forEach(initSlideshow);
});
