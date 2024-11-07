import words  from "./data.js"
let wordCount = 0;
let totalWords = 4;
let totalKeystrokes = 0;
let gameTimer = null;
let gameStartTIme = 0;
let totalGameTime = 0;
let wrongLetterCount = 0;


//mute unmute icons
const highSound = document.querySelector(".high")
const lowSound = document.querySelector(".low")
const muteSound = document.querySelector(".mute")
// key press sounds
const keySound = new Audio("./assets/sounds/click5_44.wav")
const errorKeySound = new Audio('./assets/sounds/error3_1.wav')
const speakerIconContainer = document.getElementById("speaker-icon-container")
const volumeSlider = document.getElementById("volumeSlider");
let KeyPressVolume = volumeSlider.value;
volumeSlider.addEventListener("input", () =>{
KeyPressVolume = volumeSlider.value;
// changing the icons when slided
  if (volumeSlider.value == 0) {
    highSound.style.display = "none"
    lowSound.style.display = "none"
    muteSound.style.display = "block"
  } else if (volumeSlider.value > 0.5) {
    highSound.style.display = "block"
    lowSound.style.display = "none"
    muteSound.style.display = "none"
  }else{
  highSound.style.display = "none"
  lowSound.style.display = "block"
  muteSound.style.display = "none"
  }
})
// changing the icons when clicked
speakerIconContainer.addEventListener("click", () => {
  console.log("yosh")
  if (volumeSlider.value == 0) {
    console.log("hii")
    volumeSlider.value = 0.51
    highSound.style.display = "block"
    lowSound.style.display = "none"
    muteSound.style.display = "none"
    KeyPressVolume = volumeSlider.value
  } else {
    volumeSlider.value = 0;
    highSound.style.display = "none"
    lowSound.style.display = "none"
    muteSound.style.display = "block"
    KeyPressVolume = volumeSlider.value
  }
})


//UTILITY FUNCOTIONS...
function getAccuracy(){
  // const totalLetters = [...document.querySelectorAll('.letter')]
  const correctLetterCount = [...document.querySelectorAll(".letter.correct")].length;
  const typingAccuracy = Math.round((correctLetterCount / totalKeystrokes) * 100)
  return typingAccuracy < 0 ? 0 : typingAccuracy 
}
function getWpm() {
  const words = [...document.querySelectorAll('.word')];
  const lastTypedWord = document.querySelector('.word.current');
  const lastTypedWordIndex = words.indexOf(lastTypedWord);
  const typedWords = words.slice(0, lastTypedWordIndex+1);
  const correctWords = typedWords.filter(word => {
    const letters = [...word.children]
    const correctTypedLetters = letters.filter(letter => letter.classList.contains("correct"))
    const incorrectTypedLetters = letters.filter(letter => letter.classList.contains("incorrect"))
    return (
      incorrectTypedLetters.length === 0 &&
      correctTypedLetters.length === letters.length
    )
  });
  return correctWords?.length || 0
}
function gameStart() {
  gameTimer = setInterval(() => {
    if (!gameStartTIme) {
      gameStartTIme = new Date().getTime()
    }
    document.getElementById("timer").innerHTML = (Math.floor( (new Date().getTime() - gameStartTIme) / 1000) + 1)
  }, 1000)
}
function gameRestart() {
  clearInterval(gameTimer)
  document.getElementById("timer").innerHTML = 0
  document.getElementById("accuracy").innerHTML = ""
  //reseting info values
  totalKeystrokes = 0
  gameTimer = null
  gameStartTIme = 0
  newGame()
}
function gameOver(){
  totalGameTime = Math.floor((new Date().getTime() - gameStartTIme) / 1000)
  totalGameTime = totalGameTime > 100000? 0 : totalGameTime  // for one word purpose
  clearInterval(gameTimer);
  addClass(document.getElementById('game'), 'disable')
  document.getElementById("timer").innerHTML = `Time: ${totalGameTime }`
  document.getElementById("accuracy").innerHTML = `Accuracy: ${getAccuracy() }%`
  document.getElementById("word-counter").innerHTML = 
    `WPM: ${Math.floor(getWpm() / totalGameTime * 60)}`
  

  // game reset option
  document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault()
      removeClass(document.getElementById("game"), "disable")
      gameRestart()
      //... have make a funtion about this cursor thingi>>
       const cursor = document.getElementById("cursor")
       const nextLetter = document.querySelector(".letter.current")
       if (nextLetter) {
         cursor.style.top = nextLetter.getBoundingClientRect().top + 2 + "px"
         cursor.style.left = nextLetter.getBoundingClientRect().left + "px"
       }
      // reseting info values
      totalKeystrokes = 0
      gameTimer = null
      gameStartTIme = 0
    }
  })

}
function wordCounter(){
  wordCount += 1
  document.getElementById("word-counter").innerHTML = `${wordCount}/${totalWords}`
}
function addClass(element , name){
    // element.className += " " + name
    element.classList.add(name)
}
function removeClass(element , name){
    // element.className = element.className.replace(name, "")
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

function handleKeyDown(event){
  if (document.querySelector("#game.disable")) {
    return
  }
  const inputKey = event.key
  const gameWords = document.getElementById("words")
  const currentLetter = document.querySelector(".letter.current")
  const currentWord = document.querySelector(".word.current")
  const expectedKey = currentLetter?.innerHTML || " "
  const isInputLetter = inputKey.length === 1 && inputKey !== " "
  const isInputSpace = inputKey === " "
  const isInputBackspace = inputKey === "Backspace"
  const isFirstLetter = currentLetter === currentWord.firstElementChild

  //sound play
  errorKeySound.currentTime = 0
  keySound.currentTime = 0
  keySound.volume = KeyPressVolume
  errorKeySound.volume = KeyPressVolume
  if (isInputLetter && currentLetter) {
    inputKey !== expectedKey ? errorKeySound.play() : keySound.play()
  }
  if (isInputBackspace || isInputSpace) {
    keySound.play()
  }

  //start timer
  if (!gameTimer && isInputLetter) gameStart();
  // check the letters
  if (isInputLetter) {
    totalKeystrokes += 1;
    if (currentLetter) {
      addClass(
        currentLetter,
        inputKey === expectedKey ? "correct" : "incorrect"
      )
      removeClass(currentLetter, "current")
      if (currentLetter.nextElementSibling) {
        addClass(currentLetter.nextElementSibling, "current")
      }
      if (inputKey !== expectedKey) wrongLetterCount += 1
    } else {
      const incorrectLetter = document.createElement("span")
      incorrectLetter.innerHTML = inputKey
      incorrectLetter.className = "letter incorrect extra"
      currentWord.appendChild(incorrectLetter)
      errorKeySound.play()
      wrongLetterCount += 1
    }
    // increasing the info-container opacity
    document.getElementById("info-container").style.opacity = "1"
  }
  //stop timer
  if (currentLetter === gameWords.lastElementChild.lastElementChild) {
    if (inputKey === expectedKey) gameOver()
  }
  // check the word spaces
  if (
    //the game should not start with space
    isInputSpace &&
    expectedKey !== gameWords.firstElementChild.firstElementChild.innerHTML
  ) {
    if (expectedKey !== " ") {
      const skippedLetters = [
        ...document.querySelectorAll(".word.current .letter:not(.correct)"),
      ]
      skippedLetters.forEach((letter) => {
        addClass(letter, "skipped")
        totalKeystrokes += 1;
      })
      addClass(currentLetter, "skip-start")
    }

    if (currentLetter && currentLetter !== currentWord.firstElementChild) {
      removeClass(currentLetter, "current")
      if (currentWord === gameWords.lastElementChild) {
        gameOver()
      }
    }
    if (currentWord.nextElementSibling) {
      if (currentLetter !== currentWord.firstElementChild) {
        removeClass(currentWord, "current")
        addClass(currentWord.nextElementSibling, "current")
        addClass(currentWord.nextElementSibling.firstElementChild, "current")
        wordCounter()
      }
    }
  }
  // check the BackSpace
  if (isInputBackspace &&currentLetter !== gameWords.firstElementChild.firstElementChild){
    if (currentLetter && isFirstLetter) {
      removeClass(currentWord, "current")
      removeClass(currentLetter, "current")
      addClass(currentWord.previousElementSibling, "current")

      //skipp finder 
      if(currentWord.previousElementSibling.lastElementChild){
        let sibling = currentWord.previousElementSibling.lastElementChild;
        while (sibling.classList.contains("skipped")) {
          if(sibling.classList.contains("skip-start")){
            addClass(sibling , "current")
            break;
          }
          sibling = sibling.previousElementSibling;
        }
      }
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
  // starting new game on pressing enter
  if (inputKey === "Enter") gameRestart()
  
  // moving the cursor
  const cursor = document.getElementById("cursor")
  const nextLetter = document.querySelector(".letter.current")
  const nextWord = document.querySelector(".word.current")
  if (nextLetter) {
    cursor.style.top = nextLetter.getBoundingClientRect().top + 2 + "px"
    cursor.style.left = nextLetter.getBoundingClientRect().left + "px"
  } else {
    cursor.style.top = nextWord.getBoundingClientRect().top + 5 + "px"
    cursor.style.left = nextWord.getBoundingClientRect().right + "px"
  }
  //stopping the blink animation while typing
  cursor.style.animation = "none"
  //moving the lines up
  if (parseInt(cursor.style.top) > 250) {
    const words = document.getElementById("words")
    const marginTop = parseInt(words.style.marginTop || "0px")
    words.style.marginTop = marginTop - 45 + "px"
    cursor.style.top = nextWord.getBoundingClientRect().top + 5 + "px"
  }
  // moving the lines down
  if (parseInt(cursor.style.top) < 200) {
    const words = document.getElementById("words")
    const marginTop = parseInt(words.style.marginTop || "0px")
    words.style.marginTop = marginTop + 45 + "px"
    cursor.style.top = nextWord.getBoundingClientRect().top + 5 + "px"
  }
}

function newGame(){
  const gameWords = document.getElementById("words");
  gameWords.innerHTML ='';
  for(let i = 0; i < totalWords; i++){
    gameWords.innerHTML += " " + wordFormatter(randomWord())
  }
  addClass(document.querySelector(".word"), "current")
  addClass(document.querySelector(".letter"), "current")

  // game focus
  const typingArea = document.getElementById("game");
  window.addEventListener("DOMContentLoaded", () => { typingArea.focus(); })
  window.addEventListener("keydown",() => {
    if(document.activeElement !== typingArea) typingArea.focus();
  })
 
  //updating the word counter
  document.getElementById("word-counter").innerHTML = `0/${totalWords}`
  // comparing the input and expected keys 
  document.getElementById('game').addEventListener('keydown' , handleKeyDown)
}

newGame();