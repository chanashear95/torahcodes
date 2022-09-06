<template>
  <div id="app">
    <div class="text">
      <v-list dense>
        <v-list-item-group v-model="text" color="primary">
          <v-list-item
            v-for="(item, i) in text"
            :key="i"
            style="width: 20px; display: inline-block"
          >
            <p
              :class="{
                found: wordsFound.findIndex((j) => Number(j) == i) !== -1,
              }"
            >
              {{ item }}
            </p>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </div>
    <v-text-field type="text" v-model="currWord" outlined label="Add word">
    </v-text-field>
    <v-text-field
      type="text"
      v-model="skip"
      outlined
      label="Add Skip Iteration"
    ></v-text-field>

    <v-btn @click="searchWords">Search</v-btn>

    <p v-if="wordsFound.length > 0">
      Found {{ wordsFound.length / currWord.length }} words
    </p>
  </div>
</template>

<script>
import { BEREISHIT } from "./bereishit";
export default {
  name: "App",
  data() {
    return {
      currWord: "",
      skip: "0",
      wordsFound: [],
    };
  },
  computed: {
    text() {
      return BEREISHIT();
    },
  },
  methods: {
    searchWords() {
      const foundLetters = [];
      for (let i = 0; i < this.text.length; i++) {
        if (i + this.skip * this.currWord.length < this.text.length) {
          if (this.text[i] === this.currWord.charAt(0)) {
            console.log(i + this.text[i]);
            let combo = [];
            combo.push(i);
            let counter = Number(this.skip);
            if (this.currWord.length === 1) {
              foundLetters.push(i);
            } else {
              for (let j = 1; j < this.currWord.length; j++) {
                console.log(counter);
                console.log("Verdict" + this.text[i + Number(counter)]);
                if (
                  this.currWord.charAt(j) === this.text[i + Number(counter)]
                ) {
                  const num = Number(counter) + i;
                  combo.push(num);
                  console.log("COMBO", combo);
                  counter += Number(this.skip);
                  if (combo.length === this.currWord.length) {
                    for (let g = 0; g < combo.length; g++) {
                      foundLetters.push(combo[g]);
                    }
                  }
                }
              }
            }
          }
        }
      }
      console.log(foundLetters);
      this.wordsFound = foundLetters;
    },
  },
};
</script>

<style>
.text {
  width: 400px;
  height: 400px;
  overflow-wrap: break-word;
  overflow: scroll;
  direction: rtl;
}

.found {
  color: blue;
  font-weight: bolder;
}
</style>
