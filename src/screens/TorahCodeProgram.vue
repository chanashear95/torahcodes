<template>
  <div>
    <h1>Torah Code</h1>

    <TorahMatrix
      v-if="displayedMatrix"
      :matrix-text="displayedMatrix"
      :matrix-size="displayedMatrixSize"
      :results="results"
      :highlighted-results="highlightedResultItems"
    />
    <p style="color: blue; font-size: 20px" v-if="loading > 0">
      Loading {{ loading }} %
    </p>

    <ELSResults
      :search-words="searchWords"
      :results="results"
      :highlighted-results="highlightedResultItems"
      @update-highlighted-results="updateHighlightedResults"
    />

    <MatrixOptions
      :matrix-start="matrixStart"
      :matrix-end="matrixEnd"
      @update-field="updateField"
    />
    <ELSOptions
      :matrix-start="matrixStart"
      :matrix-end="matrixEnd"
      @update-search-words="updateSearchWords"
      @update-results="updateResults"
      @update-field="updateField"
      @update-loading="updateLoading"
    />
  </div>
</template>

<script>
import { TANACH } from "@/data/tanach";

export default {
  name: "TorahCodeProgram",
  components: {
    TorahMatrix: () => import("../components/torahCodeProgram/TorahMatrix.vue"),
    ELSOptions: () => import("../components/torahCodeProgram/ELSOptions.vue"),
    MatrixOptions: () =>
      import("../components/torahCodeProgram/MatrixOptions.vue"),
    ELSResults: () => import("../components/torahCodeProgram/ELSResults.vue"),
  },
  data() {
    return {
      results: [],
      highlightedResultItems: [],
      matrixStart: 0,
      matrixEnd: TANACH.length - 1,
      loading: null,
      searchWords: [],
      tableHeight: 20,
    };
  },
  computed: {
    displayedMatrixSize() {
      const defaultSize = 50;
      return defaultSize > this.highlightedResultItems[0]?.skip
        ? this.highlightedResultItems[0].skip
        : defaultSize;
    },
    displayedMatrix() {
      if (this.highlightedResultItems.length > 0) {
        return this.generateMatrixRowsBeforeOrAfterResult(
          this.highlightedResultItems[0].letterIndexes[0],
          this.highlightedResultItems[0].skip,
          "BEFORE"
        ).concat(
          this.generateMatrixRowsBeforeOrAfterResult(
            this.highlightedResultItems[0].letterIndexes[0],
            this.highlightedResultItems[0].skip,
            "AFTER"
          )
        );
      }
      return null;
    },
  },
  methods: {
    generateMatrixRowsBeforeOrAfterResult(firstIdx, skip, type) {
      let result = [];
      const length =
        type === "BEFORE"
          ? Math.floor(this.tableHeight / 2)
          : Math.ceil(this.tableHeight / 2);
      const startingPoint = type === "BEFORE" ? 1 : 0;
      for (let i = startingPoint; i < length; i++) {
        let letterIdx =
          type === "BEFORE" ? firstIdx - skip * i : firstIdx + skip * i;
        if (
          (letterIdx <= 0 && type === "BEFORE") ||
          (letterIdx > TANACH.length - 1 && type === "AFTER")
        ) {
          break;
        } else {
          result = result.concat(
            this.generateLineInMatrix(letterIdx, this.displayedMatrixSize, type)
          );
        }
      }
      return type === "BEFORE" ? result.reverse() : result;
    },
    generateLineInMatrix(idx, lineSize, type) {
      const result = [];
      for (let j = Math.floor(lineSize / 2); j > 0; j--) {
        result.push({
          value: TANACH.charAt(idx - j),
          idx: idx - j,
        });
      }
      for (let k = 0; k < Math.ceil(this.displayedMatrixSize / 2); k++) {
        result.push({
          value: TANACH.charAt(idx + k),
          idx: idx + k,
        });
      }
      return type === "BEFORE" ? result.reverse() : result;
    },
    updateField({ field, value }) {
      this.results = [];
      this.highlightedResultItems = [];
      this[field] = value;
    },
    updateSearchWords(val) {
      this.searchWords = val;
    },
    updateLoading(val) {
      this.loading = val;
    },
    updateResults(results) {
      this.results = results;
    },

    updateHighlightedResults({ item, action }) {
      switch (action) {
        case "REMOVE":
          this.highlightedResultItems.splice(
            this.highlightedResultItems.findIndex((i) => i.id === item.id),
            1
          );
          break;
        case "ADD":
          this.highlightedResultItems = [item];
          break;
        default:
          break;
      }
    },
  },
};
</script>
