<template>
  <div class="body">
    <Navbar id="navbar" :selected="'home'" />
    <div id="textContainer">
      <p id="welcomeText">welcome to</p>
      <h1 id="title">logical</h1>
      <p id="mainText">Relax and improve your logical deduction skills <br>
      by solving fun logic puzzles</p>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'

export default {
  name: 'HomeView',
  components: {Navbar}
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

@keyframes fadein {
  from {opacity: 10%; left: -30px;}
  to {opacity: 100%; left: 0;}
}

#textContainer {
  position: relative;
  margin: 18% 6% 0 6%;
  text-align: left;
  animation-name: fadein;
  animation-fill-mode: forwards;
  animation-duration: 1.2s;
}

#welcomeText {
  font-size: 2em;
  font-weight: 500;
}

#title {
  text-transform: uppercase;
  font-family: var(--font-normal);
  font-size: 4.3em;
  margin-bottom: 40px;
  font-weight: 500;
  letter-spacing: 5px;
}

#mainText {
  font-size: 2.6em;
}
</style>