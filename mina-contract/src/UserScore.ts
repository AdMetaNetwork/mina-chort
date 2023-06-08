import {
  Bool,
  Circuit,
  CircuitValue,
  DeployArgs,
  Field,
  MerkleWitness,
  method,
  Permissions,
  PrivateKey,
  Poseidon,
  prop,
  PublicKey,
  Reducer,
  SmartContract,
  state,
  State,
  Struct,
  CircuitString
} from 'snarkyjs';

const MAX_MERKLE_TREE_HEIGHT = 32; // max 2^32 voters is supported

export class MerkleWitnessClass extends MerkleWitness(MAX_MERKLE_TREE_HEIGHT) { }

export class ScoreLevel extends Struct({
  key: PublicKey,
  level: Field,
  score: Field,
  categoryScores: Field,
  witness: MerkleWitnessClass
}) {
  constructor(key: PublicKey, level: Field, score: Field, categoryScores: Field, witness: MerkleWitnessClass) {
    super({ key, level, score, categoryScores, witness });
    this.key = key;
    this.level = level;
    this.score = score;
    this.categoryScores = categoryScores;
    this.witness = witness;
  }

  hash(): Field {
    return Poseidon.hash(this.key.toFields().concat(this.level.toFields()).concat(this.score.toFields()).concat(this.categoryScores.toFields()));
  }

  setNull(
    level: Field,
    score: Field,
    categoryScores: Field,
  ): ScoreLevel {
    return new ScoreLevel(this.key, level, score, categoryScores, this.witness);
  }

}

export class UserScore extends SmartContract {
  @state(Field) userScoreTree = State<Field>();
  @state(Field) userScoreTreeAccumulator = State<Field>();
  @state(Field) levelHash = State<Field>();

  reducer = Reducer({ actionType: ScoreLevel });

  deploy(args: DeployArgs) {
    super.deploy(args);
    this.setPermissions({
      ...Permissions.default(),
      editState: Permissions.proofOrSignature(),
      editSequenceState: Permissions.proofOrSignature(),
    });

    this.userScoreTree.set(Field(0));
    this.userScoreTreeAccumulator.set(Reducer.initialActionsHash);
    this.levelHash.set(Field(0))
  }

  @method initStatus(
    userScoreTree: Field,
    levelHash: Field
  ) {
    this.userScoreTree.set(userScoreTree);
    this.levelHash.set(levelHash)
  }

  @method setNull(
    key: PublicKey,
    path: MerkleWitnessClass
  ) {

    const currentUserScoreTree = this.userScoreTree.get()
    this.userScoreTree.assertEquals(currentUserScoreTree)
    const newUserScoreLevel = new ScoreLevel(key, Field(0), Field(0), Field(0), path);
    path.calculateRoot(newUserScoreLevel.hash()).assertEquals(currentUserScoreTree);

    const newUser = new ScoreLevel(key, Field(0), Field(0), Field(0), path);
    const newUserTree = path.calculateRoot(newUser.hash());
    this.userScoreTree.set(newUserTree);
  }

  @method addUser(
    levelHash: Field,
    key: PublicKey,
    level: Field,
    score: Field,
    categoryScores: Field,
    path: MerkleWitnessClass
  ) {
    // assert level hash
    const currentLevelHash = this.levelHash.get()
    this.levelHash.assertEquals(currentLevelHash)
    currentLevelHash.assertEquals(levelHash)

    const currentUserScoreTree = this.userScoreTree.get()
    this.userScoreTree.assertEquals(currentUserScoreTree)

    const currentUserScoreTreeAccumulator = this.userScoreTreeAccumulator.get()
    this.userScoreTreeAccumulator.assertEquals(currentUserScoreTreeAccumulator)

    const newUserScoreLevel = new ScoreLevel(key, level, score, categoryScores, path);
    path.calculateRoot(newUserScoreLevel.hash()).assertEquals(currentUserScoreTree);

    // Dispatch the event
    this.reducer.dispatch(newUserScoreLevel);
  }

  @method level(
    key: PublicKey
  ) {
    const currentUserScoreTree = this.userScoreTree.get()
    this.userScoreTree.assertEquals(currentUserScoreTree)

    const currentUserScoreTreeAccumulator = this.userScoreTreeAccumulator.get()
    this.userScoreTreeAccumulator.assertEquals(currentUserScoreTreeAccumulator)

    const { state: userLevel, actionsHash: newCurrentUserScoreTreeAccumulator } = this.reducer.reduce(
      this.reducer.getActions({ fromActionHash: currentUserScoreTreeAccumulator }),
      Field,
      (state: Field, action: ScoreLevel) => {
        return Circuit.if(action.key.equals(key), action.level, Field(0)); 
      },
      { state: Field(0), actionsHash: currentUserScoreTreeAccumulator }
    );
    return userLevel

  }

}


