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
    is_paused;
    speed;
    constructor(){
        this.initSnakeGrid();
        this.initSnakeGame();
        this.updateGuiGrid();
        this.is_paused = false;
        this.speed = this.getSpeed();
    }

    getSpeed(){
        try {
            const found = document.location.search.match(/[\?\&]speed=(\d+)/);
            return Number(found[1]);
        }catch (error){
            location.href = "./?speed=100";
        }
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

    gameBoucle(interval_id){
        if (this.is_paused)return;

        if (this.snake.alive == false){
            clearInterval(interval_id);
            this.die();
            return;
        }
        this.last_direction = this.snake.direction;
        this.snake.move();
        this.updateGuiGrid();
        for (const element of document.querySelectorAll(".current-score")){
            element.textContent = `Score: ${this.snake.getScore(this.speed)}`;
        }
    }
    launchGame(){
        this.snake.generateNewApple();
        let interval_id = setInterval(()=>this.gameBoucle(interval_id), this.speed);
        this.updateBestScore();

        document.body.addEventListener("keydown", (event)=>{
            if (event.key == " " && !this.snake.alive)location.reload();
            switch (event.key){
                case "d":
                case "ArrowRight":
                    if (this.last_direction !== LEFT && !this.is_paused)this.snake.direction = RIGHT;
                    break;
                case "q":
                case "ArrowLeft":
                    if (this.last_direction !== RIGHT && !this.is_paused)this.snake.direction = LEFT;
                    break;
                case "z":
                case "ArrowUp":
                    if (this.last_direction !== DOWN && !this.is_paused)this.snake.direction = UP;
                    break;
                case "s":
                case "ArrowDown":
                    if (this.last_direction !== UP && !this.is_paused)this.snake.direction = DOWN;
                    break;
                case " ":
                    if (!this.snake.alive)break;
                    this.is_paused = !this.is_paused;
                    document.querySelector("#pause-overlay").classList.toggle("hidden");
                    document.querySelector("#pause-img-overlay").classList.toggle("hidden");
            }
        });
    }
    updateBestScore(){
        let scores = JSON.parse(sessionStorage.getItem("snake_scores")) || [];
        const best_score = scores.sort((a, b)=>b.score-a.score)[0]?.score || 0;
        for (const element of document.querySelectorAll(".best-score")){
            element.textContent = `Best Score: ${best_score}`;
        }
    }
    addNewScore(score){
        let scores = sessionStorage.getItem("snake_scores");
        if (!scores){
            sessionStorage.setItem("snake_scores", JSON.stringify([{"score": this.snake.getScore(this.speed)}]));
        }else {
            scores = JSON.parse(scores)
            scores.push({"score": score});
            sessionStorage.setItem("snake_scores", JSON.stringify(scores));
        }
        console.log(scores);
    }
    die(){
        const popup = document.getElementById(this.snake.has_won ? "winning-popup" : "losing-popup");
        popup.style.display = "flex";
        this.addNewScore(this.snake.getScore(this.speed));
        this.updateBestScore();
    }
}

export { Game };