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

        <v-card color="rgb(0, 0, 0, 0.5)" width="100%" height="100%" 
          align="center" justify="center">
          <v-card color="transparent" width="50%" height="100%" flat>
            <!-- <v-card-title id="card-title">{{item.title}}</v-card-title> -->
          </v-card>

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
          title: "KAIST GoN Recruiting",
          text: "KAIST 정보보안 및 해킹동아리 GoN에 지원하려는 여러분을 환영합니다.",
        },
        {
          src: require("../assets/images/programmer.jpg"),
          title: "About",
          text: "동아리 정기 활동 일정 및 수상 경력, 자주 묻는 질문 등을 확인해보세요",
        },
        // {
        //   src: require("../assets/images/some_pretty_img.jpg"),
        //   text: "Meet you",
        // },
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
#card-title {
  font-size: 25px;
}
</style>
