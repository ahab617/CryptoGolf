import { Styles } from "./styles";
import { Table, Button } from "react-bootstrap";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import moment from "moment";
import { getMadeOffers, setHistory, updateOfferStatus } from "../../redux/actions";

import { EthereumContractAddress, BinanceContractAddress } from "../../contracts/address";
import etherContractAbi from '../../abi/etherContract.json'
import binanceContractAbi from '../../abi/binanceContract.json'

import EthImg from '../../assets/images/eth.png'
import BscImg from '../../assets/images/bsc.png'
import GolfImg from '../../assets/images/golf-token.png'

const OfferMade = () => {

    const dispatch = useDispatch(null)

    const { walletAddress, chainId } = useSelector(state => state.connect)
    const { madeOffers } = useSelector(state => state.account)

    useEffect(() => {
        if (walletAddress !== null) {
            dispatch(getMadeOffers(walletAddress))
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

    const handleCancelMyOffer = async (offerData) => {
        const result = checkNetwork(offerData.network)
        if (!result.isValid) {
            toast.warning(result.message)
            return;
        }
        const current_time = new Date().getTime()
        const contract = getContract()
        await contract.methods.cancelOffer(walletAddress, offerData.tokenId, current_time)
            .send({ from: walletAddress })
            .on("receipt", (receipt) => {
                toast("Cancelled offer")
                const hist = {
                    tokenId: offerData.tokenId,
                    event: "Offer cancelled",
                    from: offerData.owner,
                    to: walletAddress,
                    price: offerData.price,
                    currency: offerData.currency,
                    network: offerData.network
                }
                dispatch(setHistory(hist))
                const data = {
                    tokenId: offerData.tokenId,
                    network: offerData.network,
                    owner: offerData.owner,
                    buyer: walletAddress,
                    status: 2
                }
                dispatch(updateOfferStatus(data))
            })
            .on("error", (err) => {
                toast.warning(err.message)
            })
    }

    return (
        <Styles>
            <Table responsive striped borderless hover className="color-grey">
                <thead>
                    <tr>
                        <th className="font-small text-left">ITEMS</th>
                        <th className="font-small text-left">OWNER</th>
                        <th className="font-small text-left">DATE</th>
                        <th className="font-small text-left">PRICE</th>
                        <th className="font-small text-left">STATUS</th>
                        <th className="font-small text-left">ACTION</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        Object.keys(madeOffers).length > 0 ? madeOffers.map((offer, index) => (
                            <tr key={index}>
                                <td className="font-small text-left color-grey vertical-align">
                                    GOLFPUNKS&nbsp;#{offer.tokenId}
                                </td>
                                <td className="font-small text-left color-grey vertical-align">
                                    {(offer.owner === '0x0000...0000' || offer.owner === '') ? '' : `${offer.owner.slice(0, 6)}...${offer.owner.slice(
                                        offer.owner.length - 4,
                                        offer.owner.length
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
                                        <Button
                                            size="sm"
                                            variant="outline-danger"
                                            onClick={() => handleCancelMyOffer(offer)}
                                            className="font-very-small btn-buy"
                                        >Cancel</Button>
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

export default OfferMade