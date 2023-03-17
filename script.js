var combs = document.querySelectorAll(".comb");
const consonants = "BCDFGHKLMNPQRSTVWXYZ";
const vowels = "AEIUO";
var currentletters = [],
    possibleWords = [],
    foundWords = [],
    funcs = [];
var enteredWord = document.getElementById("enteredWord");
var toFind = document.getElementById("to-find");
var centerLetter;
var currentPoints = 0;

function declareListeners() {
    const placeholder = enteredWord.getAttribute('data-placeholder');

    document.addEventListener("keydown", (event) => {
        event.preventDefault();
        if (event.target === enteredWord)
            return
        enteredWord.dispatchEvent(new KeyboardEvent('keydown', { 'key': event.key }));
    })

    enteredWord.addEventListener("click", (event) => {
        setEndOfContenteditable(enteredWord)
    })

    enteredWord.addEventListener('keydown', (event) => {
        enteredWord.style.textTransform = "uppercase";
        if (enteredWord.textContent.length == 1 && event.key === "Backspace") {
            event.preventDefault();
            enteredWord.innerHTML = placeholder;
            enteredWord.style.textTransform = "none";
            return;
        }

        if (enteredWord.innerHTML === placeholder) {
            enteredWord.innerHTML = '';
            enteredWord.style.textTransform = "none";
            if (event.keyCode != 0) {
                return;
            }
        }

        if (enteredWord.textContent.length > 18 && event.key != "Backspace") {
            event.preventDefault();
            return;
        } else if (event.keyCode >= 65 && event.keyCode <= 90 || event.keyCode === 0 && event.key != "Backspace") {
            event.preventDefault();
            enteredWord.innerHTML = enteredWord.textContent + event.key;
            enteredWord.innerHTML = replaceAllProper();
        } else if (event.key === "Backspace") {
            event.preventDefault();
            enteredWord.textContent = enteredWord.textContent.substring(0, enteredWord.textContent.length - 1);
            enteredWord.innerHTML = replaceAllProper();
        } else if (event.key == "Enter") {
            //TODO fix capitalization when clicking enter
            event.preventDefault();
            evalWord();
            enteredWord.style.textTransform = "none";
        }

        setEndOfContenteditable(enteredWord);
        if (enteredWord.innerHTML === '') {
            enteredWord.style.textTransform = "none";
        }
    })

    if (enteredWord.innerHTML === '') {
        enteredWord.innerHTML = placeholder;
        enteredWord.style.textTransform = "none"
    }

    enteredWord.addEventListener('focus', function (e) {
        const value = e.target.innerHTML;
        if (value === placeholder) {
            e.target.innerHTML = '';
            enteredWord.style.textTransform = "none";
        }
    });

    enteredWord.addEventListener('blur', function (e) {
        const value = e.target.innerHTML;
        if (value === '') {
            e.target.innerHTML = placeholder;
            enteredWord.style.textTransform = "none";
        }
    });
}

function replaceAllProper() {
    let tc = enteredWord.textContent.toUpperCase();
    let finalHTML = "";
    for (let i = 0; i < tc.length; i++)
        if (currentletters.includes(tc[i]))
            if (tc[i] === centerLetter)
                finalHTML += `<span class="honey-letter">${tc[i]}</span>`
            else
                finalHTML += `<span class="proper-letter">${tc[i]}</span>`
        else
            finalHTML += tc[i];

    return finalHTML;
}

//source: https://stackoverflow.com/a/3866442/11782548
function setEndOfContenteditable(contentEditableElement) {
    let range, selection;
    if (document.createRange) { //Firefox, Chrome, Opera, Safari, IE 9+
        range = document.createRange();//Create a range (a range is like the selection but invisible)
        range.selectNodeContents(contentEditableElement);//Select the entire contents of the element with the range
        range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
        selection = window.getSelection();//get the selection object (allows you to change selection)
        selection.removeAllRanges();//remove any selections already made
        selection.addRange(range);//make the range you have just created the visible selection
    } else if (document.selection) {//IE 8 and lower
        range = document.body.createTextRange();//Create a range (a range is a like the selection but invisible)
        range.moveToElementText(contentEditableElement);//Select the entire contents of the element with the range
        range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
        range.select();//Select the range (make it the visible selection
    }
}

declareListeners();

function setupLetters() {
    let letters = (vowels + consonants).replace(/[SQXYZ]/g, "");
    currentletters[6] = letters.charAt(Math.random() * letters.length);
    let centerIsVowel = false;
    if (vowels.includes(currentletters[6]))
        centerIsVowel = true;
    for (let i = 0; i < 6; i++) {
        letters = consonants;
        if (i < 2) {
            letters = vowels;
        } else if (i == 3 && !centerIsVowel) {
            let rand = Math.random() * 2;
            if (rand < 1) {
                letters = vowels;
            }
        }
        do {
            tc = letters.charAt(Math.random() * letters.length);
        } while (currentletters.includes(tc));

        currentletters[i] = tc;
    }
    centerLetter = currentletters[currentletters.length - 1];
    allwords();
}

function setupDivs(weakSeed) {
    if (weakSeed) return
    let list = document.getElementById("found-word-list");

    while (list.hasChildNodes())
        list.removeChild(list.firstChild)

    document.querySelector(".pop-ups_win").classList.toggle("hidden")
    document.querySelector(".gray").classList.toggle("hidden")
}

function newGame(weakSeed) {
    assignLetters(true)

    currentletters = [];
    possibleWords = [];
    foundWords = [];
    setupLetters();
    setupDivs(weakSeed);
}
newGame(true);
// currentletters = ["A", "Y", "N", "U", "V", "E", "R"]
// centerLetter = "R";
// allwords();

function assignLetters(remove) {
    let count = 0;
    combs.forEach(e => {

        let tc = currentletters[count];

        if (remove) {
            e.removeEventListener("click", funcs[count])
        } else {
            startLetterTransition(tc, e)
            funcs[count] = function combClick() {
                enteredWord.dispatchEvent(new KeyboardEvent('keydown', { 'key': tc }));
            }
            e.addEventListener("click", funcs[count])
        }
        count++;
    })
}

function backspace() {
    enteredWord.dispatchEvent(new KeyboardEvent('keydown', { 'key': 'Backspace', 'keyCode': '8' }));
}

function enter() {
    enteredWord.dispatchEvent(new KeyboardEvent('keydown', { 'key': 'Enter', 'keyCode': '13' }));
}

function shuffle() {
    let change, temp;
    for (let i = 0; i < 7; i++) {
        if (i == 0) {
            change = currentletters[i];
            currentletters[i] = currentletters[currentletters.length - 2];
        } else if (i < 6) {
            temp = currentletters[i];
            currentletters[i] = change;
            change = temp;
        }
    }

    assignLetters(false);
}

var info = document.getElementById('info');
var timeout;

function startInfoTransition(text) {
    info.style.opacity = 0;
    if (timeout) clearTimeout(timeout);
    setTimeout(() => {
        info.style.opacity = 1;
        info.textContent = text;

        timeout = setTimeout(() => {
            info.style.opacity = 0;

            setTimeout(() => {
                info.textContent = "";
                info.style.opacity = 1;
            }, 500);
        }, 5000);

    }, 500);
}

function startLetterTransition(letter, comb) {
    let letterEl = comb.children[0];
    console.log(comb.children[0]);
    letterEl.style.opacity = 0;
    setTimeout(() => {
        letterEl.style.opacity = 1;
        letterEl.textContent = "🐝";
        setTimeout(() => {
            letterEl.style.opacity = 0;
            setTimeout(() => {
                letterEl.textContent = letter;
                letterEl.style.opacity = 1;
            }, 300);
        }, 300);
    }, 300);
}

function startShakeAnimation() {
    enteredWord.style.animationPlayState = "running"
    setTimeout(() => {
        enteredWord.style.animationPlayState = "paused"
    }, 300)
}

function evalWord() {
    let text = "", found = false;
    info.style.opacity = 1;

    if (!enteredWord.textContent.includes(centerLetter)) {
        text = "Doesn't contain center letter";
        enteredWord.textContent = ""
    } else if (enteredWord.textContent.length < 4) {
        text = "Too short";
        enteredWord.textContent = ""
    } else if (possibleWords.includes(enteredWord.textContent)) {
        if (foundWords.includes(enteredWord.textContent)) {
            text = "Already Found";
        } else {
            text = "New word '" + enteredWord.textContent + "' Found";
            found = true
            newWordFound(enteredWord.textContent)
        }
    } else {
        text = "No such word in the dictionary";
    }
    if (!found) {
        startShakeAnimation()
    }
    enteredWord.textContent = ""
    startInfoTransition(text);
}

function newWordFound(word) {
    currentPoints += word.length - 3;
    foundWords.push(word);
    let listItem = document.createElement("li");
    listItem.textContent = word;
    document.getElementById("found-word-list").appendChild(listItem);
    document.querySelector(".find-progress").textContent = currentPoints + "%"
    // currentPoints = 100;
    //check win
    if (currentPoints >= 100) {
        document.querySelector(".pop-ups_win").classList.toggle("hidden")
        document.querySelector(".gray").classList.toggle("hidden")
    }
}

function loadJSON(callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', "english.txt", true); //true == asynchronous, false == synchronous
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4) {
            if (xobj.status == "200") {
                // callback(xobj.responseText);
                callback(xobj.responseText);
            } else {
                console.log("big error");
            }
        }
    };
    xobj.send(null);
}

function allwords() {
    loadJSON((response) => {
        const lines = response.split(/\r\n|\n/);
        let letters = currentletters.join('').toLowerCase();
        let centerLetterLower = centerLetter.trim().toLowerCase();
        let myReg = new RegExp("\\b[" + letters + "]+\\b", 'g');

        possibleWords = lines.filter(word => word.match(myReg) != null && word.includes(centerLetterLower))
            .map(word => word.toUpperCase())

        let difficulty = getDifficulty();
        if (difficulty < 100) {
            console.log("weak seed = " + currentletters.join(''));
            newGame(true);
            return;
        } 
        
        shuffle();
        toFind.setAttribute("data-max-dif",`(Max ${difficulty}%)`)
        toFind.querySelector(".find-difficulty").textContent = getDifficultyNames(difficulty)
        toFind.querySelector(".find-progress").textContent = "0%";
        console.log(possibleWords);
    });
}

function getDifficulty() {
    return possibleWords.reduce((total, x) =>
        total += x.length - 3
        , 0)
}

function getDifficultyNames(difficulty) {
    if (difficulty > 200)
        return "Easy";
    else if (difficulty > 160)
        return "Normal"
    else if (difficulty > 120)
        return "Hard"
    else
        return "Very Hard"
}