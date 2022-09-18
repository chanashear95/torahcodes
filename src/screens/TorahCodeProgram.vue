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
        let result = [];
        for (let i = 0; i < 50; i++) {
          let letterIdx =
            this.highlightedResultItems[0].letterIndexes[0] +
            this.highlightedResultItems[0].skip * i;
          for (let j = Math.floor(this.displayedMatrixSize / 2); j > 0; j--) {
            result.push({
              value: TANACH.charAt(letterIdx - j),
              idx: letterIdx - j,
            });
          }
          for (let k = 0; k < Math.ceil(this.displayedMatrixSize / 2); k++) {
            result.push({
              value: TANACH.charAt(letterIdx + k),
              idx: letterIdx + k,
            });
          }
        }
        return result;
      }
      return null;
    },
  },
  methods: {
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
      console.log(action);
      // switch (action) {
      //   case "REMOVE":
      //     this.highlightedResultItems.splice(
      //       this.highlightedResultItems.findIndex((i) => i.id === item.id),
      //       1
      //     );
      //     break;
      //   case "ADD":
      //     this.highlightedResultItems.push(item);
      //     break;
      //   default:
      //     break;
      // }
      this.highlightedResultItems = [item];
    },
  },
};
</script>
