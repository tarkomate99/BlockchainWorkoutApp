const HDWalletProvider = require("@truffle/hdwallet-provider");

require("dotenv").config();
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
const GOERLI_PRIVATE_KEY = process.env.GOERLI_PRIVATE_KEY;
module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*", // Match any network id
    },
    goerli: {
      provider: () => {
        return new HDWalletProvider(
          process.env.MNEMONIC_KEY,
          "https://eth-goerli.g.alchemy.com/v2/xcuYzS3vQPrzXZxNW1PdiG_H6hfPcSNK"
        );
      },
      from: "0xf76a3e160574ba75D739d64E64Fdb1356b409016",
      network_id: 5,
      networkCheckTimeout: 1000000,
      timeoutBlocks: 200,
    },
  },

  solc: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
    evmVersion: "homestead",
  },
};
