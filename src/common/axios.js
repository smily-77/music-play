import axios from "axios";


// 初始化一个axios对象, 超时时间60s
const _axios = axios.create({
    timeout: 60000,
});

// 根据环境，配置BaseUrl

console.log('运行环境', process.env.NODE_ENV)
if (process.env.NODE_ENV === 'development')
    _axios.defaults.baseURL = '/api';
else if (process.env.NODE_ENV === 'production')
    _axios.defaults.baseURL = 'https://netease-cloud-music-api-syz247179876.vercel.app/';


// 请求拦截器
_axios.interceptors.request.use(
    config => {
        if (config.method === "post" || config.method === "post") {
            // 针对post和put请求做前处理
            if (process.env.NODE_ENV === "production") {
                config.url = `${config.url}&realIP=76.223.126.116`
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
    },
    error => {
        return Promise.error(error);
    }
);

// 相应预处理
_axios.interceptors.response.use(
    response => {
        if (response.status === 200) {            
            return Promise.resolve(response);        
        } else {            
            return Promise.reject(response);        
        }    
    }
)

export default _axios;