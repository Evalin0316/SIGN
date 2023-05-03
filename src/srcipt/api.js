import axios from "axios";
const url = 'https://auto-signature-app-v7-3.fly.dev';

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
    return axios.post(`${url}/file`,data);
}

// 上傳簽名狀態
export const uploadSignInfo = (id,data) => {
    return axios.patch(`${url}/file/${id}/signInfo`,data);
}

// 上傳檔案狀態
export const uploadFileInfo = () => {
    return axios.patch(`${url}/file/${id}/fileInfo`);
}

// 取得檔案
export const getFile = (from,count) => {
    return axios.get(`${url}/file?from=${from}&count=${count}`);
}

// 取得單一檔案資料
export const getFileDetail = (id) => {
    return axios.get(`${url}/file/${id}`);
}

// 下載檔案
export const downloadFile = (filename) => {
    return axios.get(`${url}/file/${filename}`);
}

//刪除檔案
export const deleteFile = (id,filename) => {
    return axios.delete(`${url}/file/${id}/filename/${filename}`);
}

// 編輯/更新文件
export const updateFile = (id,title,isSigned) =>{
    return axios.patch(`${url}/file/${id}?${title}&isSigned=${isSigned}`);
}

// 取得檔案
export const getSingleFile = (durl) =>{
    return axios.get(`${durl}`,{responseType:'blob'})
}




