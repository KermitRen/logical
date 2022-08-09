<template>
  <div id="shell" :style="borderThick">
    <div class="row topRow">
        <div class="bigEmpty" :style="borderThin"></div>
        <div class="columnConstraint" :style="fontSize + borderThin" v-for="x in puzzle.width" :key="x">
            <p v-for="column in puzzle.columnConstraints[x - 1]" :key="column">
                {{column}}
            </p>
        </div>
    </div>
    <div class="row">
        <div class="column">
            <div class="rowConstraint" :style="fontSize + borderThin" v-for="y in puzzle.height" :key="y">
                <p v-for="row in puzzle.rowConstraints[y - 1]" :key="row">
                {{row}}
                </p>
            </div>
        </div>
        <div class="mainContent">
            <div class="row" v-for="x in puzzle.height" :key="x">
                <div :class="{cell:true, black:this.solution[x-1][y-1].state === 1, crossed:this.solution[x-1][y-1].state === 0 && !puzzleFinished}"
                v-for="y in puzzle.width" :key="y" @click="clickedCell(x, y)" @contextmenu.prevent="rightClickedCell(x,y)" :style="borderThin">
                    <div class="dot"></div>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>


<script>
export default {
  name: 'NonogramDisplay',
  props: ['puzzle'],
  data() {
    return {
        solution: [],
        puzzleFinished: false
    }
  },
  watch: {
    puzzle: function(val) {
        this.resetSolution()
    }
  },
  beforeMount() {
    this.resetSolution()
  },
  computed: {
    fontSize() {
        switch (this.puzzle.width) {
        case 5  : return 'font-size: 1.5em;';
        case 10  : return 'font-size: 1.2em;';
        case 15 : return 'font-size: 0.95em;';
        default: return 'font-size: 1em;';
        }
    },
    borderThin() {
        switch (this.puzzle.width) {
        case 5  : return 'border: 2px solid black;';
        case 10  : return 'border: 1px solid black;';
        case 15 : return 'border: 1px solid black;';
        default: return 'border: 1px solid black;';
        }
    },
    borderThick() {
        switch (this.puzzle.width) {
        case 5  : return 'border: 3px solid black;';
        case 10  : return 'border: 2px solid black;';
        case 15 : return 'border: 2px solid black;';
        default: return 'border: 2px solid black;';
        }
    }
  },
  methods: {
    resetSolution() {
        let basicSolution = []
        for(let i = 0; i < this.puzzle.height; i++) {
            basicSolution.push([])
            for(let j = 0; j < this.puzzle.width; j++) {
                // -1 empty, 1 is colored, 0 is not-colored
                basicSolution[i][j] = {state: -1}
            }
        }
        this.solution = basicSolution
        this.puzzleFinished = false
    },
    clickedCell(x, y) {
        if(!this.puzzleFinished) {
            if(this.solution[x-1][y-1].state === 1) {
                this.solution[x-1][y-1].state = -1
            } else {
                this.solution[x-1][y-1].state = 1
            }
            this.checkPuzzle()
        }
    },
    rightClickedCell(x,y) {
        if(!this.puzzleFinished) {
            if(this.solution[x-1][y-1].state === 0) {
                this.solution[x-1][y-1].state = -1
            } else {
                this.solution[x-1][y-1].state = 0
            }
            this.checkPuzzle()
        }
    },
    checkPuzzle() {
        for(let i = 0; i < this.puzzle.height; i++) {
            for(let j = 0; j < this.puzzle.width; j++) {
                if((this.puzzle.layout[i][j].isFilled && this.solution[i][j].state != 1) ||
                   (!this.puzzle.layout[i][j].isFilled && this.solution[i][j].state == 1)) {
                    return
                   }
            }
        }
        this.puzzleFinished = true
        this.$emit('puzzleComplete')
    }
  }
}
</script>

<style scoped>

#shell {
    aspect-ratio: 1/1;
    overflow-y: auto;
}

.row {
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
}

.topRow {
    width: 100%;
    aspect-ratio: 5/1;
    overflow-y: auto;
}

.column {
    width: 20%;
    display: flex;
    flex-flow: column nowrap;
}

.mainContent {
    width: 80%;
}

.bigEmpty {
    width: 20%;
    aspect-ratio: 1/1;
    background-color: rgb(175, 190, 153);
}

.columnConstraint {
    flex: 1 1 0px;
    background-color: rgb(202, 216, 190);
    color: black;
    font-family: var(--font-normal);
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: flex-end;
    padding-bottom: 2px;
    overflow-y: auto;
}

.rowConstraint p {
    margin-right: 4px;
}

.rowConstraint {
    width: 100%;
    flex: 1 1 0px;
    color: black;
    background-color: rgb(202, 216, 190);
    color: black;
    font-family: var(--font-normal);
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: flex-end;
    overflow:hidden
}

.cell {
    flex: 1 1 0px;
    position: relative;
    aspect-ratio: 1/1;
    background-color: white;
    cursor: pointer;
    color: black;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-normal);
    font-weight: 600;
}

.cell:hover {
    box-shadow: inset 0px 0px 0px 2px gray;
}

.black {
    background-color: black;
    color: white;
}

.dot {
    display: none;
    background-color: black;
    width: 15%;
    aspect-ratio: 1/1;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
}

.crossed .dot {
    display: block;
}

.crossed {
    background-color: rgb(227, 227, 227);
}


</style>