import { useEffect, useState } from "react"
import { Modal, Button, Form } from "react-bootstrap"
import { Styles } from "./styles"
import { EthereumContractAddress, BinanceContractAddress, GOLFContractAddress } from "../../contracts/address"
import etherContractAbi from '../../abi/etherContract.json'
import binanceContractAbi from '../../abi/binanceContract.json'
import golfContractAbi from '../../abi/golfContract.json'
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"
import Web3 from "web3"
import { setHistory, setListedToken } from "../../redux/actions"

const ListSellModal = ({
    show,
    handleClose,
    network,
    tokenId,
    handlePostListing
}) => {

    const dispatch = useDispatch(null)

    const [price, setPrice] = useState(0)
    const [approveTerms, setApproveTerms] = useState(false)
    const [invalidClass, setInvalidClass] = useState(false)
    const [tokenType, setTokenType] = useState(1)
    const [golfBalance, setGolfBalance] = useState(0)
    const [golfDecimals, setGolfDecimals] = useState(0)

    const { chainId, walletAddress } = useSelector(state => state.connect)

    useEffect(() => {
        setInvalidClass(false)
    }, [])

    useEffect(() => {
        const getGolfBalance = async () => {
            const golfInst = new window.web3.eth.Contract(golfContractAbi, GOLFContractAddress);
            const golf_balance = await golfInst.methods.balanceOf(walletAddress).call()
            const golf_decimal = await golfInst.methods.decimals().call()
            setGolfDecimals(golf_decimal)
            setGolfBalance(golf_balance / Math.pow(10, golf_decimal))
        }
        if (walletAddress !== null && (chainId === 56 || chainId === 97)) {
            getGolfBalance()
        }
    }, [walletAddress, chainId])

    const getContract = () => {
        const contractAddress = network === 'ether' ? EthereumContractAddress : BinanceContractAddress
        const contractABI = network === 'ether' ? etherContractAbi : binanceContractAbi

        const contract = new window.web3.eth.Contract(contractABI, contractAddress);
        return contract;
    }

    const handlePost = async (e) => {
        if (tokenType !== 1 && tokenType !== 2) {
            toast.warning("Please select token type");
            return;
        }
        if (chainId === 1 || chainId === 3 || chainId === 56 || chainId === 97) {
            if (price === 0) {
                toast.warning("Please input your listed price");
                return;
            }
            if (!approveTerms) {
                setInvalidClass(true)
                return;
            }
            handleClose(e)
            const current_time = new Date().getTime()
            const contract = getContract()
            if (parseInt(tokenType) === 1) {
                await contract.methods.setlistedPrice(tokenId, Web3.utils.toWei(Number(price).toString()), tokenType, current_time)
                    .send({ from: walletAddress })
                    .on("receipt", (receipt) => {
                        toast("Item Listed")
                        handlePostListing()

                        const data = {
                            tokenId: tokenId,
                            event: "List",
                            from: walletAddress,
                            to: '',
                            price: price,
                            currency: tokenType,
                            network: network
                        }
                        dispatch(setHistory(data))

                        const listedData = {
                            tokenId: tokenId,
                            owner: walletAddress,
                            price: price,
                            currency: tokenType,
                            network: network,
                            status: 0
                        }
                        dispatch(setListedToken(listedData))
                    })
                    .on("error", (err) => {
                        toast.warning(err.message)
                    })
            } else {
                await contract.methods.setlistedPrice(tokenId, price, tokenType, current_time)
                    .send({ from: walletAddress })
                    .on("receipt", (receipt) => {
                        toast("Item Listed")
                        handlePostListing()

                        const data = {
                            tokenId: tokenId,
                            event: "List",
                            from: walletAddress,
                            to: '',
                            price: price,
                            currency: tokenType,
                            network: network
                        }
                        dispatch(setHistory(data))

                        const listedData = {
                            tokenId: tokenId,
                            owner: walletAddress,
                            price: price,
                            currency: tokenType,
                            network: network,
                            status: 0
                        }
                        dispatch(setListedToken(listedData))
                    })
                    .on("error", (err) => {
                        toast.warning(err.message)
                    })
            }

        }
    }

    return (
        <Styles>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title className="font-small">List for sell</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4" style={{ padding: '1.5rem !important' }}>
                    {
                        network === 'bsc' && <div className="text-left mx-3 mt-3 font-small">
                            <Form.Check
                                inline
                                label="Native"
                                name="group1"
                                type="radio"
                                className="d-flex align-items-center float-left"
                                onChange={(e) => setTokenType(1)}
                                value={tokenType}
                            />
                            <Form.Check
                                inline
                                label="GOLF Token"
                                name="group1"
                                type="radio"
                                className="d-flex align-items-center"
                                onChange={(e) => setTokenType(2)}
                                value={tokenType}
                            />
                        </div>
                    }
                    <div className="text-left mx-3 mt-3 font-small">Price </div>
                    <div className="mx-3 mb-3">
                        <Form.Control size="sm" className="font-small" type="number" placeholder="0" onChange={(e) => setPrice(e.target.value)} />
                    </div>
                    <div className="text-left mx-3 mt-3 font-small">Fees </div>
                    <div className="font-very-small mx-3 mb-3">
                        Listing is free! At the time of the sale, the following fees will be deducted.
                    </div>
                    <div className="mx-3 d-flex justify-content-between align-items-center">
                        <span className="font-very-small">GOLFPUNK Fee({tokenType === 1 ? '5%' : '0%'})</span>
                        {
                            tokenType === 1 ? (
                                <span className="font-very-small">{Number(parseFloat(price * 0.05).toFixed(4))}&nbsp;{network === 'ether' ? 'ETH' : 'BNB'}</span>
                            ) : (
                                <span className="font-very-small">0 GOLF</span>
                            )
                        }
                    </div>
                    <div className="mx-3 mt-2 d-flex justify-content-between align-items-center">
                        <span className="font-very-small">You Get</span>
                        {
                            tokenType === 1 ? (
                                <span className="font-very-small">
                                    {Number(parseFloat(price * 0.95).toFixed(4))}&nbsp;{network === 'ether' ? 'ETH' : 'BNB'}
                                </span>
                            ) : (
                                <span className="font-very-small">
                                    {price}&nbsp;GOLF
                                </span>
                            )
                        }
                    </div>
                    <div className="mx-3 my-3">
                        <Form.Group id="formGridCheckbox">
                            <Form.Check
                                type="checkbox"
                                label="I approve GOLFPUNK's Terms & Conditions"
                                className={`d-flex align-items-center font-very-small ${invalidClass && 'invalid-feedback'}`}
                                onChange={(e) => setApproveTerms(e.target.checked)}
                            />
                        </Form.Group>
                    </div>
                    <div className="mb-3 mx-3">
                        <Button variant="primary" className="w-100 btn-large" onClick={(e) => handlePost(e)} style={{ padding: '0.5rem 0.6rem !important' }}>
                            Post Your Listing
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
        </Styles>
    )
}

export default ListSellModal