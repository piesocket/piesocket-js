import PieMessage from './PieMessage.json';
const BCMEndpoint = 'https://www.piesocket.com/api/blockchain/payloadHash';
const PieMessageAddress = '0x2321c321828946153a845e69ee168f413e85c90d';

export default class Blockchain {

	constructor(apiKey, channel) {
		this.apiKey = apiKey;
		this.channel = channel;

	}

	async init() {
		const w3 = new Web3(window.ethereum);
		const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
		this.account = accounts[0];

		this.contract = new w3.eth.Contract(PieMessage.abi, PieMessageAddress);
	}

	checkWeb3() {
		if (typeof Web3 == 'undefined') {
			console.error('Web.js is not installed!');
			return false;
		}

		if (typeof window.ethereum == 'undefined') {
			console.error('MetaMask is not installed!');
			return false;
		}

		return true;
	}

	async confirm(hash) {
		return new Promise(async (resolve, reject) => {

			if (this.checkWeb3()) {
				if (!this.contract) {
					await this.init();
				}

				const receipt = this.contract.methods.confirm(hash).send({ from: this.account });
				receipt.on('transactionHash', resolve)
				receipt.on('error', (error) => {
					reject(error);
				});
			}

		});
	}

	async send(message) {
		return new Promise(async (resolve, reject) => {

			if (this.checkWeb3()) {
				if (!this.contract) {
					await this.init();
				}

				const bacmHash = await this.getTransactionHash(message);

				const receipt = this.contract.methods.send(bacmHash.payload).send({ from: this.account });
				receipt.on('transactionHash', (hash) => {
					resolve({
						hash: hash,
						id: bacmHash.transaction_id
					});
				})
				receipt.on('error', (error) => {
					reject(error);
				});

			} else {
				if (typeof Web3 == 'undefined') {
					reject("Please install Web3.js");
				} else {
					reject("Please install MetaMask");
				}
			}
		});
	}

	async getTransactionHash(message) {
		return new Promise((resolve, reject) => {
			var data = new FormData();

			data.append("apiKey", this.apiKey);
			data.append("channel", this.channel);
			data.append("message", JSON.stringify(message));

			var xhr = new XMLHttpRequest();

			xhr.addEventListener("readystatechange", function () {
				if (this.readyState === 4) {
					try {
						const response = JSON.parse(this.responseText);
						if (response.errors) {
							console.error(`PieSocket Error: ${JSON.stringify(response.errors)}`);
							reject();
						}

						if (response.success) {
							resolve(response.success);
						} else {
							reject("Unknown error");
						}
					} catch (e) {
						console.error("Could not connect to Blockchain Messaging API, try later");
						reject();
					}
				}
			});

			xhr.addEventListener('error', () => {
				console.error("Blockchain Messaging API seems unreachable at the moment, try later");
				reject();
			});

			xhr.open("POST", BCMEndpoint);
			xhr.setRequestHeader("Accept", "application/json");
			xhr.send(data);
		});
	}
}