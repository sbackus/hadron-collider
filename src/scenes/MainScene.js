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
        
        this.add.text(16, 40, 'Up/Down: Speed | Left/Right: Orbit Radius', {
            fontSize: '14px',
            fill: '#cccccc'
        });
        
        // Create debug text for momentum display
        this.debugText = this.add.text(16, 70, '', {
            fontSize: '12px',
            fill: '#ffff00'
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
            8,
            0x00ff00
        );
        
        // Add physics to player
        this.physics.add.existing(this.player);
        this.player.body.setCircle(7);
        
        // Set orbital properties
        this.orbitRadius = this.trackCenterRadius;
        this.orbitSpeed = 0.1; // Start with some momentum
        this.maxOrbitSpeed = 3;
        this.minOrbitSpeed = 0.1; // Minimum momentum
        this.orbitSpeedChange = 0.001; // Very slow acceleration
        this.radiusChange = 5;
        
        // Set player properties
        this.player.body.setBounce(0.8, 0.8);
        this.player.body.setCollideWorldBounds(false);
        this.player.body.setDrag(0.98, 0.98);
        
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
        
        // Don't change bounce here - let the physics handle the deflection naturally
    }

    update() {
        if (!this.player) return;
        
        // Handle orbital controls
        const cursors = this.cursors;
        
        // Up/Down arrows control orbit speed
        if (cursors.up.isDown) {
            this.orbitSpeed = Math.min(this.orbitSpeed + this.orbitSpeedChange, this.maxOrbitSpeed);
        } else if (cursors.down.isDown) {
            this.orbitSpeed = Math.max(this.orbitSpeed - this.orbitSpeedChange, -this.maxOrbitSpeed);
        } else {
            // Gradually slow down when no keys are pressed, but maintain minimum momentum
            this.orbitSpeed *= 0.95;
            if (Math.abs(this.orbitSpeed) < this.minOrbitSpeed) {
                this.orbitSpeed = Math.sign(this.orbitSpeed) * this.minOrbitSpeed;
            }
        }
        
        // Left/Right arrows control orbit radius
        if (cursors.left.isDown) {
            this.orbitRadius = Math.max(this.orbitRadius - this.radiusChange, this.trackCenterRadius - this.trackWidth / 2 + 20);
        } else if (cursors.right.isDown) {
            this.orbitRadius = Math.min(this.orbitRadius + this.radiusChange, this.trackCenterRadius + this.trackWidth / 2 - 20);
        }
        
        // Calculate orbital movement
        const currentAngle = Math.atan2(this.player.y - this.centerY, this.player.x - this.centerX);
        
        // Update angle based on orbit speed (this controls how fast it orbits)
        const newAngle = currentAngle + this.orbitSpeed;
        
        // Calculate target position at the desired orbit radius
        const targetX = this.centerX + Math.cos(newAngle) * this.orbitRadius;
        const targetY = this.centerY + Math.sin(newAngle) * this.orbitRadius;
        
        // Move player towards target position with consistent velocity
        const player = this.player.body;
        const dx = targetX - this.player.x;
        const dy = targetY - this.player.y;
        
        // Use a constant velocity multiplier for consistent movement
        const velocityMultiplier = 8;
        player.setVelocity(dx * velocityMultiplier, dy * velocityMultiplier);
        
        // Let physics handle the wall collisions naturally
        // The collision detection in createPlayerParticle() will handle bouncing
        
        // Update debug display
        this.updateDebugDisplay();
    }
    
    updateDebugDisplay() {
        if (!this.debugText || !this.player) return;
        
        const player = this.player.body;
        const velocity = Math.sqrt(player.velocity.x * player.velocity.x + player.velocity.y * player.velocity.y);
        const distanceFromCenter = Phaser.Math.Distance.Between(this.centerX, this.centerY, this.player.x, this.player.y);
        
        this.debugText.setText([
            `Orbit Speed: ${this.orbitSpeed.toFixed(2)}`,
            `Orbit Radius: ${this.orbitRadius.toFixed(1)}`,
            `Velocity: ${velocity.toFixed(1)}`,
            `Distance from Center: ${distanceFromCenter.toFixed(1)}`,
            `Position: (${this.player.x.toFixed(0)}, ${this.player.y.toFixed(0)})`
        ]);
    }
} 