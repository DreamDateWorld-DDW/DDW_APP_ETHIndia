import { ethers } from "ethers";
import { ddwapp_abi, app_token_abi, ddw_token_abi } from "./abi";

export const providers = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_RPC_URL_ETH);
export const app_read_contract_eth = new ethers.Contract(process.env.REACT_APP_DDWAPP_CONTRACT_ADDRESS_ETH, ddwapp_abi, providers);
export const ddw_token_read_contract_eth = new ethers.Contract(process.env.REACT_APP_DDWTOKEN_CONTRACT_ADDRESS_ETH, ddw_token_abi, providers);
export const app_token_read_contract_eth = new ethers.Contract(process.env.REACT_APP_APPTOKEN_CONTRACT_ADDRESS_ETH, app_token_abi, providers);
