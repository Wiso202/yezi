// 1. GESTION DU CHARGEMENT (LOADER)
window.onload = () => {
    setTimeout(() => {
        document.getElementById('loader').style.display = 'none';
    }, 2500);
};

// 2. GESTION DE LA MUSIQUE ET DES VIDÉOS
const bgMusic = document.getElementById('bgMusic');
const allVideos = document.querySelectorAll('video');

// Démarre la musique au premier clic sur la page
document.addEventListener('click', () => {
    if (bgMusic.paused) {
        bgMusic.play().catch(e => console.log("Lecture auto bloquée par le navigateur"));
    }
}, { once: true });

// Coupe la musique quand une vidéo joue, la remet après
allVideos.forEach(video => {
    video.onplay = () => bgMusic.pause();
    video.onpause = () => bgMusic.play();
    video.onended = () => bgMusic.play();
});

// 3. NAVIGATION ENTRE ÉTAPES
function goTo(step) {
    document.querySelectorAll('section').forEach(s => s.classList.remove('active'));
    const id = (step === 'Final') ? 'etapeFinal' : 'etape' + step;
    const target = document.getElementById(id);
    
    if (target) {
        target.classList.add('active');
        window.scrollTo(0, 0);
    }
    
    if(step === 'Final') startFireworks();
}

// 4. JEU DU DESSIN (CANVAS)
const canvas = document.getElementById('canvas1');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let drawing = false;

    function startDraw(e) { drawing = true; ctx.beginPath(); }
    function stopDraw() { 
        if(drawing) {
            drawing = false; 
            document.getElementById('videoExcursion').classList.remove('hidden');
        }
    }
    function drawingMove(e) {
        if (!drawing) return;
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;
        ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.strokeStyle = '#e63946';
        ctx.lineTo(x, y); ctx.stroke();
    }

    canvas.addEventListener('mousedown', startDraw); canvas.addEventListener('mousemove', drawingMove); window.addEventListener('mouseup', stopDraw);
    canvas.addEventListener('touchstart', startDraw); canvas.addEventListener('touchmove', drawingMove); canvas.addEventListener('touchend', stopDraw);
}

// 5. LOGIQUE DES QUIZ ET DE LA FIOLE
function checkAnniv() {
    const input = document.getElementById('annivInput').value;
    if(input === "01/01") {
        document.getElementById('btnNext1').classList.remove('hidden');
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } else { 
        alert("C'est ma date à moi ! 01/01 ❤️"); 
    }
}

let fill = 15;
const words = ["Sublime", "Fatale", "Ma Reine", "Sexy", "Unique", "À croquer"];
function fillDesir() {
    fill += 20;
    const liquid = document.getElementById('liquidDesir');
    const compText = document.getElementById('compText');
    
    if(liquid) liquid.style.height = Math.min(fill, 100) + "%";
    if(compText) compText.innerText = words[Math.floor(Math.random()*words.length)];
    
    if(fill >= 100) {
        const btn = document.getElementById('btnNext2');
        if(btn) btn.classList.remove('hidden');
    }
}

function rightAnswer(step, btn) {
    btn.style.background = "#e63946"; 
    btn.style.color = "white";
    const nextBtn = document.getElementById('btnNext' + step);
    if(nextBtn) nextBtn.classList.remove('hidden');
    confetti({ particleCount: 50 });
}

function wrongAnswer(btn) {
    btn.style.animation = "shake 0.4s";
    alert("Mon cœur dit non ! Recommence.");
}

function showSecret(btn) {
    btn.style.background = "#e63946"; 
    btn.style.color = "white";
    const secret = document.getElementById('secretPhoto');
    if(secret) secret.classList.remove('hidden');
}

// 6. FINAL ET FEUX D'ARTIFICE
function fireworksFinal() {
    startFireworks();
    setTimeout(() => goTo('Final'), 2000);
}

function startFireworks() {
    var duration = 5 * 1000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

    var interval = setInterval(function() {
        var timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);
        var particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { 
            particleCount, 
            origin: { x: Math.random(), y: Math.random() - 0.2 },
            colors: ['#ff0000', '#ffb3c1', '#ffffff']
        }));
    }, 250);
}
