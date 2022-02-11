import MapDetail from "./MapDetail";
import { Styles } from "./styles";

const Roadmap = () => {
    return (
        <Styles className="grey-bg">
            <div className="move container">
                <div id="roadmap" className="d-block padding-top-7 position-relative">
                    <div className="title-text Tanker mx-auto">
                        <h2 className="text-center">ROADMAP</h2>
                        <p className="text-convinced color-green text-center py-2">OF OUR BRILLIANT PLAN</p>
                    </div>
                    <MapDetail />
                    <div className="color-white roadmap-description text-center mt-4">
                        <p className="text-center pb-2 Tanker">
                            <span className="color-green">GOLFCHICKS</span> will be free
                            <br /> to mint for all <span className="color-green">GOLFPUNKS</span>
                            <br /> holders after sell out.
                        </p>Future utility includes breeding for <span className="color-green">CRYPTOKIDS</span>
                    </div>
                </div>
            </div>
        </Styles>
    )
}

export default Roadmap;