// require("@nomicfoundation/hardhat-toolbox");
// require("dotenv").config(); // Ensure this is included at the top
// console.log("Sepolia RPC URL:", process.env.SEPOLIA_RPC_URL);
// console.log("Private Key:", process.env.PRIVATE_KEY);

// module.exports = {
//   solidity: "0.8.18",
//   networks: {
//     sepolia: {
//       url: process.env.SEPOLIA_RPC_URL || "", // Fallback to empty string
//       accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [], // Fallback to empty array
//     },
//   },
// };

require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
    solidity: "0.8.18",
    networks: {
        sepolia: {
            url: "https://ethereum-sepolia.core.chainstack.com/4fdc8499dfd9b9a8b415ec3b42d15ec8",
            accounts:["faab44a47405018e2a0e591aba7faa010999ecea635fa46710871ff8445e95f4"]

        },
    }
};
