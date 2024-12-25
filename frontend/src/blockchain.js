import {ethers} from "ethers";
import VotingSystemABI from "./abi/VotingSystem.json";


const CONTRACT_ADDRESS="0x002A13DF3bB8Ce7D7143bE17223F8893e2152c29"

export const connectWallet= async ()=>
{
    if(!window.ethereum)
    {
        alert("Metamask not detected!");
        return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    return signer;
};

export const getContract = (signer) => {
    return new ethers.Contract(CONTRACT_ADDRESS, VotingSystemABI, signer);
};
