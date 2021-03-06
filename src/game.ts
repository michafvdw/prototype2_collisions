import * as PIXI from "pixi.js";
import mouseImage from "./images/mouse.png";
import catImage from "./images/cat.png";
import dogImage from "./images/dog.png";
import { Mouse } from "./Mouse";
import { Cat } from "./Cat";
import { Dog } from "./Dog";

export class Game {
  public pixi: PIXI.Application;
  private mice: Mouse[] = [];
  private loader: PIXI.Loader;
  private cat: Cat;
  private dogs: Dog[] = [];
  constructor() {
    console.log("Game !");
    
    //maak een pixi canvas
    this.pixi = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      forceCanvas: true
    });
    document.body.appendChild(this.pixi.view);

    //preload alle afbeeldingen
    this.loader = new PIXI.Loader();
    this.loader
      .add("mouseTexture",mouseImage)
      .add("dogTexture",dogImage)
      .add("catTexture", catImage);
    this.loader.load(() => this.loadCompleted());
  }
  
  private loadCompleted() {
    // create mice
    for (let i = 0; i < 10; i++) {
      let mouse = new Mouse(this.loader.resources["mouseTexture"].texture!, this);
      this.mice.push(mouse);
      this.pixi.stage.addChild(mouse);
    }

    // create mice
    for (let i = 0; i < 1; i++) {
      let dog = new Dog(this.loader.resources["dogTexture"].texture!, this);
      this.dogs.push(dog);
      this.pixi.stage.addChild(dog);
    }

    

    // create cat
    this.cat = new Cat(
      this.loader.resources["catTexture"].texture!,
      this
    );
    this.pixi.stage.addChild(this.cat);

    this.pixi.ticker.add((delta: number) => this.update(delta));
  }
  public update(delta: number) {
    this.cat.update();
 

    for (const mouse of this.mice) {
      mouse.update(delta);
      if (this.collision(this.cat, mouse)) {
        // console.log("CAT ATTACK!!!!");
        this.pixi.stage.removeChild(mouse);
      }
    }

    for (const dog of this.dogs) {
      dog.update(delta);
      if (this.collision(this.cat, dog)) {
        // console.log("CAT ATTACK!!!!");
        this.pixi.stage.removeChild(this.cat);
      }
    }

    

    // when the Cat is the only survivor
    if (
      this.pixi.stage.children.filter((object) => object instanceof Mouse)
        .length === 0 &&
        this.pixi.stage.children.filter((object) => object instanceof Cat)
        .length === 1 
    ) {
      console.log("YOU WIN");
      let text = new PIXI.Text("You WIN!!", { fill: ["#ffffff"] });
      text.x = this.pixi.screen.width / 2;
      text.y = this.pixi.screen.height / 2;
      this.pixi.stage.addChild(text);
      for (const dog of this.dogs) {
        dog.update(delta);
          this.pixi.stage.removeChild(dog);
        }
    }

    // when the Dog is the only survivor
    if (
      this.pixi.stage.children.filter((object) => object instanceof Dog)
        .length === 1 &&
        this.pixi.stage.children.filter((object) => object instanceof Cat)
        .length === 0 
    ) {
      console.log("YOU LOSE");
      let text = new PIXI.Text("You LOSE!!", { fill: ["#ffffff"] });
      text.x = this.pixi.screen.width / 2;
      text.y = this.pixi.screen.height / 2;
      this.pixi.stage.addChild(text);
      for (const dog of this.dogs) {
        dog.update(delta);
          this.pixi.stage.removeChild(dog);
        }
  
    }
  }

  
//collisions 
  private collision(sprite1: PIXI.Sprite, sprite2: PIXI.Sprite) {
    const bounds1 = sprite1.getBounds();
    const bounds2 = sprite2.getBounds();

    return (
      bounds1.x < bounds2.x + bounds2.width &&
      bounds1.x + bounds1.width > bounds2.x &&
      bounds1.y < bounds2.y + bounds2.height &&
      bounds1.y + bounds1.height > bounds2.y
    );
  }
}
