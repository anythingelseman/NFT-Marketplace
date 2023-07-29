require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: {
    version: "0.8.4",
  },
  paths: {
    artifacts: "./src/artifacts",
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    mumbai: {
      url: "https://polygon-mumbai.g.alchemy.com/v2/FaVhw7acfd6XMPRyTL3SKXrPauzAkksF",
      accounts: [
        "8c2771b8899527c673d73f3e8bbf8bd7144a3f509e4cd1448a6b0b09d1707f14",
      ],
      matic: {
        url: "https://polygon-mumbai.g.alchemy.com/v2/FaVhw7acfd6XMPRyTL3SKXrPauzAkksF",
        accounts: [
          "8c2771b8899527c673d73f3e8bbf8bd7144a3f509e4cd1448a6b0b09d1707f14",
        ],
      },
    },
  },
};
