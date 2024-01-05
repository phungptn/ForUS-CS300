import './renderer.css';

export default function TextRenderer({ input }) {
    return (
        <div className='text-start m-1' dangerouslySetInnerHTML={{ __html: input }}/>
    );
}