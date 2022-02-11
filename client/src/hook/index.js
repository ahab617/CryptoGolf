import { ethers } from "ethers";
import { Contract } from "@ethersproject/contracts";
import { useContractFunction, useContractCall } from "@usedapp/core";
import contractEthereumABI from '../abi/etherContract.json'
import contractBinanceABI from "../abi/binanceContract.json"
import { EthereumContractAddress, BinanceContractAddress } from "../contracts/address";

// const contractInterface = new ethers.utils.Interface(contractEthereumABI);
// const contract = new Contract(EthereumContractAddress, contractInterface);

export function useContractMethod(methodName, chainId) {
  const contractInterface = new ethers.utils.Interface(chainId === 3 ? contractEthereumABI : contractBinanceABI);
  const contract = new Contract(chainId === 3 ? EthereumContractAddress : BinanceContractAddress, contractInterface);

  const { state, send } = useContractFunction(contract, methodName, {});
  return { state, send };
}

export function useBaseImgURI(chainId) {
  const baseImgURI = useContractCall({
    abi: chainId === 3 ? contractEthereumABI : contractBinanceABI,
    address: chainId === 3 ? EthereumContractAddress : BinanceContractAddress,
    method: "baseImgURI",
    args: [],
  }) ?? "";
  return baseImgURI;
}