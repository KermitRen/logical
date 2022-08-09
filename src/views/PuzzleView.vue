<template>
  <div class="body">
    <Navbar id="navbar" :selected="'puzzles'" />
    <div id="mainContainer">
        <div id="buttonContainer">
            <div id="settingsContainer">
                <div id="settingsInnerContainer">
                    <Settings :type="type"/>
                </div>
                <i @click="toggleSettings" id="exitSettings" class="material-icons">close</i>
            </div>
            <div id="buttonBundler">
                <button class="leftButton" @click="startOver">Start Over</button>
                <div id="lastButtonContainer">
                    <button class="leftButton" @click="genNewPuzzle">New Puzzle</button>
                    <i @click="toggleSettings" id="cog" class="material-icons">settings</i>
                </div>
            </div>
        </div>
        <div id="gameContainer">
            <div id="topGameBar">
                <p id="gameTypeText"> {{ type }} </p>
                <p id="gameTimer"> {{timerString}}</p>
            </div>
            <div id="gameDisplay">
                <div id="loadingScreen" v-if="loadingPuzzle">
                    <div id="loadingCircle"></div>
                    <p>Generating new puzzle ...</p>
                </div>
                <component v-if="!loadingPuzzle" :is="selectedDisplay" @puzzleComplete="puzzleComplete" :puzzle="currentPuzzle" ref="puzzleDisplay"></component>
            </div>
        </div>
        <div id="resultContainer">
            <div v-if="showResult" id="result">
                <p>Congratulations!</p>
                <p>Puzzle solved in</p>
                <p>{{timerString}}</p>
            </div>
        </div>
        <div @click="scrollDown" id="navDown">
            <p>See Rules</p>
            <div class="arrowDown"></div>
        </div>
    </div>
    <div id="rulesContainer">
        <div @click="scrollUp" id="navUp">
            <div class="arrowUp"></div>
            <p> Back To Game</p>
        </div>
        <p id="howToText">How To Play</p>
        <hr>
        <ol>
            <li v-for="rule in rules" :key="rule">
                {{rule}}
            </li>
        </ol>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import NurikabeDisplay from '@/components/NurikabeDisplay.vue'
import MosaicDisplay from '@/components/MosaicDisplay.vue'
import SudokuDisplay from '@/components/SudokuDisplay.vue'
import NonogramDisplay from '@/components/NonogramDisplay.vue'
import Settings from '@/components/Settings.vue'


export default {
  name: 'PuzzleView',
  props: ['type'],
  components: {Navbar, NurikabeDisplay, MosaicDisplay, SudokuDisplay, NonogramDisplay, Settings},
  data() {
    return {
        rules: [],
        currentPuzzle: {},
        timer: 0,
        timerObject: null,
        showSettings: false,
        showResult: false,
        loadingPuzzle: true,
        worker: null
    }
  },
  mounted() {
    this.startTimer()
    const json = require('../data/meta-data.json')
    this.rules = json.meta.find(puzzle => puzzle.name == this.type).rules
    this.setupWorker()
    this.genNewPuzzle()
  },
  methods: {
    scrollUp() {
        document.getElementById('navbar').scrollIntoView({behavior: 'smooth'})
    },
    scrollDown() {
        document.getElementById('rulesContainer').scrollIntoView({behavior: 'smooth'})
    },
    startTimer() {
        if(this.timerObject == null) {
            this.timerObject = setInterval(() => this.timer += 1, 1000)
        }
    },
    stopTimer() {
        clearInterval(this.timerObject)
        this.timerObject = null
    },
    toggleSettings() {
        const cog = document.getElementById('cog')
        const settings = document.getElementById('settingsContainer')
        if(this.showSettings) {
            cog.style.transform = "translateY(-50%) rotate(0deg)"
            settings.style.height = "0px"
        } else {
            cog.style.transform = "translateY(-50%) rotate(140deg)"
            const newHeight = document.getElementById("gameDisplay").clientHeight - document.getElementById("buttonBundler").clientHeight - 20
            settings.style.height = "" + newHeight + "px"
        }
        this.showSettings = !this.showSettings
    },
    startOver() {
        if(this.showResult) {
            this.timer = 0
            this.startTimer()
        }
        this.showResult = false
        this.$refs.puzzleDisplay.resetSolution()
    },
    genNewPuzzle() {
        if(!this.loadPuzzle) {
            this.showResult = false
            this.loadingPuzzle = true
            this.timer = 0
            this.stopTimer()
            switch (this.type) {
                case 'mosaic': 
                    this.worker.postMessage({protocol:"generate",settings:JSON.parse(localStorage.mosaicSettings)})
                    break;
                case 'sudoku': 
                    this.worker.postMessage({protocol:"generate",settings:JSON.parse(localStorage.sudokuSettings)})
                    break;
                case 'nonogram': 
                    this.worker.postMessage({protocol:"generate",settings:JSON.parse(localStorage.nonogramSettings)})
                    break;
                case 'nurikabe': 
                    this.worker.postMessage({protocol:"generate",settings:JSON.parse(localStorage.nurikabeSettings)})
                    break;
                default: break;
            }
        }
    },
    puzzleComplete() {
        this.showResult = true
        this.stopTimer()
    },
    setupWorker() {
        if(this.worker) {
            this.worker.terminate
        }
        let path = '/workers/' + this.type + 'Util.js'
        this.worker = new Worker(path)
        this.worker.onmessage = this.insertPuzzle
    },
    insertPuzzle(response) {
        this.currentPuzzle = response.data
        this.loadingPuzzle = false
        this.startTimer()  
    }
  },
  computed: {
    timerString() {
        let minutes = Math.floor(this.timer/60)
        let seconds = this.timer - (minutes*60)
        let minuteString = (minutes < 10) ? "0" + minutes : minutes
        let secondString = (seconds < 10) ? "0" + seconds : seconds
        return minuteString + ":" + secondString
    },
    selectedDisplay() {
        switch (this.type) {
            case 'mosaic': return MosaicDisplay
            case 'nurikabe': return NurikabeDisplay
            case 'sudoku': return SudokuDisplay
            case 'nonogram': return NonogramDisplay
        }
    }
  },
  watch: {
    type: function() {
        this.startOver()
        this.setupWorker()
        this.genNewPuzzle()
        const json = require('../data/meta-data.json')
        this.rules = json.meta.find(puzzle => puzzle.name == this.type).rules
    }
  }
}
</script>

<style scoped>
.body {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  overflow-y: auto;
}

#navbar {
  height: 15%;
}

.body::-webkit-scrollbar {
  display: none;
}

#mainContainer {
    padding-bottom: 7%;
    padding-top: 2%;
    height: 85%;
    display: flex;
    flex-flow: row nowrap;
}

#buttonContainer {
    width: 25%;
    margin-left: 5%;
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: flex-end;
}

#buttonBundler{
    width: 65%;
}

#lastButtonContainer {
    position: relative;
    margin-top: 20px;
    width: 100%;
}

.leftButton {
    font-size: 2.1em;
    font-family: var(--font-light);
    color: white;
    background-color: rgba(0, 0, 0, 50%);
    border-radius: 15px;
    padding: 8px 18px;
    width: 100%;
}

.leftButton:hover {
    background-color: rgba(0, 0, 0, 85%);
}

#cog {
    position: absolute;
    left: -45px;
    top: 50%;
    font-size: 1.8em;
    transform: translateY(-50%);
    cursor: pointer;
    transition: transform 0.5s;
}

#cog:hover {
    filter: brightness(55%);
}

#settingsContainer {
    width: 65%;
    height: 0px;
    background-color: rgba(0, 0, 0, 65%);
    margin-bottom: 20px;
    transition: height 0.5s;
    border-radius: 15px;
    overflow: hidden;
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
}

#settingsInnerContainer {
    text-align: left;
    padding: 20px;
    height: 90%;
}

#exitSettings {
    font-size: 2em;
    cursor: pointer;
    height: 10%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

#gameContainer {
    width: 30%;
    margin: 0 5%;
    overflow: hidden;
    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-end;
}

#topGameBar {
    display:flex;
    flex-flow:row nowrap;
    align-items: center;
    justify-content: space-between;
    font-size: 2em;
    font-family: var(--font-normal);
    margin-bottom: 10px;
}

#gameTypeText {
    text-transform: uppercase;
    letter-spacing: 2px;
}

#resultContainer {
    width: 25%;
    margin-right: 5%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

@keyframes fadein {
  from {opacity: 10%; top: -30px;}
  to {opacity: 100%; top: 0;}
}

#result {
    position: relative;
    font-size: 2em;
    text-align: center;
    animation-name: fadein;
    animation-fill-mode: forwards;
    animation-duration: 0.6s;
}

#result p:first-child {
    color: #42f2a2ff;
    font-size: 1.1em;
    margin-bottom: 20px;
}

#rulesContainer {
    position:relative;
    height: 100%;
    text-align: left;
    padding: 10% 6%;
}

#navDown {
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    cursor: pointer;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    font-size: 1.8em;
    padding: 5px;
}

#navDown:hover {
    background-color: rgba(0, 0, 0, 10%);
}

#navUp {
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    cursor: pointer;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    font-size: 1.8em;
    padding: 5px;
}

#navUp:hover {
    background-color: rgba(0, 0, 0, 10%);
}

.arrowUp {
    width: 0; 
    height: 0; 
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 10px solid white;
    margin-bottom: 5px;
}

.arrowDown {
    width: 0; 
    height: 0; 
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-top: 10px solid white;
    margin-top: 5px;
}

#howToText {
    font-size: 2.5em;
    font-family: var(--font-normal);
}

hr {
    margin-top: 15px;
    margin-bottom: 30px;
}

ol {
    width: 65%;
    list-style: inside;
    list-style-type: decimal;
    font-size: 1.5em;
}

li:not(:last-child) {
    margin-bottom: 30px;
}

#gameDisplay {
    position: relative;
}

#loadingScreen {
    width: 100%;
    aspect-ratio: 1/1;
    background-color: rgba(0, 0, 0, 45%);
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: center;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

#loadingCircle {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    border: 6px solid white;
    border-top: 6px solid #808864;
    margin-bottom: 40px;
    animation: spin 1s linear infinite;
}

#loadingScreen p {
    font-size: 2em;
}
</style>