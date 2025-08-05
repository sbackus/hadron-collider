import Phaser from 'phaser';

export default class Wall {
    constructor(scene, centerX, centerY, trackCenterRadius, trackWidth) {
        this.scene = scene;
        this.centerX = centerX;
        this.centerY = centerY;
        this.trackCenterRadius = trackCenterRadius;
        this.trackWidth = trackWidth;
        
        // Track color
        this.WALL_COLOR = 0x0000ff; // Blue
        
        this.createCircularTrack();
    }
    
    createCircularTrack() {
        // Calculate wall radius
        const wallRadius = this.trackCenterRadius - (this.trackWidth / 2);
        
        // Create the wall as a circle
        this.track = this.scene.add.graphics();
        this.track.lineStyle(4, this.WALL_COLOR, 1);
        this.track.strokeCircle(this.centerX, this.centerY, wallRadius);
        
        // Create a single circular collision wall
        this.collisionWall = this.scene.add.circle(
            this.centerX,
            this.centerY,
            wallRadius,
            0x000000
        );
        this.collisionWall.setVisible(true); // Temporarily visible for debugging
        this.collisionWall.setAlpha(0.3); // Semi-transparent to see the boundary
        this.scene.physics.add.existing(this.collisionWall, true);
        
        // Set the collision body to be a circle
        this.collisionWall.body.setCircle(wallRadius);
    }
    
    getCollisionWalls() {
        return [this.collisionWall];
    }
} 