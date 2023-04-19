import * as Phaser from "phaser";
import Game from "../scenes/Game";

export default class Rock extends Phaser.GameObjects.Sprite {
  direction: string;

  constructor(
    scene: Game,
    x: number,
    y: number,
    texture: string,
    frame: number,
    room: number
  ) {
    super(scene, x, y, texture, frame);

    // scene.doors.add(this);
  }

  update() {}
}
