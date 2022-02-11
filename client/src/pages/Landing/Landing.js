import Home from "../../component/Home/Home";
import Meet from "../../component/Meet/Meet";
import Benefit from "../../component/Benefit/Benefit";
import Roadmap from "../../component/RoadMap/RoadMap";
import Faq from "../../component/Faq/Faq";
import Counter from "../../component/Counter/Counter";

const Landing = ({
    handleConnect,
    handleDisconnect,
    handleMint
}) => {

    return (
        <>
            <Home
                handleConnect={handleConnect}
                handleDisconnect={handleDisconnect}
                handleMint={handleMint}
            />
            <Counter />
            <Meet />
            <Benefit />
            <Roadmap />
            <Faq />
        </>
    )
}

export default Landing;