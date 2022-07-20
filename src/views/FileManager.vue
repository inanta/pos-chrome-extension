<template>
  <div class="container-fluid h-full">
    <div class="flex h-full">
      <div class="flex flex-col p-2 pr-1 text-base w-1/2">
        <div>Local Site</div>
        <div class="border border-tertiary h-full overflow-x-scroll rounded">
          <file-browser></file-browser>
        </div>
      </div>
      <div class="flex flex-col p-2 pl-1 text-base w-1/2">
        <div>Remote Site</div>
        <div
          @drop.prevent="drop"
          @dragenter.prevent
          @dragover.prevent
          class="border border-tertiary h-full overflow-x-scroll rounded"
        >
          <remote-file-browser></remote-file-browser>
          <!-- <tree
            v-for="(file, index) in remoteFiles"
            :depth="0"
            :key="index"
            :label="file.label"
            :nodes="file.nodes"
          ></tree> -->
        </div>
        <!-- <tree
          v-for="(file, index) in files"
          :depth="0"
          :key="index"
          :label="file.label"
          :nodes="file.nodes"
        ></tree>
        <div
          @drop.prevent="drop"
          @dragenter.prevent
          @dragover.prevent
          class="border border-tertiary h-full rounded"
        >
          Drop Files or Folders Here
        </div> -->
      </div>
      <!-- <div class="w-1/2">
        <tree
          v-for="(file, index) in files"
          :depth="0"
          :key="index"
          :label="file.label"
          :nodes="file.nodes"
        ></tree>
      </div> -->
    </div>
  </div>
  <div
    v-if="showQueuedFiles"
    class="absolute bg-white h-3/4 flex flex-col left-1/4 rounded shadow top-[10%] w-1/2"
  >
    <div class="bg-primary px-3 py-2 rounded text-white">
      Queued Files
      <i class="fas fa-times cursor-pointer float-right"></i>
    </div>
    <div class="overflow-x-scroll p-3">
      <tree
        v-for="(file, index) in files"
        :depth="0"
        :key="index"
        :label="file.label"
        :nodes="file.nodes"
      ></tree>
    </div>
  </div>
</template>

<script>
import FileBrowser from "@/components/FileBrowser.vue";
import RemoteFileBrowser from "@/components/RemoteFileBrowser.vue";
import Tree from "@/components/Tree.vue";

export default {
  name: "FileManager",
  components: {
    FileBrowser,
    RemoteFileBrowser,
    Tree
  },
  data: function () {
    return {
      files: [],
      remoteFiles: [],
      showQueuedFiles: false
    };
  },
  mounted: function () {},
  methods: {
    drop: function (event) {
      let self = this;
      let length = event.dataTransfer.items.length;

      self.showQueuedFiles = true;
      self.files.splice(0);

      for (let i = 0; i < length; i++) {
        let entry = event.dataTransfer.items[i].webkitGetAsEntry();

        if (entry.isFile) {
          self.files.push({
            label: entry.name,
            entry: entry
          });
        } else if (entry.isDirectory) {
          self.files.push({
            label: entry.name,
            entry: entry,
            nodes: []
          });

          self.readDirectory(entry, self.files[i]);
        }
      }
    },
    readDirectory: function (directory_entry, files) {
      let self = this;
      let directoryReader = directory_entry.createReader();

      directoryReader.readEntries(function (results) {
        if (results.length === 0) {
          self.endReadDirectory();
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
            entry: entry
          });

          if (entry.isDirectory) {
            self.readDirectory(entry, files["nodes"][files.nodes.length - 1]);
          }
        }
      });
    },
    endReadDirectory: function () {
      console.log(this.files);
    },
    eachRecursive: function (obj, remoteFiles) {
      let self = this;

      for (var k in obj) {
        if (typeof obj[k] == "object" && obj[k] !== null) {
          remoteFiles.push({ label: k });

          if (
            typeof remoteFiles[remoteFiles.length - 1].nodes === "undefined"
          ) {
            remoteFiles[remoteFiles.length - 1].nodes = [];
          }

          self.eachRecursive(
            obj[k],
            remoteFiles[remoteFiles.length - 1]["nodes"]
          );
        }
        // else {
        //   console.log("NOT OBJECT", obj[k]);
        // }
      }

      console.log("RMEOTE", self.remoteFiles);
    }
  }
};
</script>
