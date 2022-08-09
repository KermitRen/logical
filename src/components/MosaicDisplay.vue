<template>
  <div id="shell">
    <div class="row" v-for="x in puzzle.height" :key="x">
        <div :class="{cell:true, blank:this.solution[x-1][y-1].state === -1, black:this.solution[x-1][y-1].state === 1, white:this.solution[x-1][y-1].state === 0}" 
        @click="clickedCell(x, y)"  @contextmenu.prevent="rightClickedCell(x,y)" :style="'width: ' + cellSize + ';font-size: ' + fontSize + ';'" v-for="y in puzzle.width" :key="y">
            {{this.solution[x-1][y-1].clue}}
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MosaicDisplay',
  props: ['puzzle'],
  data() {
    return {
        solution: [],
        puzzleFinished: false
    }
  },
  computed: {
    cellSize() {
        switch (this.puzzle.width) {
        case 5  : return '20%';
        case 7  : return '' + 100/7 + '%';
        case 9 : return '' + 100/9 + '%';
        default: return '20%';
        }
    },
    fontSize() {
        switch (this.puzzle.width) {
        case 5  : return '3em';
        case 7  : return '2.5em';
        case 9 : return '2em';
        default: return '3em';
        }
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
  methods: {
    resetSolution() {
        let basicSolution = []
        for(let i = 0; i < this.puzzle.height; i++) {
            basicSolution.push([])
            for(let j = 0; j < this.puzzle.width; j++) {
                // -1 blank, 0 marked white, 1 marked black
                basicSolution[i][j] = {state: -1}
                if(this.puzzle.layout[i][j].showClue) {
                    basicSolution[i][j].clue = this.puzzle.layout[i][j].neighborhoodFill
                }
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
                   (!this.puzzle.layout[i][j].isFilled && this.solution[i][j].state != 0)) {
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
    border: 3px solid black;
}

.row {
    display: flex;
    flex-flow: row nowrap;
}

.cell {
    position: relative;
    width: 20%;
    aspect-ratio: 1/1;
    border: 2px solid black;
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

.white {
    background-color: white;
}

.blank {
    background-color: #bebebe;
}

</style>