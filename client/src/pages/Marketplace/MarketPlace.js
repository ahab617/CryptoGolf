import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from "react-router";
import axios from "axios";
import Web3 from "web3";
import { Form, Dropdown, InputGroup, FormControl, Button, Row, Col, Overlay, Tooltip } from 'react-bootstrap'
import { MdRefresh } from 'react-icons/md'
import { BiFilter } from 'react-icons/bi'
import { IoIosArrowDown } from 'react-icons/io'
import { FaSearch, FaCaretDown, FaCopy, FaBars } from "react-icons/fa"
import Loader from 'react-loader-spinner';
import { Styles } from "./styles"

import RangeSlider from '../../component/common/RangeSlider'
import MarketCard from "../../component/Card/MarketCard"
import ProfileModal from '../../component/Modal/ProfileModal'

import EthImg from '../../assets/images/eth.png'
import BscImg from '../../assets/images/bsc.png'
import GolfImg from '../../assets/images/logo1.png'
import Avatar from '../../assets/images/dicebear.svg'

import { EthereumContractAddress, BinanceContractAddress } from "../../contracts/address"
import etherContractAbi from '../../abi/etherContract.json'
import binanceContractAbi from '../../abi/binanceContract.json'
import { toast } from "react-toastify";
import { getUserData } from "../../redux/actions";

const MarketPlace = ({ handleExit }) => {

    const dispatch = useDispatch(null)
    const history = useHistory()
    const sortMenuRef = useRef()
    const target = useRef()

    const { chainId, walletAddress } = useSelector(state => state.connect)
    const { user } = useSelector(state => state.user)
    const tokenName = "GOLFPUNKS"

    const [filter, setFilter] = useState(false)
    const [show, setShow] = useState(false)
    const [pending, setPending] = useState(false)
    const [showNavFilter, setShowNavFilter] = useState(false)
    const [totalCount, setTotalCount] = useState(0)
    const [nftTokens, setNFTTokens] = useState([])
    const [ethPrice, setEthPrice] = useState(0)
    const [bscPrice, setBscPrice] = useState(0)
    const [showProfileModal, setShowProfileModal] = useState(false)
    const [sortKey, setSortKey] = useState("Listed")
    const [filterNetwork, setFilterNetwork] = useState(['ether', 'bsc'])
    const [filterStatus, setFilterStatus] = useState(['Sale', 'Offer', 'New'])
    const [filterProperty, setFilterProperty] = useState(['PRO', 'Break70', 'Break 80', 'Break 90 ', 'Break 100'])
    const [minPrice, setMinPrice] = useState(0)
    const [maxPrice, setMaxPrice] = useState(100)
    const [pagenum, setPagenum] = useState(1)
    const pagesize = 8;

    useEffect(() => {
        if (walletAddress !== null) {
            if (chainId === 1 || chainId === 3 || chainId === 56 || chainId === 97) {
                dispatch(getUserData(walletAddress))
            }
        }
    }, [walletAddress, chainId, dispatch])

    useEffect(() => {
        if (walletAddress !== null) {
            if (chainId === 1 || chainId === 3 || chainId === 56 || chainId === 97) {
                if (!pending) {
                    setFilter(true)
                    setPagenum(1)
                    setNFTTokens([])
                    getAllTokenData(1, true)
                }
            }
        }
    }, [walletAddress, chainId, filterNetwork, filterStatus])

    useEffect(() => {
        if (walletAddress !== null) {
            handleSort()
        }
    }, [walletAddress, sortKey])

    const handleCopy = (e) => {
        e.stopPropagation()

        navigator.clipboard.writeText(walletAddress)
        setShow(true)
        setTimeout(() => {
            setShow(false)
        }, 3000)
    }

    const handleFilterNetwork = (key, val) => {
        if (val) {
            if (filterNetwork.indexOf(key) === -1) setFilterNetwork([...filterNetwork, key])
        } else {
            if (filterNetwork.indexOf(key) > -1) {
                const data = filterNetwork.filter(i => i !== key)
                setFilterNetwork(data)
            }
        }
    }

    const handleFilterStatus = (key, val) => {
        if (val) {
            if (filterStatus.indexOf(key) === -1) setFilterStatus([...filterStatus, key])
        } else {
            if (filterStatus.indexOf(key) > -1) {
                const data = filterStatus.filter(i => i !== key)
                setFilterStatus(data)
            }
        }
    }

    const handleFilterProperty = (filterKey, val) => {
        if (val) {
            if (filterProperty.indexOf(filterKey) === -1) {
                setFilterProperty([...filterProperty, filterKey])
            }
        } else {
            if (filterProperty.indexOf(filterKey) > -1) {
                const filtered = filterProperty.filter(prop => prop !== filterKey)
                setFilterProperty(filtered)
            }
        }
    }

    const handleFilterPrice = (val) => {
        setMinPrice(val[0])
        setMaxPrice(val[1])
    }

    const getAllTokenData = async (param_pagenum, param_filter) => {
        setPending(true)
        let etherTokenData = []
        let bscTokenData = []
        let totalNFTs = 0;
        const _onSale = filterStatus.indexOf('Sale') > -1
        const _hasOffer = filterStatus.indexOf('Offer') > -1
        const _new = filterStatus.indexOf('New') > -1
        let min = Web3.utils.toWei(Number(minPrice).toString())
        let max = Web3.utils.toWei(Number(maxPrice).toString())
        if (filterNetwork.indexOf('ether') > -1) {
            const web3 = new Web3(new Web3.providers.HttpProvider(process.env.REACT_APP_ETHER_RPC_URL))
            const contract = new web3.eth.Contract(etherContractAbi, EthereumContractAddress);
            totalNFTs += parseInt(await contract.methods.totalSupply().call())
            const tokenPrice = await contract.methods.getTokenPrice().call()
            setEthPrice(Web3.utils.fromWei(Number(tokenPrice).toString(), 'ether'))
            etherTokenData = await contract.methods.getAllTokens(min, max, _onSale, _hasOffer, _new, pagesize, param_pagenum).call();
            if (etherTokenData !== "[]") {
                etherTokenData = etherTokenData.split(",]")[0] + "]"
            }
            etherTokenData = JSON.parse(etherTokenData)
        }
        if (filterNetwork.indexOf('bsc') > -1) {
            const web3 = new Web3(new Web3.providers.HttpProvider(process.env.REACT_APP_BSC_RPC_URL))
            const contract = new web3.eth.Contract(binanceContractAbi, BinanceContractAddress);
            totalNFTs += parseInt(await contract.methods.totalSupply().call())
            const tokenPrice = await contract.methods.getTokenPrice().call();
            setBscPrice(Web3.utils.fromWei(Number(tokenPrice).toString(), 'ether'))
            bscTokenData = await contract.methods.getAllTokens(min, max, _onSale, _hasOffer, _new, pagesize, param_pagenum).call();
            if (bscTokenData !== "[]") {
                bscTokenData = bscTokenData.split(",]")[0] + "]"
            }
            bscTokenData = JSON.parse(bscTokenData)
        }

        const tokenData = etherTokenData.concat(bscTokenData)
        setTotalCount(totalNFTs)
        let token_id;
        let token_metadata = [];
        let metadata = {}
        for (let i = 0; i < tokenData.length; i++) {
            token_id = tokenData[i].tokenURI.split("ipfs://")[1].split("/")[1].split(".json")[0];
            metadata = await axios.get("https://cryptogolf.mypinata.cloud/ipfs/" + tokenData[i].tokenURI.split("ipfs://")[1])
            await token_metadata.push({
                network: parseInt(token_id) > 5000 ? 'bsc' : 'ether',
                token_id: parseInt(token_id) > 5000 ? parseInt(token_id) - 5000 : token_id,
                owner: tokenData[i].owner,
                image_original_url: "https://cryptogolf.mypinata.cloud/ipfs/" + metadata.data.image.split("ipfs://")[1],
                name: metadata.data.name,
                description: metadata.data.description,
                dna: metadata.data.dna,
                date: metadata.data.date,
                attributes: metadata.data.attributes,
                highestOfferPrice: Number(tokenData[i].highestOffer.split(",")[0]),
                highestOfferType: Number(tokenData[i].highestOffer.split(",")[1]),
                lastSoldPrice: Number(tokenData[i].lastSold.split(",")[0]),
                lastSoldCurrency: Number(tokenData[i].lastSold.split(",")[1]),
                lastSoldTime: Number(tokenData[i].lastSold.split(",")[2]),
                listPrice: Number(tokenData[i].listPrice.split(",")[0]),
                listType: Number(tokenData[i].listPrice.split(",")[1]),
                listTime: Number(tokenData[i].listPrice.split(",")[2])
            })
        }
        if (param_filter) {
            setNFTTokens(token_metadata.sort((a, b) => {
                return parseInt(b.listTime) - parseInt(a.listTime)
            }))
        } else {
            const addedData = nftTokens.concat(token_metadata)
            setNFTTokens(addedData.sort((a, b) => {
                return parseInt(b.listTime) - parseInt(a.listTime)
            }))
        }
        setPending(false)
    }

    const handleCloseProfileModal = () => {
        setShowProfileModal(false)
    }

    const handleRefresh = () => {
        if (walletAddress !== null && !pending) {
            setPagenum(1)
            setNFTTokens([])
            setFilter(true)
            getAllTokenData(1, true)
        }
    }

    const handleSearchID = async (e) => {
        if (walletAddress !== null && (chainId === 1 || chainId === 3 || chainId === 56 || chainId === 97)) {
            if (e.target.value === "") {
                setPagenum(1)
                setFilter(true)
                setNFTTokens([])
                getAllTokenData(1, true)
            } else {
                if (!isNaN(e.target.value)) {
                    try {
                        let web3 = new Web3(new Web3.providers.HttpProvider(process.env.REACT_APP_ETHER_RPC_URL))
                        let contract = new web3.eth.Contract(etherContractAbi, EthereumContractAddress);
                        let ethToken = await contract.methods.getTokenDetail(parseInt(e.target.value)).call()
                        ethToken = JSON.parse(ethToken)

                        web3 = new Web3(new Web3.providers.HttpProvider(process.env.REACT_APP_BSC_RPC_URL))
                        contract = new web3.eth.Contract(binanceContractAbi, BinanceContractAddress);
                        let bscToken = await contract.methods.getTokenDetail(parseInt(e.target.value)).call()
                        bscToken = JSON.parse(bscToken)

                        const tokenData = ethToken.concat(bscToken)
                        let token_metadata = []
                        let token_id;
                        let metadata;
                        for (let i = 0; i < tokenData.length; i++) {
                            token_id = tokenData[i].tokenURI.split("ipfs://")[1].split("/")[1].split(".json")[0];
                            metadata = await axios.get("https://cryptogolf.mypinata.cloud/ipfs/" + tokenData[i].tokenURI.split("ipfs://")[1])
                            await token_metadata.push({
                                network: parseInt(token_id) > 5000 ? 'bsc' : 'ether',
                                token_id: parseInt(token_id) > 5000 ? parseInt(token_id) - 5000 : token_id,
                                image_original_url: "https://cryptogolf.mypinata.cloud/ipfs/" + metadata.data.image.split("ipfs://")[1],
                                name: metadata.data.name,
                                description: metadata.data.description,
                                dna: metadata.data.dna,
                                date: metadata.data.date,
                                attributes: metadata.data.attributes,
                                highestOfferPrice: Number(tokenData[i].highestOffer.split(",")[0]),
                                highestOfferType: Number(tokenData[i].highestOffer.split(",")[1]),
                                lastSoldPrice: Number(tokenData[i].lastSold.split(",")[0]),
                                lastSoldCurrency: Number(tokenData[i].lastSold.split(",")[1]),
                                lastSoldTime: Number(tokenData[i].lastSold.split(",")[2]),
                                listPrice: Number(tokenData[i].listPrice.split(",")[0]),
                                listType: Number(tokenData[i].listPrice.split(",")[1]),
                                listTime: Number(tokenData[i].listPrice.split(",")[2])
                            })
                        }
                        console.log(token_metadata)
                        setNFTTokens(token_metadata)
                    } catch (err) {
                        toast.warning("Token ID does not exist")
                    }
                }
            }
        }
    }

    const handleSort = () => {
        switch (sortKey) {
            case "Listed":
                setNFTTokens([
                    ...nftTokens.sort((a, b) => {
                        return parseInt(b.listTime) - parseInt(a.listTime)
                    })
                ])
                break;
            case "Sold":
                setNFTTokens([
                    ...nftTokens.sort((a, b) => {
                        return parseInt(b.lastSoldTime) - parseInt(a.lastSoldTime)
                    })
                ])
                break;
            case "LH":
                setNFTTokens([
                    ...nftTokens.sort((a, b) => {
                        return parseFloat(a.listPrice) - parseFloat(b.listPrice)
                    })
                ])
                break;
            case "HL":
                setNFTTokens([
                    ...nftTokens.sort((a, b) => {
                        return parseFloat(b.listPrice) - parseFloat(a.listPrice)
                    })
                ])
                break;
            case "Sale":
                setNFTTokens([
                    ...nftTokens.sort((a, b) => {
                        return parseFloat(b.lastSoldPrice) - parseFloat(a.lastSoldPrice)
                    })
                ])
                break;
            default:
                break;
        }
    }

    const handleScroll = (e) => {
        const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
        if (bottom && nftTokens.length < totalCount) {
            let temp = pagenum;
            temp = temp + 1;
            setPagenum(temp);
            setFilter(false);
            getAllTokenData(temp, false);
        }
    }

    return (
        <Styles>
            {
                Object.keys(nftTokens).length > 0 && (
                    <ProfileModal
                        show={showProfileModal}
                        handleClose={handleCloseProfileModal}
                        walletAddress={walletAddress}
                        user={user}
                    />
                )
            }
            <div className="container color-grey">
                <Row>
                    <Col className="page_content col-lg-12 col-12">
                        <div className="border-grey p-1">
                            <div className="row">
                                <div className="col-lg-7 col-12 d-flex align-items-center justify-content-center">
                                    <InputGroup>
                                        <InputGroup.Text className="background-transparent border-grey color-grey font-small"><FaSearch /></InputGroup.Text>
                                        <FormControl
                                            onChange={handleSearchID}
                                            className="background-transparent border-grey color-white font-small"
                                            placeholder="Search ID"
                                            size="sm"
                                        />
                                    </InputGroup>
                                    <Button
                                        variant="link"
                                        className="navbar-toggler color-white toggle-btn ml-4 background-transparent"
                                        onClick={() => setShowNavFilter(!showNavFilter)}
                                    >
                                        <FaBars />
                                    </Button>
                                </div>
                                <div className="col-lg-3 col-12 d-flex align-items-center justify-content-end px-1 desktop-menu">
                                    <Dropdown align="end" className="mx-2">
                                        <Dropdown.Toggle variant="primary" ref={sortMenuRef} className="background-transparent">
                                            Recently Listed <IoIosArrowDown />
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu className="mt-2">
                                            <Dropdown.Item className="text-left color-grey" onClick={() => setSortKey("Listed")}>Recently Listed</Dropdown.Item>
                                            <Dropdown.Item className="text-left color-grey" onClick={() => setSortKey("Sold")}>Recently Sold</Dropdown.Item>
                                            <Dropdown.Item className="text-left color-grey" onClick={() => setSortKey("LH")}>Price (Lowest to highest)</Dropdown.Item>
                                            <Dropdown.Item className="text-left color-grey" onClick={() => setSortKey("HL")}>Price (Highest to lowest)</Dropdown.Item>
                                            <Dropdown.Item className="text-left color-grey" onClick={() => setSortKey("Sale")}>Highest Last Sale</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    <span>|</span>
                                    <div className="mx-2 color-grey">
                                        <MdRefresh className="cursor-pointer" onClick={handleRefresh} />
                                    </div>
                                </div>
                                <div className="col-lg-2 col-12 d-flex align-items-center p-0 text-center desktop-menu">
                                    {
                                        walletAddress === null ? (
                                            <div className="m-auto font-very-small">Not Connected</div>
                                        ) : (
                                            <Dropdown align="end" className="m-auto">
                                                <Dropdown.Toggle variant="primary" id="dropdown-basic" className="background-transparent font-small d-flex align-items-center">
                                                    {
                                                        Object.keys(user).length > 0 ? (
                                                            <img src={user.avatar !== "" ? `upload/${user.avatar}` : Avatar} alt="" width="20px" />
                                                        ) : (
                                                            <img src={Avatar} alt="" width="20px" />
                                                        )
                                                    }
                                                    {
                                                        Object.keys(user).length > 0 && user?.name !== "" ? (
                                                            <span className="font-small color-grey bold"> &nbsp;{user?.name}</span>
                                                        ) : (
                                                            <span>
                                                                {walletAddress && `${walletAddress.slice(0, 6)}...${walletAddress.slice(
                                                                    walletAddress.length - 4,
                                                                    walletAddress.length
                                                                )}`}
                                                            </span>
                                                        )
                                                    }
                                                    <FaCaretDown className="ml-2" />
                                                </Dropdown.Toggle>

                                                <Dropdown.Menu className="mt-2">
                                                    <Dropdown.Item className="text-left color-grey bold cursor-intitial" onClick={(e) => e.stopPropagation()}>
                                                        Connected
                                                    </Dropdown.Item>
                                                    <Dropdown.Item className="text-left color-grey my-1 d-flex align-items-center justify-content-between cursor-intitial">
                                                        <div className="d-flex align-items-center justify-content-center">
                                                            {
                                                                Object.keys(user).length > 0 ? (
                                                                    <img src={user.avatar !== "" ? `upload/${user.avatar}` : Avatar} alt="" width="20px" />
                                                                ) : (
                                                                    <img src={Avatar} alt="" width="20px" />
                                                                )
                                                            }
                                                            {
                                                                (Object.keys(user).length > 0 && user.name !== "") ? (
                                                                    <div>
                                                                        <span className="cursor-pointer font-very-small bold color-grey" onClick={(e) => e.stopPropagation()}>&nbsp;{user.name}</span>
                                                                        <br />
                                                                        <span className="font-very-small mt-1">{walletAddress && `${walletAddress.slice(0, 6)}...${walletAddress.slice(
                                                                            walletAddress.length - 4,
                                                                            walletAddress.length
                                                                        )}`}</span>
                                                                    </div>
                                                                ) : (
                                                                    <div>
                                                                        <span className="font-very-small">{walletAddress && `${walletAddress.slice(0, 6)}...${walletAddress.slice(
                                                                            walletAddress.length - 4,
                                                                            walletAddress.length
                                                                        )}`}</span>
                                                                        <br />
                                                                        <span
                                                                            className="cursor-pointer mt-1"
                                                                            style={{ fontSize: '11px', color: '#5ef5a1' }}
                                                                            onClick={(e) => setShowProfileModal(true)}
                                                                        >Set display name</span>
                                                                    </div>
                                                                )
                                                            }
                                                        </div>
                                                        <Button
                                                            ref={target}
                                                            variant="outline-primary"
                                                            className="background-transparent border-none"
                                                            onClick={handleCopy}
                                                        >
                                                            <FaCopy className="color-grey text-right cursor-pointer" />
                                                        </Button>
                                                        <Overlay target={target.current} show={show} placement="bottom">
                                                            {(props) => (
                                                                <Tooltip className="font-very-small" id="overlay-example" {...props}>
                                                                    Copied
                                                                </Tooltip>
                                                            )}
                                                        </Overlay>
                                                    </Dropdown.Item>
                                                    <Dropdown.Item
                                                        className="text-left color-grey"
                                                        onClick={() => history.push(`/account`)}
                                                    >My Account</Dropdown.Item>
                                                    <Dropdown.Item
                                                        className="text-left w-100 text-decoration-none color-white"
                                                        onClick={() => history.push(`/users/${walletAddress}`)}
                                                    >
                                                        My NFT
                                                    </Dropdown.Item>
                                                    <Dropdown.Item className="text-left color-grey" onClick={(e) => setShowProfileModal(true)}>Preferences</Dropdown.Item>
                                                    <Dropdown.Item className="btn btn-primary color-black mt-1" variant="primary" onClick={handleExit}>
                                                        Exit
                                                    </Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        )
                                    }
                                </div>
                            </div>
                            <div className="row">
                            </div>
                        </div>
                    </Col>
                    <Col className="col-lg-12 col-12 text-left">
                        <div className="border-grey">
                            <Row className="mx-0">
                                <Col lg={3} xs={12} className="desktop-menu border-right-grey p-2">
                                    <div>
                                        <BiFilter />&nbsp;Filter
                                        <div className="mt-4">
                                            <h6>Network</h6>
                                            <Form.Check
                                                type='checkbox'
                                                label=' Ethereum'
                                                className="filter-net d-flex align-items-center"
                                                onChange={(e) => {
                                                    setPagenum(1)
                                                    setFilter(true)
                                                    handleFilterNetwork('ether', e.target.checked)
                                                }}
                                                checked={filterNetwork.indexOf('ether') > -1}
                                            />
                                            <Form.Check
                                                type='checkbox'
                                                label=' Binance Smart Chain'
                                                className="filter-net d-flex align-items-center"
                                                onChange={(e) => {
                                                    setNFTTokens([])
                                                    setPagenum(1)
                                                    setFilter(true)
                                                    handleFilterNetwork('bsc', e.target.checked)
                                                }}
                                                checked={filterNetwork.indexOf('bsc') > -1}
                                            />
                                        </div>
                                        <div className="mt-4">
                                            <h6>Status</h6>
                                            <Form.Check
                                                type='checkbox'
                                                label=' On Sale'
                                                className="filter-net d-flex align-items-center"
                                                onChange={(e) => {
                                                    setNFTTokens([])
                                                    setPagenum(1)
                                                    setFilter(true)
                                                    handleFilterStatus('Sale', e.target.checked)
                                                }}
                                                checked={filterStatus.indexOf('Sale') > -1}
                                            />
                                            <Form.Check
                                                type='checkbox'
                                                label=' Has Offers'
                                                className="filter-net d-flex align-items-center"
                                                onChange={(e) => {
                                                    setNFTTokens([])
                                                    setPagenum(1)
                                                    setFilter(true)
                                                    handleFilterStatus('Offer', e.target.checked)
                                                }}
                                                checked={filterStatus.indexOf('Offer') > -1}
                                            />
                                            <Form.Check
                                                type='checkbox'
                                                label=' New'
                                                className="filter-net d-flex align-items-center"
                                                onChange={(e) => {
                                                    setNFTTokens([])
                                                    setPagenum(1)
                                                    setFilter(true)
                                                    handleFilterStatus('New', e.target.checked)
                                                }}
                                                checked={filterStatus.indexOf('New') > -1}
                                            />
                                        </div>
                                        <div className="mt-4">
                                            <h6 className="d-flex justify-content-between align-items-center">
                                                <span>Price</span>
                                                <button
                                                    className="btn btn-outline-primary border-grey color-grey background-transparent"
                                                    onClick={() => {
                                                        setNFTTokens([])
                                                        setPagenum(1)
                                                        setFilter(true)
                                                        getAllTokenData(1, true)
                                                    }}
                                                >
                                                    <FaSearch className="font-very-small" />
                                                </button>
                                            </h6>
                                            <RangeSlider onSliderChange={handleFilterPrice} />
                                        </div>
                                        <hr />
                                        <p className="font-very-small">
                                            <img src={EthImg} height="20px" alt="" />&nbsp;&nbsp;ETH
                                        </p>
                                        <p className="font-very-small">
                                            <img src={BscImg} height="20px" alt="" />&nbsp;BNB (BSC)
                                        </p>
                                        <p className="font-very-small">
                                            <img src={GolfImg} height="20px" alt="" />&nbsp;GOLF
                                        </p>
                                        <div className="my-4">
                                            <h6>Class</h6>
                                            <Form.Check
                                                type='checkbox'
                                                label=' PRO'
                                                className="filter-net d-flex align-items-center"
                                                onChange={(e) => handleFilterProperty('PRO', e.target.checked)}
                                                checked={filterProperty.indexOf('PRO') > -1}
                                            />
                                            <Form.Check
                                                type='checkbox'
                                                label=' BREAK 70'
                                                className="filter-net d-flex align-items-center"
                                                onChange={(e) => handleFilterProperty('Break70', e.target.checked)}
                                                checked={filterProperty.indexOf('Break70') > -1}
                                            />
                                            <Form.Check
                                                type='checkbox'
                                                label=' BREAK 80'
                                                className="filter-net d-flex align-items-center"
                                                onChange={(e) => handleFilterProperty('Break 80', e.target.checked)}
                                                checked={filterProperty.indexOf('Break 80') > -1}
                                            />
                                            <Form.Check
                                                type='checkbox'
                                                label=' BREAK 90'
                                                className="filter-net d-flex align-items-center"
                                                onChange={(e) => handleFilterProperty('Break 90 ', e.target.checked)}
                                                checked={filterProperty.indexOf('Break 90 ') > -1}
                                            />
                                            <Form.Check
                                                type='checkbox'
                                                label=' BREAK 100'
                                                className="filter-net d-flex align-items-center"
                                                onChange={(e) => handleFilterProperty('Break 100', e.target.checked)}
                                                checked={filterProperty.indexOf('Break 100') > -1}
                                            />
                                        </div>
                                    </div>
                                </Col>
                                <Col lg={9} xs={12} className="p-3 position-relative nft-cards" onScroll={handleScroll}>
                                    {
                                        pending && <div
                                            style={{
                                                position: 'absolute',
                                                width: "100%",
                                                height: "90%",
                                                minHeight: "400px",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                zIndex: '99999'
                                            }}
                                        >
                                            <Loader type="ThreeDots" color="green" height="200px" width="100" />
                                        </div>
                                    }
                                    <Row className="mx-2">
                                        {
                                            nftTokens.length > 0 && nftTokens
                                                .filter(t => filterProperty.indexOf(t.attributes.filter(attr => attr.trait_type === 'Class')[0].value) > -1)
                                                .map((data, index) => (
                                                    <Col lg="3" xs="6" className="px-1 my-1 float-left" key={index}>
                                                        <Link className="text-decoration-none" to={`assets/${data.network}/${data.network === 'ether' ? EthereumContractAddress : BinanceContractAddress}/${data.token_id}`}>
                                                            <MarketCard
                                                                wallet={walletAddress}
                                                                data={data}
                                                                tokenName={tokenName}
                                                                ethPrice={ethPrice}
                                                                bscPrice={bscPrice}
                                                            />
                                                        </Link>
                                                    </Col>
                                                ))
                                        }
                                    </Row>
                                    {
                                        showNavFilter && (
                                            <Row className="w-75 mobile-filters p-3">
                                                <Col>
                                                    <div>
                                                        <BiFilter />&nbsp;Filter
                                                        <div className="mt-4">
                                                            <h6>Network</h6>
                                                            <Form.Check
                                                                type='checkbox'
                                                                label=' Ethereum'
                                                                className="filter-net d-flex align-items-center"
                                                                onChange={(e) => {
                                                                    setNFTTokens([])
                                                                    setPagenum(1)
                                                                    setFilter(true)
                                                                    setShowNavFilter(false)
                                                                    handleFilterNetwork('ether', e.target.checked)
                                                                }}
                                                                checked={filterNetwork.indexOf('ether') > -1}
                                                            />
                                                            <Form.Check
                                                                type='checkbox'
                                                                label=' Binance Smart Chain'
                                                                className="filter-net d-flex align-items-center"
                                                                onChange={(e) => {
                                                                    setNFTTokens([])
                                                                    setPagenum(1)
                                                                    setFilter(true)
                                                                    setShowNavFilter(false)
                                                                    handleFilterNetwork('bsc', e.target.checked)
                                                                }}
                                                                checked={filterNetwork.indexOf('bsc') > -1}
                                                            />
                                                        </div>
                                                        <div className="mt-4">
                                                            <h6>Status</h6>
                                                            <Form.Check
                                                                type='checkbox'
                                                                label=' On Sale'
                                                                className="filter-net d-flex align-items-center"
                                                                onChange={(e) => {
                                                                    setNFTTokens([])
                                                                    setPagenum(1)
                                                                    setFilter(true)
                                                                    setShowNavFilter(false)
                                                                    handleFilterStatus('Sale', e.target.checked)
                                                                }}
                                                                checked={filterStatus.indexOf('Sale') > -1}
                                                            />
                                                            <Form.Check
                                                                type='checkbox'
                                                                label=' Has Offers'
                                                                className="filter-net d-flex align-items-center"
                                                                onChange={(e) => {
                                                                    setNFTTokens([])
                                                                    setPagenum(1)
                                                                    setFilter(true)
                                                                    setShowNavFilter(false)
                                                                    handleFilterStatus('Offer', e.target.checked)
                                                                }}
                                                                checked={filterStatus.indexOf('Offer') > -1}
                                                            />
                                                            <Form.Check
                                                                type='checkbox'
                                                                label=' New'
                                                                className="filter-net d-flex align-items-center"
                                                                onChange={(e) => {
                                                                    setNFTTokens([])
                                                                    setPagenum(1)
                                                                    setFilter(true)
                                                                    setShowNavFilter(false)
                                                                    handleFilterStatus('New', e.target.checked)
                                                                }}
                                                                checked={filterStatus.indexOf('New') > -1}
                                                            />
                                                        </div>
                                                        <div className="mt-4">
                                                            <h6 className="d-flex justify-content-between">
                                                                Price
                                                                <button
                                                                    className="btn btn-outline-primary font-very-small border-grey color-grey background-transparent"
                                                                    onClick={() => {
                                                                        setNFTTokens([])
                                                                        setPagenum(1)
                                                                        setFilter(true)
                                                                        setShowNavFilter(false)
                                                                        getAllTokenData(1, true)
                                                                    }}
                                                                >
                                                                    <FaSearch />
                                                                </button>
                                                            </h6>
                                                            <RangeSlider onSliderChange={handleFilterPrice} />
                                                        </div>
                                                        <hr />
                                                        <p className="font-very-small">
                                                            <img src={EthImg} height="20px" alt="" />&nbsp;&nbsp;ETH
                                                        </p>
                                                        <p className="font-very-small">
                                                            <img src={BscImg} height="20px" alt="" />&nbsp;BNB (BSC)
                                                        </p>
                                                        <p className="font-very-small">
                                                            <img src={GolfImg} height="20px" alt="" />&nbsp;GOLF
                                                        </p>
                                                        <div className="my-4">
                                                            <h6>Class</h6>
                                                            <Form.Check
                                                                type='checkbox'
                                                                label=' PRO'
                                                                className="filter-net d-flex align-items-center"
                                                                onChange={(e) => {
                                                                    setShowNavFilter(false)
                                                                    handleFilterProperty('PRO', e.target.checked)
                                                                }}
                                                                checked={filterProperty.indexOf('PRO') > -1}
                                                            />
                                                            <Form.Check
                                                                type='checkbox'
                                                                label=' BREAK 70'
                                                                className="filter-net d-flex align-items-center"
                                                                onChange={(e) => {
                                                                    setShowNavFilter(false)
                                                                    handleFilterProperty('Break70', e.target.checked)
                                                                }}
                                                                checked={filterProperty.indexOf('Break70') > -1}
                                                            />
                                                            <Form.Check
                                                                type='checkbox'
                                                                label=' BREAK 80'
                                                                className="filter-net d-flex align-items-center"
                                                                onChange={(e) => {
                                                                    setShowNavFilter(false)
                                                                    handleFilterProperty('Break 80', e.target.checked)
                                                                }}
                                                                checked={filterProperty.indexOf('Break 80') > -1}
                                                            />
                                                            <Form.Check
                                                                type='checkbox'
                                                                label=' BREAK 90'
                                                                className="filter-net d-flex align-items-center"
                                                                onChange={(e) => {
                                                                    setShowNavFilter(false)
                                                                    handleFilterProperty('Break 90 ', e.target.checked)
                                                                }}
                                                                checked={filterProperty.indexOf('Break 90 ') > -1}
                                                            />
                                                            <Form.Check
                                                                type='checkbox'
                                                                label=' BREAK 100'
                                                                className="filter-net d-flex align-items-center"
                                                                onChange={(e) => {
                                                                    setShowNavFilter(false)
                                                                    handleFilterProperty('Break 100', e.target.checked)
                                                                }}
                                                                checked={filterProperty.indexOf('Break 100') > -1}
                                                            />
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>
                                        )
                                    }
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
            </div>
        </Styles>
    )
}

export default MarketPlace;