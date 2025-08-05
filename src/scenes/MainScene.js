import Phaser from 'phaser';
import Orbital from '../entities/Orbital.js';
import Wall from '../entities/Wall.js';

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
        
        // Create walls
        this.walls = new Wall(this, this.centerX, this.centerY, this.trackCenterRadius, this.trackWidth);
        
        // Create player
        this.player = new Orbital(this, this.centerX, this.centerY - this.trackCenterRadius);
        
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





    update() {
        if (!this.player) return;
        
        // Update player with current controls
        this.player.update(this.cursors);
        
        // Update debug display
        this.updateDebugDisplay();
    }
    
    updateDebugDisplay() {
        if (!this.debugText || !this.player) return;
        
        const debugInfo = this.player.getDebugInfo();
        
        this.debugText.setText([
            `Orbit Speed: ${debugInfo.orbitSpeed}`,
            `Orbit Radius: ${debugInfo.orbitRadius}`,
            `Velocity: ${debugInfo.velocity}`,
            `Distance from Center: ${debugInfo.distanceFromCenter}`,
            `Position: ${debugInfo.position}`,
            `Collisions: ${debugInfo.collisionCount}`,
            `Time since collision: ${debugInfo.timeSinceCollision}s`,
            `Wall Radius: ${debugInfo.wallRadius}`,
            `Inside Wall: ${debugInfo.isInsideWall}`
        ]);
    }
} 