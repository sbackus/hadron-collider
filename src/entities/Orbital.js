import Phaser from 'phaser';

export default class Orbital {
    constructor(scene, x, y) {
        this.scene = scene;
        this.centerX = scene.centerX;
        this.centerY = scene.centerY;
        
        // Create player particle
        this.sprite = scene.add.circle(x, y, 8, 0x00ff00);
        
        // Add physics to player
        scene.physics.add.existing(this.sprite);
        this.sprite.body.setCircle(7);
        
        // Set orbital properties
        this.orbitRadius = scene.trackCenterRadius;
        this.orbitSpeed = 0.1; // Start with some momentum
        this.maxOrbitSpeed = 3;
        this.minOrbitSpeed = 0.1; // Minimum momentum
        this.orbitSpeedChange = 0.001; // Very slow acceleration
        this.radiusChange = 5;
        
        // Set player properties
        this.sprite.body.setBounce(0.95, 0.95); // More bouncy like a marble
        this.sprite.body.setCollideWorldBounds(false);
        this.sprite.body.setDrag(0.01, 0.01); // Less drag for smoother movement
        
        // Add collision with all wall segments
        const innerWalls = scene.innerWalls.getCollisionWalls();
        const outerWalls = scene.outerWalls.getCollisionWalls();
        
        innerWalls.forEach(wall => {
            scene.physics.add.collider(this.sprite, wall, this.handleWallCollision, null, this);
        });
        
        outerWalls.forEach(wall => {
            scene.physics.add.collider(this.sprite, wall, this.handleWallCollision, null, this);
        });
    }
    
    handleWallCollision(player, wall) {
        // Add some visual feedback when hitting walls
        this.scene.tweens.add({
            targets: player,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 100,
            yoyo: true
        });
        
        // Track collision info for debugging
        this.lastCollisionTime = this.scene.time.now;
        this.collisionCount = (this.collisionCount || 0) + 1;
        
        // Let the physics engine handle the natural bounce
    }
    
    update(cursors) {
        if (!this.sprite) return;
        
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
            this.orbitRadius = Math.max(this.orbitRadius - this.radiusChange, this.scene.trackCenterRadius - this.scene.trackWidth / 2 + 20);
        } else if (cursors.right.isDown) {
            this.orbitRadius = Math.min(this.orbitRadius + this.radiusChange, this.scene.trackCenterRadius + this.scene.trackWidth / 2 - 20);
        }
        
        // Calculate orbital movement
        const currentAngle = Math.atan2(this.sprite.y - this.centerY, this.sprite.x - this.centerX);
        
        // Update angle based on orbit speed (this controls how fast it orbits)
        const newAngle = currentAngle + this.orbitSpeed;
        
        // Calculate target position at the desired orbit radius
        const targetX = this.centerX + Math.cos(newAngle) * this.orbitRadius;
        const targetY = this.centerY + Math.sin(newAngle) * this.orbitRadius;
        
        // Move player towards target position with consistent velocity
        const player = this.sprite.body;
        const dx = targetX - this.sprite.x;
        const dy = targetY - this.sprite.y;
        
        // Use a constant velocity multiplier for consistent movement
        const velocityMultiplier = 8;
        player.setVelocity(dx * velocityMultiplier, dy * velocityMultiplier);
    }
    
    getDebugInfo() {
        if (!this.sprite) return {};
        
        const player = this.sprite.body;
        const velocity = Math.sqrt(player.velocity.x * player.velocity.x + player.velocity.y * player.velocity.y);
        const distanceFromCenter = Phaser.Math.Distance.Between(this.centerX, this.centerY, this.sprite.x, this.sprite.y);
        
        // Calculate time since last collision
        const timeSinceCollision = this.lastCollisionTime ? 
            ((this.scene.time.now - this.lastCollisionTime) / 1000).toFixed(1) : 'N/A';
        
        return {
            orbitSpeed: this.orbitSpeed.toFixed(2),
            orbitRadius: this.orbitRadius.toFixed(1),
            velocity: velocity.toFixed(1),
            distanceFromCenter: distanceFromCenter.toFixed(1),
            position: `(${this.sprite.x.toFixed(0)}, ${this.sprite.y.toFixed(0)})`,
            collisionCount: this.collisionCount || 0,
            timeSinceCollision: timeSinceCollision,
            wallRadius: this.scene.innerWalls.collisionWall.radius.toFixed(1),
            isInsideWall: distanceFromCenter < this.scene.innerWalls.collisionWall.radius ? 'YES' : 'NO'
        };
    }
} 