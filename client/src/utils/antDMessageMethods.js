

// Global variable to hold the Ant Design message API instance
import { map } from "../All.Constants";
let messageApi;
// console.log("api",map.get("antdMsgAPI"))
//  let messageApi=map.get("antdMsgAPI");

// This is the static API that will be used across the app
export const sendMsg =  () =>{
return new Promise((res)=>{
    const myInterval = setInterval(() => {
        const antD_API = map.get("antdMsgAPI")
        if(antD_API) {
            res(antD_API)
            clearInterval(myInterval)
        }
        console.log("cheking if api key")
    },200);
})
}
// --- Exported Static Functions ---
const fireMessage = async (type, content, duration = 3) => {
    // Check if the API has been initialized (i.e., MessageHolder has rendered)
    messageApi = await sendMsg()
    console.log(messageApi)
    if (messageApi) {
        messageApi.open({ 
            type: type, 
            content: content, 
            duration: duration 
        });
    } else {
        console.warn("AntD Message API not initialized. Did you render MessageHolder?");
    }
};

export const showSuccess = (content, duration) => {
    fireMessage('success', content, duration);
};

export const showError = (content, duration) => {
    fireMessage('error', content, duration);
};

export const showInfo = (content, duration) => {
    fireMessage('info', content, duration);
};

export const showLoading = (content, key, duration = 0) => {
    if (messageApi) return messageApi.loading({ content, key, duration });
};

export const destroyMessage = (key) => {
    if (messageApi) messageApi.destroy(key);
};