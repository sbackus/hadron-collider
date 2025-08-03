# Hadron Collider Project Planning




## Project Overview
- **Name**: Hadron Collider
- **Type**: Phaser.js game/simulation
- **Goal**: Create a simple 2D game with collision physics.  The theme is "Loop".  I want to start with a circular track.  It has an inner wall and an outer wall.  The player controlls a round particle that races around the track.   

## Current State
- ✅ Project initialized with Phaser.js dependencies
- ✅ Basic directory structure created (src/assets, src/entities, src/scenes)
- ✅ Webpack configuration and development server set up
- ✅ Main HTML entry point created
- ✅ Basic Phaser game structure implemented
- ✅ Ring-shaped track with inner and outer walls
- ✅ Player particle with momentum-based physics
- ✅ Collision detection and wall bouncing
- ✅ Git repository with MIT license

## Next Steps

### Phase 1: Foundation ✅ COMPLETED
1. **Set up webpack configuration** ✅
   - Create webpack.config.js ✅
   - Configure entry point and output ✅
   - Set up dev server ✅

2. **Create main HTML entry point** ✅
   - Create index.html in public/ ✅
   - Set up canvas container ✅
   - Add basic styling ✅

3. **Implement basic Phaser game structure** ✅
   - Create main game file (src/game.js) ✅
   - Set up game config ✅
   - Create main scene (src/scenes/MainScene.js) ✅

4. **Create ring-shaped track system** ✅
   - Ring-shaped track with red outer border and blue inner border ✅
   - Invisible collision walls using rectangle segments ✅
   - Proper collision detection and bouncing ✅

5. **Implement player particle physics** ✅
   - Momentum-based movement with additive velocity ✅
   - Natural wall deflection and bouncing ✅
   - Speed limits and drag for realistic physics ✅

### Phase 2: Game Objects (IN PROGRESS)
4. **Create wall game objects** ✅ (Implemented as ring system)
   - Ring-shaped track with visual borders ✅
   - Invisible collision walls using rectangle segments ✅
   - Wall physics and collision bodies ✅

5. **Create player particle** ✅ (Implemented in MainScene)
   - Player particle with momentum-based physics ✅
   - Circular sprite with physics ✅
   - Advanced movement controls with momentum ✅

6. **Design game UI and controls** (PARTIALLY COMPLETE)
   - Add control instructions ✅
   - Display speed/position info (TODO)
   - Add restart/reset functionality (TODO)

### Phase 3: Gameplay (READY TO START)
7. **Add collision detection mechanics** ✅ (COMPLETED)
   - Wall collision handling ✅
   - Particle physics simulation ✅
   - Track boundary detection ✅

8. **Create particle system for hadrons** (NEXT PRIORITY)
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

## Recent Achievements
- ✅ Created ring-shaped track with proper collision detection
- ✅ Implemented momentum-based particle physics
- ✅ Fixed flickering issues and wall trapping problems
- ✅ Added natural wall deflection and bouncing
- ✅ Set up git repository with MIT license

## Notes
- Focus on particle physics simulation
- Consider educational aspects of hadron collider physics
- Plan for interactive controls and visualization
- Current physics system provides realistic momentum and collision behavior

## Code review 
- Use the PR prompt that Martha sent to ask Gemini for review 

## Deployment
- Vercel CLI installed and ready for deployment
- vercel login - to authenticate with your Vercel account
- vercel --help - to see all available commands
- Use `vercel` command to deploy when game is complete 