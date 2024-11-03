import words  from "./data.js"

function addClass(element , name){
    element.classList.add(name);
}
function removeClass(element , name){
    // element.className = element.className.replace(name , '');
    element.classList.remove(name)
}
function randomWord(){
    const randomIndex = Math.floor(Math.random() * (words.length -1));
    return words[randomIndex];
}
function wordFormatter(word){
    return `<div class='word'><span class="letter">${word
      .split("")
      .join('</span><span  class="letter">')}</span></div>`  
}

function newGame(){
    const gameWords = document.getElementById("words");
    gameWords.innerHTML ='';

    for(let i = 0; i < 100; i++){
        gameWords.innerHTML += " " + wordFormatter(randomWord())
    }
     addClass(document.querySelector(".word"), "current")
     addClass(document.querySelector(".letter"), "current")


document.getElementById('game').addEventListener('keyup' , event => {
  const inputKey = event.key
  const currentLetter = document.querySelector(".letter.current")
  const currentWord = document.querySelector(".word.current")
  const expectedKey = currentLetter?.innerHTML || " "
  const isInputLetter = inputKey.length === 1 && inputKey !== " "
  const isInputSpace = inputKey === " "
  const isInputBackspace = inputKey === "Backspace"
  const isFirstLetter = currentLetter === currentWord.firstElementChild
 

//   console.log({ expectedKey, inputKey })

  // for the letters
  if (isInputLetter) {
    if (currentLetter) {
      addClass(
        currentLetter,
        inputKey === expectedKey ? "correct" : "incorrect"
      )
      removeClass(currentLetter, "current")
      if (currentLetter.nextElementSibling) {
        addClass(currentLetter.nextElementSibling, "current")
      }
    } else {
      const incorrectLetter = document.createElement("span")
      incorrectLetter.innerHTML = inputKey
      incorrectLetter.className = "letter incorrect extra"
      currentWord.appendChild(incorrectLetter)
    }
  }
  // for the word spaces
  if (isInputSpace) {
    if (expectedKey !== " ") {
      const skippedLetters = [
        ...document.querySelectorAll(".word.current .letter:not(.correct)"),
      ]

      skippedLetters.forEach((letter) => {
        addClass(letter, "incorrect")
      })
    }

    removeClass(currentWord, "current")
    addClass(currentWord.nextElementSibling, "current")
    if (currentLetter) removeClass(currentLetter, "current")
    addClass(currentWord.nextElementSibling.firstElementChild, "current")
  }
  // for the BackSpace
  if (isInputBackspace) {
    if (currentLetter && isFirstLetter) {
      removeClass(currentWord, "current")
      removeClass(currentLetter, "current")
      addClass(currentWord.previousElementSibling, "current")
    }
    if (currentLetter && !isFirstLetter) {
      removeClass(currentLetter, "current")
      addClass(currentLetter.previousElementSibling, "current")
      removeClass(currentLetter.previousElementSibling, "correct")
      removeClass(currentLetter.previousElementSibling, "incorrect")
    }
    if (!currentLetter) {
      addClass(currentWord.lastElementChild, "current")
      if (currentWord.lastElementChild.classList.contains("extra")) {
        currentWord.lastElementChild.remove()
      } else {
        removeClass(currentWord.lastElementChild, "correct")
        removeClass(currentWord.lastElementChild, "incorrect")
      }
    }
  }
  //moving the lines up
  if (currentWord.getBoundingClientRect().top > 230) {
    const words = document.getElementById("words")
    const marginTop = parseInt(words.style.marginTop || '0px')
    words.style.marginTop = (marginTop - 45) + "px"
  }
  // moving the cursor
  const nextLetter = document.querySelector(".letter.current")
  const nextWord = document.querySelector(".word.current")
  const cursor = document.getElementById("cursor")
  if (nextLetter) {
    cursor.style.top = nextLetter.getBoundingClientRect().top + 2 + "px"
    cursor.style.left = nextLetter.getBoundingClientRect().left + "px"
  } else {
    cursor.style.top = nextWord.getBoundingClientRect().top + 5 + "px"
    cursor.style.left = nextWord.getBoundingClientRect().right + "px"
  }
})

}
newGame()