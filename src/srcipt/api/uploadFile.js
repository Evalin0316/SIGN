import axios from "axios";
const url = 'https://auto-signature-app-v7-4.fly.dev';

// 上傳檔案
export const uploadFile = (data) => {
    return axios.post(`${url}/file`,data);
}

// 上傳簽名狀態
export const uploadSignInfo = (id,data) => {
    return axios.patch(`${url}/file/${id}/signInfo`,data);
}

// 上傳檔案狀態
export const uploadFileInfo = (id,data) => {
    return axios.patch(`${url}/file/${id}/fileInfo`,data);
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