import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import BootstrapVue3 from "bootstrap-vue-3";
import axios from "axios";
import store from "./store.js";
import ErrorComponent from "./components/ErrorComponent.vue";

import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap-vue-3/dist/bootstrap-vue-3.css";
import "bootstrap/dist/css/bootstrap.css";
import "@/assets/styles/fonts.css";

const app = createApp(App);
app.config.globalProperties.axios = axios;
app.config.globalProperties.$store = store;

axios.defaults.baseURL = "http://ddabongdochi.com/api"; // http://localhost:8080/api
axios.defaults.withCredentials = true;

app.use(BootstrapVue3);
app.use(router);
app.use(store);
app.mount("#app");

app.component("ErrorComponent", ErrorComponent);
