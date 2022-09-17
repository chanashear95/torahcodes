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
    async useELSAlgorithm({ matrixText, searchWords, minSkip, maxSkip }) {
      for (let i = 0; i < matrixText.length; i++) {
        for (let j = 0; j < searchWords.length; j++) {
          await this.findWord(
            matrixText,
            i,
            searchWords[j],
            minSkip,
            maxSkip,
            searchWords.length
          );
        }
      }
      this.loading = 0;
    },
    async findWord(
      matrixText,
      currentLetterIdx,
      searchWord,
      minSkip,
      maxSkip,
      numOfWords
    ) {
      let foundWords = [];
      if (matrixText[currentLetterIdx] === searchWord.charAt(0)) {
        let currentSkip = minSkip;
        while (currentSkip <= maxSkip) {
          let matchedWord = "";
          const letterIndexes = [];
          for (let i = 0; i < searchWord.length; i++) {
            matchedWord += matrixText[currentLetterIdx + currentSkip * i];
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
          if (currentLetterIdx === matrixText.length) {
            this.loading = null;
          }
        }
      }
      this.loading += 100 / (matrixText.length * numOfWords);
      return foundWords;
    },
  },
};
