<template>
  <div class="home">
    <v-carousel
      cycle
      height="500"
      hide-delimiter-background
      delimiter-icon="mdi-minus"
      show-arrows-on-hover
    >
      <v-carousel-item v-for="(item, i) in items" :key="i">
        <v-img id="carousel-background" :src="item.src" height="100%"> </v-img>

        <v-card color="rgb(0, 0, 0, 0.5)" width="100%" height="100%">
          <v-row class="fill-height" align="center" justify="center">
            <div id="display-message">
              {{ item.text }}
            </div>
          </v-row>
        </v-card>
      </v-carousel-item>
    </v-carousel>
  </div>
</template>

<script>
// @ is an alias to /src
import Vue from "vue";
import Component from "vue-class-component";

@Component({
  name: "Home",
  data: () => {
    return {
      items: [
        {
          src: require("../assets/images/computer-1833058.png"),
          text: "Hello!",
        },
        {
          src: require("../assets/images/programmer.jpg"),
          text: "Nice to",
        },
        {
          src: require("../assets/images/some_pretty_img.jpg"),
          text: "Meet you",
        },
      ],
    };
  },
})
export default class Home extends Vue {}
</script>

<style scoped>
#display-message {
  font-size: 25px;
}
#carousel-background {
  position: absolute;
}
</style>
