import * as Phaser from "phaser";
import Game from "../scenes/Game";

enum Direction {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

const randomDirection = (exclude: Direction) => {
  let newDirection = Phaser.Math.Between(0, 3);
  while (newDirection === exclude) {
    newDirection = Phaser.Math.Between(0, 3);
  }

  return newDirection;
};

export default class Beholder extends Phaser.Physics.Arcade.Sprite {
  private direction = Direction.RIGHT;
  private moveEvent: Phaser.Time.TimerEvent;
  lives = 3;
  room: number;

  constructor(
    scene: Game,
    x: number,
    y: number,
    texture: string,
    frame: number,
    room: number
  ) {
    super(scene, x, y, texture, frame);
    scene.physics.world.enableBody(this);
    scene.add.existing(this);
    this.room = room;

    this.scale = 2;
    this.body.setSize(16, 16);


    scene.physics.world.on(
      Phaser.Physics.Arcade.Events.TILE_COLLIDE,
      this.handleTileCollision,
      this
    );

    this.moveEvent = scene.time.addEvent({
      delay: 2000,
      callback: () => {
        this.direction = randomDirection(this.direction);
      },
      loop: true,
    });
    scene.beholders.add(this);
  }
  doSomething() {
    this.moveEvent.remove(false);
    this.destroy();
  }
  removeLives() {
    this.lives--;
    console.log("removing lives", this.lives);
    if (this.lives == 0) {
      this.destroy(true);
    }
  }
  destroy(fromScene?: boolean) {
    this.moveEvent.destroy();
    console.log("destroying");
    super.destroy(fromScene);
  }

  private handleTileCollision(go: Phaser.GameObjects.GameObject) {
    if (go !== this) {
      return;
    }

    this.direction = randomDirection(this.direction);
  }

  preUpdate(t: number, dt: number) {
    super.preUpdate(t, dt);
    const speed = 50;

    switch (this.direction) {
      case Direction.UP:
        this.body.velocity.y = -speed;
        this.body.velocity.x = 0;
        break;

      case Direction.DOWN:
        this.body.velocity.y = speed;
        this.body.velocity.x = 0;
        break;

      case Direction.LEFT:
        this.body.velocity.y = 0;
        this.body.velocity.x = -speed;
        this.flipX = true;
        break;

      case Direction.RIGHT:
        this.body.velocity.y = 0;
        this.body.velocity.x = speed;
        this.flipX = false;
        break;
    }
  }
}
