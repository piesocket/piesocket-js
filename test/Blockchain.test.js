import '@babel/polyfill';
import Blockchain from '../src/Blockchain';

const blockchainProperties = ["options", "apiKey","channel", "blockchainTestMode", "blockchainGasFee", "contractAddress"];
const PieMessageAddressDev = '0x2321c321828946153a845e69ee168f413e85c90d';
const PieMessageAddressProd = '0x2a840CA40E082DbF24610B62a978900BfCaB23D3';

describe('Blockchain', function () {

    let blockchain;

    beforeAll(()=>{
        blockchain = new Blockchain({});
    });

    it("#constructor() - Creates a valid Blockchain instance", ()=>{
        expect(Object.keys(blockchain)).toEqual(blockchainProperties);
    });

    it("#constructor() - Test mode usage test contract address", ()=>{
        let testModeBlockchain = new Blockchain({
            blockchainTestMode: true
        });

        expect(testModeBlockchain.contractAddress).toEqual(PieMessageAddressDev);
    });

    it("#checkWeb3() - Returns error when Web3.js is not available", ()=>{
        const result = blockchain.checkWeb3();
        expect(result).toEqual(false);
    });

    it("#confirm() - Returns error when Web3.js is not available", ()=>{
        const result = blockchain.confirm("0x00000000000");
    });

});