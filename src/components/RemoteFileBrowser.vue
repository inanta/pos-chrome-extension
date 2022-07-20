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
      @request-entries="showDirectoryEntries(entry)"
      :name="directoryName(entry)"
    ></file-browser-directory-item>
    <file-browser-file-item
      v-if="entry.kind === 'file'"
      :name="entry.name"
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
  data() {
    return {
      remoteFiles: { nodes: [], isRootDirectory: true, isUpDirectory: true },
      currentDirectoryTree: [],
      // currentDirectoryEntry: null,
      directoryEntryHistories: [],
      entries: []
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
        self.groupRemoteFileNodes(data.tree, 0, self.remoteFiles["nodes"]);
      })
      .catch(() => {});
  },
  computed: {
    hasEntries: function () {
      return this.entries.length > 0;
    }
  },
  methods: {
    groupRemoteFileNodes: function (obj, depth, remoteFiles) {
      let self = this;

      for (var k in obj) {
        if (typeof obj[k] == "object" && obj[k] !== null) {
          remoteFiles.push({ label: k });

          if (
            typeof remoteFiles[remoteFiles.length - 1].nodes === "undefined"
          ) {
            remoteFiles[remoteFiles.length - 1].nodes = [];
          }

          self.groupRemoteFileNodes(
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

      directory.name = "/";
      directory.kind = "directory";
      directory.file = self.remoteFiles;

      self.directoryEntryHistories.push(directory);
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

      if (self.directoryEntryHistories.length > 0) {
        if (
          directory.isUpDirectory &&
          self.directoryEntryHistories.length > 1
        ) {
          self.directoryEntryHistories.pop();
        }

        if (!directory.isRootDirectory) {
          self.entries.push(
            self.directoryEntryHistories[
              self.directoryEntryHistories.length - 1
            ]
          );
        }
      }

      let file_count = 0;

      for (let index = 0; index < directory.file.nodes.length; index++) {
        let file = directory.file.nodes[index];

        self.entries.push({
          name: file.label,
          kind: "directory",
          file: file
        });
        file_count++;
      }

      if (!directory.isUpDirectory && file_count > 0) {
        if (self.directoryEntryHistories.length > 0) {
          directory.isUpDirectory = true;
        }

        self.directoryEntryHistories.push(directory);
      }

      console.log("HISTORY", self.directoryEntryHistories);
    },
    showDirectoryEntries(entry) {
      let self = this;

      console.log("ENTRY CLICK", entry);

      self.showEntries(entry);
    },
    directoryName: function (entry) {
      if (typeof entry.isUpDirectory === "undefined") {
        return entry.name;
      }

      return "..";
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
