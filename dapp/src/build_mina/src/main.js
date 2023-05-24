import { Score } from './Score.js';
import { isReady, shutdown, Field, Mina, PrivateKey, AccountUpdate, Poseidon, } from 'snarkyjs';
await isReady;
console.log('SnarkyJS loaded');
const useProof = false;
const Local = Mina.LocalBlockchain({ proofsEnabled: useProof });
Mina.setActiveInstance(Local);
const { privateKey: deployerKey, publicKey: deployerAccount } = Local.testAccounts[0];
const { privateKey: senderKey, publicKey: senderAccount } = Local.testAccounts[1];
const salt = Field.random();
// ----------------------------------------------------
// create a destination we will deploy the smart contract to
const zkAppPrivateKey = PrivateKey.random();
const zkAppAddress = zkAppPrivateKey.toPublicKey();
const zkAppInstance = new Score(zkAppAddress);
const levels = [Field(50), Field(100), Field(200), Field(500)];
const deployTxn = await Mina.transaction(deployerAccount, () => {
    AccountUpdate.fundNewAccount(deployerAccount);
    zkAppInstance.deploy();
    zkAppInstance.initState(Poseidon.hash(levels));
});
await deployTxn.prove();
await deployTxn.sign([deployerKey, zkAppPrivateKey]).send();
// get the initial state of IncrementSecret after deployment
const num0 = zkAppInstance.levelHash.get();
console.log('state after init:', num0.toString());
// ----------------------------------------------------
const txn1 = await Mina.transaction(senderAccount, () => {
    zkAppInstance.updateUserLevel(Field(100), Field(2));
});
await txn1.prove();
await txn1.sign([senderKey]).send();
const num1 = zkAppInstance.levelHash.get();
console.log('state after txn1:', num1.toString());
// ----------------------------------------------------
console.log('Shutting down');
await shutdown();
//# sourceMappingURL=main.js.map