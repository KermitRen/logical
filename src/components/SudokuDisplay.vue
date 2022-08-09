<template>
    <div id="shell">
    <div class="row" v-for="x in puzzle.height" :key="x">
        <input type="number" :class="{cell:true, down:(x==3 || x==6), right:(y==3 || y==6), clue:puzzle.layout[x-1][y-1].showClue}" v-for="y in puzzle.width" 
        :key="y" @input="cellChange($event,x,y)" @click="e => { if(!(puzzle.layout[x-1][y-1].showClue || puzzleFinished)){e.target.select()}}"
        :value="solution[x-1][y-1].number == -1 ? '' : solution[x-1][y-1].number" :readonly="puzzle.layout[x-1][y-1].showClue || puzzleFinished">
    </div>
  </div>
</template>

<script>
export default {
  name: 'SudokuDisplay',
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
  methods: {
    resetSolution() {
        let basicSolution = []
        for(let i = 0; i < 9; i++) {
            basicSolution.push([])
            for(let j = 0; j < 9; j++) {
                if(this.puzzle.layout[i][j].showClue) {
                    basicSolution[i][j] = {number: this.puzzle.layout[i][j].number}
                } else {
                    basicSolution[i][j] = {number: -1}
                }
            }
        }
        this.solution = basicSolution    
        this.puzzleFinished = false
    },
    cellChange(event, i,j) {
        let number = event.target.value
        
        //Fix invalid input
        if(number.length > 1) {
           number = number.charAt(0) 
        }
        const validDigits = ["1","2","3","4","5","6","7","8","9"]
        if(!validDigits.includes(number)) {
            number = ""
        }
        event.target.value = number

        //Save to solution
        this.solution[i-1][j-1].number = (number === "") ? -1 : parseInt(number)
        this.checkPuzzle()
    },
    checkPuzzle() {
        for(let i = 0; i < 9; i++) {
            for(let j = 0; j < 9; j++) {
                if(this.puzzle.layout[i][j].number != this.solution[i][j].number) {
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
    border: 4px solid black;
}

.row {
    display: flex;
    flex-flow: row nowrap;
}

.cell {
    position: relative;
    width: 11.11%;
    aspect-ratio: 1/1;
    border: 1px solid black;
    background-color: white;
    cursor: pointer;
    color: black;
    display: flex;
    text-align: center;
    align-items: center;
    justify-content: center;
    font-family: var(--font-normal);
    font-weight: 500;
    font-size: 2em;
    outline: none;
}

input[type=number]::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

.cell:hover {
    box-shadow: inset 0px 0px 0px 2px gray;
}

.right {
    border-right: 3px solid black;
}

.down {
    border-bottom: 3px solid black;
}

.clue {
    background-color: rgb(227, 227, 227);
    font-weight: 600;
}


</style>