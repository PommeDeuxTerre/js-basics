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

class Snake{
    direction;
    snake;
    grid;
    width;
    height;
    alive;
    constructor(width, height){
        this.width = width;
        this.height = height;
        this.direction = LEFT;
        this.alive = true;
        //index 0 -> head
        this.snake = [
            {"x": STARTING_X, "y": STARTING_Y},
            {"x": STARTING_X+1, "y": STARTING_Y}
        ];
        this.initGrid();
    }
    initGrid(){
        //create empty grid
        this.grid = [];
        for (let y=0;y<this.height;y++){
            this.grid.push([]);
            for (let x=0;x<this.width;x++){
                this.grid.at(-1).push(EMPTY);
            }
        }
        //create the snake
        for (const square of this.snake){
            this.grid[square.y][square.x] = SNAKE;
        }
        this.grid[this.snake[0].y][this.snake[0].x] = SNAKE_HEAD;
    }
    setDirection(direction){
        if (direction < 0 || direction > 3 || direction == (direction + 2) % 4){
            throw new Error("direction is not valid");
        }
        this.direction = direction;
    }
    getNextSquare(){
        let x = this.snake[0].x;
        let y = this.snake[0].y;
        switch (this.direction){
            case LEFT:
                x-=1;
                break;
            case UP:
                y-=1;
                break;
            case RIGHT:
                x+=1;
                break;
            case DOWN:
                y+=1;
                break;
        }
        return {"x": x, "y": y};
    }
    isValidSquare(square){
        //touch border
        if (square.x < 0 || square.x >= this.width || square.y < 0 || square.y >= this.height){
            return false;
        }
        if (this.grid[square.y][square.x] == SNAKE || this.grid[square.y][square.x] == SNAKE_HEAD){
            return false;
        }
        return true;
    }
    generateNewApple(){
        //get all empty squares
        let coords = [];
        for (let y=0;y<this.height;y++){
            for (let x=0;x<this.width;x++){
                if (this.grid[y][x]==EMPTY){
                    coords.push({"x": x, "y": y});
                }
            }
        }
        const new_apple = coords[Math.floor(Math.random()*coords.length)];
        this.grid[new_apple.y][new_apple.x] = APPLE;
    }
    move(){
        const new_head = this.getNextSquare();
        if (!this.isValidSquare(new_head)){
            this.die();
            return;
        }

        const is_eating_apple = this.grid[new_head.y][new_head.x]==APPLE;

        //update snake
        this.grid[new_head.y][new_head.x] = SNAKE_HEAD;
        this.grid[this.snake[0].y][this.snake[0].x] = SNAKE;
        this.snake.unshift(new_head);

        if (is_eating_apple){
            this.generateNewApple();
        }else {
            this.grid[this.snake.at(-1).y][this.snake.at(-1).x] = EMPTY;
            this.snake.pop();
        }
    }
    die(){
        this.alive = false;
        document.getElementById("losing-popup").style.display = "flex";
    }
}
export { Snake };