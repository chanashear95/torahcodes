import { TANACH } from "@/data/tanach";

const MAX_BATCH = 5;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default {
  name: "ELSMixin",
  data() {
    return {
      results: [],
      loading: 0,
    };
  },
  methods: {
    async useELSAlgorithm({
      matrixStart,
      matrixEnd,
      searchWords,
      minSkip,
      maxSkip,
    }) {
      for (let i = matrixStart; i < matrixEnd; i++) {
        for (let j = 0; j < searchWords.length; j++) {
          await this.findWord(
            i,
            searchWords[j],
            minSkip,
            maxSkip,
            searchWords.length,
            matrixStart,
            matrixEnd
          );
        }
      }
      this.loading = 0;
    },
    async findWord(
      currentLetterIdx,
      searchWord,
      minSkip,
      maxSkip,
      numOfWords,
      matrixStart,
      matrixEnd
    ) {
      let foundWords = [];
      if (TANACH[currentLetterIdx] === searchWord.charAt(0)) {
        let currentSkip = minSkip;
        while (currentSkip <= maxSkip) {
          let matchedWord = "";
          const letterIndexes = [];
          for (let i = 0; i < searchWord.length; i++) {
            matchedWord += TANACH[currentLetterIdx + currentSkip * i];
            letterIndexes.push(currentLetterIdx + currentSkip * i);
          }
          if (matchedWord === searchWord) {
            foundWords.push({
              id: letterIndexes.join(""),
              word: searchWord,
              letterIndexes: letterIndexes,
              skip: currentSkip,
            });
            if (
              foundWords.length % MAX_BATCH === 0 ||
              currentSkip === maxSkip
            ) {
              this.results = this.results.concat(foundWords);
              foundWords = [];
            }
          }
          matchedWord = "";
          currentSkip++;

          await sleep(0);
          if (currentLetterIdx === matrixEnd) {
            this.loading = null;
          }
        }
      }
      this.loading += 100 / ((matrixEnd - matrixStart) * numOfWords);
      return foundWords;
    },
  },
};
