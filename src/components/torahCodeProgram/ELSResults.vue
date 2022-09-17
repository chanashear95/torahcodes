<template>
  <div style="height: 400px; overflow: scroll">
    <h2>Results {{ results.length }}</h2>
    <div v-if="results.length > 0">
      <p v-for="item in searchWords" :key="item">
        {{ item }}: {{ results.filter((i) => i.word === item).length }}
      </p>
    </div>
    <v-list v-if="results.length > 0" dense>
      <v-list-item
        v-for="(item, i) in results"
        :key="i"
        @click="() => toggleHighlightResult(item)"
      >
        <div
          :class="{
            resultItem: true,
            selected:
              highlightedResults.findIndex(
                (result) => result.id === item.id
              ) !== -1,
          }"
        >
          {{ item.id + ":" }} {{ item.word }} - Skip: {{ item.skip }} - Indexes:
          {{ item.letterIndexes.join(",") }}
        </div>
      </v-list-item>
    </v-list>
    <p v-else>No results</p>
  </div>
</template>

<script>
export default {
  name: "ELSResults",
  components: {},
  props: {
    results: {
      type: Array,
      default: () => [],
    },
    highlightedResults: {
      type: Array,
      default: () => [],
    },
    searchWords: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    toggleHighlightResult(item) {
      if (this.highlightedResults.findIndex((i) => i.id === item.id) !== -1) {
        this.$emit("update-highlighted-results", {
          item: item,
          action: "REMOVE",
        });
      } else {
        this.$emit("update-highlighted-results", { item: item, action: "ADD" });
      }
    },
  },
};
</script>

<style scoped>
.resultItem {
  border: 1px solid black;
  padding: 10px;
}
.selected {
  border: 1px solid red;
  font-weight: bolder;
}
</style>
