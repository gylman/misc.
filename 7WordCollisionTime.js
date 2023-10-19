const EthereumTx = require('ethereumjs-tx').Transaction;
const ethUtil = require('ethereumjs-util');
const crypto = require('crypto');

function mockEthereumTransaction(value) {
  // Generate a mock sender private key and address
  const senderPrivateKey = crypto.randomBytes(32);
  const senderAddress = ethUtil.privateToAddress(senderPrivateKey);

  // Generate a mock receiver address
  const receiverPrivateKey = crypto.randomBytes(32);
  const receiverAddress = ethUtil.privateToAddress(receiverPrivateKey);

  // Create a mock transaction
  const txParams = {
    nonce: '0x00',
    gasPrice: '0x09184e72a000', // 40 Gwei
    gasLimit: '0x1e8480', // 2000000
    to: `0x${receiverAddress.toString('hex')}`,
    value: ethUtil.toBuffer(value), // Incrementing value in wei
    chainId: 1, // 1 is the chain ID for the Ethereum mainnet
  };

  // Create and sign the transaction
  const tx = new EthereumTx(txParams, { chain: 'mainnet' });
  tx.sign(senderPrivateKey);

  // Serialize and hash the transaction
  const serializedTx = tx.serialize();
  const transactionHash = ethUtil.keccak256(serializedTx);

  return `0x${transactionHash.toString('hex')}`;
}

const transactions = [];

const startTime = new Date(); // Record the start time

for (let i = 1; i <= 1000; i++) {
  const hash = mockEthereumTransaction(i);
  transactions.push(hash);
}

const endTime = new Date(); // Record the end time

const elapsedTime = endTime - startTime; // Compute the difference in milliseconds

console.log(`Generated 1000 transactions in ${elapsedTime} ms`);

