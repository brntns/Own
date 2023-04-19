import * as Phaser from "phaser";
import Game from "../scenes/Game";

export default class Door extends Phaser.GameObjects.Sprite {
  direction: string;

  constructor(scene: Game, x: number, y: number, direction: string) {
    super(scene, x, y, "door");

    this.direction = direction;
    this.name = direction;
    scene.doors.add(this);
  }

  update() {}
}
