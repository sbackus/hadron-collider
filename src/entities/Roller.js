import Phaser from 'phaser';

export default class Roller {
    constructor(scene, x, y) {
        this.scene = scene;
        
        // Create Phaser sprite for visual representation
        this.sprite = scene.add.circle(x, y, 8, 0xff8800); // Orange color to distinguish from Orbital
        
        // Create Matter.js physics body
        this.body = scene.matter.add.circle(x, y, 8, {
            restitution: 0.95, // More bouncy like a marble
            friction: 0.02, // Slight drag for marble-like feel
            frictionAir: 0.02, // Air resistance
            render: { visible: false } // Hide Matter.js rendering, use Phaser sprite
        });
        
        // Movement properties
        this.moveSpeed = 0.0001; // Adjusted for Matter.js force scale
        
        // Set up collision detection with Matter.js events
        this.setupCollisions();
        
        // Track collision info for debugging
        this.collisionCount = 0;
        this.lastCollisionTime = null;
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
        
        console.log(`Roller: Setting up collisions with ${allWallBodies.length} walls`);
        
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
        
        // Add spin on collision - this is what was impossible with Phaser physics!
        const spinForce = (Math.random() - 0.5) * 0.02; // Random spin direction
        this.scene.matter.body.setAngularVelocity(this.body, this.body.angularVelocity + spinForce);
        
        // Track collision info for debugging
        this.lastCollisionTime = this.scene.time.now;
        this.collisionCount = (this.collisionCount || 0) + 1;
        
        // Debug: log collision info
        console.log('Roller collision detected:', {
            playerX: this.body.position.x,
            playerY: this.body.position.y,
            angularVelocity: this.body.angularVelocity,
            collisionCount: this.collisionCount
        });
        
        // Let the physics engine handle the natural bounce
    }
    
    update(cursors) {
        if (!this.body) return;
        
        // Sync sprite position with physics body
        this.sprite.x = this.body.position.x;
        this.sprite.y = this.body.position.y;
        this.sprite.rotation = this.body.angle; // This is the key advantage - easy rotation!
        
        // Handle WASD movement with forces (Matter.js style)
        const force = { x: 0, y: 0 };
        
        // Handle input - apply forces for smooth movement
        if (cursors.A.isDown) {
            force.x -= this.moveSpeed;
        }
        if (cursors.D.isDown) {
            force.x += this.moveSpeed;
        }
        if (cursors.W.isDown) {
            force.y -= this.moveSpeed;
        }
        if (cursors.S.isDown) {
            force.y += this.moveSpeed;
        }
        
        // Apply force to the body
        this.scene.matter.body.applyForce(this.body, this.body.position, force);
        
        // Add rotation control with Q and E keys
        if (this.scene.input.keyboard.checkDown(this.scene.input.keyboard.addKey('Q'), 50)) {
            // Spin counter-clockwise
            this.scene.matter.body.setAngularVelocity(this.body, this.body.angularVelocity - 0.05);
        }
        if (this.scene.input.keyboard.checkDown(this.scene.input.keyboard.addKey('E'), 50)) {
            // Spin clockwise
            this.scene.matter.body.setAngularVelocity(this.body, this.body.angularVelocity + 0.05);
        }
        
        // Limit maximum speed
        const maxSpeed = 10; // Adjusted for Matter.js velocity scale
        const velocity = this.body.velocity;
        const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
        
        if (speed > maxSpeed) {
            const scale = maxSpeed / speed;
            this.scene.matter.body.setVelocity(this.body, {
                x: velocity.x * scale,
                y: velocity.y * scale
            });
        }
        
        // Limit angular velocity too
        const maxAngularVelocity = 0.3;
        if (Math.abs(this.body.angularVelocity) > maxAngularVelocity) {
            this.scene.matter.body.setAngularVelocity(this.body, 
                Math.sign(this.body.angularVelocity) * maxAngularVelocity);
        }
    }
    
    getDebugInfo() {
        if (!this.body) return {};
        
        const velocity = this.body.velocity;
        const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
        const distanceFromCenter = Phaser.Math.Distance.Between(
            this.scene.centerX, 
            this.scene.centerY, 
            this.body.position.x, 
            this.body.position.y
        );
        
        // Calculate time since last collision
        const timeSinceCollision = this.lastCollisionTime ? 
            ((this.scene.time.now - this.lastCollisionTime) / 1000).toFixed(1) : 'N/A';
        
        return {
            type: 'Roller',
            velocity: speed.toFixed(1),
            distanceFromCenter: distanceFromCenter.toFixed(1),
            position: `(${this.body.position.x.toFixed(0)}, ${this.body.position.y.toFixed(0)})`,
            rotation: `${(this.body.angle * (180 / Math.PI)).toFixed(1)}°`, // Show rotation!
            angularVelocity: `${this.body.angularVelocity.toFixed(3)} rad/s`, // Show spin rate!
            collisionCount: this.collisionCount || 0,
            timeSinceCollision: timeSinceCollision
        };
    }
} 