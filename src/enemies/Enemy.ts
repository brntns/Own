import * as Phaser from "phaser";
import Game from "../scenes/Game";

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  scene: Game;
  room: number;
  lives = 3;
  sprite: Phaser.Physics.Arcade.Sprite;

  constructor(scene: Game, x, y, room) {
    super(scene, x, y, "beholder");
    this.scale = 2;
    this.room = room;
    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);
    this.body.setSize(16, 16);
    this.sprite = this;
    this.sprite.anims.play("idle_beholder");
  }
  removeLives() {
    this.lives--;
    console.log("removing lives", this.lives);
    if (this.lives == 0) {
      this.destroy(true);
    }
  }
  destroy(fromScene?: boolean) {
    console.log("destroying");
    super.destroy(fromScene);
  }
  moveToPlayer(playerX: number, playerY: number, room: number): void {
    if (this.room === room) {
      const speed = 20; // Set a movement speed
      const angle = Phaser.Math.Angle.Between(this.x, this.y, playerX, playerY);
      const velocity = new Phaser.Math.Vector2(Math.cos(angle), Math.sin(angle))
        .normalize()
        .scale(speed);
      this.setVelocity(velocity.x, velocity.y);
    }
  }
}
