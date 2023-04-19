import * as Phaser from "phaser";

export default class Map {
  direction: string;
  private scene: Phaser.Scene;
  map: any;
  miniMap: Phaser.GameObjects.Group;
  s;
  constructor(scene: Phaser.Scene, x: number, y: number, map: number[][]) {
    this.map = map;
    this.scene = scene;
    this.miniMap = this.scene.physics.add.staticGroup();
    const BG = this.scene.add.rectangle(38, 38, 62, 62, 0x000000);
    BG.alpha = 0.7;
  }
  public createMiniMap(map: number[][]) {
    this.miniMap.clear();
    for (let height = 0; height < map.length; height++) {
      for (let width = 0; width < map[height].length; width++) {
        if (map[height][width] == 1) {
          const sprite = this.scene.physics.add.sprite(
            width * 14 + 16,
            height * 14 + 16,
            "door",
            7
          );
          sprite.scale = 0.35;
          this.miniMap.add(sprite);
        }
        if (map[height][width] == 2) {
          const sprite = this.scene.physics.add.sprite(
            width * 14 + 16,
            height * 14 + 16,
            "door",
            7
          );
          sprite.scale = 0.35;
          sprite.tint = 0xc30009;
          this.miniMap.add(sprite);
        }
      }
    }
  }
}
