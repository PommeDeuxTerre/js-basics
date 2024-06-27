import { Snake } from "./Snake.mjs";

const WIDTH = 10;
const HEIGHT = 10;
const STARTING_X = 5;
const STARTING_Y = 4;
const LEFT = 0;
const UP = 1;
const RIGHT = 2;
const DOWN = 3;

const EMPTY = 0;
const APPLE = 1;
const SNAKE = 2;
const SNAKE_HEAD = 3;

class Game{
    snake;
    last_direction;
    constructor(){
        this.initSnakeGrid();
        this.initSnakeGame();
        this.updateGuiGrid();
    }

    initSnakeGrid(){
        const snake_div = document.querySelector("#snake");
        for (let y=0;y<HEIGHT;y++){
            //row
            const snake_line = document.createElement("div");
            snake_line.classList.add("snake-row");
            for (let x=0;x<WIDTH;x++){
                //square
                const square = document.createElement("div");
                square.classList.add("snake-square");
                snake_line.insertAdjacentElement("beforeend", square);
            }
            snake_div.insertAdjacentElement("beforeend", snake_line);
        }
    }

    updateGuiSquare(square, type){
        const html_square = document.querySelector(`#snake > div:nth-child(${square.y+1}) > div:nth-child(${square.x+1})`);
        switch (type){
            case APPLE:
                html_square.className = "square-apple";
                break;
            case SNAKE:
                html_square.className = "square-snake";
                break;
            case SNAKE_HEAD:
                html_square.className = "square-snake-head";
                break;
            case EMPTY:
                html_square.className = "";
        }
        html_square.classList.add("snake-square");
    }

    updateGuiGrid(){
        for (let y=0;y<HEIGHT;y++){
            for (let x=0;x<WIDTH;x++){
                this.updateGuiSquare({"x": x, "y": y}, this.snake.grid[y][x]);
            }
        }
    }

    initSnakeGame(){
        this.snake = new Snake(WIDTH, HEIGHT);
    }

    launchGame(){
        this.snake.generateNewApple();
        let interval_id = setInterval(()=>{
            if (this.snake.alive == false){
                clearInterval(interval_id);
                this.die();
                return;
            }
            this.last_direction = this.snake.direction;
            this.snake.move();
            this.updateGuiGrid();
        }, 200);

        document.body.addEventListener("keydown", (event)=>{
            switch (event.key){
                case "ArrowRight":
                    if (this.last_direction !== LEFT)this.snake.direction = RIGHT;
                    break;
                case "ArrowLeft":
                    if (this.last_direction !== RIGHT)this.snake.direction = LEFT;
                    break;
                case "ArrowUp":
                    if (this.last_direction !== DOWN)this.snake.direction = UP;
                    break;
                case "ArrowDown":
                    if (this.last_direction !== UP)this.snake.direction = DOWN;
                    break;
            }
        });
    }
    die(){
    }
}

export { Game };