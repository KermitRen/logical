<template>
  <div id="shell">
    <div class="row" v-for="x in puzzle.height" :key="x">
        <div :class="{cell:true, water:solution[x-1][y-1].state == -1, land:solution[x-1][y-1].state == 0 || (puzzleFinished && !puzzle.layout[x-1][y-1].isFilled && !puzzle.layout[x-1][y-1].hasOwnProperty('number'))}" :style="fontSize"
        @click="clickedCell(x, y)"  @contextmenu.prevent="rightClickedCell(x,y)" v-for="y in puzzle.width" :key="y">
            <p v-if="puzzle.layout[x-1][y-1].number"> {{ puzzle.layout[x-1][y-1].number }} </p>
            <div class="dot"></div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NurikabeDisplay',
  props: ['puzzle'],
  data() {
    return {
        solution: [],
        puzzleFinished: false
    }
  },
  computed: {
    fontSize() {
        switch (this.puzzle.width) {
        case 5  : return 'font-size: 3em;';
        case 7  : return 'font-size: 2.5em;';
        case 9 : return 'font-size: 2em;';
        default: return 'font-size: 3em;';
        }
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
                basicSolution[i].push({state:-2})
            }
        }
        this.solution = basicSolution
        this.puzzleFinished = false
    },
    clickedCell(x, y) {
        if(this.solution[x-1][y-1].state < 1 && !this.puzzleFinished && !this.puzzle.layout[x-1][y-1].number) {
            if(this.solution[x-1][y-1].state === -1) {
                this.solution[x-1][y-1].state = -2
            } else {
                this.solution[x-1][y-1].state = -1
            }
            this.checkPuzzle()
        }
    },
    rightClickedCell(x,y) {
        if(this.solution[x-1][y-1].state < 1  && !this.puzzleFinished && !this.puzzle.layout[x-1][y-1].number) {
            if(this.solution[x-1][y-1].state === 0) {
                this.solution[x-1][y-1].state = -2
            } else {
                this.solution[x-1][y-1].state = 0
            }
            this.checkPuzzle()
        }
    },
    checkPuzzle() {
        for(let i = 0; i < this.puzzle.height; i++) {
            for(let j = 0; j < this.puzzle.width; j++) {
                if((this.puzzle.layout[i][j].isFilled && this.solution[i][j].state != -1) ||
                   (!this.puzzle.layout[i][j].isFilled && this.solution[i][j].state == -1)) {
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
    flex: 1 1 0px;
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

.water {
    background-color: black;
}

.dot {
    display: none;
    background-color: black;
    border-radius: 50%;
    width: 15%;
    aspect-ratio: 1/1;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
}

.land .dot {
    display: block;
}

</style>