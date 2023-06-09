import * as Phaser from "phaser";
import Game from "../scenes/Game";

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  scene: Game;
  room: number;
  lives: number;
  sprite: Phaser.Physics.Arcade.Sprite;
  private nextFire = 0;

  constructor(
    scene: Game,
    x: number,
    y: number,
    room: number,
    size: { x: number; y: number },
    texture: string,
    lives: number
  ) {
    super(scene, x, y, texture);
    this.scale = 2;
    this.room = room;
    this.scene = scene;
    this.lives = lives;
    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);
    this.body.setSize(size.x, size.y);
    this.sprite = this;
    this.sprite.anims.play("idle_" + texture);
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
  private fireBullet(player: Phaser.Physics.Arcade.Sprite): void {
    if (this.scene.time.now > this.nextFire) {
      const bullet = this.scene.physics.add.sprite(this.x, this.y, 'bullet');
      this.scene.enemyprojectiles.add(this);
      bullet.setImmovable(true);
      this.scene.physics.moveToObject(bullet, player, 300);
      this.nextFire = this.scene.time.now + 3000; // 3 seconds delay for the next bullet
    }
  }
  moveToPlayer(player: Phaser.Physics.Arcade.Sprite, room: number): void {
    if (this.room === room) {
      const distance = Phaser.Math.Distance.Between(
        this.sprite.x,
        this.sprite.y,
        player.x,
        player.y
      );

      if (distance <= 150) {
        this.fireBullet(player);
        const angle = Phaser.Math.Angle.Between(
          this.sprite.x,
          this.sprite.y,
          player.x,
          player.y
        );
        const speed = 20;
        const velocity = new Phaser.Math.Vector2();
        Phaser.Math.Easing.Sine.Out(0.5);
        velocity.setToPolar(angle, speed);
        this.sprite.setVelocity(velocity.x, velocity.y);
      } else {
        this.sprite.setVelocity(0, 0);
      }
    }
  }
}
