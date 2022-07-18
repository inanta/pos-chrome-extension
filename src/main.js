import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import "animate.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "./assets/css/index.css";

createApp(App).use(router).mount("#app");
