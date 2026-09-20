// js/synapse.js — animación de conexiones sinápticas del hero
(() => {
    const canvas = document.getElementById('synapse-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const container = document.getElementById('arc-container');
    const centerLogo = document.getElementById('center-logo');
    const childNodes = document.querySelectorAll('.child-logo');

    function resizeCanvas() {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    function drawLightning(x1, y1, x2, y2, opacity) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);

        const segments = 6;
        for (let i = 1; i <= segments; i++) {
            const t = i / segments;
            let targetX = x1 + (x2 - x1) * t;
            let targetY = y1 + (y2 - y1) * t;

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

    function animateConnections(once) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const containerRect = container.getBoundingClientRect();
        const centerRect = centerLogo.getBoundingClientRect();

        const centerX = centerRect.left - containerRect.left + (centerRect.width / 2);
        const centerY = centerRect.top - containerRect.top + (centerRect.height / 2);

        childNodes.forEach(node => {
            const nodeRect = node.getBoundingClientRect();
            const nodeX = nodeRect.left - containerRect.left + (nodeRect.width / 2);
            const nodeY = nodeRect.top - containerRect.top + (nodeRect.height / 2);

            const baseOpacity = 0.1;
            const randomFlash = Math.random() > 0.85 ? Math.random() * 0.8 : 0;
            const finalOpacity = baseOpacity + randomFlash;

            drawLightning(centerX, centerY, nodeX, nodeY, finalOpacity);

            if (Math.random() > 0.9) {
                drawLightning(centerX, centerY, nodeX + (Math.random() - 0.5) * 30, nodeY + (Math.random() - 0.5) * 30, finalOpacity * 0.5);
            }
        });

        if (!once) {
            requestAnimationFrame(animateConnections);
        }
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        animateConnections(true);
    } else {
        animateConnections();
    }
})();