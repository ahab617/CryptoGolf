import { Styles } from "./styles"
import EthImg from '../../assets/images/eth.png'
import BscImg from '../../assets/images/bsc.png'
import NoImage from '../../assets/images/default.png'
import { useRef } from "react";

const GolfCard = ({ tokenClass, image, id, chainId, handleSellClick }) => {

    const imgRef = useRef();
    const handleException = (e) => {
        imgRef.current.src = NoImage
    }

    return (
        <Styles>
            <div className="card position-relative">
                <div className="img-area">
                    <img src={image} className="card-img" alt="GOLFPUNKS" onError={handleException} ref={imgRef} />
                    <div className="w-100 justify-content-between align-items-center card-actions px-1">
                        {/* <Button
                            variant="outline-primary"
                            className="btn-sell cursor-pointer"
                            onClick={() => handleSellClick(chainId)}
                        >SELL</Button> */}
                        {/* <Button 
                            variant="outline-primary" 
                            className="btn-sell cursor-pointer"
                        >AUCTION</Button> */}
                    </div>
                </div>
                <div className="card-description p-1">
                    <p className="mb-2 text-left color-black card-text justify-content-between align-items-center d-flex">
                        GOLFPUNKS
                        <span className="color-green">
                            {
                                (chainId === 'ether') ? (
                                    <img src={EthImg} alt="" height="20px" />
                                ) : (
                                    <img src={BscImg} alt="" height="20px" />
                                )
                            }
                            &nbsp;{id}
                        </span>
                    </p>
                    <p className="mb-0 text-left color-black card-text justify-content-between d-flex">
                        <span className="golf-class">Class</span>
                        <span className="color-green">{tokenClass}</span>
                    </p>
                </div>
            </div>
        </Styles>
    )
}

export default GolfCard;