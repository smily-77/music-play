import { createApp } from "vue";
import App from "./App.vue";
import {
  Button,
  Form,
  Field,
  Swipe,
  SwipeItem,
  List,
  Cell,
  IndexBar,
  IndexAnchor,
  Lazyload,
} from "vant";
import router from "./router";
import "@/assets/css/base.css";
import "@/common/global";

// 引入全局样式文件
import "@/assets/scss/index.scss";

// 引入singersStore
import singerStore from "@/store/index.js";

let Vue = createApp(App);

// vant组件全局注册
Vue.use(Button);
Vue.use(Form);
Vue.use(Field);
Vue.use(Swipe);
Vue.use(SwipeItem);
Vue.use(List);
Vue.use(Cell);
Vue.use(IndexBar);
Vue.use(IndexAnchor);
Vue.use(Lazyload, {
  lazyComponent: true,
  loading: '/img/logo.77c98feb.png',
});

// Vue.use(Notify);

Vue.use(router);

// 挂载store
Vue.use(singerStore);

Vue.mount("#app");
