<template>
    <v-footer ablsolute padless>
        <v-col class="text-center" cols="12">
            {{ new Date().getFullYear() }} — <strong>GoN Recruitment</strong>
        </v-col>
    </v-footer>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
@Component({
    name: "MainFooter",
})
export default class MainFooter extends Vue {}
</script>
