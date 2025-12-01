"use client";

import React, { useEffect, useRef } from "react";
import "@/styles/backgroundAnimation.css";

const BackgroundAnimation: React.FC = () => {
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

        // Star properties
        const stars: { x: number; y: number; size: number; speed: number; opacity: number }[] = [];
        const numStars = 200;

        // Initialize stars
        for (let i = 0; i < numStars; i++) {
            stars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() * 2,
                speed: Math.random() * 0.5 + 0.1,
                opacity: Math.random(),
            });
        }

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // Draw stars
            stars.forEach((star) => {
                ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fill();

                // Move stars
                star.y += star.speed;

                // Reset star position if it goes off screen
                if (star.y > height) {
                    star.y = 0;
                    star.x = Math.random() * width;
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
        <div className="background-container">
            <div className="nebula-glow">
                <div className="nebula-1"></div>
                <div className="nebula-2"></div>
                <div className="nebula-3"></div>
            </div>
            <canvas ref={canvasRef} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 1 }} />
            {/* Shooting Stars */}
            <div className="shooting-star" style={{ top: "20%", left: "80%", animationDelay: "0s" }}></div>
            <div className="shooting-star" style={{ top: "40%", left: "60%", animationDelay: "2s" }}></div>
            <div className="shooting-star" style={{ top: "60%", left: "90%", animationDelay: "4s" }}></div>
        </div>
    );
};

export default BackgroundAnimation;
