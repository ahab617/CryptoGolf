import { Styles } from "./styles";
import Img1 from '../../assets/images/1.png';
import Img2 from '../../assets/images/2.png';
import Img3 from '../../assets/images/3.png';
import Img4 from '../../assets/images/4.png';
import Img5 from '../../assets/images/5.png';
import Img6 from '../../assets/images/6.png';
import Img7 from '../../assets/images/7.png';
import Img8 from '../../assets/images/8.png';
import Img9 from '../../assets/images/9.png';
import Img10 from '../../assets/images/10.png';
import Img11 from '../../assets/images/11.png';
import Img12 from '../../assets/images/12.png';

const Meet = () => {
    return (
        <Styles className="grey-bg">
            <div className="move container">
                <div id="golfpunks" className="d-block d-xl-flex flex-row accused-bg">
                    <div className="title-text col-12 Tanker mx-auto text-center">
                        <h2 className="p2-4">
                            MEET SOME OF OUR <br />
                            <span className="golfpunks-g">G</span>
                            <span className="golfpunks-o">O</span>
                            <span className="golfpunks-l">L</span>
                            <span className="golfpunks-f">F</span>
                            <span className="golfpunks-p">P</span>
                            <span className="golfpunks-u">U</span>
                            <span className="golfpunks-n">N</span>
                            <span className="golfpunks-k">K</span>
                            <span className="golfpunks-s">S</span>
                        </h2>
                        <div>
                            <p className="about-description text-left color-grey-light py-3">
                                Golf fanatics meet blockchain technology on the course. GOLFPUNKS collectable is a non-fungible token (NFT) programmatically generated with Solidity and stored as an ERC721 token on the Binance Smart Chain and Ethereum blockchains and hosted on IPFS.
                            </p>
                        </div>
                        <div className="images w-100">
                            <div className="row">
                                <div className="col-lg-2 col-md-2 col-sm-4 col-6 my-2">
                                    <div className="w-100 nft-images">
                                        <img className="w-100" src={Img1} alt="img" />
                                    </div>
                                </div>
                                <div className="col-lg-2 col-md-2 col-sm-4 col-6 my-2">
                                    <div className="w-100 nft-images">
                                        <img className="w-100" src={Img2} alt="img" />
                                    </div>
                                </div>
                                <div className="col-lg-2 col-md-2 col-sm-4 col-6 my-2">
                                    <div className="w-100 nft-images">
                                        <img className="w-100" src={Img3} alt="img" />
                                    </div>
                                </div>
                                <div className="col-lg-2 col-md-2 col-sm-4 col-6 my-2">
                                    <div className="w-100 nft-images">
                                        <img className="w-100" src={Img4} alt="img" />
                                    </div>
                                </div>
                                <div className="col-lg-2 col-md-2 col-sm-4 col-6 my-2">
                                    <div className="w-100 nft-images">
                                        <img className="w-100" src={Img5} alt="img" />
                                    </div>
                                </div>
                                <div className="col-lg-2 col-md-2 col-sm-4 col-6 my-2">
                                    <div className="w-100 nft-images">
                                        <img className="w-100" src={Img6} alt="img" />
                                    </div>
                                </div>
                                <div className="col-lg-2 col-md-2 col-sm-4 col-6 my-2">
                                    <div className="w-100 nft-images">
                                        <img className="w-100" src={Img7} alt="img" />
                                    </div>
                                </div>
                                <div className="col-lg-2 col-md-2 col-sm-4 col-6 my-2">
                                    <div className="w-100 nft-images">
                                        <img className="w-100" src={Img8} alt="img" />
                                    </div>
                                </div>
                                <div className="col-lg-2 col-md-2 col-sm-4 col-6 my-2">
                                    <div className="w-100 nft-images">
                                        <img className="w-100" src={Img9} alt="img" />
                                    </div>
                                </div>
                                <div className="col-lg-2 col-md-2 col-sm-4 col-6 my-2">
                                    <div className="w-100 nft-images">
                                        <img className="w-100" src={Img10} alt="img" />
                                    </div>
                                </div>
                                <div className="col-lg-2 col-md-2 col-sm-4 col-6 my-2">
                                    <div className="w-100 nft-images">
                                        <img className="w-100" src={Img11} alt="img" />
                                    </div>
                                </div>
                                <div className="col-lg-2 col-md-2 col-sm-4 col-6 my-2">
                                    <div className="w-100 nft-images">
                                        <img className="w-100" src={Img12} alt="img" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="clear"></div>
                    </div>
                </div>
            </div>
        </Styles>
    )
}

export default Meet;