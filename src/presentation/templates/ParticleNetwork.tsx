// particle-network.ts
/* eslint-disable */

export class Particle {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  particleColor: string;
  x: number;
  y: number;
  velocity: { x: number; y: number };

  constructor(parent: any) {
    this.canvas = parent.canvas;
    this.ctx = parent.ctx;
    this.particleColor = parent.options.particleColor;

    this.x = Math.random() * this.canvas.width;
    this.y = Math.random() * this.canvas.height;
    this.velocity = {
      x: (Math.random() - 0.5) * parent.options.velocity,
      y: (Math.random() - 0.5) * parent.options.velocity,
    };
  }

  update() {
    if (this.x > this.canvas.width + 20 || this.x < -20) {
      this.velocity.x = -this.velocity.x;
    }
    if (this.y > this.canvas.height + 20 || this.y < -20) {
      this.velocity.y = -this.velocity.y;
    }

    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.fillStyle = this.particleColor;
    this.ctx.globalAlpha = 0.7;
    this.ctx.arc(this.x, this.y, 1.5, 0, 2 * Math.PI);
    this.ctx.fill();
  }
}

export class ParticleNetwork {
  canvasDiv: any;
  bgDiv!: HTMLDivElement;
  canvas!: HTMLCanvasElement;
  ctx!: CanvasRenderingContext2D;
  options: {
    particleColor: string;
    background: string;
    interactive: boolean;
    velocity: number;
    density: number | string;
  };
  particles!: Particle[];
  mouseParticle!: Particle;
  resetTimer: any;

  constructor(canvas: HTMLDivElement, options: any) {
    this.canvasDiv = canvas;
    this.canvasDiv.size = {
      width: this.canvasDiv.offsetWidth,
      height: this.canvasDiv.offsetHeight,
    };

    options = options !== undefined ? options : {};
    this.options = {
      particleColor:
        options.particleColor !== undefined ? options.particleColor : "#fff",
      background:
        options.background !== undefined ? options.background : "#1a252f",
      interactive:
        options.interactive !== undefined ? options.interactive : true,
      velocity: this.setVelocity(options.speed),
      density: this.setDensity(options.density),
    };

    this.init();
  }

  init() {
    this.bgDiv = document.createElement("div");
    this.canvasDiv.appendChild(this.bgDiv);
    this.setStyles(this.bgDiv, {
      position: "absolute",
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      "z-index": 1,
    });

    if (/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(this.options.background)) {
      this.setStyles(this.bgDiv, {
        background: this.options.background,
      });
    } else if (/\.(gif|jpg|jpeg|tiff|png)$/i.test(this.options.background)) {
      this.setStyles(this.bgDiv, {
        background: 'url("' + this.options.background + '") no-repeat center',
        "background-size": "cover",
      });
    } else {
      console.error(
        "Please specify a valid background image or hexadecimal color"
      );
      return false;
    }

    if (
      !/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(this.options.particleColor)
    ) {
      console.error("Please specify a valid particleColor hexadecimal color");
      return false;
    }

    this.canvas = document.createElement("canvas");
    this.canvasDiv.appendChild(this.canvas);
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.canvas.width = this.canvasDiv.size.width;
    this.canvas.height = this.canvasDiv.size.height;
    this.setStyles(this.canvasDiv, { position: "relative" });
    this.setStyles(this.canvas, {
      "z-index": "20",
      position: "relative",
    });

    window.addEventListener("resize", () => {
      if (
        this.canvasDiv.offsetWidth === this.canvasDiv.size.width &&
        this.canvasDiv.offsetHeight === this.canvasDiv.size.height
      ) {
        return false;
      }

      this.canvas.width = this.canvasDiv.size.width =
        this.canvasDiv.offsetWidth;
      this.canvas.height = this.canvasDiv.size.height =
        this.canvasDiv.offsetHeight;

      clearTimeout(this.resetTimer);
      this.resetTimer = setTimeout(() => {
        this.particles = [];
        for (
          let i = 0;
          i < (this.canvas.width * this.canvas.height) / +this.options.density;
          i++
        ) {
          this.particles.push(new Particle(this));
        }
        if (this.options.interactive) {
          this.particles.push(this.mouseParticle);
        }
        requestAnimationFrame(this.update.bind(this));
      }, 500);
    });

    this.particles = [];
    for (
      let i = 0;
      i < (this.canvas.width * this.canvas.height) / +this.options.density;
      i++
    ) {
      this.particles.push(new Particle(this));
    }

    if (this.options.interactive) {
      this.mouseParticle = new Particle(this);
      this.mouseParticle.velocity = {
        x: 0,
        y: 0,
      };
      this.particles.push(this.mouseParticle);

      this.canvas.addEventListener("mousemove", (e) => {
        this.mouseParticle.x = e.clientX - this.canvas.offsetLeft;
        this.mouseParticle.y = e.clientY - this.canvas.offsetTop;
      });

      this.canvas.addEventListener("mouseup", (e) => {
        this.mouseParticle.velocity = {
          x: (Math.random() - 0.5) * this.options.velocity,
          y: (Math.random() - 0.5) * this.options.velocity,
        };
        this.mouseParticle = new Particle(this);
        this.mouseParticle.velocity = {
          x: 0,
          y: 0,
        };
        this.particles.push(this.mouseParticle);
      });
    }

    requestAnimationFrame(this.update.bind(this));
  }

  update() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.globalAlpha = 1;

    // Draw particles
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].update();
      this.particles[i].draw();

      // Draw connections
      for (let j = this.particles.length - 1; j > i; j--) {
        const distance = Math.sqrt(
          Math.pow(this.particles[i].x - this.particles[j].x, 2) +
            Math.pow(this.particles[i].y - this.particles[j].y, 2)
        );

        if (distance > 120) {
          continue;
        }

        this.ctx.beginPath();
        this.ctx.strokeStyle = this.options.particleColor;
        this.ctx.globalAlpha = (120 - distance) / 120;
        this.ctx.lineWidth = 0.7;
        this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
        this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
        this.ctx.stroke();
      }
    }

    if (this.options.velocity !== 0) {
      requestAnimationFrame(this.update.bind(this));
    }
  }
  setVelocity(speed: string) {
    if (speed === "fast") {
      return 1;
    } else if (speed === "slow") {
      return 0.33;
    } else if (speed === "none") {
      return 0;
    }
    return 0.66;
  }

  setDensity(density: string | number) {
    if (density === "high") {
      return 5000;
    } else if (density === "low") {
      return 20000;
    }
    return !isNaN(parseInt(density as string, 10)) ? density : 10000;
  }

  setStyles(div: HTMLElement, styles: { [property: string]: string|number }) {
    for (let property in styles) {
      const propertyClone: any = property;
      div.style[propertyClone] = styles[property] as string;
    }
  }
}
