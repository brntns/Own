import * as Phaser from "phaser";

import Beholder from "../enemies/Beholder";
import Dungeon from "../dungeon/Dungeon";
import Player from "../player/Player";
import Door from "../dungeon/Door";

export const WIDTH = 608;
export const HEIGHT = 352;

export default class Game extends Phaser.Scene {
  player!: Player;
  projectiles!: Phaser.GameObjects.Group;
  beholders!: Phaser.GameObjects.Group;
  dungeon!: Dungeon;
  doors!: Phaser.GameObjects.Group;
  doorCollider: Phaser.Physics.Arcade.Collider;

  constructor() {
    super({ key: "Game" });
  }
  reload() {
    this.scene.restart();
  }
  create() {
    // initiate projectile group
    this.projectiles = this.add.group();
    this.beholders = this.add.group();
    this.doors = this.physics.add.staticGroup();
    // create dungeon
    this.dungeon = new Dungeon(this);
    //create player
    this.player = new Player(this, 100, 100);
    // Camera
    this.cameras.main.setBounds(0, 0, WIDTH * 4, HEIGHT * 4);

    // Create Beholder
    this.createEnemies();
    // Collision
    this.physics.add.collider(this.player.sprite, this.dungeon.map);
    this.physics.add.collider(this.beholders, this.player.sprite);
    this.physics.add.collider(this.beholders, this.dungeon.map);

    const that = this;

    this.physics.add.collider(
      this.projectiles,
      this.beholders,
      function (projectile, enemy) {
        const behold = enemy as Beholder;
        behold.removeLives();
        projectile.destroy();
        that.checkRoomForEnemies();
      }
    );

    this.doorCollider = this.physics.add.collider(
      this.doors,
      this.player.sprite,
      function (p, door) {
        const next = door as Door;
        that.dungeon.changeRoom(next);
      }
    );

    this.physics.add.collider(
      this.projectiles,
      this.dungeon.map,
      function (projectile) {
        projectile.destroy();
      }
    );
  }
  checkRoomForEnemies() {
    if (this.beholders.getMatching("room", this.dungeon.room).length == 0) {
      this.dungeon.openDoors();
    }
  }
  createEnemies() {
    for (let width = 0; width < 4; width++) {
      for (let height = 0; height < 4; height++) {
        for (let index = 0; index < 3; index++) {
          new Beholder(
            this,
            width * WIDTH + (100 + index * 20),
            height * HEIGHT + (100 + index * 20),
            "beholder",
            1,
            height * 4 + width + 1
          );
        }
      }
    }
  }
  update() {
    this.player.update();
  }
}
