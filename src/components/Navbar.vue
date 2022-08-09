<template>
  <div>
    <div class="body">
        <div @click="$router.push({name:'home'})" id="logoContainer">
          <h1>Logical</h1>
          <img src="@/assets/rook-white.png" alt="Logo: Chess Rook">
        </div>
        <div id="navigationContainer">
          <div @click="$router.push({name:'home'})" class="navigationOption">
            Home
            <div v-if="selected === 'home'" class="dot"></div>
          </div>
          <div @click.self="$router.push({name:'puzzles'})" @mouseover="showDropdown = true" @mouseleave="showDropdown = false" id="puzzleOption" class="navigationOption">
            Puzzles
            <div class="arrowDown"></div>
            <div v-if="selected === 'puzzles' && !showDropdown" class="dot"></div>
            <div @click.self="$router.push({name:'puzzles'})" v-if="showDropdown" id="dropdownHitbox"></div>
            <div v-if="showDropdown" id="puzzleDropdown">
              <p v-for="meta in puzzleMetaData" :key="meta.name"  @click="$router.push({name:'puzzle', params: {type:meta.name}})"> {{meta.name}}</p>
            </div>
          </div>
          <div @click="$router.push({name:'learn'})" class="navigationOption">
            Learn
            <div v-if="selected === 'learn'" class="dot"></div>
          </div>
          <div @click="$router.push({name:'about'})" class="navigationOption">
            About
            <div v-if="selected === 'about'" class="dot"></div>
          </div>
        </div>
    </div>
  </div>

</template>

<script>
export default {
    name: 'Navbar',
    props: ['selected'],
    data() {
      return {
        showDropdown: false,
        puzzleMetaData: []
      }
    },
    methods: {
      goToPuzzles(e) {
        console.log(e)
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
  height: 100%;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
  padding: 0 4%;
}

#logoContainer {
  cursor: pointer;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
}

#logoContainer img {
  width: 30px;
}

#logoContainer h1{
  font-size: 2.65em;
  text-transform: uppercase;
  margin-right: 25px;
  font-family: var(--font-normal);
  font-weight: 500;
}

#navigationContainer {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
}

.navigationOption {
  position: relative;
  margin-left: 65px;
  font-family: var(--font-normal);
  font-size: 1.8em;
  padding: 2px 5px;
  cursor: pointer;
}

.navigationOption:hover {
  background-color: rgba(0, 0, 0, 15%);
}

.dot {
  width: 6px;
  height: 6px;
  background-color: white;
  position: absolute;
  border-radius: 50%;
  left: 50%;
  bottom: -10px;
  transform: translateX(-50%);
}

.arrowDown {
  position: absolute;
  width: 0; 
  height: 0; 
  bottom: 8px;
  right: -16px;
  border-left: 7px solid transparent;
  border-right: 7px solid transparent;
  border-top: 11px solid white;
}

#puzzleOption:hover .arrowDown {
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 12px solid white;
}

#puzzleDropdown {
  position: absolute;
  left: 50%;
  width: 200%;
  padding: 20% 20%;
  top: calc(100% + 30px);
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 45%);
  text-align: left;
  z-index: 10;
}

#puzzleDropdown p {
  font-size: 0.9em;
  cursor: pointer;
  display: block;
  text-transform: capitalize;
  padding-bottom: 5%;
  font-family: var(--font-light);
}

#puzzleDropdown p:not(:last-child) {
  border-bottom: 1px solid white;
  margin-bottom: 5%;
}

#puzzleDropdown p:hover {
  background-color: rgba(0, 0, 0, 25%)
}

#dropdownHitbox {
  position: absolute;
  width: 120%;
  height: 100px;
  top: 50%;
  left: 50%;
  transform: translateX(-50%);
}
</style>