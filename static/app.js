const canvas = document.getElementById('weatherCanvas');
const ctx = canvas.getContext('2d');
const weatherTypeSelect = document.getElementById('weatherType');
const intensitySlider = document.getElementById('intensity');

let weatherType = 'rain';
let intensity = 5;
let particles = [];
let lightningStrikes = [];
let nextLightningTime = 0;

function initParticles() {
    particles = [];
    lightningStrikes = [];
    nextLightningTime = Date.now() + getRandomLightningInterval();
    for (let i = 0; i < intensity * 10; i++) {
        particles.push(createParticle());
    }
    updateCanvasBackground();
}

function createParticle() {
    switch (weatherType) {
        case 'rain':
            return {
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                length: Math.random() * 20 + 10,
                speed: Math.random() * 5 + 2
            };
        case 'snow':
            return {
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 3 + 2,
                speed: Math.random() * 1 + 0.5
            };
        case 'wind':
            return {
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 3 + 2,
                speed: Math.random() * 3 + 1,
                direction: Math.random() * 2 * Math.PI
            };
        case 'clouds':
            return {
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height / 2,
                size: Math.random() * 50 + 50,
                speed: Math.random() * 0.5 + 0.2
            };
        case 'thunderstorm':
            return {
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                length: Math.random() * 20 + 10,
                speed: Math.random() * 5 + 2
            };
        case 'fog':
            return {
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 20 + 10,
                speed: Math.random() * 0.5 + 0.2
            };
    }
}

function createLightningStrike() {
    const strike = [];
    let x = Math.random() * canvas.width;
    let y = 0;
    strike.push({ x, y });

    while (y < canvas.height) {
        x += (Math.random() - 0.5) * 20;
        y += Math.random() * 20;
        strike.push({ x, y });
    }

    return { strike, timestamp: Date.now() };
}

function getRandomLightningInterval() {
    const baseInterval = 7000 - (intensity * 600); // Base interval decreases with higher intensity
    return Math.random() * baseInterval + 3000; // Random interval between 3000ms and baseInterval + 3000ms
}

function updateParticles() {
    particles.forEach(particle => {
        switch (weatherType) {
            case 'rain':
                particle.y += particle.speed;
                if (particle.y > canvas.height) {
                    particle.y = -particle.length;
                    particle.x = Math.random() * canvas.width;
                }
                break;
            case 'snow':
                particle.y += particle.speed;
                if (particle.y > canvas.height) {
                    particle.y = -particle.radius;
                    particle.x = Math.random() * canvas.width;
                }
                break;
            case 'wind':
                particle.x += particle.speed * Math.cos(particle.direction);
                particle.y += particle.speed * Math.sin(particle.direction);
                if (particle.x > canvas.width || particle.x < 0 || particle.y > canvas.height || particle.y < 0) {
                    particle.x = Math.random() * canvas.width;
                    particle.y = Math.random() * canvas.height;
                }
                break;
            case 'clouds':
                particle.x += particle.speed;
                if (particle.x > canvas.width) {
                    particle.x = -particle.size;
                    particle.y = Math.random() * canvas.height / 2;
                }
                break;
            case 'thunderstorm':
                particle.y += particle.speed;
                if (particle.y > canvas.height) {
                    particle.y = -particle.length;
                    particle.x = Math.random() * canvas.width;
                }
                if (Date.now() > nextLightningTime) {
                    lightningStrikes.push(createLightningStrike());
                    nextLightningTime = Date.now() + getRandomLightningInterval();
                }
                break;
            case 'fog':
                particle.x += particle.speed;
                if (particle.x > canvas.width) {
                    particle.x = -particle.size;
                    particle.y = Math.random() * canvas.height;
                }
                break;
        }
    });

    // Remove old lightning strikes
    lightningStrikes = lightningStrikes.filter(strike => Date.now() - strike.timestamp < 1000);
}

function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(particle => {
        switch (weatherType) {
            case 'rain':
                ctx.strokeStyle = 'blue';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particle.x, particle.y);
                ctx.lineTo(particle.x, particle.y + particle.length);
                ctx.stroke();
                break;
            case 'snow':
                ctx.fillStyle = 'white';
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.radius, 0, 2 * Math.PI);
                ctx.fill();
                break;
            case 'wind':
                ctx.fillStyle = 'gray';
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, 2 * Math.PI);
                ctx.fill();
                break;
            case 'clouds':
                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, 2 * Math.PI);
                ctx.fill();
                break;
            case 'thunderstorm':
                ctx.strokeStyle = 'blue';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particle.x, particle.y);
                ctx.lineTo(particle.x, particle.y + particle.length);
                ctx.stroke();
                break;
            case 'fog':
                ctx.fillStyle = 'rgba(200, 200, 200, 0.5)';
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, 2 * Math.PI);
                ctx.fill();
                break;
        }
    });

    // Draw lightning strikes
    lightningStrikes.forEach(({ strike, timestamp }) => {
        const age = Date.now() - timestamp;
        const opacity = 1 - age / 1000;
        ctx.strokeStyle = `rgba(255, 255, 0, ${opacity})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(strike[0].x, strike[0].y);
        for (let i = 1; i < strike.length; i++) {
            ctx.lineTo(strike[i].x, strike[i].y);
        }
        ctx.stroke();
    });
}

function updateCanvasBackground() {
    let bodyBackgroundColor;
    let canvasBackgroundColor;
    switch (weatherType) {
        case 'rain':
            bodyBackgroundColor = '#87CEEB'; // Light blue
            canvasBackgroundColor = '#87CEEB'; // Light blue
            break;
        case 'snow':
            bodyBackgroundColor = '#B0E0E6'; // Light blue-gray
            canvasBackgroundColor = '#B0E0E6'; // Light blue-gray
            break;
        case 'wind':
            bodyBackgroundColor = '#F0F8FF'; // Alice blue
            canvasBackgroundColor = '#F0F8FF'; // Alice blue
            break;
        case 'clouds':
            bodyBackgroundColor = '#D3D3D3'; // Light gray
            canvasBackgroundColor = '#D3D3D3'; // Light gray
            break;
        case 'thunderstorm':
            bodyBackgroundColor = '#708090'; // Slate gray
            canvasBackgroundColor = '#708090'; // Slate gray
            break;
        case 'fog':
            bodyBackgroundColor = '#778899'; // Light slate gray
            canvasBackgroundColor = '#778899'; // Light slate gray
            break;
    }
    document.body.style.backgroundColor = bodyBackgroundColor;
    canvas.style.backgroundColor = canvasBackgroundColor;
}

function animate() {
    updateParticles();
    drawParticles();
    requestAnimationFrame(animate);
}

weatherTypeSelect.addEventListener('change', (e) => {
    weatherType = e.target.value;
    initParticles();
});

intensitySlider.addEventListener('input', (e) => {
    intensity = e.target.value;
    initParticles();
});

initParticles();
animate();