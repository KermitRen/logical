<template>
  <div class="body">
    <Navbar id="navbar" :selected="'puzzles'" />
    <div id="listContainer">
        <div @click="$router.push({name:'puzzle', params: {type:puzzle.name}})" class="listItem" v-for="puzzle in puzzleMetaData" :key="puzzle.name">
            <p class="puzzleName"> {{puzzle.name}} </p>
            <p class="puzzleDescription"> {{puzzle.description}} </p>
            <img class="puzzleImage" :src="getImgUrl(puzzle.name)">
        </div>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'

export default {
  name: 'PuzzlesView',
  components: {Navbar},
  data() {
    return {
        puzzleMetaData: []
    }
  },
  methods: {
    getImgUrl(puzzle) {
        return require('../assets/'+puzzle+'.png')
    }
  },
  beforeMount() {
    const json = require('../data/meta-data.json')
    this.puzzleMetaData = json.meta
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
}

#navbar {
  height: 15%;
}

#listContainer {
  height: 70%;
  margin: 3% 7.5%;
  overflow-y: auto;
  padding-right: 25px;
  z-index: -10;
}

.listItem {
  height: 225px;
  background: rgba(0,0,0,35%);
  text-align: left;
  padding: 25px 50px;
  position: relative;
  cursor: pointer;
}

.listItem:hover {
  background: rgba(0,0,0,45%);
}

.listItem:not(:last-child) {
  margin-bottom: 30px;
}

.puzzleName {
  font-size: 2em;
  text-transform: uppercase;
  letter-spacing: 3px;
  font-family: var(--font-normal);
  margin-bottom: 20px;
}

.puzzleDescription {
  font-size: 1.45em;
  width: 60%;
}

.puzzleImage {
  position: absolute;
  width: 175px;
  height: 175px;
  right: 25px;
  top: 25px;
}

::-webkit-scrollbar {
  width: 15px;
}

::-webkit-scrollbar-track {
  background: rgba(0,0,0,55%); 
}
 
::-webkit-scrollbar-thumb {
  background: #808864; 
}

::-webkit-scrollbar-thumb:hover {
  background: #656b4c; 
}
</style>