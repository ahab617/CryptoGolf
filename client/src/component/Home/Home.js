import { useState } from "react";
import { Styles } from "./styles";
import Lock from '../../assets/images/lock.png';
import { useSelector } from "react-redux";

const Home = ({
    handleMint,
    handleConnect,
    handleDisconnect
}) => {

    const { walletAddress, accountBalance } = useSelector(state => state.connect);
    const [header_dropdown_menu, showDropDownMenu] = useState(false)

    return (
        <Styles>
            <div className="container move">
                <div className="d-block d-xl-flex flex-row padding-6" id="home">
                    <div className="title-text col-12 col-xl-6 Tanker mx-auto">
                        <h2 className="Tanker text-left h-100 home-text">
                            <span className="color-green">GOLF</span> ON THE <br />
                            BLOCKCHAIN.<br />
                            PLAY MORE. <br />
                            EARN <span className="home-wf color-green">MORE.</span>
                        </h2>
                    </div>
                    <div className="col-12 col-xl-6">
                        <div className="position-relative title-img">
                            <div className="title-connect-wallet p-4">
                                {
                                    walletAddress !== null ? (
                                        <div className="position-relative">
                                            <button type="button" className="btn btn-login-wallet Tanker" onClick={handleMint}>
                                                <img src={Lock} alt="" className="wallet-lock" />&nbsp;MINT NOW
                                            </button>
                                            <button type="button" className="btn btn-login-wallet Tanker ml-2" onClick={(e) => showDropDownMenu(!header_dropdown_menu)}>
                                                <img src={Lock} alt="" className="wallet-lock" />
                                            </button>
                                            {
                                                header_dropdown_menu && (
                                                    <div className="wallet-status-show py-1 px-1">
                                                        <p className="cursor-pointer mb-0 border-bottom-grey py-1 roboto">
                                                            {walletAddress && `${walletAddress.slice(0, 6)}...${walletAddress.slice(
                                                                walletAddress.length - 4,
                                                                walletAddress.length
                                                            )}`}
                                                        </p>
                                                        <p className="cursor-pointer mb-0 border-bottom-grey py-1 roboto">{accountBalance}</p>
                                                        <p className="cursor-pointer mb-0 py-1 roboto" onClick={(e) => {
                                                            handleDisconnect()
                                                            showDropDownMenu(!header_dropdown_menu)
                                                        }}>Logout</p>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    ) : (
                                        <button type="button" className="btn btn-login-wallet connect-btn Tanker" onClick={handleConnect}>
                                            <img src={Lock} alt="" className="wallet-lock" />&nbsp;CONNECT WALLET
                                        </button>
                                    )
                                }
                                <p className="public-text Tanker pt-2 mb-0">Public sale 12.12.21</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Styles>
    )
}

export default Home;