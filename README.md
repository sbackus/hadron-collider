# Hadron

A game for GMT game jam.  Theme: "Loop"

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone git@github.com:sbackus/hadron-collider.git
cd hadron-collider

# Install dependencies
npm install

# Start development server
npm start
```

The game will open automatically in your default browser at `http://localhost:8080`.

### Build for Production
```bash
npm run build
```

## 🛠️ Development

### Project Structure
```
hadron-collider/
├── public/          # Static assets and HTML entry point
├── src/
│   ├── assets/      # Game assets (images, sounds)
│   ├── entities/    # Game objects (particles, walls)
│   └── scenes/      # Game scenes and levels
├── package.json
└── README.md
```

### Tech Stack
- **Phaser.js 3.90.0** - Game framework
- **Webpack 5.101.0** - Module bundling
- **Webpack Dev Server** - Development server

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

*Built with ❤️ using Phaser.js* 