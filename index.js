const Web3 = require('web3');

class Transaction {
	web3;
	account;
	constructor (project_id, account) {
		this.web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/' + project_id));
		this.account = account.toLowerCase(); 
	}

	async checkBlock() {
		let block = await this.web3.eth.getBlock('latest');
		let block_number = block.number;
		console.log("block",block);
		console.log('searching block' + block_number);

		if (block != null && block.transactions != null) {
			for (const transaction_hash of block.transactions) {
			    let tx = await this.web3.eth.getTransactionReceipt(transaction_hash);
				if (this.account == tx.to.toLowerCase()) {
				 console.log('transaction found' + number );
				}
			}
	    } 
	}
}



let tx_chk = new Transaction('185f6d4e243e42998118f5e9511eb534', '0x1f294d266cDC9BE9F835440db50FF92b10Be7961');
setInterval(() => {
	tx_chk.checkBlock(); 
}, 10 * 1000);