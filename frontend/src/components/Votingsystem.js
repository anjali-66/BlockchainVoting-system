// import React, { useState, useEffect } from 'react';
// import { ethers } from 'ethers';
// import abi from '../abi/VotingSystem.json';

// const VotingSystem = ({ provider, account }) => {
//   const [contract, setContract] = useState(null);
//   const [polls, setPolls] = useState([]);
//   const [newPoll, setNewPoll] = useState({ title: '', options: ['', ''], duration: 60 });
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (provider) {
//       const contractInstance = new ethers.Contract(
//         "0x002A13DF3bB8Ce7D7143bE17223F8893e2152c29",
//         abi,
//         provider
//       );
//       setContract(contractInstance);
//     }
//   }, [provider]);

//   const createPoll = async () => {
//     if (!contract) return;
//     try {
//       setLoading(true);
//       const signer = await provider.getSigner();
//       const connectedContract = contract.connect(signer);

//       const tx = await connectedContract.createPoll(
//         newPoll.title,
//         newPoll.options.filter(opt => opt !== ''),
//         newPoll.duration
//       );
//       await tx.wait();

//       setNewPoll({ title: '', options: ['', ''], duration: 60 });
//       fetchPolls(); // Refresh polls
//     } catch (error) {
//       console.error('Error creating poll:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const castVote = async (pollId, optionIndex) => {
//     if (!contract) return;
//     try {
//       setLoading(true);
//       const signer = await provider.getSigner();
//       const connectedContract = contract.connect(signer);

//       const tx = await connectedContract.vote(pollId, optionIndex);
//       await tx.wait();
//       fetchPolls(); // Refresh polls
//     } catch (error) {
//       console.error('Error voting:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchPolls = async () => {
//     if (!contract) return;
//     try {
//       const pollCount = await contract.pollCount();
//       const pollsData = [];
//       for (let i = 0; i < pollCount; i++) {
//         const details = await contract.getPollDetails(i);
//         const results = await contract.getPollResults(i);
//         pollsData.push({ ...details, results });
//       }
//       setPolls(pollsData);
//     } catch (error) {
//       console.error('Error fetching polls:', error);
//     }
//   };

//   useEffect(() => {
//     fetchPolls();
//   }, [contract]);

//   return (
//     <div className="max-w-2xl mx-auto p-4">
//       <div className="mb-8 bg-white p-6 rounded-lg shadow">
//         <h2 className="text-xl font-bold mb-4">Create New Poll</h2>
//         <input
//           type="text"
//           value={newPoll.title}
//           onChange={(e) => setNewPoll({ ...newPoll, title: e.target.value })}
//           placeholder="Poll Title"
//           className="w-full p-2 mb-4 border rounded"
//         />
//         {newPoll.options.map((option, index) => (
//           <input
//             key={index}
//             type="text"
//             value={option}
//             onChange={(e) => {
//               const newOptions = [...newPoll.options];
//               newOptions[index] = e.target.value;
//               setNewPoll({ ...newPoll, options: newOptions });
//             }}
//             placeholder={`Option ${index + 1}`}
//             className="w-full p-2 mb-2 border rounded"
//           />
//         ))}
//         <button
//           onClick={() => setNewPoll({ ...newPoll, options: [...newPoll.options, ''] })}
//           className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
//         >
//           Add Option
//         </button>
//         <button
//           onClick={createPoll}
//           disabled={loading}
//           className="bg-blue-500 text-white px-4 py-2 rounded"
//         >
//           Create Poll
//         </button>
//       </div>

//       <div className="bg-white p-6 rounded-lg shadow">
//         <h2 className="text-xl font-bold mb-4">Active Polls</h2>
//         {polls.map((poll, index) => (
//           <div key={index} className="border-b py-4">
//             <h3 className="font-bold">{poll.title}</h3>
//             <div className="mt-2">
//               {poll.options.map((option, optIndex) => (
//                 <button
//                   key={optIndex}
//                   onClick={() => castVote(poll.pollId, optIndex)}
//                   className="bg-blue-100 hover:bg-blue-200 px-4 py-2 rounded mr-2 mb-2"
//                 >
//                   {option} ({poll.results[optIndex].toString()})
//                 </button>
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default VotingSystem;

//consists all the function to interact with the smart contract
// import React, { useState, useEffect } from 'react';
// import { ethers } from 'ethers';

// const SmartContractInterface = ({ contractAddress, abi }) => {
//   const [pollTitle, setPollTitle] = useState('');
//   const [pollOptions, setPollOptions] = useState([]);
//   const [pollDuration, setPollDuration] = useState('');
//   const [pollId, setPollId] = useState('');
//   const [optionIndex, setOptionIndex] = useState('');
//   const [pollDetails, setPollDetails] = useState(null);
//   const [pollResults, setPollResults] = useState(null);
//   const [allPolls, setAllPolls] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const provider = new ethers.BrowserProvider(window.ethereum);
//   const [contract, setContract] = useState(null);

//   useEffect(() => {
//     if (contractAddress && abi) {
//       const signer = provider.getSigner();
//       setContract(new ethers.Contract(contractAddress, abi, signer));
//     } else {
//       console.error("Invalid contractAddress or ABI");
//     }
//   }, [contractAddress, abi]);

//   useEffect(() => {
//     if (contract) fetchAllPolls();
//   }, [contract]);

//   const createPoll = async () => {
//     try {
//       setLoading(true);
//       const tx = await contract.createPoll(pollTitle, pollOptions.filter(opt => opt), pollDuration);
//       await tx.wait();
//       alert('Poll created successfully!');
//       fetchAllPolls();
//     } catch (error) {
//       console.error(error);
//       alert('Error creating poll');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const vote = async () => {
//     try {
//       setLoading(true);
//       const tx = await contract.vote(pollId, optionIndex);
//       await tx.wait();
//       alert('Vote cast successfully!');
//       fetchPollResults(pollId);
//     } catch (error) {
//       console.error(error);
//       alert('Error casting vote');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchPollDetails = async (id) => {
//     try {
//       setLoading(true);
//       console.log("Fetching poll details...");
//       const details = await contract.getPollDetails(id || pollId);
//       console.log("Poll details:", details);
//       setPollDetails(details);
//     } catch (error) {
//       console.error("Error fetching poll details:", error);
//       alert('Error fetching poll details');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchPollResults = async (id) => {
//     try {
//       setLoading(true);
//       console.log("Fetching poll results...");
//       const results = await contract.getPollResults(id || pollId);
//       console.log("Poll results:", results);
//       setPollResults(results);
//     } catch (error) {
//       console.error("Error fetching poll results:", error);
//       alert('Error fetching poll results');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchAllPolls = async () => {
//     try {
//       setLoading(true);
//       console.log("Fetching all polls...");
//       const totalPolls = await contract.pollCount();
//       console.log("Total polls:", totalPolls.toString());

//       const polls = [];
//       for (let i = 0; i < totalPolls; i++) {
//         const details = await contract.getPollDetails(i);
//         console.log(`Poll ${i} details:`, details);
//         polls.push({ id: i, details });
//       }
//       setAllPolls(polls);
//       console.log("All polls:", polls);
//     } catch (error) {
//       console.error("Error fetching all polls:", error);
//       alert('Error fetching all polls');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <h2>Smart Contract Interface</h2>

//       <div>
//         <h3>Create Poll</h3>
//         <input
//           type="text"
//           placeholder="Poll Title"
//           value={pollTitle}
//           onChange={(e) => setPollTitle(e.target.value)}
//         />
//         <input
//           type="text"
//           placeholder="Poll Options (comma separated)"
//           value={pollOptions.join(',')}
//           onChange={(e) => setPollOptions(e.target.value.split(','))}
//         />
//         <input
//           type="number"
//           placeholder="Duration in Minutes"
//           value={pollDuration}
//           onChange={(e) => setPollDuration(e.target.value)}
//         />
//         <button onClick={createPoll} disabled={loading}>Create Poll</button>
//       </div>

//       <div>
//         <h3>Vote</h3>
//         <input
//           type="number"
//           placeholder="Poll ID"
//           value={pollId}
//           onChange={(e) => setPollId(e.target.value)}
//         />
//         <input
//           type="number"
//           placeholder="Option Index"
//           value={optionIndex}
//           onChange={(e) => setOptionIndex(e.target.value)}
//         />
//         <button onClick={vote} disabled={loading}>Vote</button>
//       </div>

//       <div>
//         <h3>Get Poll Details</h3>
//         <input
//           type="number"
//           placeholder="Poll ID"
//           value={pollId}
//           onChange={(e) => setPollId(e.target.value)}
//         />
//         <button onClick={() => fetchPollDetails()} disabled={loading}>Fetch Details</button>
//         {pollDetails && (
//           <div>
//             <p>Title: {pollDetails[0]}</p>
//             <p>Options: {pollDetails[1].join(', ')}</p>
//             <p>End Time: {new Date(pollDetails[2] * 1000).toLocaleString()}</p>
//             <p>Creator: {pollDetails[3]}</p>
//           </div>
//         )}
//       </div>

//       <div>
//         <h3>Get Poll Results</h3>
//         <input
//           type="number"
//           placeholder="Poll ID"
//           value={pollId}
//           onChange={(e) => setPollId(e.target.value)}
//         />
//         <button onClick={() => fetchPollResults()} disabled={loading}>Fetch Results</button>
//         {pollResults && (
//           <div>
//             <p>Results: {pollResults.join(', ')}</p>
//           </div>
//         )}
//       </div>

//       <div>
//         <h3>All Polls</h3>
//         <button onClick={fetchAllPolls} disabled={loading}>Refresh Polls</button>
//         <ul>
//           {allPolls.map((poll) => (
//             <li key={poll.id}>
//               <p>ID: {poll.id}</p>
//               <p>Title: {poll.details[0]}</p>
//               <p>Options: {poll.details[1].join(', ')}</p>
//               <p>End Time: {new Date(poll.details[2] * 1000).toLocaleString()}</p>
//               <button onClick={() => fetchPollDetails(poll.id)}>View Details</button>
//               <button onClick={() => fetchPollResults(poll.id)}>View Results</button>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default SmartContractInterface;


// import React, { useState, useEffect } from 'react';
// import { ethers } from 'ethers';

// const SmartContractInterface = ({ contractAddress, abi }) => {
//   const [pollTitle, setPollTitle] = useState('');
//   const [pollOptions, setPollOptions] = useState([]);
//   const [pollDuration, setPollDuration] = useState('');
//   const [pollId, setPollId] = useState('');
//   const [optionIndex, setOptionIndex] = useState('');
//   const [pollDetails, setPollDetails] = useState(null);
//   const [pollResults, setPollResults] = useState(null);
//   const [allPolls, setAllPolls] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const provider = new ethers.BrowserProvider(window.ethereum);
//   const [contract, setContract] = useState(null);

//   useEffect(() => {
//     if (contractAddress && abi) {
//       const signer = provider.getSigner();
//       setContract(new ethers.Contract(contractAddress, abi, signer));
//     } else {
//       console.error("Invalid contractAddress or ABI");
//     }
//   }, [contractAddress, abi]);

//   useEffect(() => {
//     if (contract) fetchAllPolls();
//   }, [contract]);

//   const createPoll = async () => {
//     if (!pollTitle.trim()) {
//       alert("Poll title is required.");
//       return;
//     }

//     if (!pollOptions.length || pollOptions.some(opt => !opt.trim())) {
//       alert("At least one valid poll option is required.");
//       return;
//     }

//     if (!pollDuration || pollDuration <= 0) {
//       alert("Poll duration must be a positive number.");
//       return;
//     }

//     if (!contract) {
//       alert("Smart contract is not connected. Please check the connection.");
//       return;
//     }

//     try {
//       setLoading(true);
//       console.log("Creating poll with:", pollTitle, pollOptions, pollDuration);

//       const tx = await contract.createPoll(
//         pollTitle,
//         pollOptions.filter(opt => opt.trim()),
//         parseInt(pollDuration),
//         { gasLimit: 300000 }
//       );

//       await tx.wait();
//       alert('Poll created successfully!');
//       fetchAllPolls();
//     } catch (error) {
//       console.error("Detailed Error:", error);
//       alert(`Error creating poll: ${error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const vote = async () => {
//     try {
//       setLoading(true);
//       const tx = await contract.vote(pollId, optionIndex);
//       await tx.wait();
//       alert('Vote cast successfully!');
//       fetchPollResults(pollId);
//     } catch (error) {
//       console.error(error);
//       alert('Error casting vote');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchPollDetails = async (id) => {
//     try {
//       setLoading(true);
//       console.log("Fetching poll details...");
//       const details = await contract.getPollDetails(id || pollId);
//       console.log("Poll details:", details);
//       setPollDetails(details);
//     } catch (error) {
//       console.error("Error fetching poll details:", error);
//       alert('Error fetching poll details');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchPollResults = async (id) => {
//     try {
//       setLoading(true);
//       console.log("Fetching poll results...");
//       const results = await contract.getPollResults(id || pollId);
//       console.log("Poll results:", results);
//       setPollResults(results);
//     } catch (error) {
//       console.error("Error fetching poll results:", error);
//       alert('Error fetching poll results');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchAllPolls = async () => {
//     try {
//       setLoading(true);
//       console.log("Fetching all polls...");
//       const totalPolls = await contract.pollCount();
//       console.log("Total polls:", totalPolls.toString());

//       const polls = [];
//       for (let i = 0; i < totalPolls; i++) {
//         const details = await contract.getPollDetails(i);
//         console.log(`Poll ${i} details:`, details);
//         polls.push({ id: i, details });
//       }
//       setAllPolls(polls);
//       console.log("All polls:", polls);
//     } catch (error) {
//       console.error("Error fetching all polls:", error);
//       alert('Error fetching all polls');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <h2>Smart Contract Interface</h2>

//       <div>
//         <h3>Create Poll</h3>
//         <input
//           type="text"
//           placeholder="Poll Title"
//           value={pollTitle}
//           onChange={(e) => setPollTitle(e.target.value)}
//         />
//         <input
//           type="text"
//           placeholder="Poll Options (comma separated)"
//           value={pollOptions.join(',')}
//           onChange={(e) => setPollOptions(e.target.value.split(','))}
//         />
//         <input
//           type="number"
//           placeholder="Duration in Minutes"
//           value={pollDuration}
//           onChange={(e) => setPollDuration(e.target.value)}
//         />
//         <button onClick={createPoll} disabled={loading}>Create Poll</button>
//       </div>

//       <div>
//         <h3>Vote</h3>
//         <input
//           type="number"
//           placeholder="Poll ID"
//           value={pollId}
//           onChange={(e) => setPollId(e.target.value)}
//         />
//         <input
//           type="number"
//           placeholder="Option Index"
//           value={optionIndex}
//           onChange={(e) => setOptionIndex(e.target.value)}
//         />
//         <button onClick={vote} disabled={loading}>Vote</button>
//       </div>

//       <div>
//         <h3>Get Poll Details</h3>
//         <input
//           type="number"
//           placeholder="Poll ID"
//           value={pollId}
//           onChange={(e) => setPollId(e.target.value)}
//         />
//         <button onClick={() => fetchPollDetails()} disabled={loading}>Fetch Details</button>
//         {pollDetails && (
//           <div>
//             <p>Title: {pollDetails[0]}</p>
//             <p>Options: {pollDetails[1].join(', ')}</p>
//             <p>End Time: {new Date(pollDetails[2] * 1000).toLocaleString()}</p>
//             <p>Creator: {pollDetails[3]}</p>
//           </div>
//         )}
//       </div>

//       <div>
//         <h3>Get Poll Results</h3>
//         <input
//           type="number"
//           placeholder="Poll ID"
//           value={pollId}
//           onChange={(e) => setPollId(e.target.value)}
//         />
//         <button onClick={() => fetchPollResults()} disabled={loading}>Fetch Results</button>
//         {pollResults && (
//           <div>
//             <p>Results: {pollResults.join(', ')}</p>
//           </div>
//         )}
//       </div>

//       <div>
//         <h3>All Polls</h3>
//         <button onClick={fetchAllPolls} disabled={loading}>Refresh Polls</button>
//         <ul>
//           {allPolls.map((poll) => (
//             <li key={poll.id}>
//               <p>ID: {poll.id}</p>
//               <p>Title: {poll.details[0]}</p>
//               <p>Options: {poll.details[1].join(', ')}</p>
//               <p>End Time: {new Date(poll.details[2] * 1000).toLocaleString()}</p>
//               <button onClick={() => fetchPollDetails(poll.id)}>View Details</button>
//               <button onClick={() => fetchPollResults(poll.id)}>View Results</button>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default SmartContractInterface;

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const SmartContractInterface = ({ contractAddress, abi }) => {
  const [pollTitle, setPollTitle] = useState('');
  const [pollOptions, setPollOptions] = useState([]);
  const [pollDuration, setPollDuration] = useState('');
  const [pollId, setPollId] = useState('');
  const [optionIndex, setOptionIndex] = useState('');
  const [pollDetails, setPollDetails] = useState(null);
  const [pollResults, setPollResults] = useState(null);
  const [allPolls, setAllPolls] = useState([]);
  const [loading, setLoading] = useState(false);

  const provider = new ethers.BrowserProvider(window.ethereum);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    if (contractAddress && abi) {
      const initializeContract = async () => {
        try {
          const signer = await provider.getSigner();
          const initializedContract = new ethers.Contract(contractAddress, abi, signer);
          setContract(initializedContract);
          console.log("Smart contract connected:", initializedContract);
        } catch (error) {
          console.error("Error initializing contract:", error);
          alert("Failed to connect to the smart contract. Please check your configuration.");
        }
      };

      initializeContract();
    } else {
      console.error("Invalid contractAddress or ABI");
      alert("Invalid contract address or ABI. Please verify your setup.");
    }
  }, [contractAddress, abi]);

  useEffect(() => {
    if (contract) fetchAllPolls();
  }, [contract]);

  const createPoll = async () => {
    if (!pollTitle.trim()) {
      alert("Poll title is required.");
      return;
    }

    if (!pollOptions.length || pollOptions.some(opt => !opt.trim())) {
      alert("At least one valid poll option is required.");
      return;
    }

    if (!pollDuration || pollDuration <= 0) {
      alert("Poll duration must be a positive number.");
      return;
    }

    if (!contract) {
      alert("Smart contract is not connected. Please check the connection.");
      return;
    }

    try {
      setLoading(true);
      console.log("Creating poll with:", pollTitle, pollOptions, pollDuration);

      const tx = await contract.createPoll(
        pollTitle,
        pollOptions.filter(opt => opt.trim()),
        parseInt(pollDuration),
        { gasLimit: 300000 }
      );

      await tx.wait();
      alert('Poll created successfully!');
      fetchAllPolls();
    } catch (error) {
      console.error("Detailed Error:", error);
      alert(`Error creating poll: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const vote = async () => {
    if (!contract) {
      alert("Smart contract is not connected. Please check the connection.");
      return;
    }

    try {
      setLoading(true);
      const tx = await contract.vote(pollId, optionIndex);
      await tx.wait();
      alert('Vote cast successfully!');
      fetchPollResults(pollId);
    } catch (error) {
      console.error(error);
      alert('Error casting vote');
    } finally {
      setLoading(false);
    }
  };

  const fetchPollDetails = async (id) => {
    if (!contract) {
      alert("Smart contract is not connected. Please check the connection.");
      return;
    }

    try {
      setLoading(true);
      console.log("Fetching poll details...");
      const details = await contract.getPollDetails(id || pollId);
      console.log("Poll details:", details);
      setPollDetails(details);
    } catch (error) {
      console.error("Error fetching poll details:", error);
      alert('Error fetching poll details');
    } finally {
      setLoading(false);
    }
  };

  const fetchPollResults = async (id) => {
    if (!contract) {
      alert("Smart contract is not connected. Please check the connection.");
      return;
    }

    try {
      setLoading(true);
      console.log("Fetching poll results...");
      const results = await contract.getPollResults(id || pollId);
      console.log("Poll results:", results);
      setPollResults(results);
    } catch (error) {
      console.error("Error fetching poll results:", error);
      alert('Error fetching poll results');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllPolls = async () => {
    if (!contract) {
      alert("Smart contract is not connected. Please check the connection.");
      return;
    }

    try {
      setLoading(true);
      console.log("Fetching all polls...");
      const totalPolls = await contract.pollCount();
      console.log("Total polls:", totalPolls.toString());

      const polls = [];
      for (let i = 0; i < totalPolls; i++) {
        const details = await contract.getPollDetails(i);
        console.log(`Poll ${i} details:`, details);
        polls.push({ id: i, details });
      }
      setAllPolls(polls);
      console.log("All polls:", polls);
    } catch (error) {
      console.error("Error fetching all polls:", error);
      alert('Error fetching all polls');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Smart Contract Interface</h2>

      <div>
        <h3>Create Poll</h3>
        <input
          type="text"
          placeholder="Poll Title"
          value={pollTitle}
          onChange={(e) => setPollTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Poll Options (comma separated)"
          value={pollOptions.join(',')}
          onChange={(e) => setPollOptions(e.target.value.split(','))}
        />
        <input
          type="number"
          placeholder="Duration in Minutes"
          value={pollDuration}
          onChange={(e) => setPollDuration(e.target.value)}
        />
        <button onClick={createPoll} disabled={loading}>Create Poll</button>
      </div>

      <div>
        <h3>Vote</h3>
        <input
          type="number"
          placeholder="Poll ID"
          value={pollId}
          onChange={(e) => setPollId(e.target.value)}
        />
        <input
          type="number"
          placeholder="Option Index"
          value={optionIndex}
          onChange={(e) => setOptionIndex(e.target.value)}
        />
        <button onClick={vote} disabled={loading}>Vote</button>
      </div>

      <div>
        <h3>Get Poll Details</h3>
        <input
          type="number"
          placeholder="Poll ID"
          value={pollId}
          onChange={(e) => setPollId(e.target.value)}
        />
        <button onClick={() => fetchPollDetails()} disabled={loading}>Fetch Details</button>
        {pollDetails && (
          <div>
            <p>Title: {pollDetails[0]}</p>
            <p>Options: {pollDetails[1].join(', ')}</p>
            <p>End Time: {new Date(pollDetails[2] * 1000).toLocaleString()}</p>
            <p>Creator: {pollDetails[3]}</p>
          </div>
        )}
      </div>

      <div>
        <h3>Get Poll Results</h3>
        <input
          type="number"
          placeholder="Poll ID"
          value={pollId}
          onChange={(e) => setPollId(e.target.value)}
        />
        <button onClick={() => fetchPollResults()} disabled={loading}>Fetch Results</button>
        {pollResults && (
          <div>
            <p>Results: {pollResults.join(', ')}</p>
          </div>
        )}
      </div>

      <div>
        <h3>All Polls</h3>
        <button onClick={fetchAllPolls} disabled={loading}>Refresh Polls</button>
        <ul>
          {allPolls.map((poll) => (
            <li key={poll.id}>
              <p>ID: {poll.id}</p>
              <p>Title: {poll.details[0]}</p>
              <p>Options: {poll.details[1].join(', ')}</p>
              <p>End Time: {new Date(poll.details[2] * 1000).toLocaleString()}</p>
              <button onClick={() => fetchPollDetails(poll.id)}>View Details</button>
              <button onClick={() => fetchPollResults(poll.id)}>View Results</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SmartContractInterface;
