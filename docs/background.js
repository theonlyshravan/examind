/**
 * Particle Background Animation
 * Adapted from original by Alex Andrix <alex@alexandrix.com>
 */

var App = {};
App.setup = function () {
    var canvas = document.createElement('canvas');
    this.filename = "spipa";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    this.canvas = canvas;

    // Set canvas as fixed background
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1'; // Behind everything
    canvas.style.pointerEvents = 'none'; // Don't block clicks
    canvas.style.filter = 'blur(4px)'; // Blur for better readability

    document.body.appendChild(canvas);

    this.ctx = this.canvas.getContext('2d');
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.dataToImageRatio = 1;
    this.ctx.imageSmoothingEnabled = false;
    this.ctx.webkitImageSmoothingEnabled = false;
    this.ctx.msImageSmoothingEnabled = false;
    this.xC = this.width / 2;
    this.yC = this.height / 2;

    this.stepCount = 0;
    this.particles = [];
    this.lifespan = 1000;
    this.popPerBirth = 1;
    this.maxPop = 300;
    this.birthFreq = 2;

    // Build grid
    this.gridSize = 8;// Motion coords
    this.gridSteps = Math.floor(1000 / this.gridSize);
    this.grid = [];
    var i = 0;
    for (var xx = -500; xx < 500; xx += this.gridSize) {
        for (var yy = -500; yy < 500; yy += this.gridSize) {
            // Radial field, triangular function of r with max around r0
            var r = Math.sqrt(xx * xx + yy * yy),
                r0 = 100,
                field;

            if (r < r0) field = 255 / r0 * r;
            else if (r > r0) field = 255 - Math.min(255, (r - r0) / 2);

            this.grid.push({
                x: xx,
                y: yy,
                busyAge: 0,
                spotIndex: i,
                isEdge: (xx == -500 ? 'left' :
                    (xx == (-500 + this.gridSize * (this.gridSteps - 1)) ? 'right' :
                        (yy == -500 ? 'top' :
                            (yy == (-500 + this.gridSize * (this.gridSteps - 1)) ? 'bottom' :
                                false
                            )
                        )
                    )
                ),
                field: field
            });
            i++;
        }
    }
    this.gridMaxIndex = i;

    this.initDraw();
};

App.evolve = function () {
    this.stepCount++;

    // Increment all grid ages
    this.grid.forEach(function (e) {
        if (e.busyAge > 0) e.busyAge++;
    });

    if (this.stepCount % this.birthFreq == 0 && (this.particles.length + this.popPerBirth) < this.maxPop) {
        this.birth();
    }
    App.move();
    App.draw();
};

App.birth = function () {
    var x, y;
    var gridSpotIndex = Math.floor(Math.random() * this.gridMaxIndex),
        gridSpot = this.grid[gridSpotIndex],
        x = gridSpot.x, y = gridSpot.y;

    var particle = {
        hue: 240, // Fixed Indigo Hue
        sat: 80,  // Fixed Saturation
        lum: 60,  // Fixed Lightness
        x: x, y: y,
        xLast: x, yLast: y,
        xSpeed: 0, ySpeed: 0,
        age: 0,
        ageSinceStuck: 0,
        attractor: {
            oldIndex: gridSpotIndex,
            gridSpotIndex: gridSpotIndex,// Pop at random position on grid
        },
        name: 'seed-' + Math.ceil(10000000 * Math.random())
    };
    this.particles.push(particle);
};

App.kill = function (particleName) {
    var newArray = _.reject(this.particles, function (seed) {
        return (seed.name == particleName);
    });
    this.particles = _.cloneDeep(newArray);
};

App.move = function () {
    for (var i = 0; i < this.particles.length; i++) {
        // Get particle
        var p = this.particles[i];

        // Save last position
        p.xLast = p.x; p.yLast = p.y;

        // Attractor and corresponding grid spot
        var index = p.attractor.gridSpotIndex,
            gridSpot = this.grid[index];

        // Maybe move attractor and with certain constraints
        if (Math.random() < 0.5) {
            // Move attractor
            if (!gridSpot.isEdge) {
                // Change particle's attractor grid spot and local move function's grid spot
                var topIndex = index - 1,
                    bottomIndex = index + 1,
                    leftIndex = index - this.gridSteps,
                    rightIndex = index + this.gridSteps,
                    topSpot = this.grid[topIndex],
                    bottomSpot = this.grid[bottomIndex],
                    leftSpot = this.grid[leftIndex],
                    rightSpot = this.grid[rightIndex];

                // Choose neighbour with highest field value (with some desobedience...)
                var chaos = 30;
                var maxFieldSpot = _.maxBy([topSpot, bottomSpot, leftSpot, rightSpot], function (e) {
                    return e.field + chaos * Math.random()
                });

                var potentialNewGridSpot = maxFieldSpot;
                if (potentialNewGridSpot.busyAge == 0 || potentialNewGridSpot.busyAge > 15) {// Allow wall fading
                    // Ok it's free let's go there
                    p.ageSinceStuck = 0;// Not stuck anymore yay
                    p.attractor.oldIndex = index;
                    p.attractor.gridSpotIndex = potentialNewGridSpot.spotIndex;
                    gridSpot = potentialNewGridSpot;
                    gridSpot.busyAge = 1;
                } else p.ageSinceStuck++;

            } else p.ageSinceStuck++;

            if (p.ageSinceStuck == 10) this.kill(p.name);
        }

        // Spring attractor to center with viscosity
        var k = 8, visc = 0.4;
        var dx = p.x - gridSpot.x,
            dy = p.y - gridSpot.y,
            dist = Math.sqrt(dx * dx + dy * dy);

        // Spring
        var xAcc = -k * dx,
            yAcc = -k * dy;

        p.xSpeed += xAcc; p.ySpeed += yAcc;

        // Calm the f*ck down
        p.xSpeed *= visc; p.ySpeed *= visc;

        // Store stuff in particle brain
        p.speed = Math.sqrt(p.xSpeed * p.xSpeed + p.ySpeed * p.ySpeed);
        p.dist = dist;

        // Update position
        p.x += 0.1 * p.xSpeed; p.y += 0.1 * p.ySpeed;

        // Get older
        p.age++;

        // Kill if too old
        if (p.age > this.lifespan) {
            this.kill(p.name);
        }
    }
};

App.initDraw = function () {
    this.ctx.beginPath();
    this.ctx.rect(0, 0, this.width, this.height);
    this.ctx.fillStyle = '#0B0C15'; // Match body background
    this.ctx.fill();
    this.ctx.closePath();
};

App.draw = function () {
    if (!this.particles.length) return false;

    this.ctx.beginPath();
    this.ctx.rect(0, 0, this.width, this.height);
    this.ctx.fillStyle = 'rgba(11, 12, 21, 0.1)'; // Match body background with opacity for trail effect
    this.ctx.fill();
    this.ctx.closePath();

    for (var i = 0; i < this.particles.length; i++) {
        // Draw particle
        var p = this.particles[i];

        var h, s, l, a;

        h = p.hue; // Fixed hue
        s = p.sat;
        l = p.lum;
        a = 1;

        var last = this.dataXYtoCanvasXY(p.xLast, p.yLast),
            now = this.dataXYtoCanvasXY(p.x, p.y);
        var attracSpot = this.grid[p.attractor.gridSpotIndex],
            attracXY = this.dataXYtoCanvasXY(attracSpot.x, attracSpot.y);
        var oldAttracSpot = this.grid[p.attractor.oldIndex],
            oldAttracXY = this.dataXYtoCanvasXY(oldAttracSpot.x, oldAttracSpot.y);

        this.ctx.beginPath();

        this.ctx.strokeStyle = 'hsla(' + h + ', ' + s + '%, ' + l + '%, ' + a + ')';
        this.ctx.fillStyle = 'hsla(' + h + ', ' + s + '%, ' + l + '%, ' + a + ')';

        // Particle trail
        this.ctx.moveTo(last.x, last.y);
        this.ctx.lineTo(now.x, now.y);

        this.ctx.lineWidth = 1.5 * this.dataToImageRatio;
        this.ctx.stroke();
        this.ctx.closePath();

        // Attractor positions
        this.ctx.beginPath();
        this.ctx.lineWidth = 1.5 * this.dataToImageRatio;
        this.ctx.moveTo(oldAttracXY.x, oldAttracXY.y);
        this.ctx.lineTo(attracXY.x, attracXY.y);
        this.ctx.arc(attracXY.x, attracXY.y, 1.5 * this.dataToImageRatio, 0, 2 * Math.PI, false);

        this.ctx.strokeStyle = 'hsla(' + h + ', ' + s + '%, ' + l + '%, ' + a + ')';
        this.ctx.fillStyle = 'hsla(' + h + ', ' + s + '%, ' + l + '%, ' + a + ')';
        this.ctx.stroke();
        this.ctx.fill();

        this.ctx.closePath();
    }
};

App.dataXYtoCanvasXY = function (x, y) {
    var zoom = 1.6;
    var xx = this.xC + x * zoom * this.dataToImageRatio,
        yy = this.yC + y * zoom * this.dataToImageRatio;

    return { x: xx, y: yy };
};

// Handle window resize
window.addEventListener('resize', function () {
    if (App.canvas) {
        App.canvas.width = window.innerWidth;
        App.canvas.height = window.innerHeight;
        App.width = App.canvas.width;
        App.height = App.canvas.height;
        App.xC = App.width / 2;
        App.yC = App.height / 2;
        App.initDraw();
    }
});

document.addEventListener('DOMContentLoaded', function () {
    App.setup();

    var frame = function () {
        App.evolve();
        requestAnimationFrame(frame);
    };
    frame();
});
