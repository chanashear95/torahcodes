<template>
  <div id="app">
    <TorahCodeProgram />
  </div>
</template>

<script>
export default {
  name: "App",
  components: {
    TorahCodeProgram: () => import("./screens/TorahCodeProgram.vue"),
  },
};
</script>
