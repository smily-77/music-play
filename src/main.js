import { createApp } from 'vue'
import App from './App.vue'
import { Button, Loading, Area } from 'vant';
let Vue = createApp(App);

Vue.use(Button);
Vue.use(Loading);
Vue.use(Area);


Vue.mount('#app')
