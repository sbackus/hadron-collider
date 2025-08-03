import Phaser from 'phaser';

export default class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    create() {
        // Center of the game world
        this.centerX = this.cameras.main.width / 2;
        this.centerY = this.cameras.main.height / 2;
        
        // Track dimensions
        this.trackCenterRadius = 250; // Distance from center to middle of track
        this.trackWidth = 80; // Width of the racing track
        this.wallThickness = 20; // Thickness of each wall
        
        // Track colors
        this.OUTER_WALL_COLOR = 0xff0000; // Red
        this.INNER_WALL_COLOR = 0x0000ff; // Blue
        
        // Create circular track
        this.createCircularTrack();
        
        // Create player particle
        this.createPlayerParticle();
        
        // Add controls
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // Add some UI text
        this.add.text(16, 16, 'Hadron - Loop Racing', {
            fontSize: '18px',
            fill: '#ffffff'
        });
        
        this.add.text(16, 40, 'Use arrow keys to move', {
            fontSize: '14px',
            fill: '#cccccc'
        });
    }

    createCircularTrack() {
        // Calculate wall positions
        const innerWallRadius = this.trackCenterRadius - (this.trackWidth / 2);
        const outerWallRadius = this.trackCenterRadius + (this.trackWidth / 2);
        
        // Create the track as a ring shape
        this.track = this.add.graphics();
        this.track.lineStyle(4, this.OUTER_WALL_COLOR, 1);
        this.track.strokeCircle(this.centerX, this.centerY, outerWallRadius);
        this.track.lineStyle(4, this.INNER_WALL_COLOR, 1);
        this.track.strokeCircle(this.centerX, this.centerY, innerWallRadius);
        
        // Create invisible collision walls
        this.createCollisionWalls(innerWallRadius, outerWallRadius);
    }
    
    createCollisionWalls(innerRadius, outerRadius) {
        // Create multiple small collision segments to approximate the circular walls
        const segments = 32; // Number of collision segments
        this.collisionWalls = [];
        
        for (let i = 0; i < segments; i++) {
            const angle = (i / segments) * Math.PI * 2;
            const nextAngle = ((i + 1) / segments) * Math.PI * 2;
            
            // Inner wall segment
            const innerStartX = this.centerX + Math.cos(angle) * innerRadius;
            const innerStartY = this.centerY + Math.sin(angle) * innerRadius;
            const innerEndX = this.centerX + Math.cos(nextAngle) * innerRadius;
            const innerEndY = this.centerY + Math.sin(nextAngle) * innerRadius;
            
            // Create a small rectangle for collision instead of a line
            const segmentLength = Math.sqrt(
                Math.pow(innerEndX - innerStartX, 2) + Math.pow(innerEndY - innerStartY, 2)
            );
            const segmentAngle = Math.atan2(innerEndY - innerStartY, innerEndX - innerStartX);
            
            const innerSegment = this.add.rectangle(
                (innerStartX + innerEndX) / 2,
                (innerStartY + innerEndY) / 2,
                segmentLength,
                8,
                0x000000
            );
            innerSegment.setVisible(false);
            innerSegment.setRotation(segmentAngle);
            this.physics.add.existing(innerSegment, true);
            this.collisionWalls.push(innerSegment);
            
            // Outer wall segment
            const outerStartX = this.centerX + Math.cos(angle) * outerRadius;
            const outerStartY = this.centerY + Math.sin(angle) * outerRadius;
            const outerEndX = this.centerX + Math.cos(nextAngle) * outerRadius;
            const outerEndY = this.centerY + Math.sin(nextAngle) * outerRadius;
            
            const outerSegmentLength = Math.sqrt(
                Math.pow(outerEndX - outerStartX, 2) + Math.pow(outerEndY - outerStartY, 2)
            );
            const outerSegmentAngle = Math.atan2(outerEndY - outerStartY, outerEndX - outerStartX);
            
            const outerSegment = this.add.rectangle(
                (outerStartX + outerEndX) / 2,
                (outerStartY + outerEndY) / 2,
                outerSegmentLength,
                8,
                0x000000
            );
            outerSegment.setVisible(false);
            outerSegment.setRotation(outerSegmentAngle);
            this.physics.add.existing(outerSegment, true);
            this.collisionWalls.push(outerSegment);
        }
    }

    createPlayerParticle() {
        // Create player particle at the top of the track
        this.player = this.add.circle(
            this.centerX,
            this.centerY - this.trackCenterRadius,
            15,
            0x00ff00
        );
        
        // Add physics to player
        this.physics.add.existing(this.player);
        this.player.body.setCircle(15);
        
        // Set player properties
        this.playerSpeed = 200;
        this.player.body.setBounce(1, 1);
        this.player.body.setCollideWorldBounds(false);
        
        // Add collision with all wall segments
        this.collisionWalls.forEach(wall => {
            this.physics.add.collider(this.player, wall, this.handleWallCollision, null, this);
        });
    }

    handleWallCollision(player, wall) {
        // Add some visual feedback when hitting walls
        this.tweens.add({
            targets: player,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 100,
            yoyo: true
        });
        
        // Add a small bounce effect
        player.body.setBounce(0.8, 0.8);
    }

    update() {
        if (!this.player) return;
        
        // Handle player movement
        const cursors = this.cursors;
        const player = this.player.body;
        
        // Reset velocity
        player.setVelocity(0);
        
        // Handle input
        if (cursors.left.isDown) {
            player.setVelocityX(-this.playerSpeed);
        } else if (cursors.right.isDown) {
            player.setVelocityX(this.playerSpeed);
        }
        
        if (cursors.up.isDown) {
            player.setVelocityY(-this.playerSpeed);
        } else if (cursors.down.isDown) {
            player.setVelocityY(this.playerSpeed);
        }
        
        // Let physics handle the wall collisions naturally
        // The collision detection in createPlayerParticle() will handle bouncing
    }
} 