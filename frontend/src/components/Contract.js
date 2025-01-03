// import React, { useState, useEffect } from 'react';
// import { ethers } from 'ethers';
// import abi from '../abi/VotingSystem.json';

// const VotingSystem = ({ provider, account }) => {
//   const [contract, setContract] = useState(null);
//   const [polls, setPolls] = useState([]);
//   const [newPoll, setNewPoll] = useState({
//     title: '',
//     options: ['', ''],
//     duration: 60
//   });
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (provider) {
//       const contract = new ethers.Contract(
//         "0x002A13DF3bB8Ce7D7143bE17223F8893e2152c29",
//         abi,
//         provider
//       );
//       setContract(contract);
//     }
//   }, [provider]);

//   const createPoll = async () => {
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
//     } catch (error) {
//       console.error('Error creating poll:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

  

//   const castVote = async (pollId, optionIndex) => {
//     try {
//       setLoading(true);
//       const signer = await provider.getSigner();
//       const connectedContract = contract.connect(signer);
      
//       const tx = await connectedContract.vote(pollId, optionIndex);
//       await tx.wait();
//     } catch (error) {
//       console.error('Error voting:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getPollDetails = async (pollId) => {
//     try {
//       const details = await contract.getPollDetails(pollId);
//       const results = await contract.getPollResults(pollId);
//       return { ...details, results };
//     } catch (error) {
//       console.error('Error fetching poll details:', error);
//       return null;
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto p-4">
//       <div className="mb-8 bg-white p-6 rounded-lg shadow">
//         <h2 className="text-xl font-bold mb-4">Create New Poll</h2>
//         <input
//           type="text"
//           value={newPoll.title}
//           onChange={(e) => setNewPoll({...newPoll, title: e.target.value})}
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
//               setNewPoll({...newPoll, options: newOptions});
//             }}
//             placeholder={`Option ${index + 1}`}
//             className="w-full p-2 mb-2 border rounded"
//           />
//         ))}
//         <button
//           onClick={() => setNewPoll({...newPoll, options: [...newPoll.options, '']})}
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
