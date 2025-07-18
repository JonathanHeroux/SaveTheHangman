


let secretWord = "";
let language = "fr";
const urlFr = "./data/mots_francais.json"

async function getFrenchWords(){
    const request = await fetch(urlFr,{
        method:"get"
    });

    if(!request.ok){
        alert("Une erreur est survenu.")
    }else{
        let getWords = await request.json();
        let wordsList = [];

        for (let i=0; i < getWords.length; i++){
            const filtered = getWords[i];

            if(filtered.length>=4 && filtered.length<=15 && /^[a-zA-ZéèîïëàâäéèêëîïôöùûüçÀÂÄÉÈÊËÎÏÔÖÙÛÜÇ]+$/.test(filtered)){
                wordsList.push(filtered);
            }
        }
        const randomWord = wordsList[Math.floor(Math.random()* wordsList.length)];
        secretWord = randomWord;
        let hiddenWord = "";
            for ( let i=0; i < randomWord.length; i++){
                hiddenWord += "_ ";
        }
        document.getElementById("hideWord").textContent = hiddenWord; //hide the word
        // document.getElementById("hideWord").textContent = secretWord; //Show the word
    }
}

const urlEn = "./data/mots_anglais.txt"

async function getEnglishWords(){
    console.log("getEnglishWords() appelé !")
    const request = await fetch(urlEn,{
        method:"get"
    });

    if(!request.ok){
        alert("Une erreur est survenu.")
    }else{
        let rawText = await request.text();
        let getWords = rawText.split('\n').map(word => word.trim());
        let wordsList = [];

        for (let i=0; i < getWords.length; i++){
            const filtered = getWords[i];

            if(filtered.length>=4 && filtered.length<=15 && /^[a-zA-ZéèîïëàâäéèêëîïôöùûüçÀÂÄÉÈÊËÎÏÔÖÙÛÜÇ]+$/.test(filtered)){
                wordsList.push(filtered);
            }
        }
        
        const randomWord = wordsList[Math.floor(Math.random()* wordsList.length)];
        secretWord = randomWord;
        let hiddenWord = "";
            for ( let i=0; i < randomWord.length; i++){
                hiddenWord += "_ ";
        }
        document.getElementById("hideWord").textContent = hiddenWord; // hide the word
        // document.getElementById("hideWord").textContent = secretWord; //show the word
    }
}

document.getElementById("frButton").addEventListener("click", getFrenchWords);
document.getElementById("enButton").addEventListener("click", getEnglishWords);
document.getElementById("start").addEventListener("click", ()=>{
    console.log("Texte du bouton start:", language);
    if(language === "en"){
        getEnglishWords();
    }else{
        getFrenchWords();
    }
})

const letterBox = document.querySelector("#boxLetter");
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

for(let i=0; i <alphabet.length; i++){
    const keysButton = document.createElement("button");
    keysButton.textContent = alphabet[i];
    keysButton.classList.add("letterBtn");
    letterBox.appendChild(keysButton);
}

let rightHandHero = document.querySelector(".rightHandHero");
let knife = document.querySelector(".knife");
let rope = document.querySelector(".rope");
let barrel = document.querySelector(".barrel");
let hanged = document.querySelector(".hanged");

function heroAnimation(){
    rightHandHero.style.transition = "transform 0.3s ease";
    rightHandHero.style.transform = "rotate(-45deg)";
    setTimeout(() =>{
        rightHandHero.style.transform = "rotate(0deg)";
    }), 300;
}

let translation = {
    fr: {
        header: `Bienvenue sur <br>"Sauverez-vous le pendu?"`,
        winLose: "Bonne chance!",
        hideWord: "Mot Secret",
        boxText: "Vous avez une idée du mot secret ? Écrivez le mot ici!",
        frButton: "Français",
        enButton: "Anglais",
        start: "Commencez le jeu"

},
    en: {
        header: `Welcome to <br>"Will you save the hangman?"`,
        winLose: "Good luck!",
        hideWord: "Secret Word",
        boxText: "Got an idea for the secret word? Write it down here!",
        frButton: "French",
        enButton: "English",
        start: "Start the game"
        }
};

function switchLanguage(language){
    document.querySelector("header").innerHTML = translation[language].header;
    document.querySelector("#frButton").textContent = translation[language].frButton;
    document.querySelector("#enButton").textContent = translation[language].enButton;
    document.querySelector("#winLose").textContent = translation[language].winLose;
    document.querySelector("#boxText").textContent = translation[language].boxText;
    document.querySelector("#start").textContent = translation[language].start;
}

document.querySelector("#frButton").addEventListener("click", ()=>{
    switchLanguage("fr")
    language = "fr";
});
document.querySelector("#enButton").addEventListener("click", ()=>{
    switchLanguage("en")
    language = "en";
});

