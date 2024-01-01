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

    


export {
    downloadImage
}