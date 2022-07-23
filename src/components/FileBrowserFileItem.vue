<template>
  <div
    @click="entryClick"
    @dblclick="entryDoubleClick"
    :class="{ 'bg-primary': isSelected, 'text-white': isSelected }"
    :draggable="draggable"
    class="cursor-pointer px-2 select-none text-lg"
  >
    <i :class="icon" class="fas"></i> {{ internalName }}
  </div>
</template>

<script>
export default {
  name: "FileBrowseFileItem",
  emits: [
    // "entryDrag",
    "entryClick",
    "entryDoubleClick"
  ],
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
  computed: {
    icon: function () {
      let self = this;
      let file_ext = self.name.split(".").pop().toLowerCase();

      let images = ["jpg", "jpeg", "png", "gif"];
      let codes = ["liquid", "js", "css"];

      if (images.includes(file_ext)) {
        return "fa-file-image";
      } else if (codes.includes(file_ext)) {
        return "fa-file-code";
      }

      return "fa-file-alt";
    }
  },
  methods: {
    entryClick: function (event) {
      this.$emit("entryClick", this.internalName, event.shiftKey);
    },
    entryDoubleClick: function () {
      this.$emit("entryDoubleClick", this.internalName);
    }
    // handleDragStart: function () {
    //   this.$emit("entryDrag", this.entry);
    // }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
