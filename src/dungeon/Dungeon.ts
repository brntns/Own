import * as Phaser from "phaser";
import Door from "./Door";
import Game from "../scenes/Game";
import eventsCenter from "../interface/EventCenter";

const WIDTH = 608;
const HEIGHT = 352;

// TODO: Needs to be generated as Room Map
const Map: number[] = [1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1];
// MiniMap
let Navigation: number[][] = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];
const bordersleft = [0, 4, 8, 12];
const bordersright = [3, 7, 11, 15];
const borderstop = [0, 1, 2, 3];
const bordersbottom = [12, 13, 14, 15];

// TODO: Needs to be generated as Camera Navigation over the Rooms
const navi = { x: 0, y: 0 };

export default class Dungeon {
  private scene: Game;
  map!: Phaser.Tilemaps.TilemapLayer;
  private data: number[][];
  room: number;
  dungeon!: Phaser.Tilemaps.Tilemap;

  constructor(scene: any) {
    this.scene = scene;
    this.createDungeon();
  }
  createDungeon() {
    this.data = [];
    let rows = [];
    let cols = [];
    let counter = 0;
    for (let mapHeight = 0; mapHeight < Map.length; mapHeight++) {
      cols.push(this.createRoom(counter));
      counter++;
    }
    for (let rindex = 0; rindex < 44; rindex++) {
      rows.push([]);
    }
    for (let index = 0; index < 4; index++) {
      rows[0].push(...cols[index][0]);
      rows[1].push(...cols[index][1]);
      rows[2].push(...cols[index][2]);
      rows[3].push(...cols[index][3]);
      rows[4].push(...cols[index][4]);
      rows[5].push(...cols[index][5]);
      rows[6].push(...cols[index][6]);
      rows[7].push(...cols[index][7]);
      rows[8].push(...cols[index][8]);
      rows[9].push(...cols[index][9]);
      rows[10].push(...cols[index][10]);

      rows[11].push(...cols[4 + index][0]);
      rows[12].push(...cols[4 + index][1]);
      rows[13].push(...cols[4 + index][2]);
      rows[14].push(...cols[4 + index][3]);
      rows[15].push(...cols[4 + index][4]);
      rows[16].push(...cols[4 + index][5]);
      rows[17].push(...cols[4 + index][6]);
      rows[18].push(...cols[4 + index][7]);
      rows[19].push(...cols[4 + index][8]);
      rows[20].push(...cols[4 + index][9]);
      rows[21].push(...cols[4 + index][10]);

      rows[22].push(...cols[8 + index][0]);
      rows[23].push(...cols[8 + index][1]);
      rows[24].push(...cols[8 + index][2]);
      rows[25].push(...cols[8 + index][3]);
      rows[26].push(...cols[8 + index][4]);
      rows[27].push(...cols[8 + index][5]);
      rows[28].push(...cols[8 + index][6]);
      rows[29].push(...cols[8 + index][7]);
      rows[30].push(...cols[8 + index][8]);
      rows[31].push(...cols[8 + index][9]);
      rows[32].push(...cols[8 + index][10]);

      rows[33].push(...cols[12 + index][0]);
      rows[34].push(...cols[12 + index][1]);
      rows[35].push(...cols[12 + index][2]);
      rows[36].push(...cols[12 + index][3]);
      rows[37].push(...cols[12 + index][4]);
      rows[38].push(...cols[12 + index][5]);
      rows[39].push(...cols[12 + index][6]);
      rows[40].push(...cols[12 + index][7]);
      rows[41].push(...cols[12 + index][8]);
      rows[42].push(...cols[12 + index][9]);
      rows[43].push(...cols[12 + index][10]);
    }
    this.data = rows;

    this.dungeon = this.scene.make.tilemap({
      data: this.data,
      tileWidth: 32,
      tileHeight: 32,
    });

    const tiles = this.dungeon.addTilesetImage("tiles");
    this.map = this.dungeon.createLayer(0, tiles, 0, 0);
    this.map.setCollision([0, 1, 2, 6, 8, 10, 11, 12, 13, 15, 16,17]);
    this.generateDoors(this.map);
    eventsCenter.emit("update-map", Navigation);
  }
  hasDoors(index) {
    const doors = {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    };
    if (Map[index - 1] == 1 && bordersleft.indexOf(index) == -1) {
      doors.left = 1;
    }
    if (Map[index + 1] == 1 && bordersright.indexOf(index) == -1) {
      doors.right = 1;
    }
    if (Map[index + 4] == 1 && bordersbottom.indexOf(index) == -1) {
      doors.bottom = 1;
    }
    if (Map[index - 4] == 1 && borderstop.indexOf(index) == -1) {
      doors.top = 1;
    }
    return doors;
  }
  createRoom(index: number) {
    const wi = WIDTH / 32;
    const hi = HEIGHT / 32;

    const doors = this.hasDoors(index);

    let rows = [];
    for (let roomHeight = 0; roomHeight < hi; roomHeight++) {
      let col = [];
      for (let roomWidth = 0; roomWidth < wi; roomWidth++) {
        // top
        if (roomHeight == 0) {
          if (roomWidth == 0) {
            col.push(0);
          } else if (roomWidth == 18) {
            col.push(2);
          } else {
            if (doors.top && roomWidth == 9) {
              col.push(3);
            } else {
              col.push(1);
            }
          }
        }
        // bottom
        else if (roomHeight % 10 == 0) {
          if (roomWidth == 0) {
            col.push(12);
          } else if (roomWidth % 18 == 0) {
            col.push(14);
          } else {
            if (doors.bottom && roomWidth == 9) {
              col.push(9);
            } else {
              col.push(13);
            }
          }
        }
        // wall left
        else if (roomWidth == 0) {
          // door
          if (doors.left && roomHeight == 5) {
            col.push(4);
          }
          //  wall
          else {
            col.push(6);
          }
        }
        //wall right
        else if (roomWidth == 18) {
          // door
          if (doors.right && roomHeight == 5) {
            col.push(5);
          }
          //  wall
          else {
            col.push(8);
          }
        }
        // dirt left and left corners
        else if (roomWidth == 1) {
          if (roomHeight == 1) {
            col.push(18);
          } else if (roomHeight % 9 == 0) {
            col.push(30);
          } else {
            col.push(24);
          }
        }
        //  dirt right and right corners
        else if (roomWidth % 17 == 0) {
          if (roomHeight == 1) {
            col.push(20);
          } else if (roomHeight % 9 == 0) {
            col.push(32);
          } else {
            col.push(26);
          }
        }
        //dirt top
        else if (roomHeight == 1) {
          col.push(19);
        }
        // dirt bottom
        else if (roomHeight == 9) {
          col.push(31);
        }
        // floor
        else {
         
          if(this.rand(0,10) < 9){
            col.push(25);
          } else {
            col.push(17);
          }

        }
      }
      rows.push(col);
    }
    return rows;
  }
  rand(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  generateDoors(mapy: Phaser.Tilemaps.TilemapLayer) {
    if (mapy) {
      mapy.forEachTile((t: any) => {
        if (t && t.index) {
          if (t.index == 3) {
            new Door(this.scene, t.pixelX + 16, t.pixelY + 17, "top");
          }
          if (t.index == 9) {
            new Door(this.scene, t.pixelX + 16, t.pixelY + 15, "bottom");
          }
          if (t.index == 4) {
            new Door(this.scene, t.pixelX + 17, t.pixelY + 16, "left");
          }
          if (t.index == 5) {
            new Door(this.scene, t.pixelX + 15, t.pixelY + 16, "right");
          }
        }
      });
    }
  }
  getCurrentRoom(arr: number[][], k: number) {
    for (var i = 0; i < arr.length; i++) {
      var index: number = arr[i].indexOf(k);
      if (index > -1) {
        return i * 4 + index + 1;
      }
    }
  }
  changeRoom(a: Door) {
    const that = this;
    this.closeDoors();

    Navigation[navi.y][navi.x] = 1;
    switch (a.name) {
      case "left":
        this.scene.player.sprite.x = this.scene.player.sprite.x - 100;
        that.scene.cameras.main.pan(
          navi.x * WIDTH - WIDTH / 2,
          navi.y * HEIGHT + HEIGHT / 2,
          800
        );
        navi.x--;
        break;
      case "right":
        this.scene.player.sprite.x = this.scene.player.sprite.x + 100;
        that.scene.cameras.main.pan(
          navi.x * WIDTH + WIDTH * 1.5,
          navi.y * HEIGHT + HEIGHT / 2,
          800
        );
        navi.x++;
        break;
      case "top":
        this.scene.player.sprite.y = this.scene.player.sprite.y - 100;
        that.scene.cameras.main.pan(
          navi.x * WIDTH + WIDTH / 2,
          navi.y * HEIGHT - HEIGHT / 2,
          800
        );
        navi.y--;
        break;
      case "bottom":
        this.scene.player.sprite.y = this.scene.player.sprite.y + 100;
        that.scene.cameras.main.pan(
          navi.x * WIDTH + WIDTH / 2,
          navi.y * HEIGHT + HEIGHT * 1.5,
          800
        );
        navi.y++;
        break;
      default:
        break;
    }
    Navigation[navi.y][navi.x] = 2;
    this.displayMiniMap();
    this.room = this.getCurrentRoom(Navigation, 2);
    eventsCenter.emit("update-count", this.room);
    eventsCenter.emit("update-map", Navigation);
    if (this.scene.beholders.getMatching("room", this.room).length == 0) {
      this.openDoors();
    }
  }
  displayMiniMap() {
    console.log(Navigation[0]);
    console.log(Navigation[1]);
    console.log(Navigation[2]);
    console.log(Navigation[3]);
  }
  closeDoors() {
    this.map.replaceByIndex(9, 10);
    this.map.replaceByIndex(3, 11);
    this.map.replaceByIndex(5, 16);
    this.map.replaceByIndex(4, 15);
    this.map.setCollision([0, 1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13, 15, 16]);
    this.scene.doorCollider.active = false;
    // let children = this.scene.beholders.children.entries;
    // for (let i = 0; i < children.length; i++) {
    //   children[i].body.gameObject.enable = false;
    // }
  }
  openDoors() {
    this.map.replaceByIndex(10, 9);
    this.map.replaceByIndex(11, 3);
    this.map.replaceByIndex(16, 5);
    this.map.replaceByIndex(15, 4);
    this.map.setCollision([0, 1, 2, 6, 8, 10, 11, 12, 13, 15, 16]);
    this.scene.doorCollider.active = true;
    // let children = this.scene.beholders.children.entries;
    // for (let i = 0; i < children.length; i++) {
    //   children[i].body.gameObject.enable = true;
    // }
  }
}

// const room: number[][] = [
//   [0, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
//   [6, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 8],
//   [6, 24, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 26, 8],
//   [6, 24, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 26, 8],
//   [6, 24, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 26, 8],
//   [4, 24, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 26, 5],
//   [6, 24, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 26, 8],
//   [6, 24, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 26, 8],
//   [6, 24, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 26, 8],
//   [6, 30, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 32, 8],
//   [12, 13, 13, 13, 13, 13, 13, 13, 13, 9, 13, 13, 13, 13, 13, 13, 13, 13, 14],
// ];
