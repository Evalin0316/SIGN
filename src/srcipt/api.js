import axios from "axios";
const url = 'https://auto-signature-app-v3.fly.dev';

/* 圖片 */

// 上傳圖片
export const uploadImage = (data) => {
    return axios.post(`${url}/image/`,data,);
}

// 取得所有圖片(簽名檔)
export const getImage = () => {
    return axios.get(`${url}/image/`);
}

// 刪除圖片
// export const deleteImage = (id,data) => {
//     return axios.delete(`${url}/image/${id}`,{data},);
// }

export const deleteImage = (id,hash,imageurl) => {
    return axios.delete(`${url}/image/${id}/hash/${hash}/image-str/${imageurl}`);
}


/* 檔案 */


// 上傳檔案
export const uploadFile = (data) => {
    return axios.post(`${url}/file/`,data,);
}

// 取得檔案
export const getFile = (from,count) => {
    return axios.get(`${url}/file/from/${from}/count/${count}`);
}

// 下載檔案
export const downloadFile = (filename) => {
    return axios.get(`${url}/file/${filename}`);
}

//刪除檔案
export const deleteFile = (id,filename) => {
    return axios.delete(`${url}/file/${id}/filename/${filename}`);
}




