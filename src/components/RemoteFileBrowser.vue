<template>
  <div v-if="!hasEntries" class="flex h-full">
    <div class="m-auto text-center w-1/3">
      <img
        class="pb-3 w-full"
        src="@/assets/img/undraw_the_world_is_mine_re_j5cr.svg"
      />
      <div
        class="animate__animated animate__flash animate__infinite animate__slower bg-primary ml-2 mt-2 px-5 py-3 rounded text-base text-white"
      >
        Connecting To Server...
      </div>
    </div>
  </div>
  <template v-for="entry in entries" :key="entry.name">
    <file-browser-directory-item
      v-if="entry.kind === 'directory'"
      @entry-click="entryClick"
      @entry-double-click="directoryClick(entry)"
      :name="directoryName(entry)"
      :selected="entry.isSelected"
    ></file-browser-directory-item>
    <file-browser-file-item
      v-if="entry.kind === 'file'"
      :name="entry.name"
      :selected="entry.isSelected"
    ></file-browser-file-item>
  </template>
</template>

<script>
import FileBrowserDirectoryItem from "@/components/FileBrowserDirectoryItem.vue";
import FileBrowserFileItem from "@/components/FileBrowserFileItem.vue";

export default {
  components: {
    FileBrowserDirectoryItem,
    FileBrowserFileItem
  },
  name: "RemoteFileBrowser",
  emits: ["fileExecute", "directoryChange"],
  data: function () {
    return {
      remoteFiles: { nodes: [], isRootDirectory: true, isUpDirectory: true },
      currentDirectoryTree: [],
      // currentDirectoryEntry: null,
      directoryEntryHistories: [],
      entries: [],
      path: ""
    };
  },
  mounted: function () {
    let self = this;

    self.remoteFiles.nodes.splice(0);

    fetch(
      "https://sydneycommercialkitchens.staging.oregon.platform-os.com/_api/directory-tree",
      {
        method: "POST"
      }
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        self.organizeRemoteFileNodes(data.tree, 0, self.remoteFiles["nodes"]);
      })
      .catch(() => {});
  },
  computed: {
    hasEntries: function () {
      return this.entries.length > 0;
    }
  },
  methods: {
    organizeRemoteFileNodes: function (obj, depth, remoteFiles) {
      let self = this;

      for (var k in obj) {
        if (typeof obj[k] == "object" && obj[k] !== null) {
          remoteFiles.push({ label: k });

          if (
            typeof remoteFiles[remoteFiles.length - 1].nodes === "undefined"
          ) {
            remoteFiles[remoteFiles.length - 1].nodes = [];
          }

          self.organizeRemoteFileNodes(
            obj[k],
            depth + 1,
            remoteFiles[remoteFiles.length - 1]["nodes"]
          );
        }
        // else {
        //   console.log("NOT OBJECT", obj[k]);
        // }
      }

      if (depth == 0) {
        self.openRootDirectory();
      }
    },
    openRootDirectory: function () {
      let self = this;
      let directory = self.remoteFiles;

      directory.name = "";
      directory.kind = "directory";
      directory.file = self.remoteFiles;
      directory.isRootDirectory = true;
      directory.isUpDirectory = false;

      self.showEntries(directory);
    },
    showEntries: function (directory) {
      let self = this;

      self.entries.splice(0);

      if (typeof directory.isRootDirectory === "undefined") {
        directory.isRootDirectory = false;
      }

      if (typeof directory.isUpDirectory === "undefined") {
        directory.isUpDirectory = false;
      }

      if (directory.isUpDirectory) {
        self.directoryEntryHistories.pop(directory);
      } else {
        self.directoryEntryHistories.push(directory);
      }

      for (let index = 0; index < directory.file.nodes.length; index++) {
        let file = directory.file.nodes[index];

        self.entries.push({
          kind: "directory",
          name: file.label,
          isSelected: false,
          file: file
        });
      }

      if (self.directoryEntryHistories.length > 1) {
        self.directoryEntryHistories[
          self.directoryEntryHistories.length - 2
        ].file.isUpDirectory = true;

        self.entries.unshift({
          kind: "directory",
          name: "..",
          isSelected: false,
          file: self.directoryEntryHistories[
            self.directoryEntryHistories.length - 2
          ].file,

          isUpDirectory:
            self.directoryEntryHistories[
              self.directoryEntryHistories.length - 2
            ].file.isUpDirectory
        });
      }

      self.path = "";

      for (
        let index = 0;
        index < self.directoryEntryHistories.length;
        index++
      ) {
        let entry = self.directoryEntryHistories[index];

        if (entry.name == "") {
          continue;
        }

        self.path += "/" + entry.name;
      }

      if (self.path === "") {
        self.path = "/";
      }

      self.$emit("directoryChange", self.path);
    },
    directoryClick(entry) {
      let self = this;

      self.showEntries(entry);
    },
    directoryName: function (entry) {
      if (typeof entry.isUpDirectory === "undefined") {
        return entry.name;
      }

      return "..";
    },
    entryClick: function (clicked_entry, shiftKey) {
      let self = this;

      for (let index = 0; index < self.entries.length; index++) {
        let entry = self.entries[index];

        if (entry.name === clicked_entry) {
          entry.isSelected = true;
        } else {
          if (!shiftKey) {
            entry.isSelected = false;
          }
        }
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
