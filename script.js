// Portfolio JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
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
        const nameText = 'FIRDOUS\nFATHIMA';
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
});
