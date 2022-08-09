<template>
  <div class="body">
    <Navbar id="navbar" :selected="'about'" />
    <div id="textContainer">
        <p id="headerText">My Goal</p>
        <p id="mainText">The goal of LOGICAL was to create a singular hub for solving <br>
        different types of logic puzzles. I wanted the site to be simple,<br>
        clean and intuitive, without unnecessary clutter.<br><br>
        There are currently no plans to introduce new features, but in<br>
        the future I might add more unique puzzle types.</p>
    </div>
    <div id="madeWithContainer">
        <p>Made with</p>
        <hr>
        <div id="logoContainer">
            <img src="../assets/html-css-js.png">
            <img src="../assets/vue.png">
            <img src="../assets/github.png">
        </div>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'

export default {
  name: 'AboutView',
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

#textContainer{
    text-align: left;
    margin-top: 25vh;
    padding: 6%;
    height: 60%;
}

#headerText {
    font-size: 3.6em;
    margin-bottom: 15px;
    font-family: var(--font-normal);
}

#mainText {
    font-size: 1.9em;
}

#madeWithContainer {
    position: absolute;
    bottom: 5vh;
    right: 5%;
    max-width: 20%;
}

#madeWithContainer p {
    font-family: var(--font-normal);
    font-size: 2em;
}

hr {
    margin-top: 10px;
    margin-bottom: 15px;
}

#logoContainer {
    display:flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: space-evenly;
}

#logoContainer img {
    padding: 0 10px;
}
</style>