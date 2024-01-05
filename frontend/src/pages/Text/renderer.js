import { useEffect } from 'react';
import { downloadImage } from '../../utils/loadImage';
import './renderer.css';

export default function TextRenderer({ threadId, input }) {
    useEffect(() => {
        if (threadId) {
            let textRenderer = document.getElementById('textRenderer');
            let image = textRenderer.getElementsByTagName('img');
            for (let i = 0; i < image.length; i++) {
                downloadImage(`images/thread/${threadId}/${image[i].getAttribute('src')}`).then((url) => {
                    image[i].setAttribute('src', url);
                });
            }
        }
    }, []);
    return (
        <div className='text-start m-1' dangerouslySetInnerHTML={{ __html: input }} id='textRenderer'/>
    );
}