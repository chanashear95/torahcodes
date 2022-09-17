<template>
  <div class="text">
    <div
      :style="`display: grid; grid-template-columns: ${gridColumns}; column-gap: 5px;`"
    >
      <p
        style="text-align: center"
        v-for="(item, i) in matrixText"
        :key="i"
        :class="{
          found:
            results.findIndex((word) =>
              word.letterIndexes.includes(item.idx)
            ) !== -1,
          selected:
            highlightedResults.findIndex((result) =>
              result.letterIndexes.includes(item.idx)
            ) !== -1,
        }"
      >
        {{ item.value }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "TorahMatrix",
  components: {},
  props: {
    matrixText: {
      type: Array,
      default: () => [],
    },
    matrixSize: {
      type: Number,
      default: 0,
    },
    results: {
      type: Array,
      default: () => [],
    },
    highlightedResults: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    gridColumns() {
      let columns = "";
      for (let i = 0; i < this.matrixSize; i++) {
        columns += "auto";
        if (i < this.matrixSize - 1) {
          columns += " ";
        }
      }
      return columns;
    },
  },
};
</script>

<style scoped>
.text {
  /* width: 1200px;
  height: 800px; */
  overflow: scroll;
  direction: rtl;
}

.found {
  color: blue;
  font-weight: bolder;
}

.selected {
  color: red;
  font-weight: bolder;
}
</style>
