import { useEffect, useRef, useState } from "react"
import { useHistory, useParams } from "react-router"
import { useDispatch, useSelector } from "react-redux"
import { Link } from 'react-router-dom'
import { Col, Row, Button, Table } from "react-bootstrap"
import axios from "axios"
import Web3 from "web3"
import moment from 'moment'
import { toast } from "react-toastify"
import Slider from 'react-slick-slider'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaTwitter, FaWhatsapp, FaTelegramPlane, FaFacebookF, FaAnchor, FaLink } from "react-icons/fa"
import { Styles } from "./styles"

import AttributeCard from "../../component/Card/AttributeCard"
import BuyModal from "../../component/Modal/BuyModal"
import OfferModal from "../../component/Modal/OfferModal"
import MarketCard from "../../component/Card/MarketCard"
import ListSellModal from "../../component/Modal/ListSellModal"

import {
    getHistory,
    setHistory,
    updateListHistory,
    updateOfferStatus,
    cancelOffers,
    cancelOffersWhenApprove
} from "../../redux/actions"
import { EthereumContractAddress, BinanceContractAddress } from "../../contracts/address"
import etherContractAbi from '../../abi/etherContract.json'
import binanceContractAbi from '../../abi/binanceContract.json'
import Avatar from '../../assets/images/dicebear.svg'
import DefaultImg from '../../assets/images/1.png'
import EtherImg from '../../assets/images/eth.png'
import BscImg from '../../assets/images/bsc.png'
import GolfTokenImg from '../../assets/images/golf-token.png'
import { GET_GOLFPUNKS } from "../../redux/types"

const TokenDetail = () => {

    const { net, contractAddress, tokenId } = useParams()
    const history = useHistory()
    const dispatch = useDispatch(null)

    const { walletAddress, accountBalance, chainId } = useSelector(state => state.connect)
    const { lists } = useSelector(state => state.history)
    // const { tokens } = useSelector(state => state.token)
    const { histories } = useSelector(state => state.history)

    const slider = useRef(null)

    const [allTokens, setAllTokens] = useState([])
    const [tokenData, setTokenData] = useState({})
    const [tokenName, setTokenName] = useState("")
    const [tokenSymbol, setTokenSymbol] = useState("")
    const [showBuyModal, setShowBuyModal] = useState(false)
    const [showOfferModal, setShowOfferModal] = useState(false)
    const [showSellModal, setShowSellModal] = useState(false)
    const [owner, setOwner] = useState("")
    const [ownerGolfs, setOwnerGolfs] = useState([])
    const [listedPrice, setListedPrice] = useState(0)
    const [listedType, setListedType] = useState(1)
    const [lastSoldPrice, setLastSoldPrice] = useState(0)
    const [lastSoldCurrency, setLastSoldCurrency] = useState(0)
    const [offeredPrices, setOfferedPrices] = useState({})
    const [offerer, setOfferer] = useState([])
    const [highestOfferPrice, setHighestOfferPrice] = useState(0)
    const [highestOfferType, setHighestOfferType] = useState(0)
    const [ethPrice, setEthPrice] = useState(0)
    const [bscPrice, setBscPrice] = useState(0)

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const dates = ['Sun', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat']

    const settings = {
        dots: false,
        infinite: false,
        speed: 700,
        slidesToShow: window.innerWidth < 768 ? 2 : 4,
        slidesToScroll: window.innerWidth < 768 ? 2 : 4,
    }

    useEffect(() => {
        if (walletAddress !== null) {
            getTokenDetail()
        }
    }, [walletAddress])

    useEffect(() => {
        if (walletAddress !== null) {
            getAllTokenData()
        }
    }, [walletAddress])

    useEffect(() => {
        if (walletAddress !== null && owner !== "") {
            getOwnerCollections()
        }
    }, [walletAddress, owner])

    useEffect(() => {
        if (walletAddress !== null) {
            dispatch(getHistory(tokenId, net))
        }
    }, [walletAddress, tokenId, net, dispatch])

    function formatDate(paramDate) {
        var d = new Date(paramDate),
            month = months[d.getMonth()],
            day = String(d.getDate()).padStart(2, '0'),
            year = d.getFullYear(),
            date = dates[d.getDay()];

        return [date, month, day, year].join(' ');
    }

    const getTokenDetail = async () => {
        const web3 = new Web3(new Web3.providers.HttpProvider(net === "ether" ?
            process.env.REACT_APP_ETHER_RPC_URL :
            process.env.REACT_APP_BSC_RPC_URL))

        const contract = new web3.eth.Contract(net === "ether" ? etherContractAbi : binanceContractAbi, contractAddress);

        const owner = await contract.methods.ownerOfToken(tokenId).call();
        setOwner(owner)

        const offers = await contract.methods.getOfferedPrices(tokenId).call();
        setOfferedPrices(JSON.parse(offers))

        const offerer = JSON.parse(offers).map(offer => {
            if (Number(offer.price) !== 0) {
                return {
                    buyer: offer.buyer,
                    price: parseInt(offer.currency) === 1 ? Web3.utils.fromWei(offer.price.toString(), 'ether') : offer.price,
                    currency: offer.currency
                }
            }
        })
        setOfferer(offerer)

        let tokenDetail = await contract.methods.getTokenDetail(tokenId).call();
        tokenDetail = JSON.parse(tokenDetail)

        if (parseInt(Number(tokenDetail[0].listPrice.split(",")[1])) === 1) {
            setListedPrice(Number(parseFloat(Web3.utils.fromWei(tokenDetail[0].listPrice.split(",")[0], 'ether')).toFixed(4)))
        } else {
            setListedPrice(tokenDetail[0].listPrice.split(",")[0])
        }
        setListedType(Number(tokenDetail[0].listPrice.split(",")[1]))
        setTokenName(tokenDetail[0].tokenName)
        setTokenSymbol(tokenDetail[0].tokenSymbol)
        setLastSoldPrice(Number(tokenDetail[0].lastSold.split(",")[0]))
        setLastSoldCurrency(Number(tokenDetail[0].lastSold.split(",")[1]))
        setHighestOfferPrice(Number(tokenDetail[0].highestOffer.split(",")[0]))
        setHighestOfferType(Number(tokenDetail[0].highestOffer.split(",")[1]))

        let metadata = {}
        const result = await axios.get("https://cryptogolf.mypinata.cloud/ipfs/" + tokenDetail[0].tokenURI.split("ipfs://")[1])
        metadata = result.data
        metadata.image_original_url = "https://cryptogolf.mypinata.cloud/ipfs/" + metadata.image.split("ipfs://")[1]
        setTokenData(metadata)
    }

    const getOwnerCollections = async () => {

        let web3 = new Web3(new Web3.providers.HttpProvider(process.env.REACT_APP_ETHER_RPC_URL))
        let contract = new web3.eth.Contract(etherContractAbi, EthereumContractAddress);
        let etherTokenData = await contract.methods.getOwnerTokens(owner).call();
        etherTokenData = JSON.parse(etherTokenData)

        web3 = new Web3(new Web3.providers.HttpProvider(process.env.REACT_APP_BSC_RPC_URL))
        contract = new web3.eth.Contract(binanceContractAbi, BinanceContractAddress);
        let bscTokenData = await contract.methods.getOwnerTokens(owner).call();
        bscTokenData = JSON.parse(bscTokenData)
        const tokenData = etherTokenData.concat(bscTokenData)

        let token_id;
        let token_metadata = [];
        for (let i = 0; i < tokenData.length; i++) {
            token_id = tokenData[i].tokenURI.split("ipfs://")[1].split("/")[1].split(".json")[0];
            const metadata = await axios.get("https://cryptogolf.mypinata.cloud/ipfs/" + tokenData[i].tokenURI.split("ipfs://")[1])
            token_metadata.push({
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
        setOwnerGolfs(token_metadata)
    }

    const getContract = () => {
        const contractAddress = net === 'ether' ? EthereumContractAddress : BinanceContractAddress
        const contractABI = net === 'ether' ? etherContractAbi : binanceContractAbi

        const contract = new window.web3.eth.Contract(contractABI, contractAddress);
        return contract;
    }

    const getAllTokenData = async () => {

        let web3 = new Web3(new Web3.providers.HttpProvider(process.env.REACT_APP_ETHER_RPC_URL))
        let contract = new web3.eth.Contract(etherContractAbi, EthereumContractAddress);
        let tokenPrice = await contract.methods.getTokenPrice().call();
        setEthPrice(Web3.utils.fromWei(Number(tokenPrice).toString(), 'ether'))
        let etherTokenData = await contract.methods.getAllTokens(0, 1000, true, true, true, 1, 7).call();
        if (etherTokenData !== '[]') {
            etherTokenData = etherTokenData.split(",]")[0] + "]"
        }
        etherTokenData = JSON.parse(etherTokenData)

        web3 = new Web3(new Web3.providers.HttpProvider(process.env.REACT_APP_BSC_RPC_URL))
        contract = new web3.eth.Contract(binanceContractAbi, BinanceContractAddress);
        tokenPrice = await contract.methods.getTokenPrice().call();
        setBscPrice(Web3.utils.fromWei(Number(tokenPrice).toString(), 'ether'))
        let bscTokenData = await contract.methods.getAllTokens(0, 1000, true, true, true, 1, 7).call();
        if (bscTokenData !== "[]") {
            bscTokenData = bscTokenData.split(",]")[0] + "]"
        }
        bscTokenData = JSON.parse(bscTokenData)
        const tokenData = etherTokenData.concat(bscTokenData)

        let token_id;
        let token_metadata = [];
        let metadata = {}
        for (let i = 0; i < tokenData.length; i++) {
            token_id = tokenData[i].tokenURI.split("ipfs://")[1].split("/")[1].split(".json")[0];
            metadata = await axios.get("https://cryptogolf.mypinata.cloud/ipfs/" + tokenData[i].tokenURI.split("ipfs://")[1])
            token_metadata.push({
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
        setAllTokens(token_metadata)
        dispatch({
            type: GET_GOLFPUNKS,
            payload: token_metadata
        })
    }

    const handleCancelListing = async () => {
        const result = checkNetwork()
        if (!result.isValid) {
            toast.warning(result.message)
            return;
        }
        if (window.confirm("Are you sure to cancel listing?")) {
            const current_time = new Date().getTime()
            const contract = getContract()
            await contract.methods.removeFromListedPrice(tokenId, current_time)
                .send({ from: walletAddress })
                .on("receipt", async (receipt) => {
                    // const mintCount = await contract.methods.totalSupply().call()
                    const data = {
                        tokenId: tokenId,
                        event: "List Cancelled",
                        from: walletAddress,
                        to: '',
                        price: listedPrice,
                        currency: listedType,
                        network: net
                    }
                    dispatch(setHistory(data))

                    const listedData = {
                        tokenId: tokenId,
                        owner: walletAddress,
                        network: net,
                        status: 2
                    }
                    dispatch(updateListHistory(listedData))

                    const data1 = {
                        tokenId: tokenId,
                        owner: walletAddress,
                        network: net
                    }
                    dispatch(cancelOffers(data1))

                    toast("Remove from listed for sell")
                    setListedPrice(0)

                    getTokenDetail()
                })
                .on("error", (err) => {
                    toast.warning(err.message)
                })
        }
    }

    const handleClickListSell = () => {
        const result = checkNetwork()
        if (!result.isValid) {
            toast.warning(result.message)
            return;
        }
        setShowSellModal(true)
    }

    const handleClickBuyNow = () => {
        const result = checkNetwork()
        if (!result.isValid) {
            toast.warning(result.message)
            return;
        }
        setShowBuyModal(true)
    }

    const handleClickPlaceOffer = () => {
        const result = checkNetwork()
        if (!result.isValid) {
            toast.warning(result.message)
            return;
        }
        setShowOfferModal(true)
    }

    const handleCancelMyOffer = async () => {
        const current_time = new Date().getTime()
        const contract = getContract()
        await contract.methods.cancelOffer(walletAddress, tokenId, current_time)
            .send({ from: walletAddress })
            .on("receipt", (receipt) => {
                toast("Cancelled offer")
                const _price = offerer.filter(o => o.buyer === String(walletAddress).toLowerCase())[0].price
                const _currency = offerer.filter(o => o.buyer === String(walletAddress).toLowerCase())[0].currency
                const hist = {
                    tokenId: tokenId,
                    event: "Offer cancelled",
                    from: owner,
                    to: walletAddress,
                    price: _price,
                    currency: _currency,
                    network: net
                }
                dispatch(setHistory(hist))
                const data = {
                    tokenId: tokenId,
                    network: net,
                    owner: owner,
                    buyer: walletAddress,
                    status: 2
                }
                dispatch(updateOfferStatus(data))
                getTokenDetail()
            })
            .on("error", (err) => {
                toast.warning(err.message)
            })
    }

    const handleApproveOffer = async (data) => {
        const result = checkNetwork()
        if (!result.isValid) {
            toast.warning(result.message)
            return;
        }
        try {
            const contract = getContract();
            const current_time = new Date().getTime()
            if (parseInt(data.currency) === 1) {
                await contract.methods.transferToken(data.buyer, tokenId, current_time)
                    .send({
                        from: walletAddress
                    })
                    .on("receipt", async (receipt) => {
                        toast("Sell success")
                        handleBuySuccess()
                        let hist = {
                            tokenId: tokenId,
                            event: "Transfer",
                            from: owner,
                            to: data.buyer,
                            price: parseInt(data.currency) === 1 ? Web3.utils.fromWei(data.price.toString(), 'ether') : data.price,
                            currency: data.currency,
                            network: net
                        }
                        await dispatch(setHistory(hist))
                        hist = {
                            tokenId: tokenId,
                            event: "Sold",
                            from: owner,
                            to: data.buyer,
                            price: parseInt(data.currency) === 1 ? Web3.utils.fromWei(data.price.toString(), 'ether') : data.price,
                            currency: data.currency,
                            network: net
                        }
                        await dispatch(setHistory(hist))
                        const listedData = {
                            tokenId: tokenId,
                            owner: owner,
                            network: net,
                            status: 2
                        }
                        await dispatch(updateListHistory(listedData))
                        const hist3 = {
                            tokenId: tokenId,
                            owner: owner,
                            network: data.network,
                            buyer: data.buyer
                        }
                        await dispatch(cancelOffersWhenApprove(hist3))

                        history.push(`/assets/${net}/${contractAddress}/${tokenId}`)
                    })
                    .on("error", (err) => {
                        toast.warning("Transaction failed")
                    })
            } else {
                await contract.methods.approveTokenWithGolf(data.buyer, tokenId, current_time)
                    .send({
                        from: walletAddress
                    })
                    .on("receipt", async (receipt) => {
                        toast("Sell success")
                        handleBuySuccess()
                        let hist = {
                            tokenId: tokenId,
                            event: "Transfer",
                            from: owner,
                            to: data.buyer,
                            price: data.price,
                            currency: data.currency,
                            network: net
                        }
                        await dispatch(setHistory(hist))
                        hist = {
                            tokenId: tokenId,
                            event: "Sold",
                            from: owner,
                            to: data.buyer,
                            price: data.price,
                            currency: data.currency,
                            network: net
                        }
                        await dispatch(setHistory(hist))
                        const listedData = {
                            tokenId: tokenId,
                            owner: owner,
                            network: net,
                            status: 2
                        }
                        await dispatch(updateListHistory(listedData))
                        const hist3 = {
                            tokenId: tokenId,
                            owner: owner,
                            network: data.network,
                            buyer: data.buyer
                        }
                        await dispatch(cancelOffersWhenApprove(hist3))

                        history.push(`/assets/${net}/${contractAddress}/${tokenId}`)
                    })
                    .on("error", (err) => {
                        toast.warning("Transaction failed")
                    })
            }
        } catch (err) {
            // toast.warning("Transaction failed")
        }
    }

    const handleCancelOffer = async (data) => {
        try {
            const result = checkNetwork()
            if (!result.isValid) {
                toast.warning(result.message)
                return;
            }
            const contract = getContract();
            const current_time = new Date().getTime()
            await contract.methods.cancelOffer(data.buyer, tokenId, current_time)
                .send({
                    from: walletAddress
                })
                .on("receipt", (receipt) => {
                    toast("Cancelled offer")
                    const hist = {
                        tokenId: tokenId,
                        event: "Offer cancelled",
                        from: owner,
                        to: data.buyer,
                        price: parseInt(data.currency) === 1 ? Web3.utils.fromWei(data.price.toString(), 'ether') : data.price,
                        currency: data.currency,
                        network: net
                    }
                    dispatch(setHistory(hist))
                    const data1 = {
                        tokenId: tokenId,
                        network: net,
                        owner: owner,
                        buyer: data.buyer,
                        status: 2
                    }
                    dispatch(updateOfferStatus(data1))
                    getTokenDetail()
                })
                .on("error", (err) => {
                    toast.warning(err.message)
                })
        } catch (err) {
            console.log(err)
        }

    }

    const handleBuySuccess = async () => {
        await getTokenDetail()
        await getOwnerCollections()
    }

    const checkNetwork = () => {
        let ret = {
            isValid: true,
            message: ''
        }
        if (chainId !== 1 && chainId !== 3 && chainId !== 56 && chainId !== 97) {
            ret.isValid = false;
            ret.message = "Please connect with Ethereum or Binance Smart Chain network";
            return ret;
        }
        if ((chainId === 56 || chainId === 97) && net === 'ether') {
            ret.isValid = false;
            ret.message = "Please connect with Ethereum network";
        } else if ((chainId === 1 || chainId === 3) && net === 'bsc') {
            ret.isValid = false;
            ret.message = "Please connect with Binance Smart Chain network";
        }
        return ret;
    }

    return (
        <Styles>
            {
                (Object.keys(tokenData).length > 0 && walletAddress !== owner) && (
                    <BuyModal
                        show={showBuyModal}
                        handleClose={() => setShowBuyModal(false)}
                        data={tokenData}
                        tokenName={tokenName}
                        listedPrice={listedPrice}
                        listedType={listedType}
                        network={net}
                        tokenId={tokenId}
                        handleSuccess={handleBuySuccess}
                        owner={owner}
                        offers={offeredPrices}
                    />
                )
            }
            {
                (Object.keys(tokenData).length > 0 && walletAddress !== owner) && (
                    <OfferModal
                        show={showOfferModal}
                        handleClose={() => setShowOfferModal(false)}
                        accountBalance={accountBalance}
                        network={net}
                        contractAddress={contractAddress}
                        walletAddress={walletAddress}
                        tokenId={tokenId}
                        owner={owner}
                        handleOfferSuccess={() => handleBuySuccess()}
                    />
                )
            }
            {
                (Object.keys(tokenData).length > 0 && walletAddress === owner) && (
                    <ListSellModal
                        show={showSellModal}
                        handleClose={() => setShowSellModal(false)}
                        network={net}
                        tokenId={tokenId}
                        handlePostListing={handleBuySuccess}
                    />
                )
            }
            <div className="container pt-4">
                <div className="token-content">
                    {
                        Object.keys(tokenData).length > 0 && (
                            <>
                                <Row>
                                    <Col lg="6" xs="12" className="mt-2">
                                        <img src={tokenData.image_original_url} alt="" className="w-100 token-img" />
                                    </Col>
                                    <Col lg="6" xs="12" className="mt-2">
                                        <div className="color-grey text-left mb-2">{tokenName}</div>
                                        <div className="color-grey text-left mb-2 d-flex align-items-center">
                                            {tokenSymbol}&nbsp;&nbsp;
                                            {net === 'ether' ? (
                                                <img src={EtherImg} alt="" height="20px" />
                                            ) : (
                                                <img src={BscImg} alt="" height="20px" />
                                            )}
                                            &nbsp;{tokenId}
                                        </div>
                                        {
                                            histories.length > 0 && (
                                                <div className="color-grey text-left mb-2 font-small">Minted on {formatDate(histories?.filter(hist => hist.event === 'Mint')[0].date)}</div>
                                            )
                                        }
                                        <div className="my-3 color-grey text-left font-small">
                                            <img src={Avatar} alt="" width="30px" />&nbsp;Owned by {walletAddress === owner
                                                ? (
                                                    <Link to={`/users/${owner}`} className="text-decoration-none">You</Link>
                                                ) : (
                                                    <Link to={`/users/${owner}`} className="text-decoration-none">
                                                        {
                                                            `${owner.slice(0, 6)}...${owner.slice(
                                                                owner.length - 4,
                                                                owner.length
                                                            )}`
                                                        }
                                                    </Link>
                                                )}
                                        </div>
                                        <div className="my-3 color-grey text-left font-small">
                                            <span className="mx-2"><FaLink className="cursor-pointer" /></span>
                                            <span className="mx-2"><FaTwitter className="cursor-pointer" /></span>
                                            <span className="mx-2"><FaFacebookF className="cursor-pointer" /></span>
                                            <span className="mx-2"><FaTelegramPlane className="cursor-pointer" /></span>
                                            <span className="mx-2"><FaWhatsapp className="cursor-pointer" /></span>
                                        </div>
                                        {
                                            parseFloat(listedPrice) !== 0 && (
                                                <div className="mt-3 color-grey text-left font-small d-flex align-items-center">
                                                    Listed Price &nbsp;&nbsp;
                                                    <img src={listedType === 1 ? (net === 'ether' ? EtherImg : BscImg) : GolfTokenImg} alt="" height="20px" />
                                                    &nbsp;
                                                    {listedPrice}&nbsp;{listedType === 2 && 'GOLF'}
                                                </div>
                                            )
                                        }
                                        {
                                            parseFloat(lastSoldPrice) !== 0 && (
                                                <div className="mt-2 color-grey text-left font-small d-flex align-items-center">
                                                    Last Sold &nbsp;&nbsp;
                                                    <img src={parseInt(lastSoldCurrency) === 1 ? (net === 'ether' ? EtherImg : BscImg) : GolfTokenImg} alt="" height="20px" />
                                                    &nbsp;
                                                    {parseInt(lastSoldCurrency) === 1 ?
                                                        Web3.utils.fromWei(Number(lastSoldPrice).toString(), 'ether') :
                                                        lastSoldPrice + ' GOLF'
                                                    }
                                                </div>
                                            )
                                        }
                                        {
                                            Number(highestOfferPrice) !== 0 && (
                                                <div className="mt-2 color-grey text-left font-small d-flex align-items-center">
                                                    Highest Offer &nbsp;&nbsp;
                                                    <img src={parseInt(highestOfferType) === 1 ? (net === 'ether' ? EtherImg : BscImg) : GolfTokenImg} alt="" height="20px" />
                                                    &nbsp;
                                                    {parseInt(highestOfferType) === 1 ? Web3.utils.fromWei(Number(highestOfferPrice).toString(), 'ether') : highestOfferPrice}
                                                </div>
                                            )
                                        }
                                        <div className="my-3 text-left">
                                            {
                                                walletAddress === owner ? (
                                                    <>
                                                        {
                                                            parseFloat(listedPrice) !== 0 ? (
                                                                <Button
                                                                    variant="danger"
                                                                    size="lg"
                                                                    className="color-white font-very-small btn-buy"
                                                                    onClick={handleCancelListing}
                                                                >CANCEL LISTING</Button>
                                                            ) : (
                                                                <Button
                                                                    variant="warning"
                                                                    size="lg"
                                                                    className="color-white font-very-small btn-buy"
                                                                    onClick={handleClickListSell}
                                                                >LIST FOR SELL</Button>
                                                            )
                                                        }
                                                        {/* <Button 
                                                        variant="primary" 
                                                        className="mx-2 color-white font-very-small btn-order" 
                                                        size="lg" 
                                                        onClick={(e) => setShowOfferModal(true)}
                                                    >PLACE AN AUCTION</Button> */}
                                                    </>
                                                ) : (
                                                    <>
                                                        {
                                                            listedPrice !== 0 && (
                                                                <Button
                                                                    variant="warning"
                                                                    size="lg"
                                                                    className="color-white font-very-small btn-buy mr-2"
                                                                    onClick={handleClickBuyNow}
                                                                >BUY NOW</Button>
                                                            )
                                                        }
                                                        {
                                                            offeredPrices.filter(offer => offer.buyer === String(walletAddress).toLowerCase()).length === 0 ? (
                                                                <Button
                                                                    variant="primary"
                                                                    className="color-white font-very-small btn-order"
                                                                    size="lg"
                                                                    onClick={handleClickPlaceOffer}
                                                                >PLACE AN OFFER</Button>
                                                            ) : (
                                                                <Button
                                                                    variant="danger"
                                                                    className="color-white font-very-small btn-order"
                                                                    size="lg"
                                                                    onClick={handleCancelMyOffer}
                                                                >CANCEL MY OFFER</Button>
                                                            )
                                                        }
                                                    </>
                                                )
                                            }
                                        </div>
                                    </Col>
                                    <Col lg="12" xs="12" className="text-left mt-3">
                                        <Button variant="link" className="text-decoration-none font-small">History <FaAnchor /></Button>
                                        <Button variant="link" className="text-decoration-none font-small mx-2">Listings <FaAnchor /></Button>
                                        {/* <Link to="/#histories" className="text-decoration-none font-small">History <FaAnchor /></Link>
                                        <Link to="/#listings" className="text-decoration-none font-small ml-4">Listings <FaAnchor /></Link> */}
                                    </Col>
                                    <Col lg="6" xs="12" className="mt-3 text-left color-grey ">
                                        <h6>Description</h6>
                                        <div className="font-small">{tokenData.description}</div>
                                    </Col>
                                    <Col lg="6" xs="12" className="mt-3 text-left color-grey">
                                        <h6>About Collection</h6>
                                        <div className="d-flex justify-content-between">
                                            <img src={tokenData.image_original_url} alt="" width="85px" height="85px" style={{ borderRadius: '3px', border: '1px solid #52cc83' }} />
                                            <div className="font-small ml-2">
                                                GOLFPUNKS is a collection of 10,000 uniquely generated ERC721 token on the blockchain and hosted on IPSF. A total of 5,000 is programmatically generated on the Binance Smart Chain and 5,000 on the Ethereum blockchain.
                                            </div>
                                        </div>
                                    </Col>
                                    <Col lg="12" xs="12" className="mt-3 text-left color-grey">
                                        Properties
                                    </Col>
                                    {
                                        tokenData.attributes.length > 0 && tokenData.attributes.map((attr, index) => (
                                            <Col lg="3" xs="6" key={index} className="my-2">
                                                <AttributeCard data={attr} />
                                            </Col>
                                        ))
                                    }
                                    {
                                        Object.keys(lists).length > 0 && (
                                            <>
                                                <Col id="listings" lg="12" xs="12" className="py-3 text-left color-grey">
                                                    Listings
                                                </Col>
                                                <Col lg="12" xs="12" className="text-left color-grey">
                                                    <Table responsive striped borderless hover className="color-grey">
                                                        <thead>
                                                            <tr>
                                                                <th className="font-small">FROM</th>
                                                                <th className="font-small">PRICE</th>
                                                                <th className="font-small">DATE</th>
                                                                <th className="font-small">STATUS</th>
                                                                <th className="font-small">ACTION</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                lists.map((list, index) => (
                                                                    <tr key={index}>
                                                                        <td className="font-small color-grey">
                                                                            {list.owner && `${list.owner.slice(0, 6)}...${list.owner.slice(
                                                                                list.owner.length - 4,
                                                                                list.owner.length
                                                                            )}`}
                                                                        </td>
                                                                        <td className="font-small color-grey">
                                                                            <img src={list.currency === 1 ? (net === 'ether' ? EtherImg : BscImg) : GolfTokenImg} alt="" height="20px" />
                                                                            &nbsp;
                                                                            {list.price}
                                                                        </td>
                                                                        <td className="font-small color-grey">{moment(list.date).format("MM/DD/YYYY HH:mm")}</td>
                                                                        <td className="font-small color-grey">
                                                                            {list.status === 0 ?
                                                                                <span className="color-grey">Active</span> :
                                                                                (list.status === 1 ? <span className="color-green">Filled</span> :
                                                                                    <span className="color-red">Cancelled</span>)}
                                                                        </td>
                                                                        <td className="font-small color-grey">
                                                                            {
                                                                                (owner !== walletAddress && list.status === 0) &&
                                                                                <Button size="sm" variant="outline-primary" className="btn-buy w-100 font-very-small" onClick={handleClickBuyNow}>
                                                                                    Buy
                                                                                </Button>
                                                                            }
                                                                        </td>
                                                                    </tr>
                                                                ))
                                                            }
                                                        </tbody>
                                                    </Table>
                                                </Col>
                                            </>
                                        )
                                    }
                                    {
                                        offeredPrices.length > 0 && (
                                            <>
                                                <Col lg="12" xs="12" className="py-3 text-left color-grey">
                                                    Offer
                                                </Col>
                                                <Col lg="12" xs="12" className="text-left">
                                                    <Table responsive striped borderless hover className="color-grey">
                                                        <thead>
                                                            <tr>
                                                                <th className="font-small">FROM</th>
                                                                <th className="font-small">PRICE</th>
                                                                <th className="font-small">DATE</th>
                                                                <th className="font-small">ACTION</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                offeredPrices.map((offer, index) => (
                                                                    <tr key={index}>
                                                                        <td className="font-small color-grey vertical-align">
                                                                            {offer.buyer && `${offer.buyer.slice(0, 6)}...${offer.buyer.slice(
                                                                                offer.buyer.length - 4,
                                                                                offer.buyer.length
                                                                            )}`}
                                                                        </td>
                                                                        <td className="font-small color-grey vertical-align">
                                                                            <img src={parseInt(offer.currency) === 1 ? (net === 'ether' ? EtherImg : BscImg) : GolfTokenImg} alt="" height="20px" />
                                                                            &nbsp;{parseInt(offer.currency) === 1 ? Web3.utils.fromWei(offer.price, 'ether') : offer.price}
                                                                        </td>
                                                                        <td className="font-small color-grey vertical-align">{moment(Number(offer.date)).format("MM/DD/YYYY HH:mm")}</td>
                                                                        <td className="font-small color-white vertical-align">
                                                                            {
                                                                                owner === walletAddress && (
                                                                                    <>
                                                                                        <Button variant="outline-primary" className="font-very-small mx-1 btn-buy" onClick={(e) => handleApproveOffer(offer)}>Approve</Button>
                                                                                        <Button variant="outline-danger" className="font-very-small mx-1 btn-buy" onClick={(e) => handleCancelOffer(offer)}>Cancel</Button>
                                                                                    </>
                                                                                )
                                                                            }
                                                                        </td>
                                                                    </tr>
                                                                ))
                                                            }
                                                        </tbody>
                                                    </Table>
                                                </Col>
                                            </>
                                        )
                                    }
                                    {
                                        histories.length > 0 && (
                                            <>
                                                <Col id="history" lg="12" xs="12" className="py-3 text-left color-grey" id="histories">
                                                    History
                                                </Col>
                                                <Col lg="12" xs="12" className="text-left color-grey">
                                                    <Table responsive striped borderless hover className="color-grey">
                                                        <thead>
                                                            <tr>
                                                                <th className="font-small">EVENT</th>
                                                                <th className="font-small">PRICE</th>
                                                                <th className="font-small">FROM</th>
                                                                <th className="font-small">TO</th>
                                                                <th className="font-small">DATE</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                histories.sort((prev, next) => {
                                                                    return (next.date - prev.date)
                                                                }).map((hist, index) => (
                                                                    <tr key={index}>
                                                                        <td className="font-small color-grey">{hist.event}</td>
                                                                        {hist.price !== "" && hist.price !== 0 ?
                                                                            <td className="font-small color-grey">
                                                                                <img src={hist.currency === 1 ? (net === 'ether' ? EtherImg : BscImg) : GolfTokenImg} alt="" height="20px" />
                                                                                &nbsp;{hist.price}
                                                                            </td> :
                                                                            <td className="font-small color-grey"></td>
                                                                        }
                                                                        <td className="font-small color-grey">
                                                                            {hist.from && `${hist.from.slice(0, 6)}...${hist.from.slice(
                                                                                hist.from.length - 4,
                                                                                hist.from.length
                                                                            )}`}
                                                                        </td>
                                                                        <td className="font-small color-grey">
                                                                            {hist.to && `${hist.to.slice(0, 6)}...${hist.to.slice(
                                                                                hist.to.length - 4,
                                                                                hist.to.length
                                                                            )}`}
                                                                        </td>
                                                                        <td className="font-small color-grey">{moment(hist.date).format("MM/DD/YYYY HH:mm")}</td>
                                                                    </tr>
                                                                ))
                                                            }
                                                        </tbody>
                                                    </Table>
                                                </Col>
                                            </>
                                        )
                                    }
                                    <Col lg="12" xs="12" className="mt-4">
                                        <div>
                                            <p className="mb-2 text-left color-grey font-small">More from GOLFPUNKS</p>
                                            {
                                                allTokens.length > 0 && (
                                                    <Row>
                                                        <Slider ref={slider} {...settings}>
                                                            {
                                                                allTokens.slice(0, 6).map((data, index) => (
                                                                    <Col lg="3" xs="6" className="px-1 my-1" key={index}>
                                                                        <Link className="text-decoration-none" to={`/assets/${data.network}/${data.network === 'ether' ? EthereumContractAddress : BinanceContractAddress}/${data.token_id}`}>
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
                                                        </Slider>
                                                    </Row>
                                                )
                                            }
                                        </div>
                                    </Col>
                                    {
                                        ownerGolfs.length > 0 && (
                                            <Col lg="12" xs="12" className="mt-4">
                                                <p className="text-left mb-2 color-grey font-small">
                                                    More from&nbsp;
                                                    {owner && `${owner.slice(0, 6)}...${owner.slice(
                                                        owner.length - 4,
                                                        owner.length
                                                    )}`}
                                                </p>
                                                <Row>
                                                    <Slider ref={slider} {...settings} >
                                                        {
                                                            ownerGolfs.slice(0, 6).map((data, index) => (
                                                                <Col lg="3" xs="6" className="px-1 my-1" key={index}>
                                                                    <Link className="text-decoration-none" to={`/assets/${data.network}/${data.network === 'ether' ? EthereumContractAddress : BinanceContractAddress}/${data.token_id}`}>
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
                                                    </Slider>
                                                </Row>
                                            </Col>
                                        )
                                    }

                                </Row>
                            </>
                        )
                    }
                </div>
            </div>
        </Styles>
    )
}

export default TokenDetail