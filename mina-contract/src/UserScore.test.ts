import {
  AccountUpdate,
  Bool,
  Circuit,
  CircuitString,
  Field,
  isReady,
  MerkleTree,
  Mina,
  Poseidon,
  PrivateKey,
  PublicKey,
  shutdown,
} from 'snarkyjs';

import {
  ScoreLevel,
  MerkleWitnessClass,
  UserScore
} from './UserScore';

const MAX_MERKLE_TREE_HEIGHT = 32;
let allLevel: Field[]
let levelHash: Field

let testAccounts: {
  publicKey: PublicKey;
  privateKey: PrivateKey;
}[]; // Test Accounts

function createLocalBlockchain() {
  const Local = Mina.LocalBlockchain();
  Mina.setActiveInstance(Local);
  testAccounts = Local.testAccounts;
  return Local.testAccounts[0].privateKey;
}

let userScoreTree: MerkleTree
let scoreLevel: Field

describe('UserScore', () => {
  let deployerAccount: PrivateKey,
    zkAppAddress: PublicKey,
    zkAppPrivateKey: PrivateKey,
    zkAppInstance: UserScore;

  beforeAll(async () => {
    await isReady;
    userScoreTree = new MerkleTree(MAX_MERKLE_TREE_HEIGHT)
    allLevel = [Field(50), Field(100), Field(200), Field(500)]
    levelHash = Poseidon.hash(allLevel);
    deployerAccount = createLocalBlockchain();
    zkAppPrivateKey = PrivateKey.random();
    zkAppAddress = zkAppPrivateKey.toPublicKey();
    zkAppInstance = new UserScore(zkAppAddress);
    const txn = await Mina.transaction(deployerAccount, () => {
      AccountUpdate.fundNewAccount(deployerAccount);

      scoreLevel = new ScoreLevel(testAccounts[1].publicKey, Field(0), Field(0), Field(0), new MerkleWitnessClass(userScoreTree.getWitness(BigInt(0)))).hash()

      zkAppInstance.deploy({ zkappKey: zkAppPrivateKey });
    });
    await txn.send();
  });

  afterAll(async () => {
    setTimeout(shutdown, 0);
  });

  it('generates and deploys the `UserScore` smart contract', async () => {
    userScoreTree.setLeaf(BigInt(0), scoreLevel);
    const txn = await Mina.transaction(deployerAccount, () => {
      zkAppInstance.initStatus(
        userScoreTree.getRoot(),
        levelHash
      );
      zkAppInstance.sign(zkAppPrivateKey);
    });
    await txn.send();

    expect(zkAppInstance.userScoreTree.get()).toEqual(userScoreTree.getRoot());
    expect(zkAppInstance.levelHash.get()).toEqual(levelHash);
  });

  it('add user score', async () => {
    const txn = await Mina.transaction(deployerAccount, () => {
      expect(zkAppInstance.userScoreTree.get()).toEqual(userScoreTree.getRoot());
      zkAppInstance.setNull(
        testAccounts[1].publicKey,
        (new MerkleWitnessClass(userScoreTree.getWitness(BigInt(0)))), 
      );
      zkAppInstance.sign(zkAppPrivateKey);
    });
    await txn.send();

    const txn1 = await Mina.transaction(deployerAccount, () => {
      expect(zkAppInstance.levelHash.get()).toEqual(levelHash);
      expect(zkAppInstance.userScoreTree.get()).toEqual(userScoreTree.getRoot());

      zkAppInstance.addUser(
        levelHash,
        testAccounts[1].publicKey,
        Field(0),
        Field(0),
        Field(0),
        (new MerkleWitnessClass(userScoreTree.getWitness(BigInt(0)))),
      );
      zkAppInstance.sign(zkAppPrivateKey);
    });
    await txn1.send();

    const user = new ScoreLevel(testAccounts[1].publicKey, Field(0), Field(0), Field(0), new MerkleWitnessClass(userScoreTree.getWitness(BigInt(0)))).hash(); // Update offchain storage
    userScoreTree.setLeaf(BigInt(0), user);

    expect(zkAppInstance.userScoreTree.get()).toEqual(userScoreTree.getRoot());
  })

});
