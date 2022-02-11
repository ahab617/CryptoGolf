// import { pinFileToIPFS } from "./pinata.js"

export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const chain = await window.ethereum.request({ method: 'eth_chainId' })
      if (parseInt(chain, 16) === 3 || parseInt(chain, 16) === 4 || parseInt(chain, 16) === 97) {
        const addressArray = await window.ethereum.request({
          method: 'eth_requestAccounts',
        })
        if (addressArray.length > 0) {  //success
          return {
            address: addressArray[0],
            status: "👆🏽 You can mint now.",
            success: true,
            chainId: parseInt(chain, 16)
          }
        } else {  //failed
          return {
            address: "",
            status: "Failed to connect wallet",
            success: false
          }
        }
      } else {
        window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: 1 }],
        })
        return {
          address: "",
          status: "Please connect with Ethereum or Binance Smart Chain",
          success: false
        }
      }
      
    } catch (err) {
      return {
        address: "",
        status: err.message,
        success: false
      }
    }
  } else {
    return {
        address: "",
        status: "Please install Metamask",
        success: false
      }
  }
}

export const getCurrentWalletConnected = async (chainId) => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_accounts",
      })
      const chain = await window.ethereum.request({
        method: "eth_chainId",
      })
      if (addressArray.length > 0 && chain === chainId) {
        return {
          address: addressArray[0],
          status: "👆🏽 You can mint new pack now.",
        }
      } else {
        return {
          address: "",
          status: "Connect to Metamask and choose the correct chain using the top right button.",
        }
      }
    } catch (err) {
      return {
        address: "",
        status: err.message,
      }
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          <p>
            {" "}
            🦊{" "}
            {/* <a target="_blank" href={`https://metamask.io/download.html`}> */}
            ¡¡¡CryptoETS CAN ONLY BE MINTED FROM PC!!!
            {/* </a> */}
          </p>
        </span>
      ),
    }
  }
}

export const upload = async() => {
  const reader = new FileReader()
  reader.onloadend = function() {
    console.log(reader.result)

    // const buf = buffer.Buffer(reader.result) // Convert data into buffer
  }
  // const sdf = await pinFileToIPFS('nft.png')
  // const photo = document.getElementById("photo")
  // reader.readAsArrayBuffer(photo.files[0]) // Read Provided File
}