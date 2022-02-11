import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Col, Row } from "react-bootstrap";
import Web3 from 'web3';
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Styles } from "./styles";
import GolfCard from "../../component/Card/GolfCard";
import { BinanceContractAddress, EthereumContractAddress } from "../../contracts/address";
import binanceContractAbi from '../../abi/binanceContract.json'
import ethereumContractAbi from '../../abi/etherContract.json'
// import SellModal from "../../component/Modal/ListSellModal";

const MyCollections = () => {

    const { chainId, walletAddress } = useSelector(state => state.connect)
    const [mygolfs, setMyGolfs] = useState([])
    // const [showSellModal, setShowSellModal] = useState(false)
    // const [network, setNetwork] = useState('ether')

    useEffect(() => {
        const getMyCollections = async () => {
            let web3 = new Web3(new Web3.providers.HttpProvider(process.env.REACT_APP_ETHER_RPC_URL))
            let contract = new web3.eth.Contract(ethereumContractAbi, EthereumContractAddress);
            let etherTokenData = await contract.methods.getOwnerTokens(walletAddress).call();
            etherTokenData = JSON.parse(etherTokenData)

            web3 = new Web3(new Web3.providers.HttpProvider(process.env.REACT_APP_BSC_RPC_URL))
            contract = new web3.eth.Contract(binanceContractAbi, BinanceContractAddress);
            let bscTokenData = await contract.methods.getOwnerTokens(walletAddress).call();
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
                    lastSoldTime: Number(tokenData[i].lastSold.split(",")[2])
                })
            }
            setMyGolfs(token_metadata)
        }
        if (chainId !== 0) {
            if (walletAddress !== null) {
                setMyGolfs([]);
                getMyCollections()
            }
        } else {
            toast.warning("Please connect with Ethereum or Binance Smart Chain");
        }
    }, [walletAddress, chainId])

    return (
        <Styles>
            {/* {
                mygolfs.length > 0 && (
                    <SellModal
                        show={showSellModal} 
                        handleClose={setShowSellModal(false)} 
                        network={network}
                    />
                )
            } */}
            <div className="move container">
                <div className="title-text col-12 Tanker mx-auto text-center">
                    <h2 className="pt-4">
                        <span className="golfpunks-g">G</span>
                        <span className="golfpunks-o">O</span>
                        <span className="golfpunks-l">L</span>
                        <span className="golfpunks-f">F</span>
                        <span className="golfpunks-p">P</span>
                        <span className="golfpunks-u">U</span>
                        <span className="golfpunks-n">N</span>
                        <span className="golfpunks-k">K</span>
                        <span className="golfpunks-s">S</span>
                    </h2>
                </div>
                <Row className="mt-2">
                    {
                        mygolfs.length > 0 && mygolfs.map((g, index) => (
                            <Col md={3} xs={6} sm={4} className="my-2" key={index}>
                                <GolfCard
                                    tokenClass={g.attributes.filter(attr => attr.trait_type === 'Class')[0].value}
                                    image={g.image_original_url}
                                    id={g.token_id}
                                    chainId={g.network}
                                    handleSellClick={(val) => {
                                        // setNetwork(val)
                                        // setShowSellModal(true)
                                    }}
                                />
                            </Col>
                        ))
                    }
                </Row>
            </div>
        </Styles>
    )
}

export default MyCollections;