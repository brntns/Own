import * as Phaser from "phaser";

export default class Hearts {
  private scene: Phaser.Scene;
  map: any;
  lives: number;
  hearts: Phaser.GameObjects.Group;
  constructor(scene: Phaser.Scene, x: number, y: number, lives: number) {
    this.scene = scene;
    this.hearts = this.scene.physics.add.staticGroup();
  }
  public renderHearts(lives) {
    this.lives = lives;
    this.hearts.clear(true, true);
    for (let width = 0; width < this.lives; width++) {
      const sprite = this.scene.physics.add.sprite(
        width * 28 + 22,
        20,
        "hearts",
        0
      );
      sprite.scale = 2;
      this.hearts.add(sprite);
    }
  }
}
