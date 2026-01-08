// ============================================
// LifeFlex Landing Page - Simple Scripts
// ============================================

(function() {
    'use strict';

    // Ensure videos play when in viewport (for autoplay)
    const videos = document.querySelectorAll('.demo-video');
    
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Video is in viewport, ensure it plays
                const video = entry.target;
                if (video.paused) {
                    video.play().catch(err => {
                        // Autoplay may be blocked by browser
                        console.log('Autoplay prevented:', err);
                    });
                }
            } else {
                // Video is out of viewport, pause to save resources
                const video = entry.target;
                if (!video.paused) {
                    video.pause();
                }
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '50px'
    });

    // Observe all videos
    document.addEventListener('DOMContentLoaded', () => {
        videos.forEach(video => {
            videoObserver.observe(video);
        });
    });

    // Handle reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
        videos.forEach(video => {
            video.removeAttribute('autoplay');
        });
    }

})();
