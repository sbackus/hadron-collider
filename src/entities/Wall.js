import Phaser from 'phaser';

export default class Wall {
    constructor(scene, centerX, centerY, trackCenterRadius, trackWidth) {
        this.scene = scene;
        this.centerX = centerX;
        this.centerY = centerY;
        this.trackCenterRadius = trackCenterRadius;
        this.trackWidth = trackWidth;
        
        // Track colors
        this.OUTER_WALL_COLOR = 0xff0000; // Red
        this.INNER_WALL_COLOR = 0x0000ff; // Blue
        
        this.createCircularTrack();
    }
    
    createCircularTrack() {
        // Calculate wall positions
        const innerWallRadius = this.trackCenterRadius - (this.trackWidth / 2);
        const outerWallRadius = this.trackCenterRadius + (this.trackWidth / 2);
        
        // Create the track as a ring shape
        this.track = this.scene.add.graphics();
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
            
            const innerSegment = this.scene.add.rectangle(
                (innerStartX + innerEndX) / 2,
                (innerStartY + innerEndY) / 2,
                segmentLength,
                8,
                0x000000
            );
            innerSegment.setVisible(false);
            innerSegment.setRotation(segmentAngle);
            this.scene.physics.add.existing(innerSegment, true);
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
            
            const outerSegment = this.scene.add.rectangle(
                (outerStartX + outerEndX) / 2,
                (outerStartY + outerEndY) / 2,
                outerSegmentLength,
                8,
                0x000000
            );
            outerSegment.setVisible(false);
            outerSegment.setRotation(outerSegmentAngle);
            this.scene.physics.add.existing(outerSegment, true);
            this.collisionWalls.push(outerSegment);
        }
    }
    
    getCollisionWalls() {
        return this.collisionWalls;
    }
} 