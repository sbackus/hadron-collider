import Phaser from 'phaser';
import MainScene from './scenes/MainScene.js';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    backgroundColor: '#000000',
    physics: {
        default: 'matter',
        matter: {
            gravity: { x: 0, y: 0 },
            debug: false,
            enableSleeping: false
        }
    },
    scene: [MainScene]
};

const game = new Phaser.Game(config); 