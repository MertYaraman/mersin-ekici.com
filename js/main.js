document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if(navLinks.classList.contains('active')){
                navLinks.classList.remove('active');
            }
        });
    });

    // 2. Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3. Scroll Animation (Fade in elements on scroll)
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const checkVisibility = () => {
        const triggerBottom = window.innerHeight * 0.85;
        
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            if (elementTop < triggerBottom) {
                element.classList.add('visible');
            }
        });
    };

    // Initial check
    checkVisibility();
    // Check on scroll
    window.addEventListener('scroll', checkVisibility);

    // 4. Set Current Year in Footer
    const yearSpan = document.getElementById('year');
    if(yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 5. Initialize Gallery Swiper
    if (document.querySelector('.gallerySwiper')) {
        new Swiper('.gallerySwiper', {
            slidesPerView: 1, // Default to 1 slide for mobile
            spaceBetween: 20,
            loop: true,
            autoplay: {
                delay: 5000, // Auto play every 5 seconds
                disableOnInteraction: false,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                    spaceBetween: 30,
                }
            }
        });
    }

    // --- One-Click Location Sharing Logic ---
    const sendLocationBtn = document.getElementById('sendLocationBtn');
    if (sendLocationBtn) {
        sendLocationBtn.addEventListener('click', () => {
            if (navigator.geolocation) {
                const originalText = sendLocationBtn.innerHTML;
                sendLocationBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Konum Bulunuyor...';
                sendLocationBtn.style.pointerEvents = 'none';

                let isResolved = false;

                const executeFallback = () => {
                    if (isResolved) return;
                    isResolved = true;
                    const fallbackMessage = "Merhaba Sercan Bey, yolda kaldım. Konumumu WhatsApp üzerinden gönderiyorum.";
                    const fallbackUrl = `https://wa.me/905432636006?text=${encodeURIComponent(fallbackMessage)}`;
                    sendLocationBtn.innerHTML = originalText;
                    sendLocationBtn.style.pointerEvents = 'auto';
                    window.open(fallbackUrl, '_blank');
                };

                // Eğer tarayıcı 3.5 saniye içinde cevap vermezse bekleme, direkt WhatsApp'a at!
                const timeoutId = setTimeout(executeFallback, 3500);

                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        if (isResolved) return;
                        isResolved = true;
                        clearTimeout(timeoutId);

                        const lat = position.coords.latitude;
                        const lng = position.coords.longitude;
                        const message = `Merhaba Sercan Bey, yolda kaldım. Konumum: https://www.google.com/maps?q=${lat},${lng}`;
                        const whatsappUrl = `https://wa.me/905432636006?text=${encodeURIComponent(message)}`;
                        
                        sendLocationBtn.innerHTML = originalText;
                        sendLocationBtn.style.pointerEvents = 'auto';
                        window.open(whatsappUrl, '_blank');
                    },
                    (error) => {
                        console.warn("Konum erişimi reddedildi veya alınamadı:", error);
                        clearTimeout(timeoutId);
                        executeFallback();
                    },
                    { enableHighAccuracy: false, timeout: 5000, maximumAge: 0 }
                );
            } else {
                alert("Tarayıcınız konum özelliğini desteklemiyor.");
            }
        });
    }
});
