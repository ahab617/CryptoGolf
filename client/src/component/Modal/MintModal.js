import { useState } from 'react';
import { Form, Modal } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { utils } from 'ethers'
import { Styles } from './styles';
import { setMintHistory } from '../../redux/actions';
import { EthereumContractAddress, BinanceContractAddress } from '../../contracts/address';
import etherContractAbi from '../../abi/etherContract.json'
import binanceContractAbi from '../../abi/binanceContract.json'
import Lock from '../../assets/images/lock.png';

const MintModal = ({ openModal, hideModal }) => {
    const dispatch = useDispatch()
    const { chainId, walletAddress, tokenPrice } = useSelector(state => state.connect)
    const [mint_count, setMintCount] = useState(1)

    const handleMinus = () => {
        if (parseInt(mint_count) <= 1) {
            setMintCount(1)
            return;
        } else {
            setMintCount(parseInt(mint_count) - 1)
        }
    }

    const handlePlus = () => {
        if (parseInt(mint_count) >= 5) {
            setMintCount(5)
            return;
        } else {
            setMintCount(parseInt(mint_count) + 1)
        }
    }

    const getContract = (chain_id) => {
        const contractAddress = (chain_id === 1 || chain_id === 3) ? EthereumContractAddress : BinanceContractAddress
        const contractABI = (chain_id === 1 || chain_id === 3) ? etherContractAbi : binanceContractAbi

        const contract = new window.web3.eth.Contract(contractABI, contractAddress);
        return contract;
    }

    const onMintNFT = async () => {
        if (chainId !== 3 && chainId !== 97 && chainId !== 1 && chainId !== 56) { // Ethereum
            toast.warning("Please connect with Ethereum or Binance Smart Chain");
            return;
        }
        if (mint_count === '') {
            toast.warning("Please input mint count")
            return;
        }
        if (parseInt(mint_count) < 1 || parseInt(mint_count) > 5) {
            toast.warning("You can only mint up tp 1-5 NFTs")
            return;
        }
        hideModal()
        const eth_amount = parseFloat(tokenPrice * mint_count).toFixed(4)
        const nftContract = getContract(chainId);
        const totalSupply = await nftContract.methods.totalSupply().call()

        const current_time = new Date().getTime()
        await nftContract.methods.mintNFT(mint_count, current_time)
            .send({
                from: walletAddress,
                value: utils.parseEther(eth_amount.toString())
            })
            .on("receipt", async (receipt) => {

                let status = "Mint Success!"
                toast(status);

                const data = {
                    totalSupply: totalSupply,
                    mintCount: mint_count,
                    event: "Mint",
                    from: '0x0000...0000',
                    to: walletAddress,
                    price: '',
                    currency: 1,
                    network: (chainId === 1 || chainId === 3) ? 'ether' : 'bsc'
                }
                dispatch(setMintHistory(data))
            })
            .on("error", (err) => {
                let status = err.message;
                toast.warning(status);
            })
    }

    return (
        <Styles>
            <Modal show={openModal} onHide={hideModal} className="mint_modal">
                <Modal.Header>
                    <div className="text-center w-100">
                        <span className="Tanker color-white">MINT</span>&nbsp;
                        <span className="Tanker color-green">GOLFPUNKS</span>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div className="text-center p-4 d-flex">
                        <button
                            type="button"
                            className="btn btn-primary background-white color-black border-top border-bottom border-left border-right"
                            onClick={handleMinus}
                        >-</button>
                        <Form.Control
                            type="number"
                            size="sm"
                            className="font-small"
                            value={mint_count}
                            onChange={(e) => setMintCount(e.target.value)}
                            min={1}
                            max={5}
                        />
                        <button
                            type="button"
                            className="btn btn-primary background-white color-black border-top border-bottom border-left border-right"
                            onClick={handlePlus}
                        >+</button>
                    </div>
                </Modal.Body>
                <Modal.Footer className="text-center py-2">
                    <div className="w-100">
                        <button type="button" className="btn btn-login-wallet Tanker" onClick={onMintNFT}>
                            <img src={Lock} alt="" className="wallet-lock" width="0.8rem" />&nbsp;MINT NOW
                        </button>
                    </div>
                </Modal.Footer>
            </Modal>
        </Styles>
    )
}

export default MintModal