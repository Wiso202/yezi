// Cacher le loader au démarrage
window.onload = () => {
    setTimeout(() => {
        document.getElementById('loader').style.display = 'none';
    }, 2000);
};

function goTo(step) {
    document.querySelectorAll('section').forEach(s => s.classList.remove('active'));
    const id = (step === 'Final') ? 'etapeFinal' : 'etape' + step;
    document.getElementById(id).classList.add('active');
    window.scrollTo(0, 0);
    if(step === 'Final') startFireworks();
}

// Jeu du Dessin
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
let drawing = false;

function startDraw(e) { drawing = true; ctx.beginPath(); }
function stopDraw() { 
    drawing = false; 
    document.getElementById('videoExcursion').classList.remove('hidden');
}
function drawingMove(e) {
    if (!drawing) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;
    ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.strokeStyle = '#be0000';
    ctx.lineTo(x, y); ctx.stroke();
}
canvas.addEventListener('mousedown', startDraw); canvas.addEventListener('mousemove', drawingMove); window.addEventListener('mouseup', stopDraw);
canvas.addEventListener('touchstart', startDraw); canvas.addEventListener('touchmove', drawingMove); canvas.addEventListener('touchend', stopDraw);

// Logique Quiz & Fiole
function checkAnniv() {
    if(document.getElementById('annivInput').value === "01/01") {
        document.getElementById('btnNext1').classList.remove('hidden');
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } else { alert("C'est ma date à moi ! 01/01 ❤️"); }
}

let fill = 15;
const words = ["Sublime", "Fatale", "Ma Reine", "Sexy", "Unique", "À croquer"];
function fillDesir() {
    fill += 20;
    document.getElementById('liquidDesir').style.height = Math.min(fill, 100) + "%";
    document.getElementById('compText').innerText = words[Math.floor(Math.random()*words.length)];
    if(fill >= 100) document.getElementById('btnNext2').classList.remove('hidden');
}

function rightAnswer(step, btn) {
    btn.style.background = "#be0000"; btn.style.color = "white";
    document.getElementById('btnNext' + step).classList.remove('hidden');
    confetti({ particleCount: 50 });
}

function wrongAnswer(btn) {
    btn.style.animation = "shake 0.4s";
    alert("Mon cœur dit non ! Recommence.");
}

function showSecret(btn) {
    btn.style.background = "#be0000"; btn.style.color = "white";
    document.getElementById('secretPhoto').classList.remove('hidden');
}

function fireworksFinal() {
    startFireworks();
    setTimeout(() => goTo('Final'), 1500);
}

function startFireworks() {
    var duration = 5 * 1000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    var interval = setInterval(function() {
        var timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);
        var particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: Math.random(), y: Math.random() - 0.2 } }));
    }, 250);
}