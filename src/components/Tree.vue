<template>
  <div class="tree-menu">
    <div class="text-base" :style="indent">&bull; {{ label }}</div>
    <tree
      v-for="node in nodes"
      :depth="depth + 1"
      :key="node.fullPath"
      :label="node.label"
      :nodes="node.nodes"
    ></tree>
  </div>
</template>

<script>
export default {
  name: "Tree",
  props: {
    depth: Number,
    label: String,
    nodes: Array
  },
  computed: {
    indent: function () {
      return { transform: `translate(${this.depth * 20}px)` };
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
