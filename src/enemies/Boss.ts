import * as Phaser from "phaser";
import Game from "../scenes/Game";

export default class Boss {
  private scene: Game;
  sprite: Phaser.Physics.Arcade.Sprite;

  constructor(scene: Game, x: number, y: number) {
    this.scene = scene;

    this.sprite = scene.physics.add.sprite(x, y, "tron", 0);
    this.sprite.setSize(10, 10);
    this.sprite.scale = 2;
  }

  update() {}

  destroy() {
    this.sprite.destroy();
  }
}
