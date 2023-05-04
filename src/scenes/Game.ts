import * as Phaser from "phaser";

import Dungeon from "../dungeon/Dungeon";
import Player from "../player/Player";
import Door from "../dungeon/Door";
import Enemy from "../enemies/Enemy";
export const WIDTH = 608;
export const HEIGHT = 352;

export default class Game extends Phaser.Scene {
  player!: Player;
  projectiles!: Phaser.GameObjects.Group;
  beholders!: Phaser.GameObjects.Group;
  dungeon!: Dungeon;
  doors!: Phaser.GameObjects.Group;
  doorCollider: Phaser.Physics.Arcade.Collider;
  chests: Phaser.Physics.Arcade.StaticGroup;
  enemies: Phaser.GameObjects.Group;

  constructor() {
    super({ key: "Game" });
  }
  reload() {
    this.scene.restart();
  }
  create() {
    // initiate projectile group
    this.projectiles = this.add.group();
    this.doors = this.physics.add.staticGroup();
    this.chests = this.physics.add.staticGroup();
    this.enemies = this.add.group();
    // create dungeon
    this.dungeon = new Dungeon(
      this,
      Math.floor(Math.random() * 11) + 10,
      Math.floor(Math.random() * 11) + 10
    );
    //create player
    this.player = new Player(
      this,
      this.dungeon.navi[1] * WIDTH + WIDTH / 2,
      this.dungeon.navi[0] * HEIGHT + HEIGHT / 2,
      15
    );
    this.createEnemies(this.dungeon.Map);
    // Camera
    this.cameras.main.pan(this.player.sprite.x, this.player.sprite.y, 1600);
    // Collision
    const that = this;
    this.physics.add.collider(this.player.sprite, this.dungeon.map);
    this.physics.add.collider(this.enemies, this.player.sprite, function () {
      that.player.sprite.x = that.player.sprite.x + 50;
      that.player.removeLives();
    });
    this.physics.add.collider(this.enemies, this.dungeon.map);
    this.physics.add.collider(this.enemies, this.player.sprite);
    this.physics.add.collider(this.enemies, this.enemies);

    this.physics.add.collider(
      this.projectiles,
      this.enemies,
      function (projectile, enemy) {
        const behold = enemy as Enemy;
        behold.removeLives();
        projectile.destroy();
        // that.checkRoomForEnemies();
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
  createChests(){

  }
  createEnemies(map) {
    const rooms = [];

    // Get all rooms from the dungeon map
    for (let row = 0; row < map.length; row++) {
      for (let col = 0; col < map[row].length; col++) {
        if (map[row][col] === 1) {
          rooms.push({ x: col * WIDTH + 100, y: row * HEIGHT + 100, row, col });
        }
      }
    }

    // Create an enemy in each room
    for (let i = 0; i < rooms.length; i++) {
      for (let index = 0; index < 3; index++) {
        const enemy = new Enemy(
          this,
          rooms[i].x + index * 100,
          rooms[i].y + index * 100,
          rooms[i].row * this.dungeon.Map.length + rooms[i].col,
          { x: 16, y: 16 },
          "beholder",
          3
        );
        this.enemies.add(enemy);
      }
    }
  }
  update() {
    this.player.update();
    this.enemies.getChildren().forEach((enemy: Enemy) => {
      enemy.moveToPlayer(this.player.sprite, this.dungeon.room);
    });
  }
}
