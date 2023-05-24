import { Field, SmartContract, State } from 'snarkyjs';
export declare class Score extends SmartContract {
    levelHash: State<Field>;
    changeCount: State<Field>;
    events: {
        'update-user-level': typeof Field;
    };
    initState(levelHash: Field): void;
    updateUserLevel(score: Field, level: Field): void;
}
