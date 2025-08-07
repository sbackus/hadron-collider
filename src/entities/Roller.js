import Phaser from 'phaser';

export default class Roller {
    constructor(scene, x, y) {
        this.scene = scene;
        
        // Create player particle
        this.sprite = scene.add.circle(x, y, 8, 0xff8800); // Orange color to distinguish from Orbital
        
        // Add physics to player
        scene.physics.add.existing(this.sprite);
        this.sprite.body.setCircle(7);
        
        // Set player properties
        this.sprite.body.setBounce(0.95, 0.95); // More bouncy like a marble
        this.sprite.body.setCollideWorldBounds(false);
        this.sprite.body.setDrag(0.98, 0.98); // Slight drag for marble-like feel
        
        // Movement properties
        this.moveSpeed = 200;
        
        // Add collision with all wall segments
        const innerWalls = scene.innerWalls.getCollisionWalls();
        const outerWalls = scene.outerWalls.getCollisionWalls();
        
        console.log(`Roller: Adding ${innerWalls.length} inner wall collisions`);
        console.log(`Roller: Adding ${outerWalls.length} outer wall collisions`);
        
        innerWalls.forEach((wall, index) => {
            scene.physics.add.collider(this.sprite, wall, this.handleWallCollision, null, this);
            console.log(`Roller: Added inner wall collision ${index}`);
        });
        
        outerWalls.forEach((wall, index) => {
            scene.physics.add.collider(this.sprite, wall, this.handleWallCollision, null, this);
            console.log(`Roller: Added outer wall collision ${index}`);
        });
        
        // Track collision info for debugging
        this.collisionCount = 0;
        this.lastCollisionTime = null;
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
        
        // Debug: log collision info
        console.log('Roller collision detected:', {
            playerX: player.x,
            playerY: player.y,
            wallX: wall.x,
            wallY: wall.y,
            collisionCount: this.collisionCount
        });
        
        // Let the physics engine handle the natural bounce
    }
    
    update(cursors) {
        if (!this.sprite) return;
        
        // Handle WASD movement with momentum
        const player = this.sprite.body;
        
        // Handle input - add to existing velocity instead of resetting
        if (cursors.A.isDown) {
            player.setVelocityX(player.velocity.x - 10);
        } else if (cursors.D.isDown) {
            player.setVelocityX(player.velocity.x + 10);
        }
        
        if (cursors.W.isDown) {
            player.setVelocityY(player.velocity.y - 10);
        } else if (cursors.S.isDown) {
            player.setVelocityY(player.velocity.y + 10);
        }
        
        // Limit maximum speed
        const maxSpeed = this.moveSpeed;
        if (Math.abs(player.velocity.x) > maxSpeed) {
            player.setVelocityX(Math.sign(player.velocity.x) * maxSpeed);
        }
        if (Math.abs(player.velocity.y) > maxSpeed) {
            player.setVelocityY(Math.sign(player.velocity.y) * maxSpeed);
        }
    }
    
    getDebugInfo() {
        if (!this.sprite) return {};
        
        const player = this.sprite.body;
        const velocity = Math.sqrt(player.velocity.x * player.velocity.x + player.velocity.y * player.velocity.y);
        const distanceFromCenter = Phaser.Math.Distance.Between(this.scene.centerX, this.scene.centerY, this.sprite.x, this.sprite.y);
        
        // Calculate time since last collision
        const timeSinceCollision = this.lastCollisionTime ? 
            ((this.scene.time.now - this.lastCollisionTime) / 1000).toFixed(1) : 'N/A';
        
        return {
            type: 'Roller',
            velocity: velocity.toFixed(1),
            distanceFromCenter: distanceFromCenter.toFixed(1),
            position: `(${this.sprite.x.toFixed(0)}, ${this.sprite.y.toFixed(0)})`,
            collisionCount: this.collisionCount || 0,
            timeSinceCollision: timeSinceCollision
        };
    }
} 