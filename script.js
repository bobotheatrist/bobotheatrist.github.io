//function to detect whether the user is on the phone
function isMobileDevice() {
    return window.innerWidth <= 768;
}

document.addEventListener('DOMContentLoaded', function() {
    const enLink = document.getElementById('en-lang-link');
    const hrLink = document.getElementById('hr-lang-link');

    // Function to handle language change events
    const handleLanguageClick = (lang, e) => {
        if (e) e.preventDefault(); // Prevent full page reload
        changeLanguage(lang);
        // Update the URL in the browser's address bar
        history.pushState({lang: lang}, '', `?lang=${lang}`);
    };

    // Add event listeners
    enLink.addEventListener('click', (e) => handleLanguageClick('en', e));
    hrLink.addEventListener('click', (e) => handleLanguageClick('hr', e));

    // Function to change the language
    function changeLanguage(lang) {
        // Set the lang attribute of the html tag
        document.documentElement.lang = lang;

        // Update all elements with data-key attribute
        document.querySelectorAll('[data-key]').forEach(element => {
            const key = element.getAttribute('data-key');
            if (translations[lang] && translations[lang][key]) {
                // For meta tags, update the content attribute
                if (element.tagName === 'META') {
                    element.setAttribute('content', translations[lang][key]);
                } else {
                    element.innerHTML = translations[lang][key];
                }
            }
        });

        // Update the active language switcher
        if (lang === 'en') {
            enLink.classList.add('active');
            hrLink.classList.remove('active');
        } else {
            hrLink.classList.add('active');
            enLink.classList.remove('active');
        }

        // Update WhatsApp link with localized message
        updateWhatsAppLink(lang);
    }

    // WhatsApp anti-scraping and localization logic
    function updateWhatsAppLink(lang) {
        const waLink = document.getElementById('whatsapp-laser-link');
        if (!waLink) return;

        // Obfuscated number parts
        const p1 = '385';
        const p2 = '9761';
        const p3 = '24672';
        
        const message = translations[lang]['whatsapp_message'] || '';
        const encodedMessage = encodeURIComponent(message);
        
        waLink.href = `https://wa.me/${p1}${p2}${p3}?text=${encodedMessage}`;
    }

    // Determine language from URL parameter on initial load
    const urlParams = new URLSearchParams(window.location.search);
    const initialLang = urlParams.get('lang') || 'hr'; // Default to Croatian
    changeLanguage(initialLang);

    // Handle browser back/forward navigation
    window.onpopstate = function(event) {
        const stateLang = event.state ? event.state.lang : (new URLSearchParams(window.location.search).get('lang') || 'hr');
        changeLanguage(stateLang);
    };

    // Navbar scroll behavior
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hero fade-out and blur effect
        const heroContent = document.querySelector('.hero-content');
        const heroBackground = document.querySelector('.hero-background');
        const scrollPosition = window.scrollY;
        const fadeStart = 20; // Start fading at 100px scroll
        const fadeEnd = 50; // Fully faded at 400px scroll
        const blurStart = 50;
        const blurEnd = 200;
        
        // Calculate opacity and blur based on scroll position
        let opacity = 1;
        let blur = 0;
        
        if (scrollPosition > fadeStart) {
            opacity = 1 - Math.min(1, (scrollPosition - fadeStart) / (fadeEnd - fadeStart));
        }
        
        if (scrollPosition > blurStart) {
            blur = Math.min(10, (scrollPosition - blurStart) / (blurEnd - blurStart) * 10);
        }
        
        if (heroContent) heroContent.style.opacity = opacity;
        if (heroBackground) heroBackground.style.filter = `blur(${blur}px)`;
    });
    
    // Mobile menu toggle with animation
    const menuToggle = document.getElementById('menu-toggle');
    

    // Card scrolling functionality with improved timing. The Picture links are in the CSS (adding the class changes the image)
    const cardsSection = document.getElementById('cards');
    const cardsContainer = document.querySelector('.card-container');
    const cards = document.querySelectorAll('.card');
    let currentCardIndex = 0;
    
    function updateCardPosition() {
        // Skip animation on mobile devices
        if (isMobileDevice()) {
            return;
        }

        cards.forEach((card, index) => {
            card.classList.remove('active', 'previous');
            
            if (index === currentCardIndex) {
                card.classList.add('active');
            } else if (index < currentCardIndex) {
                card.classList.add('previous');
            }
        });
    }
    
    // Initialize the first card (only on desktop)
    if (!isMobileDevice()) {
        updateCardPosition();
    }
        
    // Enhanced scroll handling for cards
    function handleCardsScroll() {
        // Skip scroll handling on mobile devices
        if (isMobileDevice()) {
            return;
        }

        const cardsSectionTop = cardsSection.offsetTop;
        const cardsSectionHeight = cardsSection.offsetHeight;
        const scrollPosition = window.scrollY;
        
        // Calculate progress through cards section (0 to 1)
        const cardsProgress = Math.max(0, Math.min(1, 
            (scrollPosition - cardsSectionTop) / (cardsSectionHeight - window.innerHeight)
        ));
        
        // Determine which card should be active based on scroll progress
        // Give the first card extra time to be read, then balance the remaining two
        // Card 1: 0% to 50%, Card 2: 50% to 75%, Card 3: 75% to 100%
        let newCardIndex = 0;
        
        if (cardsProgress < 0.5) {
            newCardIndex = 0;
        } else if (cardsProgress < 0.75) {
            newCardIndex = 1;
        } else {
            newCardIndex = 2;
        }
        
        if (newCardIndex !== currentCardIndex) {
            currentCardIndex = newCardIndex;
            updateCardPosition();
        }
    }
    
    // Remove the old wheel event listener and use scroll instead
    window.addEventListener('scroll', handleCardsScroll);
    
    // Smooth hero transition with improved timing
    window.addEventListener('scroll', function() {
        // Skip hero fade on mobile devices
        if (isMobileDevice()) {
            return;
        }

        const scrollPosition = window.scrollY;
        const cardsSection = document.getElementById('cards');
        const servicesSection = document.getElementById('services');
        const cardsEnd = cardsSection.offsetTop + cardsSection.offsetHeight;
        const hero = document.getElementById('hero');
        
        // Hero fade starts when cards section ends
        const scrollPastCards = Math.max(0, scrollPosition - cardsEnd + window.innerHeight * 0.95);
        const maxFade = window.innerHeight * 0.95; // Fade over 80% of viewport height
        
        if (scrollPastCards > 0 && scrollPastCards < maxFade) {
            // Calculate fade opacity (1 to 0)
            const opacity = 1 - (scrollPastCards / maxFade);
            hero.style.opacity = opacity;
        } else if (scrollPastCards >= maxFade) {
            hero.style.opacity = '0';
        } else {
            hero.style.opacity = '1';
        }
    });

    // Handle window resize to re-evaluate mobile state
    window.addEventListener('resize', function() {
        if (isMobileDevice()) {
            // Remove all card classes when switching to mobile
            cards.forEach(card => {
                card.classList.remove('active', 'previous');
            });
            // Reset hero opacity on mobile
            document.getElementById('hero').style.opacity = '1';
        } else {
            // Re-initialize desktop behavior
            updateCardPosition();
        }
    });

    const navMenu = document.getElementById('nav-menu');
    
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('open');
    });
    
    // Navigation smooth scroll
    const navLinks = document.querySelectorAll('nav ul li a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close mobile menu if open
            navMenu.classList.remove('active');
            
            // Get the target section
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Smooth scroll to target
                window.scrollTo({
                    top: targetSection.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Update active link
                navLinks.forEach(link => link.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
    
    // Gallery modal with carousel functionality
    const galleryItems = document.querySelectorAll('.gallery-item');
    const modal = document.getElementById('imageModal');
    const modalCarousel = document.getElementById('modalCarousel');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const closeModal = document.getElementById('closeModal');
    const prevImage = document.getElementById('prevImage');
    const nextImage = document.getElementById('nextImage');
    const imageCounter = document.getElementById('imageCounter');
    
    let currentImageIndex = 0;
    let projectImages = [];
    
    galleryItems.forEach(item => {
        item.addEventListener('click', async () => {
            const clickedImg = item.querySelector('img');
            const project = item.getAttribute('data-project');
            const lang = document.documentElement.lang;

            const title = translations[lang][`project_${project}_modal_title`];
            const description = translations[lang][`project_${project}_description`];
            
            // Get project folder from image path
            const imgPath = clickedImg.src;
            const projectName = imgPath.match(/projects\/([^\/]+)/)[1];
            
            // Find all images in this project folder
            projectImages = await getProjectImages(projectName);
            
            // Set title/description
            modalTitle.textContent = title;
            modalDescription.textContent = description;
            
            // Populate carousel
            populateCarousel(projectImages);
            
            // Show first image
            showImage(0);
            
            // Show modal
            modal.style.display = 'flex';
        });
    });
    
    function getProjectImages(projectName) {
        // Hardcoded image paths for each project
        const projectImages = {
            'blaz': [
                'images/projects/blaz/1.webp',
                'images/projects/blaz/2.webp',
                'images/projects/blaz/3.webp',
                'images/projects/blaz/4.webp',
                'images/projects/blaz/5.webp',
                'images/projects/blaz/6.webp',
                'images/projects/blaz/7.webp',
                'images/projects/blaz/8.webp',
                'images/projects/blaz/9.webp',
                'images/projects/blaz/10.webp',
                'images/projects/blaz/11.webp'
            ],
            'gunduliceva': [
                'images/projects/gunduliceva/0.webp',
                'images/projects/gunduliceva/1.webp',
                'images/projects/gunduliceva/1a.webp',
                'images/projects/gunduliceva/2.webp',
                'images/projects/gunduliceva/3.webp',
                'images/projects/gunduliceva/4.webp',
                'images/projects/gunduliceva/5.webp',
                'images/projects/gunduliceva/6.webp',
                'images/projects/gunduliceva/7.webp',
                'images/projects/gunduliceva/8.webp',
                'images/projects/gunduliceva/9.webp',
                'images/projects/gunduliceva/10.webp',
                'images/projects/gunduliceva/11.webp',
                'images/projects/gunduliceva/12.webp',
                'images/projects/gunduliceva/13.webp',
                'images/projects/gunduliceva/14.webp',
                'images/projects/gunduliceva/15.webp',
                'images/projects/gunduliceva/16.webp',
                'images/projects/gunduliceva/17.webp',
                'images/projects/gunduliceva/18.webp',
                'images/projects/gunduliceva/18b.webp',
                'images/projects/gunduliceva/18c.webp',
                'images/projects/gunduliceva/19.webp',
                'images/projects/gunduliceva/20.webp',
                'images/projects/gunduliceva/21.webp',
                'images/projects/gunduliceva/22.webp',
                'images/projects/gunduliceva/23.webp',
                'images/projects/gunduliceva/24.webp',
                'images/projects/gunduliceva/25.webp',
                'images/projects/gunduliceva/26.webp',
                'images/projects/gunduliceva/27.webp',
                'images/projects/gunduliceva/28.webp',
                'images/projects/gunduliceva/29.webp',
                'images/projects/gunduliceva/30.webp',
                'images/projects/gunduliceva/31.webp',
                'images/projects/gunduliceva/32.webp',
                'images/projects/gunduliceva/33.webp',
                'images/projects/gunduliceva/34.webp',
                'images/projects/gunduliceva/35.webp',
                'images/projects/gunduliceva/36.webp',
                'images/projects/gunduliceva/37.webp'
            ],
            'hazu': [
                'images/projects/hazu/0.webp',
                'images/projects/hazu/1.webp',
                'images/projects/hazu/2.webp',
                'images/projects/hazu/3.webp',
                'images/projects/hazu/4.webp',
                'images/projects/hazu/5.webp',
                'images/projects/hazu/6.webp',
                'images/projects/hazu/7.webp',
                'images/projects/hazu/8.webp',
                'images/projects/hazu/9.webp',
                'images/projects/hazu/10.webp',
                'images/projects/hazu/11.webp',
                'images/projects/hazu/12.webp',
                'images/projects/hazu/13.webp',
                'images/projects/hazu/14.webp',
                'images/projects/hazu/15.webp',
                'images/projects/hazu/16.webp'
            ],
            'kaptol': [
                'images/projects/kaptol/0.webp',
                'images/projects/kaptol/1.webp',
                'images/projects/kaptol/2.webp',
                'images/projects/kaptol/3.webp',
                'images/projects/kaptol/4.webp',
                'images/projects/kaptol/5.webp',
                'images/projects/kaptol/6.webp',
                'images/projects/kaptol/7.webp',
                'images/projects/kaptol/8.webp',
                'images/projects/kaptol/9.webp',
                'images/projects/kaptol/10.webp',
                'images/projects/kaptol/11.webp',
                'images/projects/kaptol/12.webp',
                'images/projects/kaptol/13.webp'
            ],
            'scagliola': [
                'images/projects/scagliola/0.webp',
                'images/projects/scagliola/1.webp',
                'images/projects/scagliola/2.webp',
                'images/projects/scagliola/3.webp',
                'images/projects/scagliola/4.webp',
                'images/projects/scagliola/5.webp',
                'images/projects/scagliola/6.webp',
                'images/projects/scagliola/7.webp',
                'images/projects/scagliola/8.webp',
                'images/projects/scagliola/9.webp',
                'images/projects/scagliola/10.webp',
                'images/projects/scagliola/11.webp',
                'images/projects/scagliola/12.webp',
                'images/projects/scagliola/13.webp',
                'images/projects/scagliola/14.webp',
                'images/projects/scagliola/15.webp',
                'images/projects/scagliola/16.webp',
                'images/projects/scagliola/17.webp',
                'images/projects/scagliola/18.webp',
                'images/projects/scagliola/19.webp',
                'images/projects/scagliola/20.webp',
                'images/projects/scagliola/21.webp',
                'images/projects/scagliola/22.webp',
                'images/projects/scagliola/23.webp',
                'images/projects/scagliola/24.webp',
                'images/projects/scagliola/25.webp',
                'images/projects/scagliola/26.webp'
            ],
            'oltar': [
                'images/projects/oltar/0.webp',
                'images/projects/oltar/1.webp',
                'images/projects/oltar/2.webp',
                'images/projects/oltar/3.webp',
                'images/projects/oltar/4.webp',
                'images/projects/oltar/5.webp',
                'images/projects/oltar/6.webp',
                'images/projects/oltar/7.webp',
                'images/projects/oltar/8.webp',
                'images/projects/oltar/9.webp',
                'images/projects/oltar/10.webp'
            ],
            'golubovec': [
                'images/projects/golubovec/0.webp',
                'images/projects/golubovec/1.webp',
                'images/projects/golubovec/2.webp',
                'images/projects/golubovec/3.webp',
                'images/projects/golubovec/4.webp',
                'images/projects/golubovec/5.webp',
                'images/projects/golubovec/6.webp',
                'images/projects/golubovec/7.webp',
                'images/projects/golubovec/8.webp',
                'images/projects/golubovec/9.webp',
                'images/projects/golubovec/10.webp',
                'images/projects/golubovec/11.webp'
            ]
        };

        return projectImages[projectName] || [];
    }
    
    function populateCarousel(images) {
        modalCarousel.innerHTML = '';
        const thumbnailsContainer = document.getElementById('modalThumbnails');
        thumbnailsContainer.innerHTML = '';
        
        images.forEach((imgSrc, index) => {
            // Create main slide
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';
            if (index === 0) slide.classList.add('active');
            
            const img = document.createElement('img');
            img.src = imgSrc;
            img.alt = `Project image ${index + 1}`;
            
            slide.appendChild(img);
            modalCarousel.appendChild(slide);

            // Create thumbnail
            const thumbnail = document.createElement('img');
            thumbnail.src = imgSrc;
            thumbnail.className = 'thumbnail';
            thumbnail.dataset.index = index;
            if (index === 0) thumbnail.classList.add('active');
            
            thumbnail.addEventListener('click', () => {
                showImage(index);
            });
            
            thumbnailsContainer.appendChild(thumbnail);
        });
    }
    
    function showImage(index) {
        const slides = document.querySelectorAll('.modal-carousel .carousel-slide');
        const thumbnails = document.querySelectorAll('.thumbnail');
        if (!slides.length) return;
        
        // Update current index
        currentImageIndex = (index + slides.length) % slides.length;
        
    // Remove active class from all slides
    slides.forEach(slide => {
        slide.classList.remove('active');
    });
    
    // Set current slide as active
    slides[currentImageIndex].classList.add('active');
    
    // Update active thumbnail
    thumbnails.forEach(thumb => thumb.classList.remove('active'));
    thumbnails[currentImageIndex].classList.add('active');
        
        // Scroll thumbnail into view
        thumbnails[currentImageIndex].scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
        });
        
        // Update counter
        imageCounter.textContent = `${currentImageIndex + 1}/${slides.length}`;
    }
    
    // Navigation event listeners
    prevImage.addEventListener('click', () => showImage(currentImageIndex - 1));
    nextImage.addEventListener('click', () => showImage(currentImageIndex + 1));
    
    // Swipe functionality for modal carousel
    let modalTouchStartX = 0;
    let modalTouchEndX = 0;
    
    modalCarousel.addEventListener('touchstart', e => {
        modalTouchStartX = e.changedTouches[0].clientX;
    });
    
    modalCarousel.addEventListener('touchend', e => {
        modalTouchEndX = e.changedTouches[0].clientX;
        const threshold = 50; // Minimum swipe distance
        
        if (modalTouchStartX - modalTouchEndX > threshold) {
            // Swipe left - next image
            showImage(currentImageIndex + 1);
        } else if (modalTouchEndX - modalTouchStartX > threshold) {
            // Swipe right - previous image
            showImage(currentImageIndex - 1);
        }
    });
    
    // Close modal handlers
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Keyboard navigation for modal
    document.addEventListener('keydown', (e) => {
        if (modal.style.display === 'flex') {
            if (e.key === 'ArrowLeft') {
                showImage(currentImageIndex - 1);
            } else if (e.key === 'ArrowRight') {
                showImage(currentImageIndex + 1);
            } else if (e.key === 'Escape') {
                modal.style.display = 'none';
            }
        }
    });
    
    // Update active nav link on scroll
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
});
