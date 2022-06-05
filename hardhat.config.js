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
        "51e733b708c6fd2df54c1d29ff3bda2c059320cf1807776454d2efceae5df9a8",
      ],
      matic: {
        url: "https://polygon-mumbai.g.alchemy.com/v2/FaVhw7acfd6XMPRyTL3SKXrPauzAkksF",
        accounts: [
          "51e733b708c6fd2df54c1d29ff3bda2c059320cf1807776454d2efceae5df9a8",
        ],
      },
    },
  },
};
