// Mobile Video Optimization Script
document.addEventListener('DOMContentLoaded', function() {
    // Optimize all video elements for mobile
    const videos = document.querySelectorAll('video');
    
    videos.forEach(video => {
        // Add mobile-friendly attributes
        video.setAttribute('playsinline', 'true');
        video.setAttribute('webkit-playsinline', 'true');
        video.setAttribute('preload', 'metadata');
        
        // Optimize for mobile bandwidth
        if (window.innerWidth <= 768) {
            video.setAttribute('preload', 'none');
        }
        
        // Handle video loading errors gracefully
        video.addEventListener('error', function() {
            console.log('Video failed to load:', this.src);
            // You could add fallback behavior here
        });
        
        // Optimize video playback on mobile
        video.addEventListener('loadedmetadata', function() {
            // Ensure proper aspect ratio on mobile
            if (window.innerWidth <= 768) {
                this.style.maxHeight = '60vh';
                this.style.width = '100%';
                this.style.objectFit = 'contain';
            }
        });
    });
    
    // Add lazy loading for images and videos on mobile
    if ('IntersectionObserver' in window) {
        const lazyMediaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const media = entry.target;
                    if (media.dataset.src) {
                        media.src = media.dataset.src;
                        media.removeAttribute('data-src');
                    }
                    lazyMediaObserver.unobserve(media);
                }
            });
        });
        
        // Observe images and videos with data-src
        document.querySelectorAll('img[data-src], video[data-src]').forEach(media => {
            lazyMediaObserver.observe(media);
        });
    }
    
    // Fix touch events on navigation buttons
    const navButtons = document.querySelectorAll('.prev, .next, .nav-button, .feedback-toggle-btn, .pdf-toggle-btn');
    navButtons.forEach(button => {
        // Add visual feedback for touch without preventing default behavior
        button.addEventListener('touchstart', function(e) {
            this.style.opacity = '0.7';
            this.style.transform = 'scale(0.95)';
        }, { passive: true });
        
        button.addEventListener('touchend', function(e) {
            this.style.opacity = '1';
            this.style.transform = 'scale(1)';
            
            // Ensure click event fires on mobile
            if (!e.defaultPrevented) {
                // Trigger click event if it hasn't already fired
                setTimeout(() => {
                    this.click();
                }, 50);
            }
        }, { passive: true });
        
        button.addEventListener('touchcancel', function() {
            this.style.opacity = '1';
            this.style.transform = 'scale(1)';
        }, { passive: true });
        
        // Improve touch target size for better mobile usability
        if (button.classList.contains('prev') || button.classList.contains('next')) {
            button.style.minWidth = '44px';
            button.style.minHeight = '44px';
            button.style.touchAction = 'manipulation';
        }
    });
    
    // Optimize scroll performance on mobile
    let ticking = false;
    function updateOnScroll() {
        // Add any scroll-based optimizations here
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateOnScroll);
            ticking = true;
        }
    }, { passive: true });
    
    // Handle orientation changes
    window.addEventListener('orientationchange', function() {
        setTimeout(() => {
            // Recalculate video dimensions after orientation change
            videos.forEach(video => {
                if (window.innerWidth <= 768) {
                    video.style.maxHeight = '60vh';
                    video.style.width = '100%';
                }
            });
        }, 500);
    });
    
    // Prevent text selection on touch elements
    const touchElements = document.querySelectorAll('.slideshow-container, .prev, .next, .nav-button');
    touchElements.forEach(element => {
        element.style.webkitUserSelect = 'none';
        element.style.userSelect = 'none';
        element.style.webkitTouchCallout = 'none';
    });
});
