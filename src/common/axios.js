import axios from "axios";
import tool from "./tool"


// 初始化一个axios对象, 超时时间60s
const _axios = axios.create({
    timeout: 60000,
});

_axios.interceptors.request.use(
    (config) => {
        if (config.method === "post" || config.method === "post") {
            // 针对post和put请求做前处理
            if (process.env.VUE_APP_FLAG === "production") {
                config.url = `${config.url}&realIP=76.76.21.142`
            }
            console.log("axios接口的post和put的参数", config.data);
        }
        if (config.method === "get") {
            // 针对get请求做前处理
        }
        if (config?.data?.showLoding) {
            // 如果有需要展示加载状态, 则显示加载状态
        }
        return config;
    }
);


let authTimer;

_axios.interceptors.response.use(
    (response) => {
        //
    }
)