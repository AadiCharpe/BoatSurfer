import kaboom from "https://unpkg.com/kaboom@3000.0.1/dist/kaboom.mjs";

kaboom()

scene("title", ()=>{
    add ([
        rect(width(), height()),
        color(35, 204, 150),
        pos(0, 0)
    ])
    add ([
        text("Boat Surfer"),
        anchor("center"),
        pos(width()/2, height()/3),
        scale(2)
    ])
    add ([
        text("Press Space to Start"),
        anchor("center"),
        pos(width()/2, height()/2),
        scale(1.5)
    ])
    add ([
        text("Left and Right Arrow to Switch Lanes"),
        anchor("center"),
        pos(width()/2, height()/1.25),
    ])
    onKeyPress("space", ()=>{go("game");})
})

let score = 0;

loadSound("game", "sfx/video-game-music-loop-27629.mp3");

const music = play("game", { 
    loop: true,
    paused: true
})

scene("game", ()=>{
    let column = 2;
    let e = [];
    let waterlines = [];
    score = 0;
    loadSprite("boat", "sprites/boat-removebg-preview.png");
    loadSprite("rock", "sprites/rock-cartoon-on-white-background-vector-removebg-preview.png");
    loadSprite("shark", "sprites/istockphoto-665039562-612x612-removebg-preview.png");
    loadSprite("log", "sprites/Wooden-logs-icon-Cartoon-lumber-Hardwo-Graphics-70713646-1-removebg-preview.png");
    loadSprite("coin", "sprites/one-gold-coin-icon-in-cartoon-style-vector-24279928-removebg-preview.png");
    loadSprite("waterline", "sprites/waterline.png");

    loadSound("gameover", "sfx/game-over-38511.mp3");
    loadSound("coin", "sfx/coin-recieved-230517.mp3");

    music.paused = false

    add ([
        rect(width(), height()),
        color(49, 155, 235),
        pos(0, 0)
    ])

    const obstacles = ["rock", "shark", "log"]
    const lanes = [width() / 4, width() / 2, width() / 1.35]
    const player = add ([
        sprite("boat"),
        scale(0.4),
        area(),
        anchor("center"),
        pos(width() / 2, height() / 1.25)
    ])
    const rope1 = add([
        rect(3, height()),
        pos(width() / 2.7, height() / 2),
        anchor("center"),
        color(183, 113, 12)
    ])
    const rope2 = add([
        rect(3, height()),
        pos(width() / 1.6, height() / 2),
        anchor("center"),
        color(183, 113, 12)
    ])
    const scoreCount = add([
        text("Score: " + score),
        pos(32, 24),
        scale(1.25),
        color(255, 255, 255)
    ])
    onKeyPress("left", ()=>{
        if(column > 1)
            column--;
    })
    onKeyPress("right", ()=>{
        if(column < 3)
            column++;
    })
    for(let i = height(); i > 0; i -= 100) {
        let w = add ([
            sprite("waterline"),
            anchor("center"),
            pos(width()/2, i),
            scale(1.3)
        ])
        waterlines.push(w);
        readd(player);
        readd(rope1);
        readd(rope2);
        readd(scoreCount);
    }
    loop(0.75, ()=>{
        let w = add ([
            sprite("waterline"),
            anchor("center"),
            pos(width()/2, 0),
            scale(1.3)
        ])
        waterlines.push(w);
        readd(player);
        readd(rope1);
        readd(rope2);
        readd(scoreCount);
    })
    loop(3.5, ()=>{
        if(Math.floor(Math.random() * 3) == 0) {
            let c = add([
                sprite("coin"),
                anchor("center"),
                area(),
                scale(0.175),
                pos(lanes[Math.floor(Math.random() * 3)], 0),
                "coin"
            ])
            e.push(c)
        } else {
            let o = add([
                sprite(obstacles[Math.floor(Math.random() * 3)]),
                anchor("center"),
                area(),
                scale(0.25),
                pos(lanes[Math.floor(Math.random() * 3)], 0),
                "obstacle"
            ])
            e.push(o);
        }
    })
    player.onCollide("obstacle", ()=>{
        play("gameover");
        go("gameover");
    })
    player.onCollide("coin", (obj)=>{
        score++;
        scoreCount.text = "Score: " + score;
        e.shift();
        obj.destroy();
        play("coin");
    })
    onUpdate(()=>{
        if(column == 1)
            player.pos.x = lanes[0];
        else if(column == 2)
            player.pos.x = lanes[1];
        else
            player.pos.x = lanes[2];
        for(const obj of e) {
            obj.move(0, 100);
            if(obj.pos.y > height()) {
                e.shift();
                obj.destroy();
            }
        }
        for(const obj of waterlines) {
            obj.move(0, 100);
            if(obj.pos.y > height()) {
                waterlines.shift();
                obj.destroy();
            }
        }
    })
})

scene("gameover", ()=>{
    music.paused = true;
    add([
        rect(width(), height()),
        color(255, 0, 0),
    ])
    add([
        text("Score: " + score),
        color(0, 0, 0),
        scale(1.5),
        pos(32, 24)
    ])
    add([
        text("Game Over"),
        color(0, 0, 0),
        anchor("center"),
        scale(2),
        pos(width() / 2, height() / 2)
    ])
    add([
        text("Press Space to Restart"),
        color(0, 0, 0),
        anchor("center"),
        scale(1.5),
        pos(width() / 2, height() / 1.5)
    ])
    onKeyPress("space", ()=>{go("title")})
})

go("title")