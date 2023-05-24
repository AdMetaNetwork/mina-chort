var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Field, SmartContract, state, State, method, Poseidon, Circuit, Bool } from 'snarkyjs';
export class Score extends SmartContract {
    constructor() {
        super(...arguments);
        this.levelHash = State();
        this.changeCount = State();
        this.events = {
            'update-user-level': Field,
        };
    }
    initState(levelHash) {
        this.changeCount.set(Field(0));
        this.levelHash.set(levelHash);
    }
    updateUserLevel(score, level) {
        const levelHash = this.levelHash.get();
        this.levelHash.assertEquals(levelHash);
        const allLevel = [Field(50), Field(100), Field(200), Field(500)];
        this.levelHash.assertEquals(Poseidon.hash(allLevel));
        const condition = new Array(allLevel.length).fill(Bool(false));
        const localLevel = new Array(allLevel.length).fill(Field(0));
        allLevel.map((item, index) => {
            condition[index] = item.equals(score);
            localLevel[index] = Field(index).add(1);
        });
        let l = Circuit.switch(condition, Field, localLevel);
        l.assertEquals(level);
        const changeCount = this.changeCount.get();
        this.changeCount.assertEquals(changeCount);
        this.emitEvent("update-user-level", level);
        this.changeCount.set(changeCount.add(1));
    }
}
__decorate([
    state(Field),
    __metadata("design:type", Object)
], Score.prototype, "levelHash", void 0);
__decorate([
    state(Field),
    __metadata("design:type", Object)
], Score.prototype, "changeCount", void 0);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Field]),
    __metadata("design:returntype", void 0)
], Score.prototype, "initState", null);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Field, Field]),
    __metadata("design:returntype", void 0)
], Score.prototype, "updateUserLevel", null);
//# sourceMappingURL=Score.js.map