function hexToRgbA(hex) {
    var c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split("");
        if (c.length == 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = "0x" + c.join("");
        // return [(c>>16)&255, (c>>8)&255, c&255];
        return c & 255;
    }
    throw new Error("Bad Hex");
}

export class Particles {
    constructor(game, quantity) {
        this.particles = [];
        this.game = game;
        this.quantity = quantity;
        this.connectRadius = this.game.borders;
        this.color = hexToRgbA(getComputedStyle(document.body).getPropertyValue("--gradient2-color"));
        this.speed = 10;
        for (let i = 0; i < this.quantity; i++) {
            this.particles.push({
                x: Math.random() * this.game.width,
                y: Math.random() * this.game.height,
                radius: Math.random() * 5,
                velocity: {
                    x: Math.random() * this.speed - this.speed / 2,
                    y: Math.random() * this.speed - this.speed / 2,
                },
            });
        }

        console.log(Math.floor(quantity) + " particles created");

        document.addEventListener("themeChange", (e) => {
            this.color = hexToRgbA(getComputedStyle(document.body).getPropertyValue("--gradient2-color"));
        });
    }

    addParticles(amount, x, y) {
        for (let i = 0; i < amount; i++) {
            this.particles.push({
                x: x,
                y: y,
                radius: Math.random() * 5,
                velocity: {
                    x: Math.random() * this.speed - this.speed / 2,
                    y: Math.random() * this.speed - this.speed / 2,
                },
            });
        }
    }

    deleteParticles(raduis, x, y) {
        this.particles.forEach((particle, index) => {
            const distance = Math.sqrt((particle.x - x) ** 2 + (particle.y - y) ** 2);
            if (distance <= raduis) {
                this.particles.splice(index, 1);
            }
        });
    }

    update(deltaTime) {
        this.particles.forEach((particle) => {
            particle.x += particle.velocity.x * deltaTime * this.game.speed;
            particle.y += particle.velocity.y * deltaTime * this.game.speed;

            if (particle.x < -this.game.borders) {
                particle.x += this.game.width + this.game.borders * 2;
            } else if (particle.x > this.game.width + this.game.borders) {
                particle.x -= this.game.width + this.game.borders * 2;
            }

            if (particle.y < -this.game.borders) {
                particle.y += this.game.height + this.game.borders * 2;
            } else if (particle.y > this.game.height + this.game.borders) {
                particle.y -= this.game.height + this.game.borders * 2;
            }
        });
    }
    draw(context) {
        this.particles.forEach((particle) => {
            // context.beginPath();
            // context.arc(
            //     particle.x,
            //     particle.y,
            //     this.connectRadius,
            //     0,
            //     Math.PI * 2,
            //     false
            // );
            // context.strokeStyle = `rgba(${this.color}, ${this.color}, ${this.color}, 0.1)`;
            // context.stroke();

            this.particles.forEach((particle2) => {
                if (particle === particle2) return;

                const distance = Math.sqrt((particle.x - particle2.x) ** 2 + (particle.y - particle2.y) ** 2);
                if (distance <= this.connectRadius) {
                    const smoothRadius = this.connectRadius - this.connectRadius / 10;
                    const alpha =
                        distance <= smoothRadius
                            ? 1
                            : 1 - (distance - smoothRadius) / (this.connectRadius - smoothRadius);
                    context.beginPath();
                    context.moveTo(particle.x, particle.y);
                    context.lineTo(
                        particle.x + (particle2.x - particle.x) / 2,
                        particle.y + (particle2.y - particle.y) / 2
                    );
                    context.strokeStyle = `rgba(${this.color}, ${this.color}, ${this.color}, ${alpha / 2})`;
                    context.stroke();
                }
            });

            const cdistance = Math.sqrt(
                (particle.x - this.game.cursor.x) ** 2 + (particle.y - this.game.cursor.y) ** 2
            );

            if (cdistance <= this.connectRadius * 2) {
                const csmoothRadius = this.connectRadius * 2 - (this.connectRadius * 2) / 10;
                const calpha =
                    cdistance <= csmoothRadius
                        ? 1
                        : 1 - (cdistance - csmoothRadius) / (this.connectRadius * 2 - csmoothRadius);
                context.beginPath();
                context.moveTo(particle.x, particle.y);
                context.lineTo(this.game.cursor.x, this.game.cursor.y);
                context.strokeStyle = `rgba(${this.color}, ${this.color}, ${this.color}, ${calpha / 2})`;
                context.stroke();
            }

            context.beginPath();
            context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2, false);
            context.fillStyle = `rgb(${this.color}, ${this.color}, ${this.color})`;
            context.fill();
        });
    }
}
