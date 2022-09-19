import { TANACH } from "../../data/tanach.js";

const MAX_BATCH = 5;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

onmessage = async (msg) => {
  const params = JSON.parse(msg.data);
  await iterateOverText(params);
  postMessage(null);
};

const iterateOverText = async ({
  matrixStart,
  matrixEnd,
  workerStartRange,
  workerEndRange,
  searchWords,
  minSkip,
  maxSkip,
}) => {
  for (let i = workerStartRange; i < workerEndRange; i++) {
    for (let j = 0; j < searchWords.length; j++) {
      await findWord(
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
};
const findWord = async (
  currentLetterIdx,
  searchWord,
  minSkip,
  maxSkip,
  numOfWords,
  matrixStart,
  matrixEnd
) => {
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
        if (foundWords.length % MAX_BATCH === 0 || currentSkip === maxSkip) {
          postMessage(JSON.stringify(foundWords));
          foundWords = [];
        }
      }
      matchedWord = "";
      currentSkip++;

      await sleep(0);
    }
  }
  postMessage(JSON.stringify(100 / ((matrixEnd - matrixStart) * numOfWords)));
  return foundWords;
};
