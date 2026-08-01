document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card-3d');

    // Add 3D mouse move tilt effect to all cards
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - (rect.width / 2);
            const y = e.clientY - rect.top - (rect.height / 2);
            const rotateX = -(y / 15);
            const rotateY = (x / 15);
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            card.style.transition = `transform 0.5s ease-out`;
        });
        card.addEventListener('mouseenter', () => {
            card.style.transition = `none`;
        });
    });

    // Add scroll-reveal IntersectionObserver
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -50px 0px', threshold: 0.1 });

    const revealItems = document.querySelectorAll('.reveal-item');
    revealItems.forEach(item => observer.observe(item));

    // ----------------------------------------------------
    // Aesthetic 3D Bokeh Background
    // ----------------------------------------------------
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        
        let initialWidth = window.innerWidth;
        function resize() {
            // Only resize canvas if WIDTH changes (fixes mobile scroll bar hiding flicker)
            if (window.innerWidth !== initialWidth || !width) {
                initialWidth = window.innerWidth;
                width = canvas.width = window.innerWidth;
                height = canvas.height = window.innerHeight;
            }
        }
        window.addEventListener('resize', resize);
        resize();

        // Create particles
        const particleCount = window.innerWidth < 768 ? 20 : 40;
        const colors = [
            'rgba(255, 182, 193, 0.4)',  // LightPink
            'rgba(219, 112, 147, 0.3)',  // PaleVioletRed
            'rgba(255, 240, 245, 0.6)',  // LavenderBlush
            'rgba(255, 255, 255, 0.5)'   // White
        ];

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 80 + 20, // Huge glowing orbs
                vx: (Math.random() - 0.5) * 0.5, // Slow movement
                vy: (Math.random() - 0.5) * 0.5,
                color: colors[Math.floor(Math.random() * colors.length)],
                phase: Math.random() * Math.PI * 2 // For pulsing effect
            });
        }

        let mouseX = width / 2;
        let mouseY = height / 2;
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animate() {
            ctx.clearRect(0, 0, width, height);

            // Draw a subtle soft pink gradient over the whole canvas
            const bgGradient = ctx.createLinearGradient(0, 0, width, height);
            bgGradient.addColorStop(0, '#fff0f5');
            bgGradient.addColorStop(0.5, '#ffffff');
            bgGradient.addColorStop(1, '#ffe4e1');
            ctx.fillStyle = bgGradient;
            ctx.fillRect(0, 0, width, height);

            particles.forEach(p => {
                // Parallax response to mouse
                const dx = mouseX - p.x;
                const dy = mouseY - p.y;
                
                // Slow drift
                p.x += p.vx;
                p.y += p.vy;

                // Gentle pulsing size
                p.phase += 0.01;
                const currentRadius = p.radius + Math.sin(p.phase) * 10;

                // Screen wrap
                if (p.x < -100) p.x = width + 100;
                if (p.x > width + 100) p.x = -100;
                if (p.y < -100) p.y = height + 100;
                if (p.y > height + 100) p.y = -100;

                // Subtle parallax (particles move slightly away from mouse based on size)
                const parallaxForce = (100 / currentRadius) * 0.02;
                p.x -= dx * parallaxForce;
                p.y -= dy * parallaxForce;

                // Draw glowing orb
                const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, currentRadius);
                gradient.addColorStop(0, p.color);
                gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                
                ctx.beginPath();
                ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();
            });

            requestAnimationFrame(animate);
        }
        animate();
    }
});
