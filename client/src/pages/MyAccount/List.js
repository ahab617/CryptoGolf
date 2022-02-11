import { Styles } from "./styles";
import { Table, Button } from "react-bootstrap";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import moment from "moment";
import { getListings, setHistory, updateListHistory, cancelOffers } from "../../redux/actions";

import { EthereumContractAddress, BinanceContractAddress } from "../../contracts/address";
import etherContractAbi from '../../abi/etherContract.json'
import binanceContractAbi from '../../abi/binanceContract.json'

import EthImg from '../../assets/images/eth.png'
import BscImg from '../../assets/images/bsc.png'
import GolfImg from '../../assets/images/golf-token.png'

const List = () => {

    const dispatch = useDispatch(null)

    const { walletAddress, chainId } = useSelector(state => state.connect)
    const { lists } = useSelector(state => state.history)

    useEffect(() => {
        if (walletAddress !== null) {
            dispatch(getListings(walletAddress))
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

    const handleCancelListing = async (listData) => {
        const result = checkNetwork(listData.network)
        if (!result.isValid) {
            toast.warning(result.message)
            return;
        }
        if (window.confirm("Are you sure to cancel listing?")) {
            const current_time = new Date().getTime()
            const contract = getContract()
            await contract.methods.removeFromListedPrice(listData.tokenId, current_time)
                .send({ from: walletAddress })
                .on("receipt", async (receipt) => {
                    const data = {
                        tokenId: listData.tokenId,
                        event: "List Cancelled",
                        from: walletAddress,
                        to: '',
                        price: listData.price,
                        currency: listData.currency,
                        network: listData.network
                    }
                    dispatch(setHistory(data))

                    const listedData = {
                        tokenId: listData.tokenId,
                        owner: walletAddress,
                        network: listData.network,
                        status: 2
                    }
                    dispatch(updateListHistory(listedData))

                    const data1 = {
                        tokenId: listData.tokenId,
                        owner: walletAddress,
                        network: listData.network
                    }
                    dispatch(cancelOffers(data1))

                    toast("Remove from listed for sell")
                })
                .on("error", (err) => {
                    toast.warning(err.message)
                })
        }
    }

    return (
        <Styles>
            <Table responsive striped borderless hover className="color-grey">
                <thead>
                    <tr>
                        <th className="font-small text-left">ITEMS</th>
                        <th className="font-small text-left">DATE</th>
                        <th className="font-small text-left">PRICE</th>
                        <th className="font-small text-left">STATUS</th>
                        <th className="font-small text-left">ACTION</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        Object.keys(lists).length > 0 ? lists.map((list, index) => (
                            <tr key={index}>
                                <td className="font-small text-left color-grey vertical-align">
                                    GOLFPUNK #{list.tokenId}
                                </td>
                                <td className="font-small text-left color-grey vertical-align">
                                    {moment(list.date).format("ddd MMM DD YYYY")}
                                </td>
                                <td className="font-small text-left color-grey vertical-align">
                                    <img src={list.currency === 1 ? (list.network === 'ether' ? EthImg : BscImg) : GolfImg} alt="" height="24px" />&nbsp;{list.price}
                                </td>
                                <td className={`font-small text-left vertical-align ${list.status === 0 ? 'color-blue' : (list.status === 1 ? 'color-green' : 'color-red')}`}>
                                    {list.status === 0 ? 'Active' : (list.status === 1 ? 'Filled' : 'Cancelled')}
                                </td>
                                <td className="font-small text-left font-very-small color-grey vertical-align">
                                    {list.status === 0 && (
                                        <Button
                                            size="sm"
                                            variant="outline-danger"
                                            onClick={() => handleCancelListing(list)}
                                            className="font-very-small btn-buy"
                                        >Cancel</Button>
                                    )}
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={5} className="font-small color-grey">
                                    No Listings
                                </td>
                            </tr>
                        )
                    }
                </tbody>
            </Table>
        </Styles>
    )
}

export default List