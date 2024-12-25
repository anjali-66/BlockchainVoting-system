import React, { useState, useEffect } from "react";
import { connectWallet, getContract } from "./blockchain";

const App = () => {
    const [walletAddress, setWalletAddress] = useState("");
    const [contract, setContract] = useState(null);
    const [polls, setPolls] = useState([]);
    const [newPoll, setNewPoll] = useState({ title: "", options: [], duration: 0 });
    const [pollResults, setPollResults] = useState({});

    // Connect wallet and initialize contract
    const connectToWallet = async () => {
        try {
            const signer = await connectWallet();
            const address = await signer.getAddress();
            setWalletAddress(address);
            setContract(getContract(signer));
        } catch (error) {
            console.error("Error connecting wallet:", error);
        }
    };

    // Fetch poll details
    const fetchPolls = async () => {
        if (!contract) return;
        try {
            const pollList = [];
            for (let i = 0; i < 10; i++) { // Adjust the range if you have more polls
                try {
                    const [title, options, endTime, creator] = await contract.getPollDetails(i);
                    pollList.push({ id: i, title, options, endTime, creator });
                } catch {
                    break; // Stop fetching when no more polls exist
                }
            }
            setPolls(pollList);
        } catch (error) {
            console.error("Error fetching polls:", error);
        }
    };

    // Create a new poll
    const createPoll = async () => {
        if (!contract) return;
        try {
            const tx = await contract.createPoll(
                newPoll.title,
                newPoll.options,
                newPoll.duration
            );
            await tx.wait();
            alert("Poll created successfully!");
            fetchPolls();
        } catch (error) {
            console.error("Error creating poll:", error);
        }
    };

    // Vote for a poll option
    const voteForOption = async (pollId, optionIndex) => {
        if (!contract) return;
        try {
            const tx = await contract.vote(pollId, optionIndex);
            await tx.wait();
            alert("Vote cast successfully!");
            fetchPolls();
        } catch (error) {
            console.error("Error voting:", error);
        }
    };

    // Fetch poll results
    const fetchPollResults = async (pollId) => {
        if (!contract) return;
        try {
            const results = await contract.getPollResults(pollId);
            setPollResults((prevResults) => ({
                ...prevResults,
                [pollId]: results,
            }));
        } catch (error) {
            console.error("Error fetching results:", error);
        }
    };

    useEffect(() => {
        if (contract) fetchPolls();
    }, [contract]);

    return (
        <div>
            <h1>Blockchain Voting System</h1>
            {!walletAddress ? (
                <button onClick={connectToWallet}>Connect Wallet</button>
            ) : (
                <p>Connected as: {walletAddress}</p>
            )}
            <div>
                <h2>Create a Poll</h2>
                <input
                    type="text"
                    placeholder="Poll Title"
                    value={newPoll.title}
                    onChange={(e) => setNewPoll({ ...newPoll, title: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Options (comma-separated)"
                    value={newPoll.options.join(", ")}
                    onChange={(e) =>
                        setNewPoll({
                            ...newPoll,
                            options: e.target.value.split(",").map((opt) => opt.trim()),
                        })
                    }
                />
                <input
                    type="number"
                    placeholder="Duration (minutes)"
                    value={newPoll.duration}
                    onChange={(e) =>
                        setNewPoll({ ...newPoll, duration: parseInt(e.target.value) })
                    }
                />
                <button onClick={createPoll}>Create Poll</button>
            </div>
            <div>
                <h2>Available Polls</h2>
                {polls.map((poll) => (
                    <div key={poll.id}>
                        <h3>{poll.title}</h3>
                        <p>Creator: {poll.creator}</p>
                        <p>Ends: {new Date(poll.endTime * 1000).toLocaleString()}</p>
                        <div>
                            {poll.options.map((option, index) => (
                                <button
                                    key={index}
                                    onClick={() => voteForOption(poll.id, index)}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                        <button onClick={() => fetchPollResults(poll.id)}>
                            View Results
                        </button>
                        {pollResults[poll.id] && (
                            <div>
                                <h4>Results</h4>
                                {pollResults[poll.id].map((votes, index) => (
                                    <p key={index}>
                                        {poll.options[index]}: {votes} votes
                                    </p>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default App;
