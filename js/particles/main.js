import { Particles } from "./particles.js";

window.addEventListener("load", () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class Game {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.borders = 120;
            this.speed = 0.02;
            this.particles = new Particles(this, this.width*this.height/8000);
            this.cursor = { x: -1000, y: -1000 };
        }
        update(deltaTime) {
            this.particles.update(deltaTime);
        }
        draw(context) {
            context.clearRect(0, 0, this.width, this.height);
            this.particles.draw(context);
        }
    }

    const game = new Game(canvas.width, canvas.height);

    let lasttime = 0;

    function animate(timeStamp) {
        const deltaTime = timeStamp - lasttime;
        lasttime = timeStamp;
        game.update(deltaTime);
        game.draw(ctx);
        requestAnimationFrame(animate);
    }

    window.addEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        game.width = canvas.width;
        game.height = canvas.height;
    });

    window.addEventListener("mousemove", (e) => {
        game.cursor.x = e.clientX;
        game.cursor.y = e.clientY;
    });

    window.addEventListener("touchmove", (e) => {
        game.cursor.x = e.clientX;
        game.cursor.y = e.clientY;
    });

    window.addEventListener("mouseout", (e) => {
        game.cursor.x = -1000;
        game.cursor.y = -1000;
    });

    window.addEventListener("touchend", (e) => {
        game.cursor.x = -1000;
        game.cursor.y = -1000;
    });

    animate(0);
});
