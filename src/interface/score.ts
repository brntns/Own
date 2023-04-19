import { Text } from "./text";

export enum ScoreOperations {
  INCREASE,
  DECREASE,
  SET_VALUE,
}

export class Score extends Text {
  private scoreValue: number;

  constructor(scene: Phaser.Scene, x: number, y: number, initScore = 0) {
    super(scene, x, y, `Room: ${initScore}`);
    scene.add.existing(this);

    this.scoreValue = initScore;
  }

  public changeValue(value: number): void {
    this.scoreValue = value;
    this.setText(`Room: ${this.scoreValue}`);
  }

  public getValue(): number {
    return this.scoreValue;
  }
}
