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
          :disabled="isSubmitting"
          class="border border-gray-500 p-2 rounded-sm text-base w-full"
          placeholder="Enter instance URL"
          type="text"
        />
      </div>
      <div class="pb-2">
        <label class="block pb-1.5 text-base w-full" for="env"
          >Select Environment</label
        >
        <select
          v-model="env"
          :disabled="isSubmitting"
          class="border border-gray-500 p-2 rounded-sm text-base w-full"
        >
          <option value="staging">Staging</option>
          <option value="production">Production</option>
        </select>
      </div>
      <div class="pb-2">
        <label class="block pb-1.5 text-base w-full" for="email"
          >Email address</label
        >
        <input
          v-model="email"
          :disabled="isSubmitting"
          class="border border-gray-500 p-2 rounded-sm text-base w-full"
          aria-describedby="emailHelp"
          placeholder="Enter email"
          type="email"
        />
        <small id="emailHelp" class="form-text text-muted"
          >We'll never share your email with anyone else.</small
        >
      </div>
      <div class="pb-2">
        <label class="block pb-1.5 text-base w-full" for="password"
          >Password</label
        >
        <input
          v-model="password"
          :disabled="isSubmitting"
          class="border border-gray-500 p-2 rounded-sm text-base w-full"
          placeholder="Password"
          type="password"
        />
      </div>
      <button
        @click="submit"
        :disabled="isSubmitting"
        class="bg-primary mt-2 px-5 py-3 rounded-sm text-base text-white"
        type="button"
      >
        {{ isSubmitting ? "Asking access token..." : "Submit" }}
      </button>
    </form>
  </div>
</template>

<script>
/* global chrome */
// @ is an alias to /src
// import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "Home",
  // components: {
  // HelloWorld,
  // },
  data: function () {
    return {
      url: "",
      env: "staging",
      email: "",
      password: "",
      isSubmitting: false
    };
  },
  methods: {
    submit: function () {
      let self = this;

      self.isSubmitting = true;

      fetch("https://partners.platformos.com/api/user_tokens", {
        headers: {
          UserAuthorization: self.email + ":" + self.password,
          InstanceDomain: self.url
        }
      })
        .then((response) => {
          console.log(response);
          if (response.status == 401) {
            alert("Unauthorized, plese check your email and / or password!");

            throw new Error(
              "Unauthorized, plese check your email and / or password!"
            );
          }

          return response.json();
        })
        .then((data) => {
          let pos = {
            env: self.env,
            url: self.url,
            token: data[0].token,
            email: self.email
          };

          chrome.storage.sync.set(pos, () => {
            // document.location.href = chrome.runtime.getURL("access_token.html");
            self.$router.push("/access-token");
          });
        })
        .catch(() => {
          // document.querySelector("#submit").innerHTML = "Submit";
          // document.querySelector("#submit").removeAttribute("disabled");
          self.isSubmitting = false;
        });
    }
  }
};
</script>
