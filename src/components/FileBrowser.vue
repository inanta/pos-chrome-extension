<template>
  <div v-if="!hasEntries" class="flex h-full">
    <div class="m-auto text-center w-1/3">
      <img
        class="pb-3 w-full"
        src="@/assets/img/undraw_folder_files_re_2cbm.svg"
      />
      <button
        @click="openRootDirectory"
        class="bg-primary ml-2 mt-2 px-5 py-3 rounded text-base text-white"
      >
        Open Local Directory
      </button>
    </div>
  </div>
  <template v-for="entry in entries" :key="entry.name">
    <file-browser-directory-item
      v-if="entry.kind === 'directory'"
      @entry-click="entryClick"
      @entry-double-click="directoryClick(entry)"
      :draggable="true"
      :name="entry.name"
      :selected="entry.isSelected"
    ></file-browser-directory-item>
    <file-browser-file-item
      v-if="entry.kind === 'file'"
      @entry-click="entryClick"
      @entry-double-click="entryDoubleClick(entry)"
      :draggable="true"
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
  name: "FileBrowser",
  emits: ["fileExecute", "directoryChange"],
  data: function () {
    return {
      currentDirectoryEntry: null,
      directoryEntryHistories: [],
      entries: []
    };
  },
  mounted: function () {},
  computed: {
    hasEntries: function () {
      return this.entries.length > 0;
    }
  },
  methods: {
    openRootDirectory: async function () {
      let self = this;

      try {
        let directory = await window.showDirectoryPicker({
          startIn: "desktop"
        });

        directory.isRootDirectory = true;

        self.showEntries(directory);
      } catch (error) {
        console.log(error);
      }
    },
    showEntries: async function (directory) {
      let self = this;

      self.currentDirectoryEntry = directory;
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

      for await (let entry of directory.values()) {
        // Skip files / directories that start with "." (dot)
        if (entry.name.charAt(0) === ".") {
          continue;
        }

        self.entries.push({
          kind: entry.kind,
          name: entry.name,
          isSelected: false,
          entry: entry
        });
      }

      if (self.directoryEntryHistories.length > 1) {
        self.directoryEntryHistories[
          self.directoryEntryHistories.length - 2
        ].isUpDirectory = true;

        self.entries.unshift({
          kind: "directory",
          name: "..",
          isSelected: false,
          entry:
            self.directoryEntryHistories[
              self.directoryEntryHistories.length - 2
            ]
        });
      }

      console.log("HISTORY", self.directoryEntryHistories);
    },
    directoryClick(entry) {
      let self = this;

      self.showEntries(entry.entry);
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
    },
    entryDoubleClick: function (entry) {
      this.$emit("fileExecute", entry);
    },
    entryDrag: function (entry) {
      console.log("ENTRY", entry);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
