from web3 import Web3
from config import Config
import json

# Blockchain connection
w3 = Web3(Web3.HTTPProvider(Config.BLOCKCHAIN_PROVIDER))

# Smart contract setup
contract_abi = json.loads('''
[
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "pollId",
                "type": "uint256"
            }
        ],
        "name": "PollCreated",
        "type": "event"
    }
]
''')
contract = w3.eth.contract(address=Config.CONTRACT_ADDRESS, abi=contract_abi)

def create_poll_on_blockchain(title, options, deadline):
    tx = contract.functions.createPoll(title, options, deadline).buildTransaction({
        'from': Config.WALLET_ADDRESS,
        'gas': 2000000,
        'gasPrice': w3.toWei('20', 'gwei'),
        'nonce': w3.eth.getTransactionCount(Config.WALLET_ADDRESS),
    })
    signed_tx = w3.eth.account.sign_transaction(tx, private_key=Config.PRIVATE_KEY)
    return w3.eth.sendRawTransaction(signed_tx.rawTransaction)

def cast_vote_on_blockchain(poll_id, option):
    tx = contract.functions.vote(poll_id, option).buildTransaction({
        'from': Config.WALLET_ADDRESS,
        'gas': 2000000,
        'gasPrice': w3.toWei('20', 'gwei'),
        'nonce': w3.eth.getTransactionCount(Config.WALLET_ADDRESS),
    })
    signed_tx = w3.eth.account.sign_transaction(tx, private_key=Config.PRIVATE_KEY)
    return w3.eth.sendRawTransaction(signed_tx.rawTransaction)

