import Phaser from 'phaser';

export default class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    create() {
        // Center of the game world
        this.centerX = this.cameras.main.width / 2;
        this.centerY = this.cameras.main.height / 2;
        
        // Create a simple text to show the scene is working
        this.add.text(this.centerX, this.centerY, 'Hadron Collider - Loop Racing', {
            fontSize: '24px',
            fill: '#ffffff'
        }).setOrigin(0.5);
        
        this.add.text(this.centerX, this.centerY + 40, 'Game is running!', {
            fontSize: '16px',
            fill: '#cccccc'
        }).setOrigin(0.5);
    }

    update() {
        // Game loop updates will go here
    }
} 