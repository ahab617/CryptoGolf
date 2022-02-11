import { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { Styles } from './styles';
import { FaTwitter, FaDiscord, FaBars } from 'react-icons/fa'
import Logo from '../../assets/images/logo1.png';
import Lock from '../../assets/images/lock.png';
import OpenseaImg from '../../assets/images/opensea.png';
import { useSelector } from 'react-redux';

const Header = ({
    connectWallet,
    onMintNFT,
    disconnectWallet
}) => {
    const ref = useRef(null)

    const history = useHistory();

    const [isSticky, setSticky] = useState(false)
    const [showNarrow, setShowNarrow] = useState(false)
    const [header_dropdown_menu, showDropDownMenu] = useState(false)

    const { toggle_sticky, walletAddress, accountBalance } = useSelector(state => state.connect)

    const handleScroll = () => {
        setSticky(window.scrollY > 100)
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll)
        return () => {
            window.removeEventListener('scroll', () => handleScroll)
        };
    }, [])

    const getOffset = (el) => {
        const rect = el.getBoundingClientRect();
        return {
            left: rect.left + window.scrollX,
            top: rect.top + window.scrollY
        };
    }

    const handleClickMenu = async (aid) => {
        const elem = document.getElementById(aid)
        if (elem !== null) {
            const posY = getOffset(elem).top;
            if (isSticky) {
                window.scrollTo(window.scrollX, posY - 70)
            } else {
                window.scrollTo(window.scrollX, posY - 200)
            }
            history.push('/#' + aid)
        } else {
            history.push('/#' + aid)
            await sleep(500);
            handleNavigate(aid)
        }
    }

    const sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }

    const handleNavigate = (aid) => {
        const elem = document.getElementById(aid)
        if (elem !== null) {
            const posY = getOffset(elem).top;
            if (isSticky) {
                window.scrollTo(window.scrollX, posY - 70)
            } else {
                window.scrollTo(window.scrollX, posY - 200)
            }
            history.push('/#' + aid)
        }
    }

    return (
        <Styles>
            <header className={toggle_sticky ? (`header${isSticky ? ' sticky' : ''}`) : ''} ref={ref}>
                <div className="container">
                    <div className="position-relative">
                        <nav className="navbar pt-3 px-0 px-sm-3 navbar-toggleable-md navbar-inverse d-flex align-items-center justify-content-between">
                            <Link className="navbar-brand Tanker mr-4 position-relative" to="/">
                                <div className="logo-img position-absolute">
                                    <img className="w-100" src={Logo} alt="img" />
                                </div>
                                <div className="logo-text">
                                    <span className="w1">C</span>
                                    <span className="w2">R</span>
                                    <span className="w3">Y</span>
                                    <span className="w4">P</span>
                                    <span className="w5">T</span>
                                    <span className="w6">O</span>
                                    <span className="color-green w7">G</span>
                                    <span className="color-green w8">O</span>
                                    <span className="color-green w9">L</span>
                                    <span className="color-green w10">F</span>
                                </div>
                            </Link>
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="mr-4">
                                    <ul className="header-menu mb-0 pl-0">
                                        <li className="color-white Tanker header-menu-item"><a href="/#home" className="color-white text-decoration-none">HOME</a></li>
                                        <li className="color-white Tanker header-menu-item" onClick={() => handleClickMenu('tokenomics')}>TOKENOMICS</li>
                                        <li className="color-white Tanker header-menu-item" onClick={() => handleClickMenu('roadmap')}>ROADMAP</li>
                                        <li className="color-white Tanker header-menu-item" onClick={() => handleClickMenu('faq')}>FAQ</li>
                                        <li className="color-white Tanker header-menu-item"><Link to="/mygolfpunks" className="color-white text-decoration-none">MY GOLFPUNKS</Link></li>
                                        <li className="color-white Tanker header-menu-item"><Link to="/marketplace" className="color-white text-decoration-none">MARKETPLACE</Link></li>
                                    </ul>
                                </div>
                                <div className="d-flex align-items-center">
                                    <div className="d-none d-xl-block mr-4">
                                        <a href="https://discord.gg/KjhUseQx38" title="Discord" className="social-icon mx-1" target="_blank" rel="noopener noreferrer">
                                            <FaDiscord />
                                        </a>
                                        <a href="https://twitter.com/cryptogolf_io" title="Twitter" className="social-icon mx-2" target="_blank" rel="noopener noreferrer">
                                            <FaTwitter />
                                        </a>
                                        <a href="/" className="social-icon mx-1" target="_blank" rel="noopener noreferrer">
                                            <img src={OpenseaImg} alt="OpenSea Logo" width="28px" title="OpenSea" />
                                        </a>
                                    </div>
                                    <div>
                                        {
                                            walletAddress !== null ? (
                                                <div className="position-relative mx-1">
                                                    <button type="button" className="btn btn-login-wallet Tanker" onClick={onMintNFT}>
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
                                                                    disconnectWallet()
                                                                    showDropDownMenu(!header_dropdown_menu)
                                                                }}>Logout</p>
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                            ) : (
                                                <div>
                                                    <button type="button" className="btn btn-login-wallet connect-btn Tanker mx-1" onClick={connectWallet}>
                                                        <img src={Lock} alt="" className="wallet-lock" />&nbsp;CONNECT WALLET
                                                    </button>
                                                </div>
                                            )
                                        }
                                    </div>
                                    <button
                                        className="navbar-toggler color-white toggle-btn ml-4"
                                        onClick={() => setShowNarrow(!showNarrow)}
                                        type="button"
                                        data-toggle="collapse"
                                        data-target="#navbarsExampleDefault"
                                        aria-controls="navbarsExampleDefault"
                                        aria-expanded="false"
                                        aria-label="Toggle navigation"
                                    >
                                        <FaBars />
                                    </button>
                                </div>
                            </div>
                        </nav>
                        {showNarrow && <div className="narrowLinks d-lg-none py-2">
                            <a href="/#home" className="py-2 Tanker toggle-menu-item" onClick={() => setShowNarrow(!showNarrow)}>HOME</a>
                            <div className="color-white py-2 Tanker toggle-menu-item" onClick={() => {
                                setShowNarrow(!showNarrow)
                                handleClickMenu('tokenomics')
                            }}>TOKENOMICS</div>
                            <div className="color-white py-2 Tanker toggle-menu-item" onClick={() => {
                                setShowNarrow(!showNarrow)
                                handleClickMenu('roadmap')
                            }}>ROADMAP</div>
                            <div className="color-white py-2 Tanker toggle-menu-item" onClick={() => {
                                setShowNarrow(!showNarrow)
                                handleClickMenu('faq')
                            }}>FAQ</div>
                            <Link to="/mygolfpunks" className="py-2 Tanker toggle-menu-item" onClick={() => setShowNarrow(!showNarrow)}>MY GOLFPUNKS</Link>
                            <Link to="/marketplace" className="py-2 Tanker toggle-menu-item" onClick={() => setShowNarrow(!showNarrow)}>MARKETPLACE</Link>
                        </div>
                        }
                    </div>
                </div>
            </header>
        </Styles>
    )
}

export default Header;