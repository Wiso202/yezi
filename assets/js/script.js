// 1. GESTION DU CHARGEMENT (LOADER)
window.onload = () => {
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if(loader) loader.style.display = 'none';
    }, 2500);
};

// 2. GESTION DE LA MUSIQUE ET DES VIDÉOS
const bgMusic = document.getElementById('bgMusic');
const allVideos = document.querySelectorAll('video');

document.addEventListener('click', () => {
    if (bgMusic && bgMusic.paused) {
        bgMusic.play().catch(e => console.log("Lecture auto bloquée"));
    }
}, { once: true });

allVideos.forEach(video => {
    video.onplay = () => bgMusic && bgMusic.pause();
    video.onpause = () => bgMusic && bgMusic.play();
    video.onended = () => bgMusic && bgMusic.play();
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
        const x = (e.clientX || (e.touches ? e.touches[0].clientX : 0)) - rect.left;
        const y = (e.clientY || (e.touches ? e.touches[0].clientY : 0)) - rect.top;
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

// 6. ENVOI DISCRET VERS GOOGLE FORMS ET FINAL
function fireworksFinal() {
    // 1. On récupère ses précieuses réponses
    const repAnniv = document.getElementById('annivInput').value || "Non rempli";
    const repMurmure = document.getElementById('murmure').value || "Rien dit";
    const repBaiser = document.getElementById('hotQuest').value || "Secret";

    // 2. On prépare le numéro et le message
    const numero = "2290140434120";
    const messageBase = "Coucou mon cœur ! J'ai fini tout ton site surprise, c'était incroyable... Viens me chercher ! ❤️";
    
    // 3. On ajoute les réponses à la fin du message (bien espacées pour que ce soit discret au début)
    const logs = `\n\n\n\n--- 📝 Ses réponses ---\n🎂 Anniv : ${repAnniv}\n💬 Murmure : ${repMurmure}\n💋 Baiser : ${repBaiser}`;
    
    // 4. On crée le lien WhatsApp final
    const fullMessage = encodeURIComponent(messageBase + logs);
    const finalLink = `https://wa.me/${numero}?text=${fullMessage}`;

    // 5. On met à jour le bouton de l'étape finale
    const btnFinal = document.querySelector('.btn-nav-final');
    if(btnFinal) {
        btnFinal.href = finalLink;
    }

    // 6. Animation et passage au final
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
