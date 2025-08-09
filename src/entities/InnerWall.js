import Phaser from 'phaser';

export default class InnerWall {
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
        
        // Create Phaser sprite for visual representation
        this.wallSprite = this.scene.add.circle(
            this.centerX,
            this.centerY,
            wallRadius,
            0x000000
        );
        this.wallSprite.setVisible(true); // Temporarily visible for debugging
        this.wallSprite.setAlpha(0.3); // Semi-transparent to see the boundary
        
        // Create Matter.js physics body
        this.collisionWall = this.scene.matter.add.circle(
            this.centerX,
            this.centerY,
            wallRadius,
            { 
                isStatic: true,
                render: { visible: false } // Hide Matter.js rendering, use Phaser sprite
            }
        );
    }
    
    getCollisionWalls() {
        return [this.collisionWall];
    }
} 