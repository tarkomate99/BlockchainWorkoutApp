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
          "https://goerli.infura.io/v3/" + process.env.INFURA_API_KEY
        );
      },
      network_id: 5,
      networkCheckTimeout: 1000000,
      timeoutBlocks: 200,
      gas: 4465030,
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
