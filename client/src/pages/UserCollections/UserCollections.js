import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Web3 from "web3";
import axios from "axios";
import { Col, Container, Row, InputGroup, FormControl, Form, Button, Overlay, Tooltip, Dropdown } from "react-bootstrap";
import { useParams } from "react-router";
import { IoIosArrowDown } from 'react-icons/io'
import { FaCopy, FaSearch } from "react-icons/fa"
import { MdRefresh } from 'react-icons/md'
import Loader from 'react-loader-spinner';
import { Styles } from "./styles";

import MarketCard from "../../component/Card/MarketCard";

import { EthereumContractAddress, BinanceContractAddress } from "../../contracts/address"
import etherContractAbi from '../../abi/etherContract.json'
import binanceContractAbi from '../../abi/binanceContract.json'
import { toast } from "react-toastify";

const UserCollections = () => {
    const { address } = useParams()
    const target = useRef(null);
    const sortMenuRef = useRef();

    const { walletAddress, chainId } = useSelector(state => state.connect)
    const [ethPrice, setEthPrice] = useState(0)
    const [bscPrice, setBscPrice] = useState(0)
    const [sortKey, setSortKey] = useState("Listed")
    const [ownerTokens, setOwnerTokens] = useState([])
    const [show, setShow] = useState(false)
    const tokenName = "CryptoGolf"

    useEffect(() => {
        if (walletAddress !== null) {
            getOwnerCollections()
        }
    }, [walletAddress])

    useEffect(() => {
        if (walletAddress !== null) {
            handleSort()
        }
    }, [walletAddress, sortKey])

    const handleSort = () => {
        switch (sortKey) {
            case "Listed":
                setOwnerTokens([
                    ...ownerTokens.sort((a, b) => {
                        return parseInt(b.listTime) - parseInt(a.listTime)
                    })
                ])
                break;
            case "Sold":
                setOwnerTokens([
                    ...ownerTokens.sort((a, b) => {
                        return parseInt(b.lastSoldTime) - parseInt(a.lastSoldTime)
                    })
                ])
                break;
            case "LH":
                setOwnerTokens([
                    ...ownerTokens.sort((a, b) => {
                        return parseFloat(a.listPrice) - parseFloat(b.listPrice)
                    })
                ])
                break;
            case "HL":
                setOwnerTokens([
                    ...ownerTokens.sort((a, b) => {
                        return parseFloat(b.listPrice) - parseFloat(a.listPrice)
                    })
                ])
                break;
            case "Sale":
                setOwnerTokens([
                    ...ownerTokens.sort((a, b) => {
                        return parseFloat(b.lastSoldPrice) - parseFloat(a.lastSoldPrice)
                    })
                ])
                break;
            default:
                break;
        }
    }

    const getOwnerCollections = async () => {
        setOwnerTokens([])
        let web3 = new Web3(new Web3.providers.HttpProvider(process.env.REACT_APP_ETHER_RPC_URL))
        let contract = new web3.eth.Contract(etherContractAbi, EthereumContractAddress);
        let tokenPrice = await contract.methods.getTokenPrice().call();
        setEthPrice(Web3.utils.fromWei(Number(tokenPrice).toString(), 'ether'))
        let etherTokenData = await contract.methods.getOwnerTokens(address).call();
        etherTokenData = JSON.parse(etherTokenData)

        web3 = new Web3(new Web3.providers.HttpProvider(process.env.REACT_APP_BSC_RPC_URL))
        contract = new web3.eth.Contract(binanceContractAbi, BinanceContractAddress);
        tokenPrice = await contract.methods.getTokenPrice().call();
        setBscPrice(Web3.utils.fromWei(Number(tokenPrice).toString(), 'ether'))
        let bscTokenData = await contract.methods.getOwnerTokens(address).call();
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
                listTime: Number(tokenData[i].listPrice.split(",")[2]),
            })
        }
        setOwnerTokens(token_metadata)
    }

    const handleSearch = async (e) => {
        if (walletAddress !== null && (chainId === 1 || chainId === 3 || chainId === 56 || chainId === 97)) {
            if (e.target.value === "") {
                getOwnerCollections()
            } else {
                const filteredToken = ownerTokens.filter(t => parseInt(t.token_id) === parseInt(e.target.value))
                if (filteredToken.length === 0) {
                    toast.warning("Token ID of current user does not exist")
                    return;
                }
                setOwnerTokens(filteredToken)
            }
        }
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(address)
        setShow(true)
        setTimeout(() => {
            setShow(false)
        }, 3000)
    }

    return (
        <Styles>
            <Container>
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
                <Row>
                    <Col lg="12" xs={12} className="text-center color-grey font-big my-2">
                        {address && `${address.slice(0, 6)}...${address.slice(
                            address.length - 4,
                            address.length
                        )}`}
                    </Col>
                    <Col lg="12" xs={12} className="text-center font-small color-grey d-flex justify-content-center align-items-center">
                        <div>{address && `${address.slice(0, 6)}...${address.slice(
                            address.length - 4,
                            address.length
                        )}`} &emsp;</div>
                        <div className="position-relative">
                            <Button ref={target} variant="outline-primary" className="background-transparent border-none" onClick={handleCopy}>
                                <FaCopy className="color-grey text-right cursor-pointer" />
                            </Button>
                            <Overlay target={target.current} show={show} placement="bottom">
                                {(props) => (
                                    <Tooltip className="font-very-small" id="overlay-example" {...props}>
                                        Copied
                                    </Tooltip>
                                )}
                            </Overlay>
                        </div>
                    </Col>
                    <Col lg="12" xs="12" className="border-1 border-grey p-3 mt-4">
                        <Row>
                            <Col lg="9" xs="12">
                                <InputGroup>
                                    <InputGroup.Text className="background-transparent border-grey color-grey font-small"><FaSearch /></InputGroup.Text>
                                    <FormControl
                                        className="background-transparent border-grey color-grey"
                                        size="sm"
                                        placeholder="Search ID"
                                        onChange={handleSearch}
                                    />
                                </InputGroup>
                            </Col>
                            <Col lg="3" xs="12" className="d-flex align-items-center justify-content-end px-1 desktop-menu">
                                {/* <Form.Select aria-label="Default select example" className="filter-select background-transparent color-grey font-small border-grey">
                                    <option className="background-transparent font-small color-grey">Recently Listed</option>
                                    <option className="background-transparent font-small color-grey" value="1">Recently Sold</option>
                                    <option className="background-transparent font-small color-grey" value="2">Price (Lowest to highest)</option>
                                    <option className="background-transparent font-small color-grey" value="2">Price (Highest to lowest)</option>
                                    <option className="background-transparent font-small color-grey" value="3">Highest Last Sale</option>
                                </Form.Select> */}
                                <Dropdown align="end" className="mx-2">
                                    <Dropdown.Toggle variant="primary" ref={sortMenuRef} className="background-transparent px-3">
                                        Recently Listed <IoIosArrowDown />
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.Item className="text-left color-grey" onClick={() => setSortKey("Listed")}>Recently Listed</Dropdown.Item>
                                        <Dropdown.Item className="text-left color-grey" onClick={() => setSortKey("Sold")}>Recently Sold</Dropdown.Item>
                                        <Dropdown.Item className="text-left color-grey" onClick={() => setSortKey("LH")}>Price (Lowest to highest)</Dropdown.Item>
                                        <Dropdown.Item className="text-left color-grey" onClick={() => setSortKey("HL")}>Price (Highest to lowest)</Dropdown.Item>
                                        <Dropdown.Item className="text-left color-grey" onClick={() => setSortKey("Sale")}>Highest Last Sale</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                                <Button varian="link" className="background-transparent color-grey border-grey mx-1 font-small">
                                    <MdRefresh onClick={() => getOwnerCollections()} />
                                </Button>
                            </Col>
                            <Col lg="12" xs="12" className="mt-3">
                                {
                                    ownerTokens.length > 0 ? (
                                        <Row>
                                            {ownerTokens.map((data, index) => (
                                                <Col lg="2" xs="2" key={index} className="my-1">
                                                    <Link className="text-decoration-none" to={`/assets/${data.network}/${data.network === 'ether' ? EthereumContractAddress : BinanceContractAddress}/${data.token_id}`}>
                                                        <MarketCard data={data} tokenName={tokenName} ethPrice={ethPrice} bscPrice={bscPrice} />
                                                    </Link>
                                                </Col>
                                            ))}
                                        </Row>
                                    ) : (
                                        walletAddress !== null && (
                                            <Row>
                                                <Col className="text-center color-grey font-small">
                                                    <Loader type="ThreeDots" color="green" height="200px" width="100" />
                                                </Col>
                                            </Row>
                                        )
                                    )
                                }
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </Styles>
    )
}

export default UserCollections;