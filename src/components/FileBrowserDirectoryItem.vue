<template>
  <div
    @click="entryClick"
    @dblclick="entryDoubleClick"
    :class="{ 'bg-primary': isSelected, 'text-white': isSelected }"
    :draggable="draggable"
    class="cursor-pointer px-2 select-none text-lg"
  >
    <i class="fas fa-folder"></i> {{ internalName }}
  </div>
</template>

<script>
export default {
  name: "FileBrowseDirectoryItem",
  emits: ["entryClick", "entryDoubleClick"],
  props: {
    draggable: Boolean,
    name: String,
    selected: Boolean
  },
  data: function () {
    return {
      internalName: "",
      isSelected: false
    };
  },
  watch: {
    name: {
      handler: function (value) {
        this.internalName = value;
      },
      immediate: true
    },
    selected: {
      handler: function (value) {
        this.isSelected = value;
      },
      immediate: true
    }
  },
  methods: {
    entryClick: function (event) {
      this.$emit("entryClick", this.internalName, event.shiftKey);
    },
    entryDoubleClick: function () {
      this.$emit("entryDoubleClick", this.internalName);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
