# Akinlolu Adeboye - 3D XR Portfolio

## 🚀 Overview

An exceptional 3D portfolio showcasing senior-level expertise in XR technologies, featuring advanced physics simulations, particle systems, and immersive interactive experiences built with React Three Fiber and Cannon.js.

## ✨ Features

### Advanced 3D Graphics
- **Physics Simulations**: Real-time physics using Cannon.js
- **Particle Systems**: Dynamic particle fields with WebGL shaders
- **Post-Processing Effects**: Bloom, depth of field, and vignette effects
- **Interactive Elements**: Clickable 3D objects with physics responses
- **Animated Text**: 3D text with hover effects and animations

### Technical Highlights
- **Performance Optimized**: Code splitting and lazy loading
- **Responsive Design**: Fully adaptive across all devices
- **Accessibility**: WCAG compliant with keyboard navigation
- **SEO Optimized**: Meta tags and structured data
- **Progressive Enhancement**: Works without JavaScript

### Interactive Sections
- **Hero Section**: 3D avatar with physics simulation
- **Project Cards**: Expandable 3D cards with detailed information
- **Tech Stack**: Floating interactive technology icons
- **Navigation Orbs**: 3D navigation elements

## 🛠️ Tech Stack

- **React 18** - UI Framework
- **Three.js** - 3D Graphics Engine
- **React Three Fiber** - React renderer for Three.js
- **Drei** - Useful helpers for React Three Fiber
- **Cannon.js** - Physics engine
- **React Spring** - Animation library
- **Vite** - Build tool
- **Vercel** - Deployment platform

## 📦 Installation

```bash

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🚀 Deployment

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
npm run deploy
```

### Manual Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎮 Controls

- **Mouse**: Orbit camera control
- **Scroll**: Navigate through sections
- **Click**: Interact with 3D objects
- **Hover**: Reveal additional information

## 🏗️ Project Structure

```
portfolio-3d/
├── src/
│   ├── components/
│   │   ├── Hero.jsx
│   │   ├── Projects.jsx
│   │   ├── Skills.jsx
│   │   └── Contact.jsx
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── public/
│   ├── models/
│   ├── textures/
│   └── fonts/
├── index.html
├── package.json
├── vite.config.js
└── vercel.json
```

## 🎨 Customization

### Colors
Edit the CSS variables in `src/index.css`:

```css
:root {
  --primary-color: #00ff88;
  --secondary-color: #00a8ff;
  --bg-primary: #0a0a0a;
  --bg-secondary: #1a1a2e;
}
```

### Projects
Update the projects array in `App.jsx`:

```javascript
const projects = [
  {
    title: "Portfolio",
    description: "Description",
    tech: ["Tech1", "Tech2"],
    color: "#hexcolor"
  }
];
```

## 🔧 Performance Optimization

- **Texture Compression**: Use basis/ktx2 formats
- **Model Optimization**: Draco compression for GLTF models
- **LOD (Level of Detail)**: Multiple model resolutions
- **Instancing**: For repeated geometries
- **Frustum Culling**: Automatic with Three.js
- **Code Splitting**: Dynamic imports for heavy components

## 📱 Responsive Breakpoints

- **Desktop**: 1920px and above
- **Laptop**: 1024px - 1919px
- **Tablet**: 768px - 1023px
- **Mobile**: 320px - 767px

## 🌟 Key Features Explained

### Physics System
The portfolio uses Cannon.js for realistic physics simulations:
- Gravity simulation
- Collision detection
- Force application
- Constraints and joints

### Particle Systems
Custom WebGL shaders create dynamic particle effects:
- GPU-accelerated particles
- Interactive particle fields
- Performance-optimized rendering

### Post-Processing Pipeline
Advanced visual effects using:
- Bloom for glowing elements
- Depth of field for focus effects
- Vignette for atmospheric depth

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👤 Contact

**Akinlolu Adeboye**
- LinkedIn: [https://www.linkedin.com/in/akinlolu-adeboye-56499922b/](https://www.linkedin.com/in/akinlolu-adeboye-56499922b/)
- Email: akinlolu.adeboye@email.com

## 🙏 Acknowledgments

- Three.js community for amazing documentation
- React Three Fiber team for the excellent React renderer
- Vercel for hosting and deployment

---

Built with ❤️ by Akinlolu Adeboye - Bridging Tech & Imagination through XR
