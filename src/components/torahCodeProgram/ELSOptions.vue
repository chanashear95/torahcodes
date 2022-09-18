<template>
  <div>
    <h3>Words to Search: {{ searchWords.join(" | ") }}</h3>
    <v-text-field v-model="searchInputVal" type="text" label="Search Word" />
    <v-btn @click="addWord">Add Word</v-btn>
    <v-text-field v-model="minSkip" type="number" label="Minimum Skips" />
    <v-text-field v-model="maxSkip" type="number" label="Minimum Skips" />
    <v-btn @click="search">Search</v-btn>
  </div>
</template>

<script>
import ELSMixin from "../../mixins/els/els";

export default {
  name: "ELSOptions",
  mixins: [ELSMixin],
  props: {
    matrixStart: {
      type: Number,
      default: 0,
    },
    matrixEnd: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      searchInputVal: "",
      searchWords: [],
      minSkip: 0,
      maxSkip: 1,
    };
  },
  watch: {
    results(val) {
      this.$emit("update-results", val);
    },
    loading(val) {
      this.$emit("update-loading", val);
    },
  },
  methods: {
    addWord() {
      this.searchWords.push(this.searchInputVal);
      this.searchInputVal = "";
      this.$emit("update-search-words", this.searchWords);
    },
    async search() {
      this.$emit("update-results", []);
      await this.useELSAlgorithm({
        matrixStart: this.matrixStart,
        matrixEnd: this.matrixEnd,
        searchWords: this.searchWords,
        minSkip: Number(this.minSkip),
        maxSkip: Number(this.maxSkip),
      });
    },
  },
};
</script>
