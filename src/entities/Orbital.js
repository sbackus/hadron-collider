import Phaser from 'phaser';

export default class Orbital {
    constructor(scene, x, y) {
        this.scene = scene;
        this.centerX = scene.centerX;
        this.centerY = scene.centerY;
        
        // Create Phaser sprite for visual representation
        this.sprite = scene.add.circle(x, y, 8, 0x00ff00);
        
        // Create Matter.js physics body
        this.body = scene.matter.add.circle(x, y, 8, {
            restitution: 0.95, // More bouncy like a marble
            friction: 0.01, // Less drag for smoother movement
            frictionAir: 0.01, // Air resistance
            render: { visible: false } // Hide Matter.js rendering, use Phaser sprite
        });
        
        // Set orbital properties
        this.orbitRadius = scene.trackCenterRadius;
        this.orbitSpeed = 0.1; // Start with some momentum
        this.maxOrbitSpeed = 3;
        this.minOrbitSpeed = 0.1; // Minimum momentum
        this.orbitSpeedChange = 0.001; // Very slow acceleration
        this.radiusChange = 5;
        
        // Set up collision detection with Matter.js events
        this.setupCollisions();
    }
    
    setupCollisions() {
        // Get wall bodies for collision detection
        const innerWalls = this.scene.innerWalls.getCollisionWalls();
        const outerWalls = this.scene.outerWalls.getCollisionWalls();
        
        // Collect all wall bodies
        const allWallBodies = [...innerWalls];
        this.scene.outerWalls.getCollisionWalls().forEach(wallData => {
            allWallBodies.push(wallData.body);
        });
        
        console.log(`Orbital: Setting up collisions with ${allWallBodies.length} walls`);
        
        // Add collision event listener
        this.scene.matter.world.on('collisionstart', (event) => {
            event.pairs.forEach((pair) => {
                if ((pair.bodyA === this.body && allWallBodies.includes(pair.bodyB)) ||
                    (pair.bodyB === this.body && allWallBodies.includes(pair.bodyA))) {
                    this.handleWallCollision();
                }
            });
        });
    }
    
    handleWallCollision() {
        // Add some visual feedback when hitting walls
        this.scene.tweens.add({
            targets: this.sprite,
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
        if (!this.body) return;
        
        // Sync sprite position with physics body
        this.sprite.x = this.body.position.x;
        this.sprite.y = this.body.position.y;
        this.sprite.rotation = this.body.angle; // Show rotation!
        
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
        const currentAngle = Math.atan2(this.body.position.y - this.centerY, this.body.position.x - this.centerX);
        
        // Update angle based on orbit speed (this controls how fast it orbits)
        const newAngle = currentAngle + this.orbitSpeed;
        
        // Calculate target position at the desired orbit radius
        const targetX = this.centerX + Math.cos(newAngle) * this.orbitRadius;
        const targetY = this.centerY + Math.sin(newAngle) * this.orbitRadius;
        
        // Move player towards target position with consistent velocity
        const dx = targetX - this.body.position.x;
        const dy = targetY - this.body.position.y;
        
        // Use velocity for orbital movement
        const velocityMultiplier = 0.08; // Adjusted for Matter.js scale
        this.scene.matter.body.setVelocity(this.body, {
            x: dx * velocityMultiplier,
            y: dy * velocityMultiplier
        });
    }
    
    getDebugInfo() {
        if (!this.body) return {};
        
        const velocity = this.body.velocity;
        const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
        const distanceFromCenter = Phaser.Math.Distance.Between(
            this.centerX, 
            this.centerY, 
            this.body.position.x, 
            this.body.position.y
        );
        
        // Calculate time since last collision
        const timeSinceCollision = this.lastCollisionTime ? 
            ((this.scene.time.now - this.lastCollisionTime) / 1000).toFixed(1) : 'N/A';
        
        // Get wall radius from Matter.js body
        const wallRadius = this.scene.innerWalls.collisionWall.circleRadius || 80;
        
        return {
            orbitSpeed: this.orbitSpeed.toFixed(2),
            orbitRadius: this.orbitRadius.toFixed(1),
            velocity: speed.toFixed(1),
            distanceFromCenter: distanceFromCenter.toFixed(1),
            position: `(${this.body.position.x.toFixed(0)}, ${this.body.position.y.toFixed(0)})`,
            rotation: `${(this.body.angle * (180 / Math.PI)).toFixed(1)}°`, // Show rotation!
            collisionCount: this.collisionCount || 0,
            timeSinceCollision: timeSinceCollision,
            wallRadius: wallRadius.toFixed(1),
            isInsideWall: distanceFromCenter < wallRadius ? 'YES' : 'NO'
        };
    }
} 