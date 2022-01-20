import { createApp } from 'vue'
import App from './App.vue'
import { Button, Loading, Area } from 'vant';
import router from './router'
let Vue = createApp(App);

Vue.use(Button);
Vue.use(Loading);
Vue.use(Area);
Vue.use(router);


Vue.mount('#app')
