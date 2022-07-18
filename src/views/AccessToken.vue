<template>
  <div class="container-fluid p-10">
    <h1 class="font-bold text-2xl text-center">
      OOC PlatformOS Chrome Extension
    </h1>
    <form>
      <div class="pb-2">
        <label class="block pb-1.5 text-base w-full" for="url"
          >Instance URL</label
        >
        <input
          v-model="url"
          class="border border-gray-500 p-2 rounded-sm text-base w-full"
          disabled
          placeholder="Enter instance URL"
          type="text"
        />
      </div>
      <!-- <div class="pb-2">
        <label class="block pb-1.5 text-base w-full" for="env">Select Environment</label>
        <select
          v-model="env"
          class="border border-gray-500 p-2 rounded-sm text-base w-full"
          disabled
        >
          <option value="staging">Staging</option>
          <option value="production">Production</option>
        </select>
      </div> -->
      <div class="pb-2">
        <label class="block pb-1.5 text-base w-full" for="email"
          >Email address</label
        >
        <input
          v-model="email"
          class="border border-gray-500 p-2 rounded-sm text-base w-full"
          disabled
          aria-describedby="emailHelp"
          placeholder="Enter email"
          type="email"
        />
        <small id="emailHelp" class="form-text text-muted"
          >We'll never share your email with anyone else.</small
        >
      </div>
      <div class="pb-2">
        <label class="block pb-1.5 text-base w-full" for="token"
          >Access Token</label
        >
        <input
          v-model="token"
          class="border border-gray-500 p-2 rounded-sm text-base w-full"
          disabled
          placeholder="Access Token"
          type="text"
        />
      </div>
      <button
        @click="forget"
        class="bg-primary mt-2 px-5 py-3 rounded-sm text-base text-white"
        type="button"
      >
        Forget Access Token
      </button>
    </form>
  </div>
</template>

<script>
/* global chrome */

export default {
  name: "AccessToken",
  data: function () {
    return {
      url: "",
      env: "",
      email: "",
      token: ""
    };
  },
  mounted: function () {
    let self = this;

    chrome.storage.sync.get("url", (data) => {
      self.url = data.url;
    });

    chrome.storage.sync.get("email", (data) => {
      self.email = data.email;
    });

    chrome.storage.sync.get("token", (data) => {
      self.token = data.token;
    });
  },

  methods: {
    forget: function () {
      let self = this;

      chrome.storage.sync.remove("token", () => {
        self.$router.push("/");
      });
    }
  }
};
</script>
