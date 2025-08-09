import Phaser from 'phaser';

export default class OuterWall {
    constructor(scene, centerX, centerY, size) {
        this.scene = scene;
        this.centerX = centerX;
        this.centerY = centerY;
        this.size = size;
        
        // Wall color
        this.WALL_COLOR = 0xff0000; // Red
        
        this.createBoxWall();
    }
    
    createBoxWall() {
        // Create the visual box wall
        this.track = this.scene.add.graphics();
        this.track.lineStyle(4, this.WALL_COLOR, 1);
        
        // Draw rectangle
        const halfSize = this.size / 2;
        this.track.strokeRect(
            this.centerX - halfSize,
            this.centerY - halfSize,
            this.size,
            this.size
        );
        
        // Create collision walls for the box
        this.createCollisionWalls();
    }
    
    createCollisionWalls() {
        this.collisionWalls = [];
        const halfSize = this.size / 2;
        
        // Create 4 walls for the box (top, right, bottom, left)
        const walls = [
            // Top wall
            { x: this.centerX, y: this.centerY - halfSize, width: this.size, height: 20 },
            // Right wall
            { x: this.centerX + halfSize, y: this.centerY, width: 20, height: this.size },
            // Bottom wall
            { x: this.centerX, y: this.centerY + halfSize, width: this.size, height: 20 },
            // Left wall
            { x: this.centerX - halfSize, y: this.centerY, width: 20, height: this.size }
        ];
        
        walls.forEach((wall, index) => {
            // Create Phaser sprite for visual representation
            const wallSprite = this.scene.add.rectangle(
                wall.x,
                wall.y,
                wall.width,
                wall.height,
                0x0000ff
            );
            wallSprite.setVisible(true); // Temporarily visible for debugging
            wallSprite.setAlpha(0.3); // Semi-transparent
            
            // Create Matter.js physics body
            const wallBody = this.scene.matter.add.rectangle(
                wall.x,
                wall.y,
                wall.width,
                wall.height,
                { 
                    isStatic: true,
                    render: { visible: false } // Hide Matter.js rendering, use Phaser sprite
                }
            );
            
            // Store both sprite and body
            this.collisionWalls.push({
                sprite: wallSprite,
                body: wallBody
            });
            
            // Debug: log wall segment info
            console.log(`Outer wall segment ${index}:`, {
                x: wall.x,
                y: wall.y,
                width: wall.width,
                height: wall.height
            });
        });
        
        console.log(`Created ${this.collisionWalls.length} outer wall segments`);
    }
    
    getCollisionWalls() {
        return this.collisionWalls;
    }
} 