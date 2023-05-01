import * as Phaser from "phaser";
import Game from "../scenes/Game";

export default class Chest extends Phaser.GameObjects.Sprite {
  constructor(
    scene: Game,
    x: number,
    y: number,
    texture: string,
    frame: number
  ) {
    super(scene, x, y, texture, frame);
    
    scene.chests.add(this);
  }

  update() {}
}
