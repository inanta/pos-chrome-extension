<template>
  <ul
    v-if="kind === 'file' || (kind == 'directory' && hasNodes())"
    class="tree-menu pl-4"
  >
    <li class="list-disc text-base" :xstyle="indent">
      {{ label }}
      <span v-if="label !== slugifyLabel">
        <i class="fas fa-angle-double-right text-red-600"></i>&nbsp;{{
          slugifyLabel
        }}
      </span>
      <div v-if="kind === 'file'" class="float-right">
        <span v-if="internalStatus === 'pending'" class="text-gray-600"
          ><i class="fas fa-clock"></i> Pending</span
        >
        <span v-else-if="internalStatus === 'syncing'" class="text-yellow-500"
          ><i class="fas fa-cog fa-spin"></i> Syncing</span
        >
        <span v-else-if="internalStatus === 'synced'" class="text-green-600"
          ><i class="fas fa-check"></i> Synced
          <a
            v-if="asset != ''"
            :href="baseURL + '/assets/' + asset"
            target="_blank"
          >
            <i class="fas fa-eye"></i>
          </a>
        </span>
        <span v-else-if="internalStatus === 'skip'" class="text-red-600"
          ><i class="fas fa-times"></i> Skipped (File Not Allowed)</span
        >
        <span v-else-if="internalStatus === 'error'" class="text-red-600"
          ><i class="fas fa-times"></i> Error
        </span>
      </div>
    </li>
    <li v-if="nodes">
      <tree
        v-for="node in nodes"
        :asset="node.isAsset"
        :depth="depth + 1"
        :key="node.fullPath"
        :kind="node.kind"
        :label="node.label"
        :nodes="node.nodes"
        :path="node.fullPath"
        :status="node.status"
      ></tree>
    </li>
  </ul>
</template>

<script>
/* global chrome */

export default {
  name: "Tree",
  props: {
    asset: String,
    depth: Number,
    kind: String,
    label: String,
    nodes: Array,
    path: String,
    status: String
  },
  data() {
    return {
      baseURL:
        "https://sydneycommercialkitchens.staging.oregon.platform-os.com",
      internalPath: "",
      internalStatus: "pending",
      slugifyLabel: ""
    };
  },
  watch: {
    status: {
      handler: function (value) {
        this.internalStatus = value;
      },
      immediate: true
    }
  },
  mounted: function () {
    let self = this;
    let slugify = require("slugify");

    if (typeof self.path !== "undefined") {
      let path_split = self.path.split("/");

      path_split.shift();
      path_split.pop();

      for (let index = 0; index < path_split.length; index++) {
        self.internalPath += "/" + slugify(path_split[index], { lower: true });
      }
    }

    if (typeof chrome.storage !== "undefined") {
      chrome.storage.sync.get("url", (data) => {
        self.baseURL = data.url;
      });
    }

    this.slugifyLabel = slugify(this.label, { lower: true });
  },
  computed: {
    indent: function () {
      return { transform: `translate(${this.depth * 20}px)` };
    },
    href: function () {
      return this.baseURL + "/" + this.path;
    }
  },
  methods: {
    hasNodes: function () {
      if (typeof this.nodes !== "undefined" && this.nodes.length > 0) {
        return true;
      }

      return false;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
