declare module 'canvas-confetti' {
  interface ConfettiOptions {
    particleCount?: number;
    spread?: number;
    origin?: { x?: number; y?: number };
    colors?: string[];
    angle?: number;
    startVelocity?: number;
    decay?: number;
    gravity?: number;
    ticks?: number;
    scalar?: number;
  }
  function confetti(options?: ConfettiOptions): Promise<null>;
  export default confetti;
}
