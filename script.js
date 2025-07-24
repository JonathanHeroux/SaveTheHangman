
let secretWord = "";
let language = "fr";
let startBtn = document.querySelector("#startGame");
let resetBtn = document.querySelector("#restartGame");
let knife = document.querySelector(".knife");
let rope = document.querySelector(".rope");
let barrel = document.querySelector(".barrel");
let revealedLetters = [];
let guessedLetter=[];
let chanceLeft = 7;
let goodAnswerNumbers=0;
let errorNumbers = 0;
let gameOver = false;
let animationInProgress = false;

knife.addEventListener("animationend", (e) => {
    animationInProgress=false;
  if (e.animationName === "knifeToBarrel") {
    onWrongAnswer();
  }else if(e.animationName === "knifeToRope"){
        onGoodAnswer();
    }

});



const triedWords =[];
const urlFr = "./data/mots_francais.json"
const urlEn = "./data/mots_anglais.txt"
const input = document.querySelector("#boxText");

async function getFrenchWords(){
    const request = await fetch(urlFr,{
        method:"get"
    });

    if (!request.ok){
        alert("Une erreur est survenu.")
    }else{
        let getWords = await request.json();
        let wordsList = [];

        for (let i = 0; i < getWords.length; i++){
            const filtered = getWords[i];

            if (filtered.length >= 4 && filtered.length <= 12 && /^[a-zA-ZéèîïëàâäéèêëîïôöùûüçÀÂÄÉÈÊËÎÏÔÖÙÛÜÇ]+$/.test(filtered)){
                wordsList.push(filtered);
            }
        }
        const randomWord = wordsList[Math.floor(Math.random()* wordsList.length)];
        secretWord = randomWord;
        revealedLetters = [];
            for ( let i = 0; i < randomWord.length; i++){
                revealedLetters.push("_");
        }
        document.getElementById("hideWord").textContent = revealedLetters.join(" "); //hide the word for admin tools
        // document.getElementById("hideWord").textContent = secretWord; //Show the word for admin tools
        document.getElementById("winLose").textContent = "Bonne chance!";
        resetElements();
    }
}

async function getEnglishWords(){
    console.log("getEnglishWords() appelé !")
    const request = await fetch(urlEn,{
        method:"get"
    });

    if (!request.ok){
        alert("Une erreur est survenu.")
    } else {
        let rawText = await request.text();
        let getWords = rawText.split('\n').map(word => word.trim());
        let wordsList = [];

        for (let i = 0; i < getWords.length; i++){
            const filtered = getWords[i];

            if (filtered.length >= 4 && filtered.length <= 12 && /^[a-zA-ZéèîïëàâäéèêëîïôöùûüçÀÂÄÉÈÊËÎÏÔÖÙÛÜÇ]+$/.test(filtered)){
                wordsList.push(filtered);
            }
        }
        
        const randomWord = wordsList[Math.floor(Math.random()* wordsList.length)];
        secretWord = randomWord;
        revealedLetters = [];
            for ( let i = 0; i < randomWord.length; i++){
                revealedLetters.push("_");
        }
        document.getElementById("hideWord").textContent = revealedLetters.join(" "); // hide the word for admin
        // document.getElementById("hideWord").textContent = secretWord; //show the word for admin
        document.getElementById("winLose").textContent = "Good luck!";
        resetElements();
    }
}

function resetElements(){
    rope.classList.remove("breakedRope");
    rope.style.top = "21.5%";
    barrel.style.left = "54%";
    animationInProgress=false;
    goodAnswerNumbers = 0;
    errorNumbers = 0;
    chanceLeft = 7;
    gameOver = false;
    guessedLetter = [];
    triedWords.length = 0;
    input.style.borderColor= "";
    document.querySelectorAll(".letterBtn").forEach(btn =>{
        btn.disabled = false;
        btn.classList.remove("usedLetter");
    });
    enableAllLetters();
    
}

document.getElementById("startGame").addEventListener("click", ()=>{
    document.getElementById("restartGame").style.display="inline-block";
    document.getElementById("startGame").style.display="none";
    
    if (language === "en"){
        getEnglishWords();
    } else {
        getFrenchWords();
    }
});
document.getElementById("restartGame").addEventListener("click", async ()=>{
    if (language === "en"){
        await getEnglishWords();
    } else {
        await getFrenchWords();
        
    }
});

const letterBox = document.querySelector("#boxLetter");
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function disableAllLetters() {
    document.querySelectorAll(".letterBtn").forEach(btn => btn.disabled = true);
}
function enableAllLetters() {
    document.querySelectorAll(".letterBtn").forEach(btn =>{
        if (!btn.classList.contains("usedLetter")) {
            btn.disabled = false;
        }
    });
}

function revealSecretWord(){
    for (let i = 0; i < secretWord.length; i++){
        revealedLetters[i] = secretWord[i];
    }
    document.getElementById("hideWord").textContent = revealedLetters.join(" ");
}

function removeAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}


function getClick(clickedLetter,button){
    if (gameOver || guessedLetter.includes(clickedLetter) || chanceLeft <=0){
        return;
    }
    if (animationInProgress){
        return;
    }
    if (button.disabled){
        return;
    }

    animationInProgress=true;
    disableAllLetters();

    guessedLetter.push(clickedLetter);
    button.disabled = true;
    button.classList.add("usedLetter");
    
    let found = false;
    for (let i = 0; i < secretWord.length; i++){
        if (removeAccents(secretWord[i].toUpperCase()) === clickedLetter){
            revealedLetters[i] = secretWord[i];
            found = true;
        }
    }
    document.getElementById("hideWord").textContent = revealedLetters.join(" ")

    if (found){
            playThrowAnimation(rope);
        } else {
            chanceLeft--;
                if (chanceLeft<=0){
                    chanceLeft=0;
                    document.getElementById("winLose").textContent = language === "fr" ? "Le pendu est ... peut être sauverez-vous le prochain!" : "The hangman is ... maybe you will save the next one!";
                    gameOver=true;
                    revealSecretWord();
                    playThrowAnimation(barrel)
                    disableAllLetters();
                } else {
                    document.getElementById("winLose").textContent = language ==="fr" ? "Ce n'est pas terminé, il vous reste "+chanceLeft+" chance(s)" : "This is not over, you have "+chanceLeft+" chance(s) left!";
                    playThrowAnimation(barrel); 
        }
    }
}

for (let i = 0; i < alphabet.length; i++){
    const keysButton = document.createElement("button");
    keysButton.textContent = alphabet[i];
    keysButton.classList.add("letterBtn");
    

    keysButton.addEventListener("click", ()=>{
        getClick(alphabet[i],keysButton);
    });

    letterBox.appendChild(keysButton);
}
disableAllLetters();

document.querySelector("#guessWord").addEventListener("submit", (e)=>{
    e.preventDefault();
    
    if (animationInProgress || gameOver || chanceLeft <=0){
        return;
    }
    
    animationInProgress=true;
    disableAllLetters();

    const input = document.querySelector("#boxText");
    const guess = input.value.trim();

    input.value="";
    input.focus();
    input.style.borderColor="";

    if (!/^[a-zA-ZéèîïëàâäéèêëîïôöùûüçÀÂÄÉÈÊËÎÏÔÖÙÛÜÇ]+$/.test(guess) || guess.length<4){
        input.style.borderColor="darkred";
        animationInProgress=false;
        enableAllLetters();
        return;
    }

    if (triedWords.includes(guess)){
        document.getElementById("winLose").textContent=language === "fr" ? "Oups, vous avez déjà essayé ce mot!" : "Oupsy, you've already tried this word!";
        animationInProgress = false;
        enableAllLetters();
        return;
    } else {
        triedWords.push(guess);
    }

    if (removeAccents(guess.toUpperCase()) === removeAccents(secretWord.toUpperCase())){
         for (let i = 0; i < secretWord.length; i++){
            revealedLetters[i] = secretWord[i];
    }
        
        document.getElementById("hideWord").textContent = revealedLetters.join(" ")
        playThrowAnimation(rope);
        gameOver = true;
    } else {
        if (chanceLeft > 0){
        chanceLeft--;
        document.getElementById("winLose").textContent = language ==="fr" ? "Ce n'est pas terminé, il vous reste "+chanceLeft+" chance(s)" : "This is not over, you have "+chanceLeft+" chance(s) left!";
        
        playThrowAnimation(barrel);
        }
        if (chanceLeft <= 0){
            document.getElementById("winLose").textContent = language === "fr" ? "Le pendu est ... peut être sauverez-vous le prochain!" : "The hangman is ... maybe you will save the next one!";
            gameOver = true;
            revealSecretWord();
            chanceLeft = 0;
            playThrowAnimation(barrel);
            disableAllLetters();
        }
    }
});

let translation = {
    fr: {
        header: `Bienvenue sur <br>"Sauverez-vous le pendu?"`,
        winLose: "Bonne chance!",
        hideWord: "Mot secret",
        boxText: "Devinez le mot ici !",
        
        start: "Commencer le jeu",
        restart:"Recommencer",
        submitButton:"Valider"
},
    en: {
        header: `Welcome to <br>"Will you save the hangman?"`,
        winLose: "Good luck!",
        hideWord: "Secret Word",
        boxText: "Guess the word here !",
        
        start: "Start the game",
        restart: "Restart",
        submitButton: "Submit"
        }
};

function switchLanguage(language){
    document.querySelector("header").innerHTML = translation[language].header;
    
    document.querySelector("#winLose").textContent = translation[language].winLose;
    document.querySelector("#boxText").placeholder = translation[language].boxText;
    document.querySelector("#startGame").textContent = translation[language].start;
    document.querySelector("#restartGame").textContent = translation[language].restart;
    document.querySelector(".submitButton").textContent = translation[language].submitButton;
    document.querySelector("#hideWord").textContent = translation[language].hideWord;
}

document.querySelector("#frButton").addEventListener("click", ()=>{
    switchLanguage("fr")
    language = "fr";
    gameOver = true;
    document.getElementById("restartGame").style.display="none";
    document.getElementById("startGame").style.display="inline-block";
    document.getElementById("hideWord").textContent = translation.fr.hideWord;
    document.querySelectorAll(".letterBtn").forEach(btn => {
        btn.disabled = false;
        btn.classList.remove("usedLetter");
    });
    
    
});
document.querySelector("#enButton").addEventListener("click", ()=>{
    switchLanguage("en")
    language = "en";
    gameOver = true;
    document.getElementById("restartGame").style.display="none";
    document.getElementById("startGame").style.display="inline-block";
    document.getElementById("hideWord").textContent = translation.en.hideWord;
    document.querySelectorAll(".letterBtn").forEach(btn => {
        btn.disabled = false;
        btn.classList.remove("usedLetter");
    });
});

function playThrowAnimation(target){
    const hand = document.getElementById("throwHand");
    const animatedKnife = document.getElementById("animatedKnife");

    hand.classList.remove("throw-hand");
    animatedKnife.classList.remove("throwToRope");
    animatedKnife.classList.remove("throwToBarrel");

    void hand.offsetWidth;
    void animatedKnife.offsetWidth;

    hand.classList.add("throw-hand");
    if (target.classList.contains("rope")){
    animatedKnife.classList.add("throwToRope");
    } else if (target.classList.contains("barrel")){
    animatedKnife.classList.add("throwToBarrel");
    }

    setTimeout(() => {
        animatedKnife.style.opacity="1";
        animatedKnife.style.transform="none";
        animatedKnife.classList.remove("throwToRope","throwToBarrel");
        animationInProgress = false;
        if (!gameOver) enableAllLetters();
    }, 1600);

};


function onGoodAnswer(){
    goodAnswerNumbers++;
    let baseTopPosition = 21.5;
    let ropeDown = 0.3;
    let newTopPosition = baseTopPosition + goodAnswerNumbers * ropeDown;
    rope.style.top = newTopPosition+"%";

    if (!revealedLetters.includes("_")) {
        revealSecretWord();
        document.getElementById("winLose").textContent = language === "fr" ? "Félicitation, vous avez sauvé le pendu!" : "Congratulations, you've saved the hangman!";
        gameOver = true;
        disableAllLetters();
        animatedRopeBreak();
    }
}

function onWrongAnswer(){
    errorNumbers++;
    let baseLeftPosition = 54;
    let barrelLeft = -0.63;
    let newLeftPosition = baseLeftPosition + errorNumbers * barrelLeft;
    barrel.style.left = newLeftPosition + "%";
}

function animatedRopeBreak(){
    let currentTop = parseFloat(getComputedStyle(rope).top);
    rope.style.top = currentTop + "%";
    rope.classList.add("breakedRope");
}

