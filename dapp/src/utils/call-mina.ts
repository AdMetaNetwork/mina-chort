import { Score } from '../../build_mina/src';

import {
  isReady,
  shutdown,
  Field,
  Mina,
  PrivateKey,
  AccountUpdate, Poseidon,
} from 'snarkyjs';



const ZK = async () => {
  await isReady;

  console.log('SnarkyJS loaded');

  const useProof = false;

  const Local = Mina.LocalBlockchain({ proofsEnabled: useProof });
  Mina.setActiveInstance(Local);
  const { privateKey: deployerKey, publicKey: deployerAccount } =
    Local.testAccounts[0];
  const { privateKey: senderKey, publicKey: senderAccount } =
    Local.testAccounts[1];

  const zkAppPrivateKey = PrivateKey.random();
  const zkAppAddress = zkAppPrivateKey.toPublicKey();

  // @ts-ignore
  const zkAppInstance = new Score(zkAppAddress);
  const levels = [Field(50), Field(100), Field(200), Field(500)]
  const deployTxn = await Mina.transaction(deployerAccount, () => {
    AccountUpdate.fundNewAccount(deployerAccount);
    zkAppInstance.deploy();
    zkAppInstance.initState(Poseidon.hash(levels));
  });
  await deployTxn.prove();
  await deployTxn.sign([deployerKey, zkAppPrivateKey]).send();

  const num0 = zkAppInstance.levelHash.get();
  console.log('state after init:', num0.toString());

}

export default ZK
