import { createApp } from 'vue'
import App from './App.vue'
import { Button, Form, Field} from 'vant';
import router from './router'
import '@/assets/css/base.css'
let Vue = createApp(App);

Vue.use(Button);
Vue.use(Form);
Vue.use(Field);

Vue.use(router);


Vue.mount('#app')
