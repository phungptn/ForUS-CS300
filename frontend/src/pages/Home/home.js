import Box from "./Box/box";
import LatestThread from "./LatestThread/latestThread";
import "./home.css";

export default function Home() {
    return (
        <>
        <div className="container">
            <div className="row" >
                            <div className="col-8">
                            <Box />
            <Box />
            <Box />
            </div>
            <div className="col-4">
                <LatestThread />
            </div>
            </div>



        </div>

        
        </>
    );

}