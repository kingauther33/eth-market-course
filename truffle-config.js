const HDWalletProvider = require('@truffle/hdwallet-provider');
const keys = require('./keys.json');

module.exports = {
	contracts_build_directory: './public/contracts',
	networks: {
		development: {
			host: '127.0.0.1', // Localhost (default: none)
			port: 7545, // Standard Ethereum port (default: none)
			network_id: '*', // Any network (default: none)
		},
		ropsten: {
			provider: () =>
				new HDWalletProvider({
					mnemonic: {
						phrase: keys.MNEMONIC,
					},
					providerOrUrl: `https://ropsten.infura.io/v3/${keys.INFURA_PROJECT_ID}`,
					addressIndex: 0,
				}),
			network_id: '3',
			gas: 5500000, // Gas Limit, How much gas we are willing to spent
			gasPrice: 20000000000, // how much we are willing to spent for unit of gas
			confirmations: 2, // number of blocks to wait between deployment
			timeoutBlocks: 200, // number of blocks before deployment times out
			networkCheckTimeout: 100000, // slow internet
		},
	},

	// Configure your compilers
	compilers: {
		solc: {
			version: '0.8.11', // Fetch exact version from solc-bin (default: truffle's version)
		},
	},
};

// > transaction hash:    0x23c69a312bd474d309732cb791c6aee4eb8797ad132fd9de8c11495ab894495f
// > Blocks: 2            Seconds: 25
// > contract address:    0x361C590F520050e7046f8285a4DD5d255f89b74E

// Transaction Fee: 0.00000002 * 1366162
