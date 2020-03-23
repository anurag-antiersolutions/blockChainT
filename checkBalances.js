const express = require("express");
const app = express();
const Web3 = require('web3');
const EthereumTx = require('ethereumjs-tx').Transaction;
const infuraNetwork = `https://kovan.infura.io/v3/${'185f6d4e243e42998118f5e9511eb534'}`;
const web3 = new Web3(new Web3.providers.HttpProvider(infuraNetwork));
const axios = require('axios');


async function transferFund(sendersData, recieverData, amountToSend) {
try {
	return new Promise(async (resolve, reject) => {
		var nonce = await web3.eth.getTransactionCount(sendersData.address);
		web3.eth.getBalance(sendersData.address, async (err, result) => {
			if (err) {
			  return reject();
			}

			let balance = web3.utils.fromWei(result,"ether"); console.log(balance + "ETH===19");
			if (balance < amountToSend) { console.log('insufficient funds');
				return reject();
			}

			let gasPrices = await getCurrentGasPrices();
			let details = {
				"to": recieverData.address,
				"gas": 31001,
				"gasPrice": gasPrices.low * 10000.000000,
				"nonce": nonce,
				"chainId": 42 // EIP 155 chainId - kovan network
			};

			const transaction = new EthereumTx(details, { chain: 'kovan' });
			let privateKey = sendersData.privateKey;
			let privKey = Buffer.from(privateKey, 'hex');
			transaction.sign(privKey);
			const serializedTransaction = transaction.serialize();

			web3.eth.sendSignedTransaction('0x' + serializedTransaction.toString('hex'), (err, id) => {
			if (err) {
				console.log("error:" + err);
				return reject();
			}
            console.log("=====id=======",id,"\n\n");
			const url = `https://api.infura.io/v1/jsonrpc/kovan/tx/${'185f6d4e243e42998118f5e9511eb534'}`;				 
				resolve({id: id, link: url});
			});
		});
	});
}catch (error) {
  console.log(error);
}
}

async function getCurrentGasPrices() {
	let response = await axios.get('https://ethgasstation.info/json/ethgasAPI.json');
	let prices = {
		low: response.data.safeLow / 10,
		medium: response.data.average / 10,
		high: response.data.fast / 10
	};
	return prices;
}

transferFund({ address: '0x1f294d266cDC9BE9F835440db50FF92b10Be7961', privateKey: '07218A163E0A300C5D6693CF0AB3DDC9D4F26835DEA0A9EB4ADDA181F26D039B' }, { address: '0x57B6b6B87e6CB408527ED247f18B6ae2C38fD75A' }, 0.10);

module.exports = app;