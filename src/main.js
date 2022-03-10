import { createApp } from 'vue'
import App from './App.vue'
import { Button, Form, Field} from 'vant';
import router from './router'
import '@/assets/css/base.css'
import "@/common/global";


// 引入全局样式文件
import '@/assets/scss/index.scss'

let Vue = createApp(App);

// vant组件全局注册
Vue.use(Button);
Vue.use(Form);
Vue.use(Field);
// Vue.use(Notify);

Vue.use(router);


Vue.mount('#app')
