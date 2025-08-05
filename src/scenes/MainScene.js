import Phaser from 'phaser';
import Orbital from '../entities/Orbital.js';
import Roller from '../entities/Roller.js';
import InnerWall from '../entities/InnerWall.js';

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
        this.walls = new InnerWall(this, this.centerX, this.centerY, this.trackCenterRadius, this.trackWidth);
        
        // Create players
        this.player = new Orbital(this, this.centerX, this.centerY - this.trackCenterRadius);
        this.player2 = new Roller(this, this.centerX + 50, this.centerY - this.trackCenterRadius);
        
        // Add controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasdKeys = {
            W: this.input.keyboard.addKey('W'),
            A: this.input.keyboard.addKey('A'),
            S: this.input.keyboard.addKey('S'),
            D: this.input.keyboard.addKey('D')
        };
        
        // Add some UI text
        this.add.text(16, 16, 'Hadron - Loop Racing', {
            fontSize: '18px',
            fill: '#ffffff'
        });
        
        this.add.text(16, 40, 'Arrow Keys: Orbital | WASD: Roller', {
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
        if (!this.player || !this.player2) return;
        
        // Update players with current controls
        this.player.update(this.cursors);
        this.player2.update(this.wasdKeys);
        
        // Update debug display
        this.updateDebugDisplay();
    }
    
    updateDebugDisplay() {
        if (!this.debugText || !this.player || !this.player2) return;
        
        const orbitalInfo = this.player.getDebugInfo();
        const rollerInfo = this.player2.getDebugInfo();
        
        this.debugText.setText([
            `=== ORBITAL (Green) ===`,
            `Orbit Speed: ${orbitalInfo.orbitSpeed}`,
            `Orbit Radius: ${orbitalInfo.orbitRadius}`,
            `Velocity: ${orbitalInfo.velocity}`,
            `Collisions: ${orbitalInfo.collisionCount}`,
            `Time since collision: ${orbitalInfo.timeSinceCollision}s`,
            `Inside Wall: ${orbitalInfo.isInsideWall}`,
            ``,
            `=== ROLLER (Orange) ===`,
            `Velocity: ${rollerInfo.velocity}`,
            `Position: ${rollerInfo.position}`,
            `Collisions: ${rollerInfo.collisionCount}`,
            `Time since collision: ${rollerInfo.timeSinceCollision}s`,
            ``,
            `Wall Radius: ${orbitalInfo.wallRadius}`
        ]);
    }
} 