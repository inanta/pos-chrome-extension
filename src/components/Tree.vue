<template>
  <ul class="tree-menu">
    <li class="text-base" :style="indent">&bull; {{ label }}</li>
    <li>
      <tree
        v-for="node in nodes"
        :depth="depth + 1"
        :key="node.fullPath"
        :label="node.label"
        :nodes="node.nodes"
      ></tree>
    </li>
  </ul>
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
  },
  methods: {
    hasNodes: function () {
      if (typeof this.nodes !== "undefined" && this.nodes.length > 0) {
        return true;
      }

      return false;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
