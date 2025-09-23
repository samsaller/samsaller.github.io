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
            this.particles = new Particles(this, (this.width * this.height) / 8000);
            this.cursor = { x: -1000, y: -1000 };
            this.affectedRaduis = this.particles.connectRadius;
        }
        update(deltaTime) {
            this.particles.update(deltaTime);
        }
        draw(context) {
            context.clearRect(0, 0, this.width, this.height);
            context.beginPath();
            context.arc(this.cursor.x, this.cursor.y, this.affectedRaduis, 0, 2 * Math.PI);
            context.strokeStyle = "#fff";
            context.stroke();
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

    window.addEventListener("click", (e) => {
        let x = e.x;
        let y = e.y;
        game.particles.addParticles(10, x, y);
    });
    window.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        let x = e.x;
        let y = e.y;
        game.particles.deleteParticles(game.affectedRaduis, x, y);
    });

    animate(0);
});
