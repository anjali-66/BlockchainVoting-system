// import React, { useState } from 'react';
// import { ethers } from 'ethers';

// const ConnectWallet = ({ onWalletConnected }) => {
//   const [error, setError] = useState('');
//   const [isConnecting, setIsConnecting] = useState(false);

//   const connectWallet = async () => {
//     setIsConnecting(true);
//     setError('');

//     try {
//       if (!window.ethereum) {
//         throw new Error('MetaMask is not installed');
//       }

//       await window.ethereum.request({ method: 'eth_requestAccounts' });
//       const provider = new ethers.BrowserProvider(window.ethereum); // Updated for ethers 6.x
//       const signer = await provider.getSigner();
//       const address = await signer.getAddress();
      
//       onWalletConnected(provider, address);
//     } catch (err) {
//       setError(err.message);
//     }
//     setIsConnecting(false);
//   };

//   return (
//     <div>
//       {error && <div className="text-red-500 mb-2">{error}</div>}
//       <button 
//         onClick={connectWallet}
//         disabled={isConnecting}
//         className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//       >
//         {isConnecting ? 'Connecting...' : 'Connect Wallet'}
//       </button>
//     </div>
//   );
// };

// export default ConnectWallet;
import React, { useState } from 'react';
import { ethers } from 'ethers';

const ConnectWallet = ({ onWalletConnected }) => {
  const [error, setError] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = async () => {
    setIsConnecting(true);
    setError('');

    try {
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
      }

      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      onWalletConnected(provider, address);
    } catch (err) {
      setError(err.message);
    }
    setIsConnecting(false);
  };

  return (
    <div>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <button
        onClick={connectWallet}
        disabled={isConnecting}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </button>
    </div>
  );
};

export default ConnectWallet;
