import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Web3 from 'web3';
import Loader from 'react-loader-spinner';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from './component/Header/Header';
import Footer from './component/Footer/Footer';
import Landing from './pages/Landing/Landing';
import MyCollections from './pages/MyCollections/MyCollections';
import MarketPlace from './pages/Marketplace/MarketPlace';
import TokenDetail from './pages/TokenDetail/TokenDetail';
import UserCollections from './pages/UserCollections/UserCollections'
import MintModal from './component/Modal/MintModal';

import {
  REMOVE_TOGGLE_STICKY,
  SET_TOGGLE_STICKY,
  SET_WALLET_ADDRESS,
  SET_CHAIN_ID,
  SET_CONNECTED,
  SET_ACCOUNT_BALANCE,
  SET_TOKEN_PRICE
} from "./redux/types";
import {
  EthereumContractAddress,
  BinanceContractAddress
} from './contracts/address';
import etherContractAbi from './abi/etherContract.json';
import binanceContractAbi from './abi/binanceContract.json';

import { connectUser } from './redux/actions'

import './App.css';
import Terms from './pages/Terms/Terms';
import MyAccount from './pages/MyAccount/MyAccount';

function App() {

  const dispatch = useDispatch();

  const Web3Modal = window.Web3Modal.default;
  const WalletConnectProvider = window.WalletConnectProvider.default;

  const { toggle_sticky, pending } = useSelector(state => state.connect);
  const [openMint, setOpenMint] = useState(false)

  useEffect(() => {
    const initWalletConnect = () => {

      const providerOptions = {
        disableInjectedProvider: true,
        injected: {
          display: {
            name: "MetaMask",
            description: "For Desktop Web Wallets",
          },
          package: null,
        },
        walletconnect: {
          display: {
            name: "WalletConnect",
            description: "For Mobile App Wallets",
          },
          package: WalletConnectProvider,
          options: {
            // infuraId: "40bd58898adb4907b225865d9cedcd4a",   //mainnet
            rpc: {
              56: 'https://bsc-dataseed.binance.org/'
            },
            network: "binance", // here
          },
          network: 'mainnet',
        },
      };

      let web3ModalObj = new Web3Modal({
        // network: "mainnet",
        cacheProvider: true,
        providerOptions,
      });
      window.web3Modal = web3ModalObj
    }
    initWalletConnect();
  }, [WalletConnectProvider, Web3Modal])

  const fetchAccountData = async () => {
    const web3Obj = new Web3(window.provider);
    window.web3 = web3Obj;

    let chain_id = await web3Obj.eth.getChainId();

    if (chain_id === 3 || chain_id === 97 || chain_id === 1 || chain_id === 56) {
      const accounts = await web3Obj.eth.getAccounts();
      dispatch({
        type: SET_CHAIN_ID,
        payload: chain_id
      })
      dispatch({
        type: SET_WALLET_ADDRESS,
        payload: accounts[0]
      })

      connectContract(accounts[0], chain_id);
      dispatch({
        type: SET_CONNECTED,
        payload: true
      })
    } else {
      dispatch({
        type: SET_CONNECTED,
        payload: false
      })
      toast.warning("Please connect with Ethereum or Binance Smart Chain net");
    }
  }

  const getContract = (chain_id) => {
    const contractAddress = (chain_id === 1 || chain_id === 3) ? EthereumContractAddress : BinanceContractAddress
    const contractABI = (chain_id === 1 || chain_id === 3) ? etherContractAbi : binanceContractAbi

    const contract = new window.web3.eth.Contract(contractABI, contractAddress);
    return contract;
  }

  const connectContract = async (accountID, chain_id) => {
    const nftContract = getContract(chain_id);

    const userBalance = await window.web3.eth.getBalance(accountID);
    let userBalanceInEth;
    if (chain_id === 97 || chain_id === 56) {
      userBalanceInEth = await parseFloat(window.web3.utils.fromWei(userBalance, "ether")).toFixed(4).toString() + " BNB";
    } else {
      userBalanceInEth = await parseFloat(window.web3.utils.fromWei(userBalance, "ether")).toFixed(4).toString() + " ETH";
    }
    dispatch({
      type: SET_ACCOUNT_BALANCE,
      payload: userBalanceInEth
    })

    let nftPrice = await nftContract.methods.tokenPrice().call();
    nftPrice = await parseFloat(window.web3.utils.fromWei(nftPrice, "ether")).toFixed(4).toString();

    const data = {
      address: accountID
    }
    dispatch(connectUser(data))

    dispatch({
      type: SET_TOKEN_PRICE,
      payload: nftPrice
    })
  }

  const onConnect = async () => {
    let providerObj;
    try {
      providerObj = await window.web3Modal.connect();
      window.provider = providerObj
      await window.web3Modal.toggleModal();
    } catch (e) {
      toast("Could not get a wallet connection");
      return;
    }
    providerObj.on("accountsChanged", (accounts) => {
      console.log("accountsChanged")
      fetchAccountData();
    });
    providerObj.on("chainChanged", (chain_id) => {
      console.log("chainChanged")
      fetchAccountData();
    });

    providerObj.on("disconnect", (error) => {
      console.log("disconnect")
      onDisconnect();
    });
    await fetchAccountData();
  }

  const onDisconnect = async () => {

    if (window.provider.close) {
      await window.provider.close();
      await window.web3Modal.clearCachedProvider();
      window.provider = null;
    }

    dispatch({
      type: SET_WALLET_ADDRESS,
      payload: null
    });
    dispatch({
      type: SET_CONNECTED,
      payload: false
    })
  }

  const handleToggleSticky = (e) => {
    if (e.target.checked) {
      dispatch({
        type: SET_TOGGLE_STICKY
      })
    } else {
      dispatch({
        type: REMOVE_TOGGLE_STICKY
      })
    }
  }

  return (
    <Router>
      <div className="App position-relative">
        {
          pending && <div className="mask"></div>
        }

        <Header
          connectWallet={onConnect}
          onMintNFT={() => setOpenMint(true)}
          disconnectWallet={onDisconnect}
        />
        {
          pending && <div
            style={{
              position: 'absolute',
              width: "100%",
              height: "100%",
              minHeight: "600px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Loader type="ThreeDots" color="green" height="100" width="100" />
          </div>
        }
        <Switch>

          <Route exact path="/" component={() =>
            <Landing
              handleConnect={onConnect}
              handleDisconnect={onDisconnect}
              handleMint={() => setOpenMint(true)}
            />
          } />

          <Route exact path="/mygolfpunks" component={() =>
            <MyCollections />
          } />

          <Route exact path="/marketplace" component={() => <MarketPlace handleExit={onDisconnect} />} />

          <Route exact path="/assets/:net/:contractAddress/:tokenId" component={TokenDetail} />

          <Route exact path="/users/:address" component={UserCollections} />

          <Route exact path="/terms" component={Terms} />

          <Route exact path="/account" component={MyAccount} />

        </Switch>

        <Footer
          openConnectMetaMaskModal={onConnect}
          onMintNFT={() => setOpenMint(true)}
          disconnectWallet={onDisconnect}
        />

        <div className="switch">
          <label>
            <input type="checkbox" checked={toggle_sticky} onChange={handleToggleSticky} />  - Toggle Sticky
          </label>
        </div>

        <ToastContainer />
        {
          openMint && <MintModal openModal={openMint} hideModal={() => setOpenMint(false)} />
        }


      </div>
    </Router>
  );
}

export default App;
