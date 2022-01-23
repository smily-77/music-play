import { get, post} from './tool'


// 手机短信登录
export const PhoneLogin = (params) => post(`/`, params);

// 检测手机号是否注册
export const IsRegister = (params) => get('/cellphone/existence/check', params);
