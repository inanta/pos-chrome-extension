<template>
  <div
    @drop.prevent="drop"
    @dragenter.prevent
    @dragover.prevent
    class="container-fluid p-10"
  >
    <div class="flex">
      <div class="w-1/2">
        <div
          class="border border-dashed border-gray-300 p-40 rounded text-center"
        >
          Drop Files or Folders Here
        </div>
      </div>
      <div class="w-1/2">
        <tree :depth="0" :label="files.label" :nodes="files.nodes"></tree>
      </div>
    </div>
  </div>
</template>

<script>
import Tree from "@/components/Tree.vue";

export default {
  name: "FileManager",
  components: {
    Tree
  },
  data: function () {
    return {
      url: "",
      env: "",
      email: "",
      token: "",
      files: { nodes: [] }
    };
  },
  mounted: function () {},

  methods: {
    drop: function (event) {
      let self = this;
      let length = event.dataTransfer.items.length;

      for (let i = 0; i < length; i++) {
        let entry = event.dataTransfer.items[i].webkitGetAsEntry();

        if (entry.isFile) {
          self.files.nodes.push({
            label: entry.name,
            fullPath: entry.fullPath
          });
        } else if (entry.isDirectory) {
          self.files.nodes.push({
            label: entry.name,
            fullPath: entry.fullPath,
            nodes: []
          });

          self.readDirectory(entry, self.files.nodes[i]);
        }
      }
    },
    readDirectory: function (directory_entry, files) {
      let self = this;
      let directoryReader = directory_entry.createReader();

      directoryReader.readEntries(function (results) {
        if (results.length === 0) {
          console.log(self.files);
        }

        for (let index = 0; index < results.length; index++) {
          const entry = results[index];

          // Skip files / directories that start with "." (dot)
          if (entry.name.charAt(0) === ".") {
            continue;
          }

          if (typeof files.nodes === "undefined") {
            files.nodes = [];
          }

          files.nodes.push({
            label: entry.name,
            fullPath: entry.fullPath
          });

          if (entry.isDirectory) {
            self.readDirectory(entry, files["nodes"][files.nodes.length - 1]);
          }
        }
      });
    }
  }
};
</script>
