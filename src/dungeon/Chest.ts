import * as Phaser from "phaser";
import Game from "../scenes/Game";

export default class Chest extends Phaser.Physics.Arcade.Sprite {
  scene: Game;
  room: number;
  lives: number;
  sprite: Phaser.Physics.Arcade.Sprite;

  constructor(
    scene: Game,
    x: number,
    y: number,
    room: number,
    size: { x: number; y: number },
    texture: string,
  ) {
    super(scene, x, y, texture);
    this.scale = 2;
    this.room = room;
    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);
    this.body.setSize(size.x, size.y);
    this.body.immovable = true;
  
    this.sprite = this;
  }

  update() {
    this.setVelocity(0,0);
  }
}
