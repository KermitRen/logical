<template>
  <div class="body">
    <Navbar id="navbar" :selected="'learn'" />
    <div id="contentContainer">
        <p id="mainText">Want to improve your deduction skills? This page contains tips and tricks <br>
        for all the different puzzle types. Click on one of the types below to <br>
        learn new techniques and get a better solving time.</p>
        <div id="puzzlesContainer">
            <div @click="$router.push({name:'technique', params: {type:meta.name}})" class="puzzleContainer" v-for="meta in puzzleMetaData" :key="meta.name">
                <p>{{meta.name}}</p>
                <img :src="getImgUrl(meta.name)">
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'

export default {
  name: 'LearnView',
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

#contentContainer {
    display: flex;
    flex-flow: column nowrap;
    align-items: left;
    justify-content: space-between;
    margin: 9vh 10%;
    height: 67%;
}

#mainText {
    text-align: left;
    font-size: 2em;
}

#puzzlesContainer {
    display:flex;
    flex-flow: row nowrap;
    align-items: center;
    overflow-x: auto;
    padding-bottom: 25px;
}

.puzzleContainer {
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-evenly;
    align-items: center;
    background-color: rgba(0, 0, 0, 45%);
    padding: 20px;
    cursor: pointer;
}

.puzzleContainer:hover {
    background-color: rgba(0, 0, 0, 65%);
}

.puzzleContainer:not(:last-child) {
    margin-right: 35px;
}

.puzzleContainer p {
    font-size: 1.8em;
    text-transform: uppercase;
    letter-spacing: 2px;
    font-family: var(--font-normal);
    margin-bottom: 15px;
}

.puzzleContainer img {
    width: 200px;
    height: 200px;
}

::-webkit-scrollbar {
  height: 15px;
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