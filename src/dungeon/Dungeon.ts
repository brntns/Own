import * as Phaser from "phaser";
import Door from "./Door";
import Game from "../scenes/Game";
import eventsCenter from "../interface/EventCenter";
import Chest from "./Chest";

const WIDTH = 608;
const HEIGHT = 352;
const roomWidth = 11;

// TODO: Needs to be generated as Room Map
let Map: number[][] = [];
// MiniMap
let Navigation: number[][] = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const wi = WIDTH / 32;
const hi = HEIGHT / 32;
export default class Dungeon {
  private scene: Game;
  map!: Phaser.Tilemaps.TilemapLayer;
  private data: number[][];
  start: number[];
  room: number;
  dungeon!: Phaser.Tilemaps.Tilemap;
  width: number;
  navi: number[];
  height: number;
  Map: number[][] = [];

  constructor(scene: Game, width: number, height: number) {
    this.width = width;
    this.height = height;
    this.scene = scene;

    this.Map = this.generateDungeon(this.width, this.height);
    this.createDungeon();
    console.log(this.Map);
    this.dungeon = this.scene.make.tilemap({
      data: this.data,
      tileWidth: 32,
      tileHeight: 32,
    });

    const tiles = this.dungeon.addTilesetImage("tiles");
    this.map = this.dungeon.createLayer(0, tiles, 0, 0);
    this.map.setCollision([0, 1, 2, 6, 8, 10, 11, 12, 13, 15, 16, 17]);
    this.generateDoors(this.map);
    eventsCenter.emit("update-map", Navigation);
  }
  generateDungeon(width: number, height: number): number[][] {
    // Step 1: Create a 2D array of rooms filled with 0s
    let dungeon: number[][] = [];
    for (let i = 0; i < height; i++) {
      dungeon.push(new Array(width).fill(0));
    }

    // Step 2: Choose a random starting room
    let startX = Math.floor(Math.random() * width);
    let startY = Math.floor(Math.random() * height);
    dungeon[startY][startX] = 1;
    this.navi = [startY, startX];
    this.room = startY * dungeon.length + startX;

    // Step 3: Call the recursive function to visit all rooms
    this.visitRoom(startX, startY, dungeon, width, height);

    // Step 4: Ensure there are at least 20% rooms
    let roomCount = dungeon.flat().filter((val) => val === 1).length;
    let minRoomCount = Math.ceil(width * height * 0.2);
    if (roomCount < minRoomCount) {
      let additionalRooms = minRoomCount - roomCount;
      for (let i = 0; i < additionalRooms; i++) {
        this.addRoom(dungeon, width, height);
      }
    }
    // Step 5: Return the generated dungeon
    return dungeon;
  }

  visitRoom(
    x: number,
    y: number,
    dungeon: number[][],
    width: number,
    height: number
  ): void {
    // Step 4a: Get a list of neighboring rooms that haven't been visited yet
    let neighbors: [number, number, number, number][] = [];
    if (x > 0 && dungeon[y][x - 1] === 0) {
      neighbors.push([x - 1, y, x, y]);
    }
    if (y > 0 && dungeon[y - 1][x] === 0) {
      neighbors.push([x, y - 1, x, y]);
    }
    if (x < width - 1 && dungeon[y][x + 1] === 0) {
      neighbors.push([x + 1, y, x, y]);
    }
    if (y < height - 1 && dungeon[y + 1][x] === 0) {
      neighbors.push([x, y + 1, x, y]);
    }

    // Step 4b: Choose a random neighboring room and mark it as a 1
    if (neighbors.length > 0) {
      let [nx, ny] = neighbors[Math.floor(Math.random() * neighbors.length)];
      dungeon[ny][nx] = 1;
      // Step 4c: Recursively visit the neighboring room
      this.visitRoom(nx, ny, dungeon, width, height);
    }
  }
  addRoom(dungeon: number[][], width: number, height: number): void {
    // Find a random room that is adjacent to an existing room
    let x, y;
    do {
      x = Math.floor(Math.random() * width);
      y = Math.floor(Math.random() * height);
    } while (
      dungeon[y][x] !== 1 ||
      !this.isAdjacentToRoom(x, y, dungeon, width, height)
    );

    // Mark the room as a 1 and call the recursive function to visit it
    dungeon[y][x] = 1;
    this.visitRoom(x, y, dungeon, width, height);
  }

  isAdjacentToRoom(
    x: number,
    y: number,
    dungeon: number[][],
    width: number,
    height: number
  ): boolean {
    // Check if any adjacent room is already marked as a 1
    return (
      (x > 0 && dungeon[y][x - 1] === 1) ||
      (y > 0 && dungeon[y - 1][x] === 1) ||
      (x < width - 1 && dungeon[y][x + 1] === 1) ||
      (y < height - 1 && dungeon[y + 1][x] === 1)
    );
  }
  createDungeon() {
    let rows = [];
    let rooms = [];
    // Generating Rooms
    for (let mapHeight = 0; mapHeight < this.height; mapHeight++) {
      for (let mapWidth = 0; mapWidth < this.width; mapWidth++) {
        rooms.push(this.createRoom(mapHeight, mapWidth));
      }
      rows.push(rooms);
      rooms = [];
    }
    // @TODO THIS IS TOTAL MADNESS, IM DOING SOMETHING REALLY REALLY REALLY WRONG,
    // made it work with casting an array onto a string and reversing it. That shouldn't
    // be necessary, but for some reason temp[tempcounter].push(item) is pushing not only
    // the item but the parent and all its items.

    // create Dungeon Blank map
    let temp = Array(this.height * roomWidth).fill([]);

    // Dungeonheight
    for (
      let dungeonheightcount = 0;
      dungeonheightcount < this.height;
      dungeonheightcount++
    ) {
      // Dungeonwidth
      for (
        let dungeonwidthcount = 0;
        dungeonwidthcount < this.width;
        dungeonwidthcount++
      ) {
        // Room
        let counter = roomWidth;

        for (
          let dungeonrowindex = 0;
          dungeonrowindex < roomWidth;
          dungeonrowindex++
        ) {
          let tempcounter = (dungeonheightcount + 1) * roomWidth - counter;
          let item =
            rows[dungeonheightcount][dungeonwidthcount][dungeonrowindex];
          counter--;
          temp[tempcounter] = temp[tempcounter] + "," + item;

          if (counter == 0) {
            counter = 11;
          }
        }
      }
    }
    for (let is = 0; is < temp.length; is++) {
      const faster = temp[is].replace(/^./, "");
      temp[is] = faster.split(",");
    }
    this.data = temp;

    this.dungeon = this.scene.make.tilemap({
      data: this.data,
      tileWidth: 32,
      tileHeight: 32,
    });

    const tiles = this.dungeon.addTilesetImage("tiles");
    this.map = this.dungeon.createLayer(0, tiles, 0, 0);
    this.map.setCollision([0, 1, 2, 6, 8, 10, 11, 12, 13, 15, 16, 17]);
    this.generateDoors(this.map);
    eventsCenter.emit("update-map", Navigation);
    console.log(this.navi);
  }
  createRoom(height: number, width: number) {
    const doors = this.hasDoors(height, width);
    let rows = [];
    for (let roomHeight = 0; roomHeight < hi; roomHeight++) {
      let col = [];
      for (let roomWidth = 0; roomWidth < wi; roomWidth++) {
        // top
        if (this.Map[height][width] == 1) {
          if (roomHeight == 0) {
            // left corner
            if (roomWidth == 0) {
              col.push(0);
            }
            // right corner
            else if (roomWidth % 18 == 0) {
              col.push(2);
            }
            // Door
            else if (doors.top && roomWidth == 9) {
              col.push(3);
            }
            //  Wall Top
            else {
              //   col.push(1);
              col.push(1);
            }
            // console.log(roomWidth, doors);
          }
          // bottom
          else if (roomHeight % 10 == 0) {
            if (roomWidth == 0) {
              col.push(12);
            } else if (roomWidth % 18 == 0) {
              col.push(14);
            }
            //Door
            else if (doors.bottom && roomWidth == 9) {
              col.push(9);
            }
            // Wall Bottom
            else {
              col.push(13);
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
            // if (this.rand(0, 10) < 9) {
            col.push(25);
            // } else {
            // col.push(17);
            // }
          }
        } else {
          col.push(0);
        }
      }
      rows.push(col);
    }

    return rows;
  }
  hasDoors(height, width) {
    const doors = {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    };

    if (width != 0 && this.Map[height][width - 1] == 1) {
      doors.left = 1;
    }
    if (width != this.width - 1 && this.Map[height][width + 1] == 1) {
      doors.right = 1;
    }
    if (height != this.height - 1 && this.Map[height + 1][width] == 1) {
      doors.bottom = 1;
    }
    if (height != 0 && this.Map[height - 1][width] == 1) {
      doors.top = 1;
    }

    // console.log(doors);
    return doors;
  }

  rand(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  generateDoors(mapy: Phaser.Tilemaps.TilemapLayer) {
    if (mapy) {
      mapy.forEachTile((t: any, i) => {
        if (t && t.index) {
          // console.log(i);
          if (t.index == 3) {
            new Door(this.scene, t.pixelX + 16, t.pixelY + 17, "top");
            // console.log("new door top");
          }
          if (t.index == 9) {
            new Door(this.scene, t.pixelX + 16, t.pixelY + 15, "bottom");
            // console.log('new door bottom')
          }
          if (t.index == 4) {
            new Door(this.scene, t.pixelX + 17, t.pixelY + 16, "left");
            // console.log('new door left')
          }
          if (t.index == 5) {
            new Door(this.scene, t.pixelX + 15, t.pixelY + 16, "right");
            // console.log('new door rigth')
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
    // this.closeDoors();
    const currentX = this.scene.cameras.main.scrollX;
    const currentY = this.scene.cameras.main.scrollY;
    let relativeX = 0;
    let relativeY = 0;
    switch (a.name) {
      case "left":
        this.scene.player.sprite.x = this.scene.player.sprite.x - 100;
        relativeX = currentX - WIDTH * 0.5;
        relativeY = currentY + HEIGHT * 0.5;
        console.log(relativeX, relativeY);
        this.scene.cameras.main.pan(relativeX, relativeY, 800);
        this.navi[1]--;
        break;
      case "right":
        relativeX = currentX + WIDTH * 1.5;
        relativeY = currentY + HEIGHT * 0.5;
        console.log(relativeX, relativeY);
        this.scene.player.sprite.x = this.scene.player.sprite.x + 100;
        this.scene.cameras.main.pan(relativeX, relativeY, 800);
        this.navi[1]++;
        break;
      case "top":
        relativeX = currentX + WIDTH * 0.5;
        relativeY = currentY - HEIGHT * 0.5;
        console.log(relativeX, relativeY);
        this.scene.player.sprite.y = this.scene.player.sprite.y - 100;

        this.scene.cameras.main.pan(relativeX, relativeY, 800);
        this.navi[0]--;
        break;
      case "bottom":
        relativeX = currentX + WIDTH * 0.5;
        relativeY = currentY + HEIGHT * 1.5;
        console.log(relativeX, relativeY);
        this.scene.player.sprite.y = this.scene.player.sprite.y + 100;
        this.scene.cameras.main.pan(relativeX, relativeY, 800);
        this.navi[0]++;
        break;
    }
    this.room = this.navi[0] * this.Map.length + this.navi[1];
    // console.log(this.navi);
    // console.log(a.name, Map, this.navi);
    // Navigation[navi.y][navi.x] = 2;
    // this.displayMiniMap();
    // this.room = this.getCurrentRoom(Map, 2);
    // eventsCenter.emit("update-count", this.room);
    // eventsCenter.emit("update-map", Navigation);
    // if (this.scene.beholders.getMatching("room", this.room).length == 0) {
    //   // this.openDoors();
    // }
    console.log(this.room);
  }

  closeDoors() {
    this.map.replaceByIndex(9, 10);
    this.map.replaceByIndex(3, 11);
    this.map.replaceByIndex(5, 16);
    this.map.replaceByIndex(4, 15);
    this.map.setCollision([0, 1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13, 15, 16]);
    this.scene.doorCollider.active = false;
    let children = this.scene.beholders.children.entries;
    for (let i = 0; i < children.length; i++) {
      children[i].body.gameObject.enable = false;
    }
  }
  openDoors() {
    this.map.replaceByIndex(10, 9);
    this.map.replaceByIndex(11, 3);
    this.map.replaceByIndex(16, 5);
    this.map.replaceByIndex(15, 4);
    this.map.setCollision([0, 1, 2, 6, 8, 10, 11, 12, 13, 15, 16]);
    this.scene.doorCollider.active = true;
    let children = this.scene.beholders.children.entries;
    for (let i = 0; i < children.length; i++) {
      children[i].body.gameObject.enable = true;
    }
  }
}
