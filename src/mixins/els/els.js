const MAX_WORKERS = 18;

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
      const totalMatrixLength = matrixEnd - matrixStart;
      const lettersPerWorker = Math.ceil(totalMatrixLength / MAX_WORKERS);
      for (let i = 0; i < MAX_WORKERS; i++) {
        let endIdx =
          i * lettersPerWorker + lettersPerWorker + matrixStart >= matrixEnd
            ? matrixEnd
            : i * lettersPerWorker + lettersPerWorker + matrixStart;
        this.createELSWorker({
          matrixStart,
          matrixEnd,
          workerStartRange: i * lettersPerWorker + matrixStart,
          workerEndRange: endIdx,
          searchWords,
          minSkip,
          maxSkip,
        });
      }
    },
    createELSWorker({
      matrixStart,
      matrixEnd,
      workerStartRange,
      workerEndRange,
      searchWords,
      minSkip,
      maxSkip,
    }) {
      if (window.Worker) {
        const worker = new Worker("/workers/els/els.worker.js", {
          type: "module",
        });
        worker.postMessage(
          JSON.stringify({
            matrixStart,
            matrixEnd,
            workerStartRange,
            workerEndRange,
            searchWords,
            minSkip,
            maxSkip,
          })
        );
        worker.onmessage = (msg) => {
          if (msg.data) {
            const parsedData = JSON.parse(msg.data);
            switch (typeof parsedData) {
              case "number":
                if (parsedData === 0) {
                  this.loading = null;
                } else {
                  this.loading += parsedData;
                }
                break;
              default:
                this.results = this.results.concat(parsedData);
                break;
            }
          } else {
            console.log("Closing");
            worker.terminate();
          }
        };
      }
    },
  },
};
