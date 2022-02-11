import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Styles } from "./styles";
import { FaTwitter, FaDiscord } from 'react-icons/fa'
import Lock from '../../assets/images/lock.png';
import OpenseaImg from '../../assets/images/opensea.png';
import { useSelector } from 'react-redux';

const Footer = ({
    disconnectWallet,
    openConnectMetaMaskModal,
    onMintNFT
}) => {
    const [footer_dropdown_menu, showDropDownMenu] = useState(false);

    const { walletAddress, accountBalance } = useSelector(state => state.connect)

    return (
        <Styles className="grey-bg footer">
            <div className="move container">
                <div className="d-block py-5 position-relative">
                    <div className="pt-2 pb-3 w-100 text-center">
                        {
                            walletAddress !== null ? (
                                <div className="position-relative d-inline-block">
                                    <button type="button" className="btn btn-login-wallet Tanker" onClick={onMintNFT}>
                                        <img src={Lock} alt="" className="wallet-lock" />&nbsp;MINT NOW
                                    </button>
                                    <button type="button" className="btn btn-login-wallet Tanker ml-2" onClick={(e) => showDropDownMenu(!footer_dropdown_menu)}>
                                        <img src={Lock} alt="" className="wallet-lock" />
                                    </button>
                                    {
                                        footer_dropdown_menu && (
                                            <div className="wallet-status-show py-1 px-1">
                                                <p className="cursor-pointer mb-0 border-bottom-grey py-1 roboto">
                                                    {walletAddress && `${walletAddress.slice(0, 6)}...${walletAddress.slice(
                                                        walletAddress.length - 4,
                                                        walletAddress.length
                                                    )}`}
                                                </p>
                                                <p className="cursor-pointer mb-0 border-bottom-grey py-1 roboto">{accountBalance}</p>
                                                <p className="cursor-pointer mb-0 py-1 roboto" onClick={(e) => {
                                                    disconnectWallet()
                                                    showDropDownMenu(!footer_dropdown_menu)
                                                }}>Logout</p>
                                            </div>
                                        )
                                    }
                                </div>
                            ) : (
                                <button type="button" className="btn btn-login-wallet connect-btn Tanker" onClick={openConnectMetaMaskModal}>
                                    <img src={Lock} alt="" className="wallet-lock" />&nbsp;CONNECT WALLET
                                </button>
                            )
                        }
                    </div>
                    <div className="d-block text-center pt-3 pb-3">
                        <a className="social-icon px-3" href="https://discord.gg/KjhUseQx38" target="_blank" rel="noopener noreferrer">
                            <FaDiscord />
                        </a>
                        <a className="social-icon px-2" href="https://twitter.com/cryptogolf_io" target="_blank" rel="noopener noreferrer">
                            <FaTwitter />
                        </a>
                        <a href="/" className="social-icon px-3" target="_blank" rel="noopener noreferrer">
                            <img src={OpenseaImg} alt="OpenSea Logo" width="22px" title="OpenSea" />
                        </a>
                    </div>
                    <div className="copyright color-grey text-center pt-3">
                        © 2021 <a className="navbar-brand m-auto" href="/" style={{ fontFamily: 'roboto', fontSize: '0.8rem !important' }}>cryptogolf.io</a>
                        &nbsp;&nbsp;<Link to="/terms">Terms and Conditions</Link>
                    </div>
                </div>
            </div>
        </Styles>
    )
}

export default Footer;