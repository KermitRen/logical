<template>
  <div class="body">
    <Navbar id="navbar" :selected="'learn'" />
    <div id="contentContainer">
        <p id="titleText">Techniques for solving a <span>{{type}}</span></p>
        <hr>
        <div class="techContainer" v-for="technique in techniques" :key="technique.title">
            <p class="techTitle">{{technique.title}}</p>
            <p class="techText">{{technique.text}}</p>
            <img class="techImg" :src="getImgUrl(technique.image)">
        </div>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'

export default {
  name: 'TechniqueView',
  components: {Navbar},
  props: ['type'],
  data() {
    return {
        techniques: []
    }
  },
  beforeMount() {
    const json = require('../data/techniques/' + this.type + '-t.json')
    this.techniques = json.techniques
  },
  methods: {
    getImgUrl(path) {
        return require('../assets/techniques/'+path)
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
}

#navbar {
  height: 15%;
}

#contentContainer {
    height: 75%;
    margin: 5vh 6%;
    text-align: left;
    overflow-y: auto;
}

#contentContainer::-webkit-scrollbar {
    display: none;
}

#titleText {
    font-size: 2.5em;
    font-family: var(--font-normal);
}

#titleText span {
    text-transform: capitalize;
}

hr {
    margin-top: 15px;
    margin-bottom: 50px;
}

.techContainer {
    margin-bottom: 80px;
}

.techTitle {
    font-size: 1.85em;
    font-family: var(--font-normal);
    margin-bottom: 10px;
}

.techText {
    font-size: 1.6em;
    width: 60%;
    margin-bottom: 30px;
}

.techImg {
    height: 150px;
}
</style>