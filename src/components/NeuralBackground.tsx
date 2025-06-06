"use client";

import type { Container } from "@tsparticles/engine";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useCallback, useEffect, useState } from "react";

export default function NeuralBackground() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = useCallback(async (container: Container | undefined) => {
    console.log("Neural particles container loaded", container);
  }, []);

  if (!init) {
    return null;
  }

  return (
    <Particles
      id="tsparticles"
      particlesLoaded={particlesLoaded}
      options={{
        fullScreen: false,
        background: {
          color: {
            value: "#000000",
          },
        },
        fpsLimit: 120,
        interactivity: {
          events: {
            onClick: {
              enable: false,
            },
            onHover: {
              enable: false,
            },
            resize: {
              enable: true,
            },
          },
        },
        particles: {
          color: {
            value: [
              "#ff0000", // 红色
              "#00ff00", // 绿色
              "#0000ff", // 蓝色
              "#ffff00", // 黄色
              "#ff00ff", // 紫色
              "#00ffff", // 青色
              "#ffa500", // 橙色
              "#ff69b4", // 粉色
            ],
          },
          links: {
            color: "#ffffff",
            distance: 80,
            enable: true,
            opacity: 0.4,
            width: 1,
            triangles: {
              enable: true,
              opacity: 0.1,
            },
          },
          move: {
            enable: false,
          },
          number: {
            value: 80,
            density: {
              enable: true,
            },
          },
          opacity: {
            value: 0.7,
            animation: {
              enable: true,
              speed: 0.5,
              sync: false,
            },
          },
          shape: {
            type: "circle",
          },
          size: {
            value: 2,
          },
          pulse: {
            enable: true,
            speed: 0.5,
            sync: false,
          },
        },
        detectRetina: true,
      }}
      className="absolute inset-0"
    />
  );
}
