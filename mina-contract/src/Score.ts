import { Field, SmartContract, state, State, method, Poseidon, Circuit, Bool, DeployArgs, Permissions } from 'snarkyjs';

export class Score extends SmartContract {
  @state(Field) levelHash = State<Field>();
  @state(Field) changeCount = State<Field>();

  events = {
    'update-user-level': Field,
  };

  @method initState( levelHash: Field) {
    this.changeCount.set(Field(0))
    this.levelHash.set(levelHash);
  }

  @method updateUserLevel(score: Field, level: Field) {
    const levelHash = this.levelHash.get()
    this.levelHash.assertEquals(levelHash)

    const allLevel = [Field(50), Field(100), Field(200), Field(500)]
    this.levelHash.assertEquals(Poseidon.hash(allLevel))
    const condition = new Array<Bool>(allLevel.length).fill(Bool(false))
    const localLevel = new Array<Field>(allLevel.length).fill(Field(0))

    allLevel.map((item, index) => {
      condition[index] = item.equals(score)
      localLevel[index] = Field(index).add(1)
    })

    let l = Circuit.switch(condition, Field, localLevel);

    l.assertEquals(level)

    const changeCount = this.changeCount.get()
    this.changeCount.assertEquals(changeCount)

    this.emitEvent("update-user-level", level);
    this.changeCount.set(changeCount.add(1))

  }
}
