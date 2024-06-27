import { Game } from "./Game.mjs";
import { Snake } from "./Snake.mjs";

let game = new Game();
game.launchGame();
document.body.addEventListener("keydown", (event)=>console.log(event))