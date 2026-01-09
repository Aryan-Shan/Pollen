export class Dandelion {
    constructor(container) {
        // Container is #dandelion-container, but we target the .dandelion inside it or create it
        this.container = container.querySelector('#dandelion') || container;
        this.mode = 'idle';
        this.idleInterval = null;
        this.init();
    }

    init() {
        this.build();
        this.startIdleAnimation();
    }

    startIdleAnimation() {
        if (this.idleInterval) clearInterval(this.idleInterval);
        this.idleInterval = setInterval(() => {
            if (this.mode === 'idle') {
                this.shedSubtleSeed();
            }
        }, 3000); // Shed every 3 seconds
    }

    shedSubtleSeed() {
        const head = this.container.querySelector('.head');
        if (!head) return;

        // Pick an existing regular seed that isn't already shedding
        const seeds = head.querySelectorAll('.seed-wrapper.outter:not(.idle-shed):not(.receiving-seed)');

        // If it's getting too sparse, don't shed or refill? Refill happens on mode change.
        // Let's just stop shedding if below 20 seeds to keep it looking like a dandelion.
        if (seeds.length < 20) return;

        const target = seeds[Math.floor(Math.random() * seeds.length)];
        target.classList.add('idle-shed');

        // Cleanup after idle fly completes
        setTimeout(() => {
            if (target.parentNode === head) target.remove();
        }, 8500);
    }

    build() {
        const oldHead = this.container.querySelector('.head');
        const persistentSeeds = oldHead ? Array.from(oldHead.querySelectorAll('.receiving-seed')) : [];

        this.container.innerHTML = '';

        // Structure: .head > .seed-wrapper.outter > .seed-wrapper.inner > .seed > .feather*12
        const head = document.createElement('div');
        head.className = 'head';

        const seedsCount = 60; // Denser

        for (let i = 1; i <= seedsCount; i++) {
            const outer = document.createElement('div');
            outer.className = 'seed-wrapper outter';

            const inner = document.createElement('div');
            inner.className = 'seed-wrapper inner';

            const seed = document.createElement('div');
            seed.className = 'seed';

            // Seed Rotation: Spread in a circle
            const seedRotation = (i * 360) / seedsCount;
            // Add some randomness to naturalize
            const randomOffset = (Math.random() - 0.5) * 10;
            seed.style.transform = `rotate(${seedRotation + randomOffset}deg)`;

            // Feathers (12 per seed) - Visual detail
            // For DOM performance, maybe reduce count or use SVG image for feather bunch?
            // Provided loop had 12 feathers. Let's do 4 for performance + visual enough.
            for (let j = 1; j <= 6; j++) {
                const feather = document.createElement('div');
                feather.className = 'feather';

                // Fan them out
                const fRot = (j - 3.5) * 20;
                feather.style.transform = `translateX(-50%) rotate(${fRot}deg)`;

                seed.appendChild(feather);
            }

            inner.appendChild(seed);
            outer.appendChild(inner);
            head.appendChild(outer);

            // Assign animation delays via custom properties
            // Randomize index for "natural" release order instead of linear
            const delayIndex = Math.random() * 20;
            outer.style.setProperty('--i', delayIndex);
        }

        // Re-attach persistent seeds
        persistentSeeds.forEach(s => head.appendChild(s));

        this.container.appendChild(head);

        // Add stem
        const stem = document.createElement('div');
        stem.style.position = 'absolute';
        stem.style.bottom = '0';
        stem.style.left = '50%';
        stem.style.width = '4px';
        stem.style.height = '50%';
        stem.style.background = '#4a8c76';
        stem.style.transform = 'translateX(-50%)';
        stem.style.zIndex = '-1';
        this.container.appendChild(stem);
    }

    setMode(mode) {
        this.mode = mode;
        if (mode === 'send') {
            this.container.classList.add('transferring');
            // Reset after animation
            setTimeout(() => {
                this.container.classList.remove('transferring');
                this.build(); // Refill header
            }, 8000);
        } else if (mode === 'receive') {
            this.playReceivingAnimation();
        }
    }

    playReceivingAnimation() {
        const head = this.container.querySelector('.head');
        if (!head) return;

        // Create temporary yellow seeds drifting in
        const count = 30;
        for (let i = 0; i < count; i++) {
            const outer = document.createElement('div');
            outer.className = 'seed-wrapper outter receiving-seed';

            const inner = document.createElement('div');
            inner.className = 'seed-wrapper inner';

            const seed = document.createElement('div');
            seed.className = 'seed';

            // Random target rotation on head
            const rot = Math.random() * 360;
            seed.style.transform = `rotate(${rot}deg)`;

            for (let j = 0; j < 4; j++) {
                const feather = document.createElement('div');
                feather.className = 'feather';
                const fRot = (j - 1.5) * 20;
                feather.style.transform = `translateX(-50%) rotate(${fRot}deg)`;
                seed.appendChild(feather);
            }

            inner.appendChild(seed);
            outer.appendChild(inner);

            // Organic delay and landing spread
            outer.style.setProperty('--i', Math.random() * 8); // Shorter duration spread
            outer.style.left = '50%';
            outer.style.bottom = '50%';

            head.appendChild(outer);

            // NO CLEANUP - seeds stay stuck as requested
        }
    }

    clearPollen() {
        const head = this.container.querySelector('.head');
        if (head) {
            const persistentSeeds = head.querySelectorAll('.receiving-seed');
            persistentSeeds.forEach(s => {
                // Animate them falling off or just remove?
                // Let's make them fade out
                s.style.transition = 'opacity 2s ease-out, transform 2s ease-in';
                s.style.opacity = '0';
                s.style.transform = 'translateY(100vh)';
                setTimeout(() => s.remove(), 2100);
            });
        }
    }

    updateProgress(progress) {
        // Trigger based on progress chunks? 
        // For now, full scatter on start is most impactful.
    }
}
