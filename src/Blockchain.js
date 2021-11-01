import PieMessage from './PieMessage.json';
const PieMessageAddress = '0x8D9F7c78D4B3F955B57cB10b4A1fdc9f88B31B01';

export default class Blockchain {
	async send(data) {
		if (typeof Web3 == 'undefined') {
			console.error('Web.js is not installed!');
			return;
		}

		if (typeof window.ethereum == 'undefined') {
			console.error('MetaMask is not installed!');
			return;
		}

		const w3 = new Web3(window.ethereum);

		const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
		const account = accounts[0];

		const contract = new w3.eth.Contract(PieMessage.abi, PieMessageAddress);

		contract.methods.record(["0xdFAb80D25f67fAD043D5003934608dc0E038dC5f"], "Hey").send({ from: account })
			.then(function (receipt) {
				console.log(receipt);
			});
	}
}