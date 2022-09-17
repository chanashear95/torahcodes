<template>
  <div>
    <v-text-field
      :value="matrixStart"
      @change="updateMatrixStart"
      label="From Letter Index"
      type="number"
    />
    <v-text-field
      :value="matrixEnd"
      @change="updateMatrixEnd"
      label="To Letter Index"
      type="number"
    />
  </div>
</template>

<script>
let searchTimeout = null;

export default {
  name: "MatrixOptions",
  props: {
    matrixStart: {
      type: Number,
      required: true,
    },
    matrixEnd: {
      type: Number,
      required: true,
    },
  },
  methods: {
    updateMatrixStart(val) {
      clearTimeout(searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.$emit("update-field", {
          field: "matrixStart",
          value: Number(val),
        });
      }, 750);
    },
    updateMatrixEnd(val) {
      clearTimeout(searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.$emit("update-field", { field: "matrixEnd", value: Number(val) });
      }, 750);
    },
  },
};
</script>
