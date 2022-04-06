import axios from "./axios";
import _axios from "axios";

/** 
 * post方法，对应post请求 
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 */
 export function post(url, params) {
    return new Promise((resolve, reject) => {
         axios.post(url, JSON.stringify(params))
        .then(res => {
            resolve(res.data);
        })
        .catch(err =>{
            reject(err.data)
        })
    });
}


/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
 export function get(url, params){    
    return new Promise((resolve, reject) =>{        
        axios.get(url, {            
            params: params        
        }).then(res => {
            resolve(res.data);
        }).catch(err =>{
            reject(err.data)        
    })    
});}


export function getAllSingers(urls) {
    return new Promise((resolve, reject) =>{ 
        let promiseObjs = [];
        for (let i = 0 ;i < urls.length; i++) {
            promiseObjs.push(axios.get(urls[i]));
        }
        _axios.all(promiseObjs)
        .then(res=> {
            resolve(res);
        }).catch(err =>{
            reject(err.data);
        })
    })
}

