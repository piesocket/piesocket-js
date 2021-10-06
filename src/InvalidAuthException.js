export default class InvalidAuthException{
  constructor(message, name="InvalidAuthException") {
    this.message = "Auth endpoint did not return a valid JWT Token, please see: https://www.piesocket.com/docs/3.0/authentication";
    this.name = name;  
  }
}