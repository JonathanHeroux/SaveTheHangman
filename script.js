


let secretWord = "";

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

            if(filtered.length>=4 && filtered.length<=15){
                wordsList.push(filtered);
            }
        }
        const randomWord = wordsList[Math.floor(Math.random()* wordsList.length)];
        secretWord = randomWord;
        let hiddenWord = "";
            for ( let i=0; i < randomWord.length; i++){
                hiddenWord += "_ ";
        }
        document.getElementById("hideWord").textContent = hiddenWord;
    }
}

const urlEn = "./data/mots_anglais.txt"

async function getEnglishWords(){
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

            if(filtered.length>=4 && filtered.length<=15){
                wordsList.push(filtered);
            }
        }
        
        const randomWord = wordsList[Math.floor(Math.random()* wordsList.length)];
        secretWord = randomWord;
        let hiddenWord = "";
            for ( let i=0; i < randomWord.length; i++){
                hiddenWord += "_ ";
        }
        document.getElementById("hideWord").textContent = hiddenWord;
    }
}

document.getElementById("frButton").addEventListener("click", getFrenchWords);
document.getElementById("enButton").addEventListener("click", getEnglishWords);

const letterBox = document.querySelector("#boxLetter");
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

for(let i=0; i <alphabet.length; i++){
    const keysButton = document.createElement("button");
    keysButton.textContent = alphabet[i];
    keysButton.classList.add("letterBtn");
    letterBox.appendChild(keysButton);
}