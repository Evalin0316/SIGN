import axios from "axios";
const url = 'https://auto-signature-app-v7-4.fly.dev';

// 上傳圖片
export const uploadImage = (data) => {
    return axios.post(`${url}/image/`,data,);
}

// 取得所有圖片(簽名檔)
export const getImage = () => {
    return axios.get(`${url}/image/`);
}

// 刪除圖片
export const deleteImage = (id,hash,imageurl) => {
    return axios.delete(`${url}/image/${id}/hash/${hash}/image-str/${imageurl}`);
}
