import { Modal, Button, Form } from "react-bootstrap"
import Web3 from "web3"
import { Styles } from "./styles"
import { EthereumContractAddress, BinanceContractAddress, GOLFContractAddress } from "../../contracts/address"
import etherContractAbi from '../../abi/etherContract.json'
import binanceContractAbi from '../../abi/binanceContract.json'
import golfContractAbi from '../../abi/golfContract.json'
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { setHistory, updateListHistory, cancelOffers } from "../../redux/actions"

const BuyModal = ({
    show,
    handleClose,
    data,
    tokenName,
    listedPrice,
    listedType,
    network,
    tokenId,
    handleSuccess,
    owner,
    offers
}) => {
    const dispatch = useDispatch(null)
    const { chainId, walletAddress } = useSelector(state => state.connect)

    const [approved, setApproved] = useState(false)
    const [invalidClass, setInvalidClass] = useState(false)

    useEffect(() => {
        setInvalidClass(false)
    }, [])

    const onClickCheckout = async (e) => {
        if (chainId === 1 || chainId === 3 || chainId === 56 || chainId === 97) {
            if (!approved) {
                setInvalidClass(true)
                return;
            }
            handleClose(e)
            const current_time = new Date().getTime()

            if (listedType === 2) {
                const golfContract = new window.web3.eth.Contract(golfContractAbi, GOLFContractAddress)
                const decimals = await golfContract.methods.decimals().call()
                await golfContract.methods.approve(BinanceContractAddress, listedPrice * Math.pow(10, decimals))
                    .send({
                        from: walletAddress
                    })
                    .on("receipt", async (receipt) => {
                        toast("Approve success")
                        const contract = getContract();
                        await contract.methods.buyNFTWithGolf(tokenId, listedPrice, current_time)
                            .send({
                                from: walletAddress
                            })
                            .on("receipt", (receipt) => {
                                toast("Buy success!")
                                handleSuccess()
                                const hist1 = {
                                    tokenId: tokenId,
                                    event: "Transfer",
                                    from: owner,
                                    to: data.buyer,
                                    price: listedPrice,
                                    currency: listedType,
                                    network: network
                                }
                                dispatch(setHistory(hist1))
                                const hist2 = {
                                    tokenId: tokenId,
                                    event: "Sold",
                                    from: owner,
                                    to: data.buyer,
                                    price: listedPrice,
                                    currency: listedType,
                                    network: network
                                }
                                dispatch(setHistory(hist2))
                                const listedData = {
                                    tokenId: tokenId,
                                    owner: owner,
                                    network: network,
                                    status: 1
                                }
                                dispatch(updateListHistory(listedData))
                                const data1 = {
                                    tokenId: tokenId,
                                    owner: owner,
                                    network: network
                                }
                                dispatch(cancelOffers(data1))
                            })
                            .on("error", (err) => {
                                toast.warning(err.message)
                            })
                    })
                    .on("error", (err) => {
                        toast.warning(err.message);
                    })
            } else {
                const contract = getContract();
                await contract.methods.buyNFT(tokenId, current_time)
                    .send({
                        from: walletAddress,
                        value: Web3.utils.toWei(Number(listedPrice).toString())
                    })
                    .on("receipt", (receipt) => {
                        toast("Buy success!")
                        handleSuccess()
                        const hist1 = {
                            tokenId: tokenId,
                            event: "Transfer",
                            from: owner,
                            to: walletAddress,
                            price: listedPrice,
                            currency: listedType,
                            network: network
                        }
                        dispatch(setHistory(hist1))
                        const hist2 = {
                            tokenId: tokenId,
                            event: "Sold",
                            from: owner,
                            to: walletAddress,
                            price: listedPrice,
                            currency: listedType,
                            network: network
                        }
                        dispatch(setHistory(hist2))
                        const listedData = {
                            tokenId: tokenId,
                            owner: owner,
                            network: network,
                            status: 1
                        }
                        dispatch(updateListHistory(listedData))
                        const data1 = {
                            tokenId: tokenId,
                            owner: owner,
                            network: network
                        }
                        dispatch(cancelOffers(data1))
                    })
                    .on("error", (err) => {
                        toast.warning(err.message)
                    })
            }
        }
    }

    const getContract = () => {
        const contractAddress = network === 'ether' ? EthereumContractAddress : BinanceContractAddress
        const contractABI = network === 'ether' ? etherContractAbi : binanceContractAbi

        const contract = new window.web3.eth.Contract(contractABI, contractAddress);
        return contract;
    }

    return (
        <Styles>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title className="font-small">Buy Now</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4" style={{ padding: '1.5rem !important' }}>
                    <p className="text-left mx-4 my-3 font-small">Here's a summary of your purchase: </p>
                    <div className="d-flex align-items-center mx-4 my-3">
                        <img src={data.image_original_url} alt="" width="50px" />
                        <div className=" ml-4">
                            <p className="mb-2 text-left font-small">{tokenName}</p>
                            <p className="text-left font-small mb-0">{data.name}</p>
                        </div>
                    </div>
                    <hr className="mx-4" />
                    <div className="mx-4 d-flex justify-content-between align-items-center">
                        <span className="font-small">Total</span>
                        {
                            listedType === 1 ? (
                                <span className="font-small">{listedPrice}&nbsp;{network === "ether" ? "ETH" : "BNB"}</span>
                            ) : (
                                <span className="font-small">{listedPrice}&nbsp;GOLF</span>
                            )
                        }
                    </div>
                    <div className="mx-4 my-3">
                        <Form.Group id="formGridCheckbox">
                            <Form.Check
                                type="checkbox"
                                label="I approve GOLFPUNK's Terms & Conditions"
                                className={`d-flex align-items-center font-very-small ${invalidClass && 'invalid-feedback'}`}
                                onChange={(e) => setApproved(e.target.checked)}
                            />
                        </Form.Group>
                    </div>
                    <div className="mb-3 mx-4">
                        <Button variant="primary" className="w-100 btn-large" onClick={(e) => onClickCheckout(e)}>
                            Checkout
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
        </Styles>
    )
}

export default BuyModal