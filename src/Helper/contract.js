import { ethers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';

export const checkCorrectNetwork = async (chainName) => {
  const provider = await detectEthereumProvider();
  if(chainName === "matic") {
    if (provider.networkVersion !== parseInt(process.env.REACT_APP_CHAIN_ID_MATIC)) {
      try {
        await provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: ethers.utils.hexValue(parseInt(process.env.REACT_APP_CHAIN_ID_MATIC)) }],
        });
      } catch (err) {
        if (err.code === 4902) {
          await provider.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainName: process.env.REACT_APP_CHAIN_NAME_MATIC,
                chainId: ethers.utils.hexValue(parseInt(process.env.REACT_APP_CHAIN_ID_MATIC)),
                nativeCurrency: { name: "MATIC", decimals: 18, symbol: "MATIC" },
                rpcUrls: [process.env.REACT_APP_RPC_URL_MATIC],
              },
            ],
          });
        }
      }
    }
  }
  else if(chainName === "eth") {
    if (provider.networkVersion !== parseInt(process.env.REACT_APP_CHAIN_ID_ETH)) {
      try {
        await provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: ethers.utils.hexValue(parseInt(process.env.REACT_APP_CHAIN_ID_ETH)) }],
        });
      } catch (err) {
        if (err.code === 4902) {
          await provider.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainName: process.env.REACT_APP_CHAIN_NAME_ETH,
                chainId: ethers.utils.hexValue(parseInt(process.env.REACT_APP_CHAIN_ID_ETH)),
                nativeCurrency: { name: "ETH", decimals: 18, symbol: "ETH" },
                rpcUrls: [process.env.REACT_APP_RPC_URL_ETH],
              },
            ],
          });
        }
      }
    }
  }
  };

  export const ConnectWalletHandler = async () => {
    const provider = await detectEthereumProvider();
    if (provider) {
      let addresses = await provider.request({
        method: "eth_requestAccounts",
      });
      let userBalance = await getUserBalance(addresses[0]);
      return [addresses[0], userBalance];
    }
    else {
      alert("Install MetaMask")
      return ["0x0000000000000000000000000000000000000000","0x0"]
    }
  };

  export const accountChangeHandler = async (newAccount) => {
    return newAccount;
  };
  export const getUserBalance = async (address) => {
    const provider = await detectEthereumProvider();
    return await provider.request({
      method: "eth_getBalance",
      params: [address, "latest"],
    });
  };
  export const chainChangedHandler = () => {
    window.location.reload();
  };

  export const checkAndGetAddress = async (chainName) => {
    await checkCorrectNetwork(chainName);
    var returnValue = await ConnectWalletHandler();
    if(returnValue[0])
    return returnValue[0];
    else 
    return null;
  }

  export const isWalletCorrect = async (walletAddress, chainName) => {
    var address = await checkAndGetAddress(chainName);
    return walletAddress === address;

  }