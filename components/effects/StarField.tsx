"use client";

import React, { useEffect, useRef } from "react";

interface Star {
    x: number;
    y: number;
    z: number;
    size: number;
}

const StarField: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        const stars: Star[] = [];
        const numStars = 800;
        const speed = 0.5;

        for (let i = 0; i < numStars; i++) {
            stars.push({
                x: Math.random() * width - width / 2,
                y: Math.random() * height - height / 2,
                z: Math.random() * width,
                size: Math.random() * 2,
            });
        }

        const animate = () => {
            ctx.fillStyle = "#030014";
            ctx.fillRect(0, 0, width, height);

            stars.forEach((star) => {
                star.z -= speed;
                if (star.z <= 0) {
                    star.z = width;
                    star.x = Math.random() * width - width / 2;
                    star.y = Math.random() * height - height / 2;
                }

                const x = (star.x / star.z) * width + width / 2;
                const y = (star.y / star.z) * height + height / 2;
                const size = (1 - star.z / width) * star.size * 2;

                if (x >= 0 && x < width && y >= 0 && y < height && size > 0) {
                    const alpha = 1 - star.z / width;
                    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
                    ctx.beginPath();
                    ctx.arc(x, y, size, 0, Math.PI * 2);
                    ctx.fill();
                }
            });

            requestAnimationFrame(animate);
        };

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        window.addEventListener("resize", handleResize);
        animate();

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full -z-10"
        />
    );
};

export default StarField;
