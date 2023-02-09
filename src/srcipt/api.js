import axios from "axios";
const url = 'https://auto-signature-app.fly.dev';

/* 圖片 */

// 上傳圖片
export const uploadImage = (data) =>{
    return axios.post(`${url}/image/`,data,);
}

// 取圖片
export const getImage = () =>{
    return axios.get(`${url}/image/`);
}

// 刪除圖片
export const deleteImage = (id) =>{
    return axios.delete(`${url}/image/${id}`);
}


/* 檔案 */

// 上傳檔案
export const uploadFile = (data) =>{
    return axios.post(`${url}/file/`,data,);
}

// 取得檔案
export const getFile = () =>{
    return axios.get(`${url}/file/`);
}

// 下載檔案
export const downloadFile = () =>{
    return axios.get(`${url}/file/`);
}

//刪除檔案
export const deleteFile = (id) =>{
    return axios.delete(`${url}/file/${id}`)
}




