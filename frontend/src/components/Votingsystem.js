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
