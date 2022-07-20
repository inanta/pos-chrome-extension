<template>
  <div class="cursor-pointer px-2 text-lg">
    <i :class="icon" class="fas"></i> {{ name }}
  </div>
</template>

<script>
export default {
  name: "FileBrowseFileItem",
  props: {
    name: String
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
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
