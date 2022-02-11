import { useRef } from "react";
// import { Button } from "react-bootstrap";
import Web3 from "web3";
import { Styles } from "./styles";
import EthImg from '../../assets/images/eth.png'
import BscImg from '../../assets/images/bsc.png'
import GolfImg from '../../assets/images/golf-token.png'
import NoImage from '../../assets/images/default.png'
import GolfTokenImg from '../../assets/images/golf-token.png'

const MarketCard = ({ wallet, data, tokenName, ethPrice, bscPrice }) => {
    const imgRef = useRef();

    const handleException = (e) => {
        imgRef.current.src = NoImage
    }

    return (
        <Styles>
            <div className={`card ${data.owner === String(wallet).toLowerCase() && `card-mine`}`}>
                <div className="img-area">
                    <img src={data.image_original_url} className="card-img" alt="GOLFPUNKS" onError={handleException} ref={imgRef} />
                </div>
                <div className="card-description p-1">
                    <p className="font-very-very-small mb-1 color-grey text-left d-flex justify-content-between align-items-center">
                        <span className="d-flex align-items-center">
                            {tokenName}
                            &nbsp;<img src={data.network === 'ether' ? EthImg : BscImg} alt="" height="14px" />&nbsp;{data.token_id}
                        </span>
                        <span className="color-green bold">
                            {data.attributes.filter(attr => attr.trait_type === 'Class')[0].value.toUpperCase()}
                        </span>
                    </p>
                    {/* <p className="mb-1 text-left color-grey card-text justify-content-between align-items-center d-flex">
                        #{data.token_id}
                    </p> */}
                    <p className="mb-0 text-left color-black card-text justify-content-between d-flex">
                        {
                            data.highestOfferPrice !== 0 ? (
                                <span className="color-grey font-very-very-small d-flex align-items-center">
                                    <img src={data.highestOfferType === 1 ? (data.network === 'ether' ? EthImg : BscImg) : GolfImg} alt="" height="14px" />
                                    &nbsp;
                                    {data.highestOfferType === 1 ? Web3.utils.fromWei(Number(data.highestOfferPrice).toString(), 'ether') : data.highestOfferPrice} (Highest Offer)
                                </span>
                            ) : (
                                data.lastSoldPrice !== 0 ? (
                                    <span className="color-grey font-very-very-small d-flex align-items-center">
                                        <img src={data.lastSoldCurrency === 1 ? (data.network === 'ether' ? EthImg : BscImg) : GolfImg} alt="" height="14px" />
                                        &nbsp;
                                        {data.lastSoldCurrency === 1 ? Web3.utils.fromWei(Number(data.lastSoldPrice).toString(), 'ether') : data.lastSoldPrice} (Last Sold)
                                    </span>
                                ) : (
                                    <span className="color-grey font-very-small"> </span>
                                )
                            )
                        }
                        <span className="color-green text-right d-flex align-items-center">
                            {
                                <img src={(data.listType === 0 || data.listType === 1) ? (data.network === 'bsc' ? BscImg : EthImg) : GolfTokenImg} alt="" height="16px" />
                            }&nbsp;
                            {data.listPrice === 0 ?
                                (data.network === 'ether' ? ethPrice : bscPrice) :
                                (parseInt(data.listType) === 1 ?
                                    Web3.utils.fromWei(parseInt(data.listPrice).toString(), 'ether') :
                                    data.listPrice
                                )}
                        </span>
                    </p>
                </div>
            </div>
        </Styles>
    )
}

export default MarketCard;