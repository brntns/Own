import * as Phaser from "phaser";
import { Scene } from "phaser";

// import { Score } from "../interface/score";
// import { Text } from "../interface/text";
import Map from "../interface/Map";
import Hearts from "../interface/Hearts";

import eventsCenter from "../interface/EventCenter";

export default class Userinterface extends Scene {
  // private score!: Score;
  private gameEndPhrase!: Text;
  private map!: Map;
  private lives!: Hearts;

  constructor() {
    super({ key: "Userinterface" });
  }

  create(): void {
    // this.score = new Score(this, 5, 5, 0);
    this.map = new Map(this, 0, 0, []);
    this.lives = new Hearts(this, 0, 0, 3);
    // eventsCenter.on("update-count", this.chestLootHandler, this);
    eventsCenter.on("update-map", this.createMiniMap, this);
    eventsCenter.on("update-lives", this.updateLive, this);

    // this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
    //   eventsCenter.off("update-count", this.chestLootHandler, this);
    // });
  }
  chestLootHandler = (i: number) => {
    console.log(i);
    // this.score.changeValue(i);
  };
  createMiniMap = (map: number[][]) => {
    this.map.createMiniMap(map);
  };
  updateLive = (lives: number) => {
    // console.log(lives);
    this.lives.renderHearts(lives);
  };
}
