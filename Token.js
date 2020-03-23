const express = require("express");
const app = express();
const web3 = require('web3');
const Tx = require('ethereumjs-tx');
console.log("Count======= ");
//Infura HttpProvider Endpoint
web3js = new web3(new web3.providers.HttpProvider("https://kovan.infura.io/v3/185f6d4e243e42998118f5e9511eb534"));

app.get('/sendtx',function(req,res){

var myAddress = '0x1f294d266cDC9BE9F835440db50FF92b10Be7961';
var privateKey = Buffer.from('07218A163E0A300C5D6693CF0AB3DDC9D4F26835DEA0A9EB4ADDA181F26D039B', 'hex')
var toAddress = '0x57B6b6B87e6CB408527ED247f18B6ae2C38fD75A';

//contract abi is the array that you can get from the ethereum wallet or etherscan
var contractABI = [{}];
var contractAddress = "0xb67c108c4195e1f243c014fa4ea4c550e6d9e100";
//creating contract object
var contract = new web3js.eth.Contract(contractABI,contractAddress);

var count;
// get transaction count, later will used as nonce
web3js.eth.getTransactionCount(myAddress).then(function(v){
console.log("Count: "+v);
count = v;
var amount = web3js.utils.toHex(1e16);
//creating raw tranaction
var rawTransaction = {
	"from": myAddress, 
	"gasPrice": web3js.utils.toHex(20* 1e9),
	"gasLimit": web3js.utils.toHex(210000),
	"to": contractAddress,
	"value":"0x0",
	"data": contract.methods.transfer(toAddress, amount).encodeABI(),
	"nonce": web3js.utils.toHex(count)
}

console.log(rawTransaction);
//creating tranaction via ethereumjs-tx
var transaction = new Tx(rawTransaction);
//signing transaction with private key
transaction.sign(privateKey);
//sending transacton via web3js module
web3js.eth.sendSignedTransaction('0x'+transaction.serialize().toString('hex'))
.on('transactionHash', console.log);

  contract.methods.balanceOf(myAddress).call().then(function(balance){
	console.log(balance)});
  })
});
console.log("Count======= ");
module.exports = app;