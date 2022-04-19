import { get, getAllSingers } from "./tool";

/**
 * 手机短信登录
 * @param {Map} params [请求携带的参数]
 * {phone: '', captcha: ''}
 * @returns Promise
 */
export const PhoneLogin = (params) => get(`/login/cellphone`, params);

/**
 * 手机号注册
 * {phone: '', password: '', nickname: '', captcha: ''}
 */
export const PhoneRegister = (params) => get(`/register/cellphone`, params);

/**
 * 检测手机号是否注册
 * {phone: ''}
 */
export const IsRegister = (params) => get("/cellphone/existence/check", params);

/**
 * 发送验证码
 * {phone: ''}
 */
export const sendCode = (params) => get("/captcha/sent", params);

/**
 * 验证验证码
 * {phone: '', captcha: ''}
 */
export const verifyCode = (params) => get("/captcha/verify", params);

// 获取轮播图
export const getBanner = (params) => get("/banner", params);
// 获取推荐歌单
export const getPersonalized = (params) => get("/personalized", params);
/**
 *
 * 获取所有歌手数据
 * {type:0, area: 0, initial: ''}
 */
export const getSinger = (urls) => getAllSingers(urls);

/**
 * 获取歌手歌曲
 * @param {*} params
 * {id:000}
 * @returns
 */
export const getHotSongs = (params) => get("/artist/top/song", params);

/**
 * 获取歌手详情
 * {id:000}
 * @returns
 */
export const getSingerDetail = (params) => get("/artist/detail", params);
/**
 * 根据id获取歌曲url
 * {id:000}
 * @returns
 */
export const getSongUrl = (params) => get("/song/url", params);

/**
 * 根据id获取歌曲歌词
 * {id:000}
 * @returns
 */
export const getSongWords = (params) => get("/lyric", params);

/**
 * 根据歌单id获取歌单歌曲
 * @returns
 */
export const getAlbumSong = (params) => get("/playlist/track/all", params);

/**
 * 根据id获取歌单详情
 * @returns
 */
export const getAlbumDetail = (params) => get("/playlist/detail", params);

/**
 * 获取排行榜
 * @returns
 */
export const getToplist = (params) => get("/toplist", params);

/**
 * 获取榜单详情
 * @param {*} params
 * @returns
 */
export const getToplistDetail = (params) => get("/toplist/detail", params);

/**
 * 获取热门搜索
 * @returns
 */
export const getHotSearch = (params) => get("/search/hot", params);
/**
 * 搜索歌曲/歌手·
 * @returns
 */
export const getSearchSong = (params) => get("/search", params);

/**
 * 获取歌曲详情
 * @returns 
 */
export const getSongDetail = (params) => get("/song/detail", params);




/**
 * 退出登录
 *
 */
export const logout = () => get("/logout");

/**
 * 获取登录状态
 *
 */
export const loginState = (params) => get("/login/status", params);

/**
 * 获取用户详情
 * {uid: 'uid'}
 */
export const userDetail = (params) => get("/user/detail", params);

/**
 * 获取账号信息
 *
 */
export const userAccount = () => get("/user/account");

/**
 * 获取用户音乐信息
 */
export const userInfo = () => get("/user/subcount");

/**
 * 获取用户听歌等级
 */

export const userMusicRank = () => get("/user/level");
