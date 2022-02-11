import { useEffect, useRef, useState } from "react";
import { Styles } from "./styles";
import Logo1 from '../../assets/images/logo1.png';
import GolfImg from '../../assets/images/golf.png'
import { useSelector } from "react-redux";

const MapDetail = () => {

    const lastPosRef = useRef();
    const golfRef = useRef();

    const [sticky, setGolfSticky] = useState(true)
    const { toggle_sticky } = useSelector(state => state.connect)

    useEffect(() => {
        const handleScroll = () => {
            if(lastPosRef.current !== null) {
                setGolfSticky(lastPosRef.current.getBoundingClientRect().top > 135)
            }
        }
        window.addEventListener('scroll', handleScroll)
        return () => {
            window.removeEventListener('scroll', () => handleScroll)
        };
    }, [toggle_sticky])

    return (
        <Styles>
            <img src={GolfImg} ref={golfRef} alt="" width="42px" className={sticky ? "d-none d-lg-block m-auto golf-img" : "d-none d-lg-block m-auto"} />
            <div className="percent-step w-100">
                <div className="d-flex flex-row percent-height100">
                    <div className="d-none d-lg-block col-6 pb-5">
                    </div>
                    <div className="left-border col-12 col-lg-6 pl-0 pr-0 pl-lg-5 pb-5 position-relative pt-5">
                        <div className="d-flex flex-row">
                            <p className="text-left percent-num Tanker color-white pr-2">
                                <span className="percent-text-color10">10%</span>
                                <span className="d-none">10%</span>
                                <span className="d-none">10%</span>
                                <span className="d-none">10%</span>
                                <span className="d-none">10%</span>
                            </p>
                            <p className="text-left percent-script color-grey pl-2">Giveaway of 20 NFTs for Discord users and Twitter followers.</p>
                        </div>
                        <div className="position-absolute loadmap-key1 d-none d-lg-block translateY1">
                            <img className="key" src={Logo1} alt="img" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="percent-step w-100">
                <div className="d-flex flex-row percent-height100">
                    <div className="d-none"></div>
                    <div className="right-border col-12 col-lg-6 pl-0 pr-0 pr-lg-5 pb-5 position-relative">
                        <div className="d-flex flex-row">
                            <p className="text-left percent-num Tanker color-white pr-2">
                                <span className="d-none">25%</span>
                                <span className="percent-text-color25">25%</span>
                                <span className="d-none">25%</span>
                                <span className="d-none">25%</span>
                                <span className="d-none">25%</span>
                            </p>
                            <p className="text-left percent-script color-grey pl-2">First round of GOLF token airdrops to all NFT holders. The lucky minter of TokenID 2500 will receive a bonus token airdrop.</p>
                        </div>
                        <div className="position-absolute loadmap-key2 d-none d-lg-block">
                            <img className="key" src={Logo1} alt="img" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="percent-step w-100">
                <div className="d-flex flex-row percent-height100">
                    <div className="d-none d-lg-block col-6 pb-5"></div>
                    <div className="left-border col-12 col-lg-6 pl-0 pr-0 pl-lg-5 pb-5 position-relative">
                        <div className="d-flex flex-row">
                            <p className="text-left percent-num Tanker color-white pr-2">
                                <span className="d-none">50%</span>
                                <span className="d-none">50%</span>
                                <span className="percent-text-color50">50%</span>
                                <span className="d-none">50%</span>
                                <span className="d-none">50%</span>
                            </p>
                            <p className="text-left percent-script color-grey pl-2">Second round of GOLF token airdrops to all NFT holders who hold at least 5 NFTs and 50,000 GOLF tokens in their wallet.</p>
                        </div>
                        <div className="position-absolute loadmap-key1 d-none d-lg-block">
                            <img className="key" src={Logo1} alt="img" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="percent-step w-100">
                <div className="d-flex flex-row percent-height100">
                    <div className="d-none"></div>
                    <div className="right-border col-12 col-lg-6 pl-0 pr-0 pr-lg-5 pb-5 position-relative">
                        <div className="d-flex flex-row">
                            <p className="text-left percent-num Tanker color-white pr-2">
                                <span className="d-none">80%</span>
                                <span className="d-none">80%</span>
                                <span className="d-none">80%</span>
                                <span className="percent-text-color80">80%</span>
                                <span className="d-none">80%</span>
                            </p>
                            <p className="text-left percent-script color-grey pl-2">Beta release of the marketplace. The lucky minter of TokenID 8000 will receive a bonus token airdrop.</p>
                        </div>
                        <div className="position-absolute loadmap-key2 d-none d-lg-block">
                            <img className="key" src={Logo1} alt="img" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="percent-step w-100">
                <div className="d-flex flex-row percent-height100">
                    <div className="d-none d-lg-block col-6"></div>
                    <div className="col-12 col-lg-6 pl-0 pr-0 pl-lg-5 position-relative">
                        <div className="d-flex flex-row">
                            <p className="text-left percent-num Tanker color-white pr-2">
                                <span className="d-none">100%</span>
                                <span className="d-none">100%</span>
                                <span className="d-none">100%</span>
                                <span className="d-none">100%</span>
                                <span className="percent-text-color100">100%</span>
                            </p>
                            <p className="text-left percent-script color-grey pl-2">At SOLD OUT the full version of the marketplace will go live. We will start to develop the online golf course tee time booking software and step up marketing campaigns and expansion of golf course partnerships worldwide.</p>
                        </div>
                        <div className="position-absolute loadmap-key1 d-none d-lg-block">
                            <img className="key" src={Logo1} alt="" ref={lastPosRef} />
                        </div>
                    </div>
                    </div>
            </div>
        </Styles>
    )
}

export default MapDetail;