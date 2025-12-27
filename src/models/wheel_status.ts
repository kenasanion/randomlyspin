export interface WheelStatus {
    rotation: number;
    slices: number;
    radius: number;
    durationInSeconds: number;
    spinning: boolean;
    spinDirection: 'clockwise' | 'counter-clockwise';
}