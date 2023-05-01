import * as Phaser from "phaser";

import Bullet from "../player/Bullet";
import Game from "../scenes/Game";
import eventsCenter from "../interface/EventCenter";

export default class Player {
  private keys: Phaser.Types.Input.Keyboard.CursorKeys;
  private keyW: Phaser.Input.Keyboard.Key;
  private keyS: Phaser.Input.Keyboard.Key;
  private keyA: Phaser.Input.Keyboard.Key;
  private keyD: Phaser.Input.Keyboard.Key;
  private scene: Game;
  sprite: Phaser.Physics.Arcade.Sprite;
  lives: number;

  constructor(scene: Game, x: number, y: number, lives: number) {
    this.scene = scene;
    this.lives = lives;
    const anims = scene.anims;
    eventsCenter.emit("update-lives", this.lives);
    anims.create({
      key: "idle",
      frames: anims.generateFrameNumbers("sokoban", {
        start: 0,
        end: 1,
      }),
      frameRate: 5,
      repeat: -1,
    });

    anims.create({
      key: "down-walk",
      frames: anims.generateFrameNumbers("sokoban", {
        start: 1,
        end: 4,
      }),
      frameRate: 10,
      repeat: -1,
    });

    anims.create({
      key: "up-walk",
      frames: anims.generateFrameNumbers("sokoban", {
        start: 1,
        end: 4,
      }),
      frameRate: 10,
      repeat: -1,
    });

    anims.create({
      key: "left-walk",
      frames: anims.generateFrameNumbers("sokoban", {
        start: 1,
        end: 4,
      }),
      frameRate: 10,
      repeat: -1,
    });

    anims.create({
      key: "right-walk",
      frames: anims.generateFrameNumbers("sokoban", {
        start: 1,
        end: 4,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.sprite = scene.physics.add.sprite(x, y, "tron", 0);
    this.sprite.setSize(10, 10);
    this.sprite.scale = 2;
    this.sprite.anims.play("idle");

    this.keys = scene.input.keyboard.createCursorKeys();
    this.keyW = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keyS = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keyA = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyD = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
  }
  removeLives() {
    this.lives--;
    eventsCenter.emit("update-lives", this.lives);
  }
  update() {
    const keys = this.keys;
    const sprite = this.sprite;
    const speed = 150;

    // Stop any previous movement from the last frame
    sprite.setVelocity(0);
    // Horizontal movement
    if (keys.left.isDown) {
      sprite.setVelocityX(-speed);
      sprite.setFlipX(true);
    } else if (keys.right.isDown) {
      sprite.setVelocityX(speed);
      sprite.setFlipX(false);
    }

    // Vertical movement
    if (keys.up.isDown) {
      sprite.setVelocityY(-speed);
    } else if (keys.down.isDown) {
      sprite.setVelocityY(speed);
    }

    const WPressed = Phaser.Input.Keyboard.JustDown(this.keyW);
    const SPressed = Phaser.Input.Keyboard.JustDown(this.keyS);
    const APressed = Phaser.Input.Keyboard.JustDown(this.keyA);
    const DPressed = Phaser.Input.Keyboard.JustDown(this.keyD);

    if (WPressed) {
      new Bullet(this.scene, sprite.x, sprite.y, -200, 0);
    }
    if (SPressed) {
      new Bullet(this.scene, sprite.x, sprite.y, 200, 0);
    }
    if (APressed) {
      new Bullet(this.scene, sprite.x, sprite.y, 0, -200);
    }
    if (DPressed) {
      new Bullet(this.scene, sprite.x, sprite.y, 0, 200);
    }
    // Normalize and scale the velocity so that sprite can't move faster along a diagonal
    sprite.body.velocity.normalize().scale(speed);

    // Update the animation last and give left/right animations precedence over up/down animations
    if (keys.left.isDown || keys.right.isDown || keys.down.isDown) {
      sprite.anims.play("right-walk", true);
    } else if (keys.up.isDown) {
      sprite.anims.play("left-walk", true);
    } else {
      sprite.anims.play("idle", true);
    }
  }

  destroy() {
    this.sprite.destroy();
  }
}
