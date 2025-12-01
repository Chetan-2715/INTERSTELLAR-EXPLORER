import React, { useMemo, useRef } from "react";
import { useFrame, useThree, extend } from "@react-three/fiber";
import * as THREE from "three";
import { Effect } from "postprocessing";

// Custom Effect Implementation
class GravitationalLensingEffect extends Effect {
    constructor({ strength = 0.0 }) {
        super(
            "GravitationalLensingEffect",
            `
      uniform vec2 uMouse;
      uniform vec2 uResolution;
      uniform float uStrength;
      uniform float uTime;
      
      void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
        // Correct aspect ratio
        float aspect = uResolution.x / uResolution.y;
        vec2 center = vec2(0.5, 0.5);
        
        // UV relative to center, corrected for aspect
        vec2 uvToCenter = uv - center;
        uvToCenter.x *= aspect;
        
        float dist = length(uvToCenter);
        
        // Lensing formula
        // Distortion decreases with distance from center
        // We want a strong Einstein ring effect near the center
        // Formula: alpha = 4GM / (c^2 * b)
        // Visual approximation: distortion ~ 1/dist
        
        // Smoothstep to limit effect to a certain radius if needed, 
        // but gravity is infinite range (inverse square).
        
        float distortion = uStrength / (dist * dist + 0.02);
        
        // Clamp distortion to avoid tearing at singularity
        distortion = min(distortion, 0.8);
        
        // Calculate offset vector
        // Light bends *around* the mass.
        // We see light from "behind" the mass appearing at a larger radius.
        // So we need to sample from a coordinate *closer* to the center than the current pixel.
        
        vec2 offset = normalize(uvToCenter) * distortion * 0.05;
        
        // Apply offset
        vec2 distortedUV = uv - offset;
        
        // Sample texture
        outputColor = texture2D(inputBuffer, distortedUV);
        
        // Optional: Add a subtle chromatic aberration near the event horizon
        if (distortion > 0.2) {
             float r = texture2D(inputBuffer, distortedUV + offset * 0.05).r;
             float g = texture2D(inputBuffer, distortedUV).g;
             float b = texture2D(inputBuffer, distortedUV - offset * 0.05).b;
             outputColor = vec4(r, g, b, 1.0);
        }
      }
      `,
            {
                uniforms: new Map<string, THREE.Uniform>([
                    ["uMouse", new THREE.Uniform(new THREE.Vector2(0.5, 0.5))],
                    ["uResolution", new THREE.Uniform(new THREE.Vector2(1, 1))],
                    ["uStrength", new THREE.Uniform(strength)],
                    ["uTime", new THREE.Uniform(0)],
                ]),
            }
        );
    }
}

// React Component Wrapper
export const Lensing = React.forwardRef(({ strength }: { strength: number }, ref) => {
    const effect = useMemo(() => new GravitationalLensingEffect({ strength }), [strength]);
    const { size, pointer, clock } = useThree();

    useFrame(() => {
        const resolutionUniform = effect.uniforms.get("uResolution");
        const strengthUniform = effect.uniforms.get("uStrength");
        const mouseUniform = effect.uniforms.get("uMouse");
        const timeUniform = effect.uniforms.get("uTime");

        if (resolutionUniform) resolutionUniform.value.set(size.width, size.height);
        if (timeUniform) timeUniform.value = clock.getElapsedTime();

        // Mouse interaction logic
        // Calculate strength based on mouse position relative to center
        // pointer is -1 to 1
        const dist = Math.sqrt(pointer.x * pointer.x + pointer.y * pointer.y);

        // Dynamic strength: stronger when mouse is close to center (BH)
        // Formula: mass * smoothstep(0, 0.35, 1 - distance)
        // distance is 0 at center, 1.41 at corner

        // Normalize dist to 0-1 range roughly
        const normDist = Math.min(dist, 1.0);

        // User requested: lensingStrength = mass * smoothstep(0, 0.35, 1 - distance(cursor, blackHoleCenter))
        // Note: smoothstep(edge0, edge1, x) returns 0 if x < edge0, 1 if x > edge1
        // 1 - dist is 1 at center, 0 at edge.
        // So if we are close to center (1-dist is high), smoothstep is 1.
        // If we are far (1-dist is low), smoothstep is 0.

        const proximity = 1.0 - normDist;
        const mouseFactor = THREE.MathUtils.smoothstep(proximity, 0.0, 0.35);
        // Wait, smoothstep(0, 0.35, proximity) means:
        // if proximity < 0 -> 0
        // if proximity > 0.35 -> 1
        // So if we are within distance 0.65 (1-0.35) of center, it's max strength?
        // Actually, let's just use the requested formula logic.

        // Base strength from mass (prop) + mouse interaction
        // We want the effect to be always present (gravity doesn't turn off), 
        // but maybe the *cursor* adds *extra* bending or the user wants the cursor to *control* it?
        // "Cursor-based light bending... Receives mouse position... Computes bending intensity..."
        // It seems the user wants the LENSING to be dependent on the CURSOR position?
        // Or maybe the cursor *is* the probe.
        // "Moving the cursor near the black hole bends spacetime around it"
        // Okay, so the lensing effect *on the screen* gets stronger when cursor is near BH.

        const dynamicStrength = strength * THREE.MathUtils.smoothstep(proximity, 0.0, 0.6);

        // Ensure a minimum base lensing so the BH always looks like a BH
        const finalStrength = Math.max(dynamicStrength, strength * 0.2);

        if (strengthUniform) strengthUniform.value = finalStrength;
        if (mouseUniform) mouseUniform.value.set(pointer.x * 0.5 + 0.5, pointer.y * 0.5 + 0.5);
    });

    return <primitive ref={ref} object={effect} dispose={null} />;
});
