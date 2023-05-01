import * as Phaser from "phaser";

// import Beholder from "../enemies/Beholder";
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
    // Enemy.preloadAssets(this);
  }
  create() {
    // initiate projectile group
    this.projectiles = this.add.group();
    // this.beholders = this.add.group();
    this.doors = this.physics.add.staticGroup();
    this.chests = this.physics.add.staticGroup();
    this.enemies = this.add.group();
    // create dungeon
    this.dungeon = new Dungeon(this);
    //create player
    this.player = new Player(
      this,
      this.dungeon.navi[1] * WIDTH + WIDTH / 2,
      this.dungeon.navi[0] * HEIGHT + HEIGHT / 2,
      15
    );
    this.createEnemies(this.dungeon.Map);
    // this.enemies = [];
    // for (let y = 0; y < this.dungeon.Map.length; y++) {
    //   for (let x = 0; x < this.dungeon.Map[y].length; x++) {
    //     if (this.dungeon.Map[y][x] === 1) {
    //       console.log("create Enemy", x * WIDTH + 100, y * HEIGHT + 100);
    //       this.enemies.push(new Enemy(this, x * WIDTH + 100, y * HEIGHT + 100));
    //     }
    //   }
    // }
    // console.log(this.enemies
    // this.enemies = this.createEnemies(this.dungeon.Map);
    // Camera
    this.cameras.main.pan(this.player.sprite.x, this.player.sprite.y, 1600);
    // Create Beholder
    // this.createEnemies();
    // Collision
    const that = this;
    this.physics.add.collider(this.player.sprite, this.dungeon.map);
    // this.physics.add.collider(this.beholders, this.player.sprite, function () {
    //   // console.log(that.player.lives)
    //   that.player.sprite.x = that.player.sprite.x + 50;
    //   that.player.removeLives();
    // });
    this.physics.add.collider(this.enemies, this.dungeon.map);

    this.physics.add.collider(
      this.projectiles,
      this.enemies,
      function (projectile, enemy) {
        const behold = enemy as Enemy;
        behold.destroy();
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
  // checkRoomForEnemies() {
  //   if (this.beholders.getMatching("room", this.dungeon.room).length == 0) {
  //     this.dungeon.openDoors();
  //   }
  // }
  // createEnemies() {
  //   for (let width = 0; width < this.dungeon.width; width++) {
  //     for (let height = 0; height < this.dungeon.height; height++) {
  //       if (this.dungeon.Map[height][width] == 1) {
  //         for (let index = 0; index < 3; index++) {
  //           new Beholder(
  //             this,
  //             width * WIDTH + (100 + index * 20),
  //             height * HEIGHT + (100 + index * 20),
  //             "beholder",
  //             1,
  //             height * 4 + width + 1
  //           );
  //         }
  //       }
  //     }
  //   }
  // }
  // createEnemies(dungeon: number[][]) {
  //   const enemies = this.add.group();

  //   for (let y = 0; y < dungeon.length; y++) {
  //     for (let x = 0; x < dungeon[y].length; x++) {
  //       if (dungeon[y][x] === 1) {
  //         const enemy = new Enemy(this, x * WIDTH + 100, y * HEIGHT + 100);
  //         enemies.add(enemy);
  //       }
  //     }
  //   }

  //   return enemies;
  // }
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
      const enemy = new Enemy(
        this,
        rooms[i].x,
        rooms[i].y,
        rooms[i].row * this.dungeon.Map.length + rooms[i].col
      );
      // enemy.room = i + 1;
      this.enemies.add(enemy);
    }
    console.log(this.enemies);
  }
  update() {
    this.player.update();
    this.enemies.getChildren().forEach((enemy: Enemy) => {
      // enemy.update(this.player.sprite, this.dungeon.room);
      enemy.moveToPlayer(
        this.player.sprite.x,
        this.player.sprite.y,
        this.dungeon.room
      );
    });
  }
}
