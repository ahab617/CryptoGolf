import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import Web3 from "web3"
import { Modal, Button, Form } from "react-bootstrap"
import { toast } from "react-toastify"
import { Styles } from "./styles"
import etherContractAbi from '../../abi/etherContract.json'
import binanceContractAbi from '../../abi/binanceContract.json'
import golfContractAbi from '../../abi/golfContract.json'
import { BinanceContractAddress, GOLFContractAddress } from "../../contracts/address"
import { setHistory, setOffer } from "../../redux/actions"

const OfferModal = ({
    show,
    handleClose,
    accountBalance,
    network,
    contractAddress,
    walletAddress,
    tokenId,
    owner,
    handleOfferSuccess
}) => {
    const dispatch = useDispatch(null)
    const [offerPrice, setOfferPrice] = useState(0)
    const [approved, setApproved] = useState(false)
    const [invalidClass, setInvalidClass] = useState(false)
    const [tokenType, setTokenType] = useState(1)
    const [golfBalance, setGolfBalance] = useState(0)
    const [golfDecimals, setGolfDecimals] = useState(0)

    const { chainId } = useSelector(state => state.connect)

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
        const contractABI = network === 'ether' ? etherContractAbi : binanceContractAbi

        const contract = new window.web3.eth.Contract(contractABI, contractAddress);
        return contract;
    }

    const handlePlaceOffer = async (e) => {
        if (offerPrice === 0 || offerPrice === '') {
            toast.warning("Please input your offer price");
            return;
        }
        if (tokenType === 0 && network === 'bsc') {
            toast.warning("Please select payment type")
        }
        if (!approved) {
            setInvalidClass(true)
            return;
        }

        handleClose(e)

        const contract = await getContract();
        const timestamp = new Date().getTime()
        if (tokenType === 1) {
            await contract.methods.placeOffer(tokenId, timestamp)
                .send({
                    from: walletAddress,
                    value: Web3.utils.toWei(offerPrice.toString())
                })
                .on("receipt", (receipt) => {
                    toast("Offer success")
                    const data = {
                        tokenId: tokenId,
                        event: "Offer",
                        from: walletAddress,
                        to: owner,
                        price: offerPrice,
                        currency: 1,
                        network: network
                    }
                    dispatch(setHistory(data))
                    const offerData = {
                        tokenId: tokenId,
                        owner: owner,
                        buyer: walletAddress,
                        price: offerPrice,
                        currency: 1,
                        network: network,
                        status: 0
                    }
                    dispatch(setOffer(offerData))
                    handleOfferSuccess()
                })
                .on("error", (err) => {
                    toast.warning(err.message)
                })
        } else {
            const golfContract = new window.web3.eth.Contract(golfContractAbi, GOLFContractAddress);
            await golfContract.methods.approve(BinanceContractAddress, offerPrice * Math.pow(10, golfDecimals))
                .send({
                    from: walletAddress
                })
                .on("receipt", async (receipt) => {
                    await contract.methods.placeOfferWithGolf(tokenId, offerPrice, timestamp)
                        .send({
                            from: walletAddress
                        })
                        .on("receipt", (receipt) => {
                            toast("Offer success")
                            const data = {
                                tokenId: tokenId,
                                event: "Offer",
                                from: walletAddress,
                                to: owner,
                                price: offerPrice,
                                currency: 2,
                                network: network
                            }
                            dispatch(setHistory(data))
                            handleOfferSuccess()
                        })
                        .on("error", (err) => {
                            toast.warning(err.message)
                        })
                })
                .on("error", (err) => {
                    toast.warning(err.message)
                })

        }
    }

    return (
        <Styles>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title className="font-small">Place an Offer</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4" style={{ padding: '1.5rem !important' }}>
                    {
                        (chainId === 56 || chainId === 97) && <div className="text-left mx-4 mt-3 font-small">
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
                    <div className="text-left mx-4 mt-3 font-small">Price </div>
                    <div className="mx-4 mb-3">
                        <Form.Control
                            size="sm"
                            className="font-small"
                            type="text"
                            placeholder="0"
                            onChange={(e) => setOfferPrice(e.target.value)}
                        />
                    </div>
                    <div className="text-left mx-4 mt-3 font-small">Offer Details </div>
                    <div className="font-very-small mx-4 mb-3">
                        All transactions are placed in WBNB, NFTrade automatically convert your BNB to WBNB. Please review the conversion summary below.
                    </div>
                    <div className="mx-4 d-flex justify-content-between align-items-center">
                        <span className="font-small">Your Balance</span>
                        <span className="font-small">{tokenType === 1 ? accountBalance : golfBalance + ' GOLF'}</span>
                    </div>
                    <div className="mx-4 my-2">
                        <Form.Group id="formGridCheckbox">
                            <Form.Check
                                type="checkbox"
                                label="I approve GOLFPUNK's Terms & Conditions"
                                className={`d-flex align-items-center font-very-small ${invalidClass && `invalid-feedback`}`}
                                onChange={(e) => setApproved(e.target.checked)}
                            />
                        </Form.Group>
                    </div>
                    <div className="mb-3 mx-4">
                        <Button
                            variant="primary"
                            className="w-100 btn-large"
                            onClick={handlePlaceOffer}
                        >
                            Place Your Offer
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
        </Styles>
    )
}

export default OfferModal