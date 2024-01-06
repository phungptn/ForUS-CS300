import { useEffect } from 'react';
import { downloadImage } from '../../utils/loadImage';
import './renderer.css';

export default function TextRenderer({ threadId, input }) {
    useEffect(() => {
        if (threadId) {
            let textRenderer = document.getElementById('textRenderer');
            let image = textRenderer.getElementsByTagName('img');
            for (let i = 0; i < image.length; i++) {
                let url = image[i].getAttribute('src');
                if (url.startsWith('http')) {
                    continue;
                }
                else {
                    downloadImage(`images/thread/${threadId}/${url}`).then((decodedUrl) => {
                        image[i].setAttribute('src', decodedUrl);
                    });
                }
            }
        }
    }, []);
    return (
        <div className='text-start m-1' style={{overflowX: 'auto'}} dangerouslySetInnerHTML={{ __html: input }} id='textRenderer'/>
    );
}