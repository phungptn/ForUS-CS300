import { storage } from "../Firebase/config";

import { getDownloadURL, ref, getStorage } from "firebase/storage";

async function downloadImage(url) {
    try {
        console.log(url);
        const storage = getStorage();
        const fileRef = url ;
        const imageReference = ref(storage, fileRef);
        const  imageUrl = await getDownloadURL(imageReference);
        return imageUrl;
    } catch (error) {
        console.error(error);
        return null;
    }
    
}

async function uploadImage(file, url){
    try {
        const storage = storage;
        const fileRef = url ;
        const imageReference = ref(storage, fileRef);
        const uploadTask = await uploadBytes(imageReference, file);
        const imageUrl = await getDownloadURL(uploadTask.ref);
        return imageUrl;
    } catch (error) {
        console.error(error);
        return null;
    }
}
export {
    downloadImage,
    uploadImage
}