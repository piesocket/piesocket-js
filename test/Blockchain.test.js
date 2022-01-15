import '@babel/polyfill';
import Blockchain from '../src/Blockchain';

const blockchainProperties = ["options", "apiKey","channel", "blockchainTestMode", "blockchainGasFee", "contractAddress"];

describe('Blockchain', function () {

    let blockchain;

    beforeAll(()=>{
        blockchain = new Blockchain({});
    });

    it("#constructor() - Creates a valid Blockchain instance", ()=>{
        expect(Object.keys(blockchain)).toEqual(blockchainProperties);
    });

    it("#checkWeb3() - Returns error when Web3.js is not available", ()=>{
        const result = blockchain.checkWeb3();
        expect(result).toEqual(false);
    });

    it("#confirm() - Returns error when Web3.js is not available", ()=>{
        const result = blockchain.confirm("0x00000000000");
    });


});