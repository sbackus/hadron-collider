# Hadron Collider Project Planning




## Project Overview
- **Name**: Hadron Collider
- **Type**: Phaser.js game/simulation
- **Goal**: Create a simple 2D game with collision physics.  The theme is "Loop".  I want to start with a circular track.  It has an inner wall and an outer wall.  The player controlls a round particle that races around the track.   

## Current State
- ✅ Project initialized with Phaser.js dependencies
- ✅ Basic directory structure created (src/assets, src/entities, src/scenes)
- ❌ No actual code implemented yet

## Next Steps

### Phase 1: Foundation
1. **Set up webpack configuration**
   - Create webpack.config.js
   - Configure entry point and output
   - Set up dev server

2. **Create main HTML entry point**
   - Create index.html in public/
   - Set up canvas container
   - Add basic styling

3. **Implement basic Phaser game structure**
   - Create main game file (src/game.js)
   - Set up game config
   - Create main scene (src/scenes/MainScene.js)

### Phase 2: Game Objects
4. **Create wall game objects**
   - Wall class (src/entities/Wall.js)
   - Inner and outer wall instances
   - Wall physics and collision bodies

5. **Create player particle**
   - Player particle class (src/entities/PlayerParticle.js)
   - Circular sprite with physics
   - Basic movement controls

6. **Design game UI and controls**
   - Add control instructions
   - Display speed/position info
   - Add restart/reset functionality

### Phase 3: Gameplay
7. **Add collision detection mechanics**
   - Wall collision handling
   - Particle physics simulation
   - Track boundary detection

8. **Create particle system for hadrons**
   - Background particle effects
   - Collision particle trails
   - Visual feedback for collisions

## Technical Stack
- Phaser.js 3.90.0 (game framework)
- Webpack 5.101.0 (bundling)
- Webpack Dev Server (development)

## Project Structure
```
hadron-collider/
├── public/          # Static assets
├── src/
│   ├── assets/      # Game assets (images, sounds)
│   ├── entities/    # Game objects (particles, hadrons)
│   └── scenes/      # Game scenes/levels
├── package.json
└── claude.md        # This planning file
```

## Notes
- Focus on particle physics simulation
- Consider educational aspects of hadron collider physics
- Plan for interactive controls and visualization

## Code review 
- Use the PR prompt that Martha sent to ask Gemini for review 

## Deployment
- Vercel CLI installed and ready for deployment
- vercel login - to authenticate with your Vercel account
- vercel --help - to see all available commands
- Use `vercel` command to deploy when game is complete 