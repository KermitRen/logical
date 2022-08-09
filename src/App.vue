<template>
  <div class="background-base">
    <div :style="'opacity:' + backgroundOpacity + ';'" class="background"></div>
  </div>
  <router-view/>
</template>

<script>
export default {
  computed: {
    backgroundOpacity() {
      switch (this.$route.name) {
        case 'puzzles'  : return '40%';
        case 'puzzle'   : return '50%';
        case 'learn'    : return '45%';
        case 'technique': return '40%';
        default: return '30%';
      }
    }
  },
  beforeCreate() {
    //Default Settings
    if(!localStorage.mosaicSettings) {
      localStorage.mosaicSettings = JSON.stringify([{label:"size", type:"radio", options: [{name:"S",val: "small", set:true}, {name:"M",val: "medium"}, {name:"L",val:"large"}]}])
    }
    if(!localStorage.nurikabeSettings) {
      localStorage.nurikabeSettings = JSON.stringify([{label:"size", type:"radio", options: [{name:"S",val: "small", set:true}, {name:"M",val: "medium"}, {name:"L",val:"large"}]}])
    }
    if(!localStorage.sudokuSettings) {
      localStorage.sudokuSettings = JSON.stringify([{label:"difficulty", type:"radio", options: [{name:"Easy",val: "easy", set:true}, {name:"Normal",val: "medium"}, {name:"Hard",val:"hard"}]}])
    }
    if(!localStorage.nonogramSettings) {
      localStorage.nonogramSettings = JSON.stringify([{label:"size", type:"radio", options: [{name:"S",val: "small", set:true}, {name:"M",val: "medium"}, {name:"L",val:"large"}]},
                                                      {label:"difficulty", type:"radio", options: [{name:"Easy",val: "easy", set:true}, {name:"Normal",val: "medium"}, {name:"Hard",val:"hard"}]}])
    }
  }
}
</script>

<style>
@import url('http://fonts.cdnfonts.com/css/louis-george-cafe');
@import url('http://fonts.cdnfonts.com/css/lato');

:root {
  --font-normal: 'Louis George Café', Helvetica, Arial, sans-serif;
  --font-light: 'Louis George Café Light', Helvetica, Arial, sans-serif;
}

#app {
  font-family: var(--font-light);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: white;
  font-size: 100%;
  letter-spacing: 1px;
  height: 100vh;
  position: relative;
}

* {
  box-sizing: border-box;
  padding: 0px;
  margin: 0px;

  -webkit-user-select: none; 
  -moz-user-select: none;
  -ms-user-select: none; 
  -o-user-select: none;
  user-select: none;
}

button {
  cursor: pointer;
  border: none;
  outline: none;
}

.background-base {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: black;
}

.background {
  height: 100%;
  width: 100%;
  background-image: url("@/assets/serenity.jpg");
  background-size: cover;
  opacity: 30%;
  transition: opacity 2.5s;
}
</style>
