import * as Phaser from "phaser";
import Game from "./Game";
import Userinterface from "./UI";

export default class Preloader extends Phaser.Scene {
  constructor() {
    super({ key: "preloader" });
  }

  preload() {
    this.load.image("tiles", "dungeons/walls.png");
    this.load.spritesheet("beholder", "monsters/beholder.png", {
      frameWidth: 32,
    });
    this.load.spritesheet("sokoban", "character/herald.png", {
      frameWidth: 32,
    });
    this.load.spritesheet("chest", "dungeons/chest.png", {
      frameWidth: 24,
    });
    this.load.spritesheet("hearts", "character/hearts.png", {
      frameWidth: 13,
    });
    this.load.spritesheet("bullet", "character/bullet.png", {
      frameWidth: 16,
    });
    this.load.spritesheet("door", "dungeons/walls.png", {
      frameWidth: 32,
    });
  }

  create() {
    // start game scene
    // this.scene.start("Userinterface");
    this.anims.create({
      key: "idle_beholder",
      frames: this.anims.generateFrameNumbers("beholder", {
        start: 0,
        end: 1,
      }),
      frameRate: 5,
      repeat: -1,
    });
    this.scene.start("Game");
  }
}

const config = {
  type: Phaser.AUTO,
  width: 608,
  height: 352,
  backgroundColor: "#000000",
  scale: {
    mode: Phaser.Scale.FIT,
  },
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      // debug: true,
      gravity: { y: 0 },
    },
  },
  scene: [Preloader, Game, Userinterface],
};

const game = new Phaser.Game(config);
