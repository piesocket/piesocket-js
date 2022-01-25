import '@babel/polyfill';
import InvalidAuthException from '../src/InvalidAuthException';

describe('Invalid Auth Exception', function () {

    it("#constructor() - Returns valid exception instance", ()=>{
        const e = new InvalidAuthException();
        expect(e.message).toEqual('Auth endpoint did not return a valid JWT Token, please see: https://www.piesocket.com/docs/3.0/authentication');
        expect(e.name).toEqual('InvalidAuthException');
    })

    it("#constructor() - Returns valid exception instance with a custom message", ()=>{
        const message = "Something went wrong!";
        const e = new InvalidAuthException(message);
        expect(e.message).toEqual(message);
        expect(e.name).toEqual('InvalidAuthException');
    })
});