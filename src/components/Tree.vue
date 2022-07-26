<template>
  <ul
    v-if="kind === 'file' || (kind == 'directory' && hasNodes())"
    class="tree-menu pl-4"
  >
    <li class="list-disc text-base" :xstyle="indent">
      {{ label }}
      <div v-if="kind === 'file'" class="float-right">
        <template v-if="internalStatus === 'pending'">
          <i class="fas fa-clock"></i> Pending
        </template>
        <template v-else-if="internalStatus === 'syncing'">
          <i class="fas fa-cog fa-spin"></i> Syncing
        </template>
        <template v-else-if="internalStatus === 'synced'">
          <i class="fas fa-check"></i> Synced
        </template>
        <template v-else-if="internalStatus === 'skip'">
          <i class="fas fa-times"></i> Skipped (File Not Allowed)
        </template>
        <template v-else-if="internalStatus === 'error'">
          <i class="fas fa-times"></i> Error
        </template>
      </div>
    </li>
    <li v-if="nodes">
      <tree
        v-for="node in nodes"
        :depth="depth + 1"
        :key="node.fullPath"
        :kind="node.kind"
        :label="node.label"
        :nodes="node.nodes"
        :status="node.status"
      ></tree>
    </li>
  </ul>
</template>

<script>
export default {
  name: "Tree",
  props: {
    depth: Number,
    kind: String,
    label: String,
    nodes: Array,
    status: String
  },
  data() {
    return {
      internalStatus: "pending"
    };
  },
  watch: {
    status: {
      handler: function (value) {
        this.internalStatus = value;
      },
      immediate: true
    }
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
