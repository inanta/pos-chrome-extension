<template>
  <div @click="$emit('requestEntries')" class="cursor-pointer px-2 text-lg">
    <i class="fas fa-folder"></i> {{ name }}
  </div>
</template>

<script>
export default {
  name: "FileBrowseDirectoryItem",
  emits: ["requestEntries"],
  props: {
    name: String
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
