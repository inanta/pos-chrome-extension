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
  name: "FileBrowser",
  data() {
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

      for await (const entry of directory.values()) {
        // Skip files / directories that start with "." (dot)
        if (entry.name.charAt(0) === ".") {
          continue;
        }

        self.entries.push(entry);
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

      console.log(entry);

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
