// import React, { useState, useEffect } from 'react';
// import { ethers } from 'ethers';
// import ConnectWallet from './components/ConnectWallet';
// import VotingSystem from './components/Contract';

// const App = () => {
//   const [provider, setProvider] = useState(null);
//   const [account, setAccount] = useState('');
//   const [balance, setBalance] = useState('');

//   const handleWalletConnected = async (provider, account) => {
//     setProvider(provider);
//     setAccount(account);
    
//     try {
//       const balance = await provider.getBalance(account);
//       setBalance(ethers.formatEther(balance)); // Updated for ethers 6.x
//     } catch (err) {
//       console.error('Error fetching balance:', err);
//     }
//   };

//   useEffect(() => {
//     if (window.ethereum) {
//       window.ethereum.on('accountsChanged', () => window.location.reload());
//       window.ethereum.on('chainChanged', () => window.location.reload());
//     }

//     return () => {
//       if (window.ethereum) {
//         window.ethereum.removeListener('accountsChanged', () => window.location.reload());
//         window.ethereum.removeListener('chainChanged', () => window.location.reload());
//       }
//     };
//   }, []);

//   const disconnectWallet = () => {
//     setProvider(null);
//     setAccount('');
//     setBalance('');
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Ethereum Wallet</h1>
//       {!account ? (
//         <ConnectWallet onWalletConnected={handleWalletConnected} />
//       ) : (
//         <div>
//           <p>Account: {account}</p>
//           <p>Balance: {balance} ETH</p>
//           <button 
//             onClick={disconnectWallet}
//             className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-2"
//           >
//             Disconnect
//           </button>
//         </div>
//       )}
//       {account && (
//     <VotingSystem provider={provider} account={account} />
//   )}  

//     </div>
//   );
// };

// export default App;
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
//       const provider = new ethers.BrowserProvider(window.ethereum);
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
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import ConnectWallet from './components/ConnectWallet';
import VotingSystem from './components/Votingsystem';

const App = () => {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('');

  const handleWalletConnected = async (provider, account) => {
    setProvider(provider);
    setAccount(account);

    try {
      const balance = await provider.getBalance(account);
      setBalance(ethers.formatEther(balance)); // Updated for ethers.js v6
    } catch (err) {
      console.error('Error fetching balance:', err);
    }
  };

  const disconnectWallet = () => {
    setProvider(null);
    setAccount('');
    setBalance('');
  };

  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = () => window.location.reload();
      const handleChainChanged = () => window.location.reload();

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Blockchain Voting System</h1>
      {!account ? (
        <ConnectWallet onWalletConnected={handleWalletConnected} />
      ) : (
        <div>
          <p>Account: {account}</p>
          <p>Balance: {balance} ETH</p>
          <button
            onClick={disconnectWallet}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-2"
          >
            Disconnect
          </button>
        </div>
      )}
      {account && provider && (
        <VotingSystem provider={provider} account={account} />
      )}
    </div>
  );
};

export default App;

