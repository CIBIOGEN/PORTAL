document.addEventListener('DOMContentLoaded', () => {
    // === LÓGICA DEL CARRUSEL ARRASTRABLE ===
    const slider = document.getElementById('draggable-carousel');
    let isDown = false;
    let startX;
    let scrollLeft;

    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        slider.classList.add('active');
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener('mouseleave', () => {
        isDown = false;
        slider.classList.remove('active');
    });

    slider.addEventListener('mouseup', () => {
        isDown = false;
        slider.classList.remove('active');
    });

    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2; 
        slider.scrollLeft = scrollLeft - walk;
    });
    
    slider.addEventListener('touchstart', (e) => {
        isDown = true;
        startX = e.touches[0].pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    }, {passive: true});
    
    slider.addEventListener('touchend', () => {
        isDown = false;
    });
    
    slider.addEventListener('touchmove', (e) => {
        if(!isDown) return;
        const x = e.touches[0].pageX - slider.offsetLeft;
        const walk = (x - startX) * 2;
        slider.scrollLeft = scrollLeft - walk;
    }, {passive: true});

    // === LÓGICA DEL CANVAS (SINAPSIS NEURONAL) ===
    const canvas = document.getElementById('synapse-canvas');
    const ctx = canvas.getContext('2d');
    const container = document.getElementById('arc-container');
    const centerLogo = document.getElementById('center-logo');
    const childNodes = document.querySelectorAll('.child-logo');

    // Ajustar tamaño del canvas al contenedor
    function resizeCanvas() {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Dibuja una línea de estilo "rayo" o "sinapsis"
    function drawLightning(x1, y1, x2, y2, opacity) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        
        const segments = 6;
        for (let i = 1; i <= segments; i++) {
            const t = i / segments;
            let targetX = x1 + (x2 - x1) * t;
            let targetY = y1 + (y2 - y1) * t;
            
            // Añadir temblor (jitter) para simular electricidad/sinapsis
            if (i < segments) {
                targetX += (Math.random() - 0.5) * 15;
                targetY += (Math.random() - 0.5) * 15;
            }
            ctx.lineTo(targetX, targetY);
        }

        ctx.strokeStyle = `rgba(141, 240, 94, ${opacity})`;
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#8df05e';
        ctx.stroke();
    }

    // Bucle de animación principal
    function animateConnections(once) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Obtener posición actual del logo central
        const containerRect = container.getBoundingClientRect();
        const centerRect = centerLogo.getBoundingClientRect();
        
        const centerX = centerRect.left - containerRect.left + (centerRect.width / 2);
        const centerY = centerRect.top - containerRect.top + (centerRect.height / 2);

        // Dibujar conexiones hacia cada nodo hijo (equipo de estudio)
        childNodes.forEach(node => {
            const nodeRect = node.getBoundingClientRect();
            const nodeX = nodeRect.left - containerRect.left + (nodeRect.width / 2);
            const nodeY = nodeRect.top - containerRect.top + (nodeRect.height / 2);

            // Opacidad aleatoria para dar efecto de destello de energía (conecta y desconecta)
            const baseOpacity = 0.1;
            const randomFlash = Math.random() > 0.85 ? Math.random() * 0.8 : 0;
            const finalOpacity = baseOpacity + randomFlash;

            // Dibujar el rayo principal
            drawLightning(centerX, centerY, nodeX, nodeY, finalOpacity);
            
            // Ocasionalmente dibujar una bifurcación para más detalle
            if(Math.random() > 0.9) {
                drawLightning(centerX, centerY, nodeX + (Math.random()-0.5)*30, nodeY + (Math.random()-0.5)*30, finalOpacity * 0.5);
            }
        });

        if (!once) {
            requestAnimationFrame(animateConnections);
        }
    }

    // Iniciar animación (respetando la preferencia de movimiento reducido)
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        animateConnections(true); // un solo trazo estático, sin bucle
    } else {
        animateConnections();
    }
});