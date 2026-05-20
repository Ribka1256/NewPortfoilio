/* ===== Projects Slider Logic ===== */
document.addEventListener('DOMContentLoaded', () => {
    
    const track = document.getElementById('projectTrack');
    const prevBtn = document.getElementById('projectPrevBtn');
    const nextBtn = document.getElementById('projectNextBtn');
    const projectsSection = document.getElementById('projects');
    
    // Select all project cards
    const slides = document.querySelectorAll('.project-card');
    const totalSlides = slides.length;
    
    let currentIndex = 0;
    let slidesPerView = 3; // Default Desktop
    let autoSlideInterval;

    // 1. Determine how many slides are visible based on screen width
    function updateSlidesPerView() {
        const width = window.innerWidth;
        if (width <= 480) {
            slidesPerView = 1;
        } else if (width <= 768) {
            slidesPerView = 2; // Mobile (as requested)
        } else {
            slidesPerView = 3; // Desktop/Tablet
        }
    }

    // 2. Move the slider
    function updateSliderPosition() {
        // Calculate percentage width of one slide
        const slideWidth = 100 / slidesPerView; 
        const translateX = -(currentIndex * slideWidth);
        track.style.transform = `translateX(${translateX}%)`;
    }

    // 3. Logic for Next Slide (Infinite Loop)
    function nextSlide() {
        const maxIndex = totalSlides - slidesPerView;

        if (currentIndex < maxIndex) {
            currentIndex++;
        } else {
            // Infinite Loop: Reset to start
            currentIndex = 0;
        }
        updateSliderPosition();
    }

    // 4. Logic for Prev Slide
    function prevSlide() {
        const maxIndex = totalSlides - slidesPerView;

        if (currentIndex > 0) {
            currentIndex--;
        } else {
            // Loop to the end
            currentIndex = maxIndex;
        }
        updateSliderPosition();
    }

    // 5. Auto Slide Logic
    function startAutoSlide() {
        // 8 seconds interval (within 7-10s range)
        autoSlideInterval = setInterval(nextSlide, 9000); 
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    // 6. Event Listeners
    nextBtn.addEventListener('click', () => {
        nextSlide();
        stopAutoSlide();
        startAutoSlide(); // Restart timer
    });

    prevBtn.addEventListener('click', () => {
        prevSlide();
        stopAutoSlide();
        startAutoSlide(); // Restart timer
    });

    // Pause on Hover
    projectsSection.addEventListener('mouseenter', stopAutoSlide);
    projectsSection.addEventListener('mouseleave', startAutoSlide);

    // Handle Window Resize
    window.addEventListener('resize', () => {
        updateSlidesPerView();
        // Reset position to prevent empty space if resizing significantly
        currentIndex = 0; 
        updateSliderPosition();
    });
    
    let touchStartX = 0;
    let touchEndX = 0;

    // 1. Touch Start: Record where the finger landed
    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoSlide(); // Pause auto-sliding while user interacts
    }, { passive: true });

    // 2. Touch End: Record where the finger lifted
    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoSlide(); // Resume auto-sliding
    }, { passive: true });

    // 3. Calculate Direction
    function handleSwipe() {
        const threshold = 50; // Min distance (px) to count as a swipe

        // Swipe Left (Show Next)
        if (touchStartX - touchEndX > threshold) {
            
            // Logic to prevent swiping past the last slide
            const maxIndex = totalSlides - slidesPerView;
            if (currentIndex < maxIndex) {
                currentIndex++;
            } else {
                currentIndex = 0; // Loop back to start
            }
            updateSliderPosition();
        }

        // Swipe Right (Show Prev)
        if (touchEndX - touchStartX > threshold) {
            
            // Logic to prevent swiping past the first slide
            const maxIndex = totalSlides - slidesPerView;
            if (currentIndex > 0) {
                currentIndex--;
            } else {
                currentIndex = maxIndex; // Loop to end
            }
            updateSliderPosition();
        }
    }

    // Initialize
    updateSlidesPerView();
    startAutoSlide();
});

document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -10% 0px"
    };

    const observer = new IntersectionObserver((entries, observerInstance) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const delay = parseInt(el.getAttribute('data-anim-delay') || '0', 10);
                setTimeout(() => {
                    el.classList.add('in-view');
                }, delay);
                observerInstance.unobserve(el);
            }
        });
    }, observerOptions);

    // Target ALL elements with class .animate-on-scroll
    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
});