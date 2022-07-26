<template>
  <div class="container-fluid h-full">
    <div class="flex h-full">
      <div class="flex flex-col w-full">
        <div class="border-b border-tertiary flex w-full">
          <div class="pl-2 pt-2 mt-1 text-xl w-1/2">
            <img class="h-6 inline-block pr-2" src="@/assets/img/ooc.png" />
            OOC POS Chrome Extension
          </div>
          <div class="pb-3 pr-2 mt-1 text-right w-1/2">
            <button
              @click="forget"
              class="bg-red-600 mt-1 px-5 py-2 rounded text-base text-white"
              type="button"
            >
              <i class="fa fa-times"></i> Forget Access Token
            </button>
          </div>
        </div>
        <div class="flex h-full">
          <div class="flex flex-col p-2 pr-1 text-base w-1/2">
            <div class="pb-1">Local Site: {{ fileBrowserPath }}</div>
            <div
              class="border border-tertiary h-full overflow-x-scroll rounded"
            >
              <file-browser
                @file-execute="localFileUpload"
                @directory-change="changeFileBrowserPath"
              ></file-browser>
            </div>
          </div>
          <div class="flex flex-col p-2 pl-1 text-base w-1/2">
            <div class="pb-1">Remote Site: {{ remoteFileBrowserPath }}</div>
            <div
              @drop.prevent="drop"
              @dragenter.prevent
              @dragover.prevent
              class="border border-tertiary h-full overflow-x-scroll rounded"
            >
              <remote-file-browser
                @directory-change="changeRemoteFileBrowserPath"
              ></remote-file-browser>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div
    v-if="showQueuedFiles"
    class="animate__animated animate__slideInUp animate__faster absolute bg-white h-3/4 flex flex-col left-1/4 rounded shadow top-[10%] w-1/2"
  >
    <div class="bg-primary px-3 py-2 rounded text-lg text-white">
      Queued Files ({{ totalQueuedFiles }})
      <i
        @click="showQueuedFiles = false"
        class="fas fa-times cursor-pointer float-right pt-1"
      ></i>
    </div>
    <div class="overflow-x-scroll p-3">
      <tree
        v-for="(file, index) in queuedFiles"
        :depth="0"
        :key="index"
        :kind="file.kind"
        :label="file.label"
        :nodes="file.nodes"
        :status="file.status"
      >
      </tree>
    </div>
  </div>
</template>

<script>
/* global chrome */

import FileBrowser from "@/components/FileBrowser.vue";
import RemoteFileBrowser from "@/components/RemoteFileBrowser.vue";
import Tree from "@/components/Tree.vue";
import allowedFileExtension from "@/assets/js/allowedFileExtensions.js";

export default {
  name: "FileManager",
  components: {
    FileBrowser,
    RemoteFileBrowser,
    Tree
  },
  data: function () {
    return {
      url: "https://sydneycommercialkitchens.staging.oregon.platform-os.com",
      env: "",
      email: "inanta+2021@easywebsitemanager.com.au",
      token: "rk63vDWDL7jCb8gt3WcDXZ7Cx_690LqbJnOjK3nqJuQ",

      queuedFiles: [],
      flattenQueuedFiles: [],
      totalQueuedFiles: 0,
      showQueuedFiles: false,
      isSyncing: false,

      fileBrowserPath: "(Not Selected)",
      remoteFiles: [],
      remoteFileBrowserPath: "(Not Connected)"
    };
  },
  mounted: function () {
    let self = this;

    if (typeof chrome.storage !== "undefined") {
      chrome.storage.sync.get("url", (data) => {
        self.url = data.url;
      });

      chrome.storage.sync.get("email", (data) => {
        self.email = data.email;
      });

      chrome.storage.sync.get("token", (data) => {
        self.token = data.token;
      });
    }
  },
  methods: {
    forget: function () {
      let self = this;

      chrome.storage.sync.remove("token", () => {
        self.$router.push("/");
      });
    },
    drop: function (event) {
      let self = this;
      let length = event.dataTransfer.items.length;

      console.log("DROPPED", event);

      self.totalQueuedFiles = 0;
      self.showQueuedFiles = true;
      self.queuedFiles.splice(0);

      for (let i = 0; i < length; i++) {
        let entry = event.dataTransfer.items[i].webkitGetAsEntry();

        if (entry.isFile) {
          self.queuedFiles.push({
            entry: entry,
            kind: "file",
            label: entry.name,
            status: "pending"
          });

          self.flattenQueuedFiles.push(
            self.queuedFiles[self.queuedFiles.length - 1]
          );

          self.totalQueuedFiles++;
        } else if (entry.isDirectory) {
          self.queuedFiles.push({
            entry: entry,
            kind: "directory",
            label: entry.name,
            nodes: []
          });

          self.readDirectory(entry, self.queuedFiles[i]);
        }
      }

      console.log("ENDFOR");

      self.processQueue(self.queuedFiles);
    },
    readDirectory: function (directory_entry, files) {
      let self = this;
      let directoryReader = directory_entry.createReader();

      directoryReader.readEntries(function (results) {
        // if (results.length === 0) {
        //   self.endReadDirectory();
        // }

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
            entry: entry,
            kind: entry.isFile ? "file" : entry.isDirectory ? "directory" : "",
            label: entry.name,
            status: "pending"
          });

          if (entry.isDirectory) {
            self.readDirectory(entry, files["nodes"][files.nodes.length - 1]);
          } else {
            self.flattenQueuedFiles.push(
              files["nodes"][files.nodes.length - 1]
            );

            self.totalQueuedFiles++;
          }
        }

        self.endReadDirectory();
      });
    },
    endReadDirectory: function () {
      let self = this;
      // console.log(this.flattenQueuedFiles);
      // if (!this.isSyncing) {
      // }
      this.processQueue(self.queuedFiles);
    },
    processQueue: function (files) {
      let self = this;

      for (let index = 0; index < files.length; index++) {
        const file = files[index];

        if (typeof file.nodes !== "undefined" && file.nodes.length > 0) {
          self.processQueue(file.nodes);
        } else {
          if (file.status === "pending") {
            file.status = "prepare-sync";
            self.prepareUpload(file);
          }
        }
      }
    },
    localFileUpload: function (entry) {
      let self = this;

      self.totalQueuedFiles += 1;
      self.showQueuedFiles = true;

      self.queuedFiles.push({
        entry: entry.entry,
        kind: "file",
        label: entry.name,
        status: "pending"
      });

      self.prepareUpload(self.queuedFiles[self.queuedFiles.length - 1]);
    },
    changeFileBrowserPath: function (path) {
      this.fileBrowserPath = path;
    },
    changeRemoteFileBrowserPath: function (path) {
      this.remoteFileBrowserPath = path;
    },
    prepareUpload: async function (file_handle) {
      let self = this;
      let file = "";

      if (typeof file_handle.entry.file !== "undefined") {
        file = await self.getFileFromFileEntry(file_handle.entry);
      } else if (typeof file_handle.entry.getFile !== "undefined") {
        file = await file_handle.entry.getFile();
      } else {
        return;
      }

      let path = self.remoteFileBrowserPath.substr(1);
      let file_ext = file.name.split(".").pop();

      if (!allowedFileExtension.includes(file_ext)) {
        file_handle.status = "skip";
      } else {
        self.upload(path + "/" + file.name, file, file_handle);
      }
    },
    getFileFromFileEntry: async function (fileEntry) {
      try {
        return await new Promise((resolve, reject) =>
          fileEntry.file(resolve, reject)
        );
      } catch (error) {
        console.log(error);
      }
    },
    upload: function (path, contents, entry) {
      let self = this;
      let form_data = new FormData();

      form_data.append("path", path);
      form_data.append("marketplace_builder_file_body", contents);

      entry.status = "syncing";

      fetch(self.url + "/api/app_builder/marketplace_releases/sync", {
        method: "PUT",
        headers: {
          Authorization: "Token " + self.token,
          InstanceDomain: self.url,
          "User-Agent": "pos-cli/4.5.18",
          From: self.email
        },
        body: form_data
      })
        .then((response) => {
          if (response.status == 401) {
            console.log(
              "Unauthorized, plese check your email and / or password!"
            );

            throw new Error(
              "Unauthorized, plese check your email and / or password!"
            );
          }

          return response.json();
        })
        .then((data) => {
          entry.status = "synced";
          console.log(data);
        })
        .catch(() => {
          entry.status = "error";
        });
    }
  }
};
</script>
