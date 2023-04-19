import * as Phaser from "phaser";
import Game from "../scenes/Game";

export default class Bullet extends Phaser.GameObjects.Sprite {
  constructor(
    scene: Game,
    x: number,
    y: number,
    velocityY: number,
    velocityX: number
  ) {
    super(scene, x, y, "bullet");

    scene.add.existing(this);
    scene.physics.world.enableBody(this);
    this.body.position.x = x;
    this.body.position.y = y;
    this.body.velocity.y = velocityY;
    this.body.velocity.x = velocityX;

    scene.projectiles.add(this);
  }

  update() {
 
  }
}
