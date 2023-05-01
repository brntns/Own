import * as Phaser from "phaser";
import Game from "../scenes/Game";

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  scene: Game;
  room: number;

  constructor(scene: Game, x, y, room) {
    super(scene, x, y, "beholder");
    this.scale = 2;
    this.room = room;
    this.scene = scene;
    scene.add.existing(this);
    this.scene.physics.world.enable(this);
    this.body.setSize(16, 16);
  }
  update(player, room) {
    if (this.room === room) {
      const dx = player.x - this.x;
      const dy = player.y - this.y;
      const angle = Math.atan2(dy, dx);
      const speed = 100;
      this.x += speed * Math.cos(angle);
      this.y += speed * Math.sin(angle);
    }
  }
  moveToPlayer(playerX: number, playerY: number, room: number): void {
    if (this.room === room) {
      const speed = 50;
      const angle = Phaser.Math.Angle.Between(this.x, this.y, playerX, playerY);
      const distance = Phaser.Math.Distance.Between(
        this.x,
        this.y,
        playerX,
        playerY
      );
      const duration = (distance / speed) * 1000;
      const tween = this.scene.add.tween({
        targets: this,
        x: playerX,
        y: playerY,
        duration: duration,
        ease: "Linear",
        repeat: 0,
      });
    }
  }
}
