import React, { MutableRefObject } from "react";

interface ImageObject {
  image: HTMLImageElement;
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  key: number;
  index: number;
  status: boolean;
}

const images = [
  "/truc-linh/1.JPG",
  "/truc-linh/2.JPG",
  "/truc-linh/3.JPG",
  "/truc-linh/4.JPG",
  "/truc-linh/5.JPG",
  "/truc-linh/6.JPG",
  "/truc-linh/7.JPG",
  "/truc-linh/8.JPG",
  "/truc-linh/9.JPG",
  "/truc-linh/10.JPG",
  "/truc-linh/11.JPG",
  "/truc-linh/12.JPG",
  "/truc-linh/13.JPG",
  "/truc-linh/14.JPG",
  "/truc-linh/15.JPG",
  "/truc-linh/16.JPG",
  "/truc-linh/17.JPG",
  "/truc-linh/18.JPG"
];

export function useImage(
  canvasRef: MutableRefObject<HTMLCanvasElement | null>,
  draw: () => void
) {
  const flakes = React.useRef<Record<string, string[]>>({});

  const runImage = React.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const context = canvas?.getContext("2d") as CanvasRenderingContext2D;
    const imageObjects: ImageObject[] = [];

    const loadImage = (
      src: string,
      x: number,
      speed: number,
      key: number,
      index: number,
      status: boolean
    ) => {
      const image = new Image();
      image.src = src;
      image.onload = () => {
        const width = 200;
        const height = (width / image.width) * image.height;
        imageObjects.push({
          image,
          x,
          y: -height,
          width,
          height,
          speed,
          key,
          index,
          status,
        });
      };
    };

    const updateCanvas = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      draw();

      for (let i = 0; i < imageObjects.length; i++) {
        const flake = imageObjects[i];
        flake.y += flake.speed;
        if (flake.y > canvas!.height) {
          const newFlakes = flakes.current[flake.key];
          let index = flake.index + 1 >= newFlakes.length ? 0 : flake.index + 1;
          const src = newFlakes[index];

          const image = new Image();
          image.src = src;
          image.onload = () => {
            const width = 200;
            const height = (width / image.width) * image.height;
            imageObjects[i] = {
              image,
              x: flake.x,
              y: -height,
              width,
              height,
              speed:  Math.random() * 1 + 1,
              index,
              key: flake.key,
              status: true,
            };
          };
        }
        context.drawImage(
          flake.image,
          flake.x,
          flake.y,
          flake.width,
          flake.height
        );
      }

      requestAnimationFrame(updateCanvas);
    };

    let count = Math.floor(canvas.width / 200);
    let delta = canvas.width - count * 200;
    if (delta < 150) {
      count = count - 1;
      delta = delta + 200;
    }
    delta = Math.floor(delta / count);

    images.forEach((src, index) => {
      const key = index % count;
      if (!flakes.current[key]) {
        flakes.current[key] = [src];
      } else {
        flakes.current[key].push(src);
      }
    });

    for (let i = 0; i < count; i++) {
      const src = flakes.current[i][0];
      if (src) {
        const x = delta / 2 + i * (200 + delta);
        const speed = Math.random() * 1 + 1;
        loadImage(src, x, speed, i, 0, true);
      }
    }
    updateCanvas();
  }, [canvasRef, draw]);

  return { runImage };
}
