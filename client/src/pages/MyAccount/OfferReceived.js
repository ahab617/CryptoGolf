import { Styles } from "./styles";
import { Table, Button } from "react-bootstrap";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import moment from "moment";
import Web3 from "web3";
import {
    getReceivedOffers,
    setHistory,
    updateOfferStatus,
    cancelOtherOffers,
    updateListHistory,
    cancelOffersWhenApprove
} from "../../redux/actions";

import { EthereumContractAddress, BinanceContractAddress } from "../../contracts/address";
import etherContractAbi from '../../abi/etherContract.json'
import binanceContractAbi from '../../abi/binanceContract.json'

import EthImg from '../../assets/images/eth.png'
import BscImg from '../../assets/images/bsc.png'
import GolfImg from '../../assets/images/golf-token.png'

const OfferReceived = () => {

    const dispatch = useDispatch(null)

    const { walletAddress, chainId } = useSelector(state => state.connect)
    const { receivedOffers } = useSelector(state => state.account)

    useEffect(() => {
        if (walletAddress !== null) {
            dispatch(getReceivedOffers(walletAddress))
        }
    }, [walletAddress])

    const checkNetwork = (network) => {
        let ret = {
            isValid: true,
            message: ''
        }
        if (chainId !== 1 && chainId !== 3 && chainId !== 56 && chainId !== 97) {
            ret.isValid = false;
            ret.message = "Please connect with Ethereum or Binance Smart Chain network";
            return ret;
        }
        if ((chainId === 56 || chainId === 97) && network === 'ether') {
            ret.isValid = false;
            ret.message = "Please connect with Ethereum network";
        } else if ((chainId === 1 || chainId === 3) && network === 'bsc') {
            ret.isValid = false;
            ret.message = "Please connect with Binance Smart Chain network";
        }
        return ret;
    }

    const getContract = () => {
        const contractAddress = (chainId === 1 || chainId == 3) ? EthereumContractAddress : BinanceContractAddress
        const contractABI = (chainId === 1 || chainId == 3) ? etherContractAbi : binanceContractAbi

        const contract = new window.web3.eth.Contract(contractABI, contractAddress);
        return contract;
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
                await contract.methods.transferToken(data.buyer, data.tokenId, current_time)
                    .send({
                        from: walletAddress
                    })
                    .on("receipt", async (receipt) => {
                        toast("Sell success")
                        let hist = {
                            tokenId: data.tokenId,
                            event: "Transfer",
                            from: walletAddress,
                            to: data.buyer,
                            price: parseInt(data.currency) === 1 ? Web3.utils.fromWei(data.price.toString(), 'ether') : data.price,
                            currency: data.currency,
                            network: data.network
                        }
                        await dispatch(setHistory(hist))
                        hist = {
                            tokenId: data.tokenId,
                            event: "Sold",
                            from: walletAddress,
                            to: data.buyer,
                            price: parseInt(data.currency) === 1 ? Web3.utils.fromWei(data.price.toString(), 'ether') : data.price,
                            currency: data.currency,
                            network: data.network
                        }
                        await dispatch(setHistory(hist))
                        const listedData = {
                            tokenId: data.tokenId,
                            owner: walletAddress,
                            network: data.network,
                            status: 2
                        }
                        await dispatch(updateListHistory(listedData))
                        const hist3 = {
                            tokenId: data.tokenId,
                            owner: walletAddress,
                            network: data.network,
                            buyer: data.buyer
                        }
                        await dispatch(cancelOffersWhenApprove(hist3))
                    })
                    .on("error", (err) => {
                        toast.warning("Transaction failed")
                    })
            } else {
                await contract.methods.approveTokenWithGolf(data.buyer, data.tokenId, current_time)
                    .send({
                        from: walletAddress
                    })
                    .on("receipt", async (receipt) => {
                        toast("Sell success")
                        let hist = {
                            tokenId: data.tokenId,
                            event: "Transfer",
                            from: walletAddress,
                            to: data.buyer,
                            price: data.price,
                            currency: data.currency,
                            network: data.network
                        }
                        await dispatch(setHistory(hist))
                        hist = {
                            tokenId: data.tokenId,
                            event: "Sold",
                            from: walletAddress,
                            to: data.buyer,
                            price: data.price,
                            currency: data.currency,
                            network: data.network
                        }
                        await dispatch(setHistory(hist))
                        const listedData = {
                            tokenId: data.tokenId,
                            owner: data.owner,
                            network: data.network,
                            status: 2
                        }
                        await dispatch(updateListHistory(listedData))
                        const hist3 = {
                            tokenId: data.tokenId,
                            owner: walletAddress,
                            network: data.network,
                            buyer: data.buyer
                        }
                        await dispatch(cancelOffersWhenApprove(hist3))
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
            await contract.methods.cancelOffer(data.buyer, data.tokenId, current_time)
                .send({
                    from: walletAddress
                })
                .on("receipt", (receipt) => {
                    toast("Cancelled offer")
                    const hist = {
                        tokenId: data.tokenId,
                        event: "Offer cancelled",
                        from: walletAddress,
                        to: data.buyer,
                        price: parseInt(data.currency) === 1 ? Web3.utils.fromWei(data.price.toString(), 'ether') : data.price,
                        currency: data.currency,
                        network: data.network
                    }
                    dispatch(setHistory(hist))
                    const data1 = {
                        tokenId: data.tokenId,
                        network: data.network,
                        owner: data.owner,
                        buyer: walletAddress,
                        status: 2
                    }
                    dispatch(updateOfferStatus(data1))
                })
                .on("error", (err) => {
                    toast.warning(err.message)
                })
        } catch (err) {
            console.log(err)
        }

    }

    return (
        <Styles>
            <Table responsive striped borderless hover className="color-grey">
                <thead>
                    <tr>
                        <th className="font-small text-left">ITEMS</th>
                        <th className="font-small text-left">BUYER</th>
                        <th className="font-small text-left">DATE</th>
                        <th className="font-small text-left">PRICE</th>
                        <th className="font-small text-left">STATUS</th>
                        <th className="font-small text-left">ACTION</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        Object.keys(receivedOffers).length > 0 ? receivedOffers.map((offer, index) => (
                            <tr key={index}>
                                <td className="font-small text-left color-grey vertical-align">
                                    GOLFPUNKS&nbsp;#{offer.tokenId}
                                </td>
                                <td className="font-small text-left color-grey vertical-align">
                                    {(offer.buyer === '0x0000...0000' || offer.buyer === '') ? '' : `${offer.buyer.slice(0, 6)}...${offer.buyer.slice(
                                        offer.buyer.length - 4,
                                        offer.buyer.length
                                    )}`}
                                </td>
                                <td className="font-small text-left color-grey vertical-align">
                                    {moment(offer.date).format("ddd MMM DD YYYY")}
                                </td>
                                <td className="font-small text-left color-grey vertical-align">
                                    <img src={offer.currency === 1 ? (offer.network === 'ether' ? EthImg : BscImg) : GolfImg} alt="" height="24px" />&nbsp;{offer.price}
                                </td>
                                <td className={`font-small text-left vertical-align ${offer.status === 0 ? 'color-blue' : (offer.status === 1 ? 'color-green' : 'color-red')}`}>
                                    {offer.status === 0 ? 'Active' : (offer.status === 1 ? 'Filled' : 'Cancelled')}
                                </td>
                                <td className="font-small text-left font-very-small color-grey vertical-align">
                                    {offer.status === 0 && (
                                        <>
                                            <Button variant="outline-primary" className="font-very-small mx-1 btn-buy" onClick={(e) => handleApproveOffer(offer)}>Approve</Button>
                                            <Button variant="outline-danger" className="font-very-small mx-1 btn-buy" onClick={(e) => handleCancelOffer(offer)}>Cancel</Button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={6} className="font-small color-grey">
                                    No Offers
                                </td>
                            </tr>
                        )
                    }
                </tbody>
            </Table>
        </Styles>
    )
}

export default OfferReceived