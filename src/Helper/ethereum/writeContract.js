import { ethers } from "ethers";
import { ddwapp_abi, ddw_token_abi } from "./abi";

export const createDDWAppWriteContractEth = () => {
    try {
        const { ethereum } = window;

        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner()
            const Contract = new ethers.Contract(
                process.env.REACT_APP_DDWAPP_CONTRACT_ADDRESS_ETH,
                ddwapp_abi,
                signer
            );
            return Contract;
        } else {
            console.log("Ethereum object doesn't exist!");
        }
    } catch (error) {
        console.log('write contract', error);
    }
};

export const createDDWTokenWriteContractEth = () => {
    try {
        const { ethereum } = window;

        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner()
            const Contract = new ethers.Contract(
                process.env.REACT_APP_DDWTOKEN_CONTRACT_ADDRESS_ETH,
                ddw_token_abi,
                signer
            );
            return Contract;
        } else {
            console.log("Ethereum object doesn't exist!");
        }
    } catch (error) {
        console.log('write contract', error);
    }
};
