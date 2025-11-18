import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  PerspectiveCamera, 
  Environment, 
  Float, 
  Text3D, 
  Center,
  Sparkles,
  Cloud,
  Stars,
  useTexture,
  Reflector,
  useScroll,
  ScrollControls,
  Scroll,
  Image as DreiImage,
  MeshDistortMaterial,
  MeshWobbleMaterial,
  ContactShadows,
  Html,
  Preload,
  useProgress,
  Box,
  Sphere,
  Torus,
  TorusKnot,
  Octahedron,
  useGLTF,
  meshBounds,
  RoundedBox,
  Text
} from '@react-three/drei';
import { Physics, useBox, useSphere, usePlane, useCompoundBody } from '@react-three/cannon';
import * as THREE from 'three';
import { EffectComposer, Bloom, DepthOfField, Noise, Vignette } from '@react-three/postprocessing';
import { useSpring, animated, config } from '@react-spring/three';
import './App.css';

// Loader Component
function Loader() {
  const { progress } = useProgress();
  return (
    <div className="loader">
      <div className="loader-content">
        <h2>Initializing XR Experience</h2>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <p>{Math.round(progress)}%</p>
      </div>
    </div>
  );
}

// Animated 3D Text Component
function AnimatedText({ text, position, color = "#00ff88", size = 0.5 }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  const { scale } = useSpring({
    scale: hovered ? 1.2 : 1,
    config: config.wobbly
  });

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <animated.group scale={scale}>
      <Center position={position}>
        <Text3D
          ref={meshRef}
          font="../fonts/Inter_18pt_Bold.json"
          size={size}
          height={0.2}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
          bevelOffset={0}
          bevelSegments={5}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          {text}
          <meshNormalMaterial />
        </Text3D>
      </Center>
    </animated.group>
  );
}

// Hero Avatar with Physics
function HeroAvatar({ imageUrl }) {
  const [ref, api] = useSphere(() => ({
    mass: 1,
    position: [0, 5, 0],
    args: [1.5]
  }));
  
  const texture = useTexture(imageUrl);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (hovered) {
      api.applyImpulse([0, 5, 0], [0, 0, 0]);
    }
  });

  return (
    <group>
      <mesh 
        ref={ref}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshStandardMaterial 
          map={texture} 
          roughness={0.1} 
          metalness={0.8}
          emissive={hovered ? "#00ff88" : "#000000"}
          emissiveIntensity={hovered ? 0.5 : 0}
        />
      </mesh>
      <Sparkles
        count={100}
        scale={4}
        size={2}
        speed={0.4}
        opacity={0.5}
        color="#00ff88"
      />
    </group>
  );
}

// Floating Tech Icons with Physics
function TechIcon({ position, technology, icon }) {
  const [ref, api] = useBox(() => ({
    mass: 0.5,
    position,
    rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0],
    args: [1, 1, 1]
  }));
  
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (ref.current && !hovered) {
      api.rotation.set(
        state.clock.elapsedTime * 0.5,
        state.clock.elapsedTime * 0.3,
        0
      );
    }
  });

  return (
    <mesh
      ref={ref}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => api.velocity.set(0, 5, 0)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshPhysicalMaterial
        color={hovered ? "#00ff88" : "#4a9eff"}
        metalness={0.8}
        roughness={0.2}
        envMapIntensity={1}
        clearcoat={1}
        clearcoatRoughness={0}
        emissive={hovered ? "#00ff88" : "#000000"}
        emissiveIntensity={hovered ? 0.5 : 0}
      />
      {hovered && (
        <Html center>
          <div className="tech-tooltip">{technology}</div>
        </Html>
      )}
    </mesh>
  );
}

// Interactive Project Card
function ProjectCard({ project, position }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  
  const { scale, rotation } = useSpring({
    scale: clicked ? 1.5 : hovered ? 1.1 : 1,
    rotation: clicked ? Math.PI : 0,
    config: config.wobbly
  });

  useFrame((state) => {
    if (meshRef.current && !clicked) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime + position[0]) * 0.1;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <animated.group scale={scale} rotation-y={rotation}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh
          ref={meshRef}
          position={position}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={() => setClicked(!clicked)}
        >
          <RoundedBox args={[3, 2, 0.5]} radius={0.1} smoothness={4}>
            <MeshDistortMaterial
              color={project.color}
              attachArray="material"
              distort={0.3}
              speed={2}
              roughness={0.2}
              metalness={0.8}
            />
          </RoundedBox>
          <Html
            center
            distanceFactor={10}
            transform
            occlude
            style={{
              transition: 'all 0.3s',
              opacity: clicked ? 1 : 0.9,
              transform: `scale(${clicked ? 1.2 : 1})`
            }}
          >
            <div className={`project-content ${clicked ? 'expanded' : ''}`}>
              <h3>{project.title}</h3>
              {clicked && (
                <>
                  <p>{project.description}</p>
                  <div className="tech-stack">
                    {project.tech.map((t, i) => (
                      <span key={i} className="tech-tag">{t}</span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </Html>
        </mesh>
      </Float>
    </animated.group>
  );
}

// Particle Field Background
function ParticleField() {
  const points = useRef();
  const [sphere] = useState(() => {
    const arr = [];
    for (let i = 0; i < 1000; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      const r = 10 + Math.random() * 10;
      
      arr.push(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );
    }
    return new Float32Array(arr);
  });

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.x = state.clock.elapsedTime * 0.05;
      points.current.rotation.y = state.clock.elapsedTime * 0.075;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={sphere.length / 3}
          array={sphere}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#00ff88"
        sizeAttenuation
        transparent
        opacity={0.8}
      />
    </points>
  );
}

// Navigation Orbs
function NavigationOrb({ position, label, onClick, color = "#00ff88" }) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.5;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <octahedronGeometry args={[0.5, 0]} />
        <meshPhysicalMaterial
          color={color}
          metalness={0.9}
          roughness={0.1}
          emissive={color}
          emissiveIntensity={hovered ? 0.8 : 0.3}
          wireframe={hovered}
        />
      </mesh>
      {hovered && (
        <Html center>
          <div className="nav-label">{label}</div>
        </Html>
      )}
    </group>
  );
}

// Ground Plane with Reflections
function GroundPlane() {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, -2, 0],
    type: 'Static'
  }));

  return (
    <Reflector
      ref={ref}
      blur={[300, 100]}
      resolution={2048}
      args={[50, 50]}
      mirror={0.5}
      mixBlur={1}
      mixStrength={50}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -2, 0]}
    >
      {(Material, props) => (
        <Material
          color="#101010"
          metalness={0.5}
          roughnessMap={null}
          {...props}
        />
      )}
    </Reflector>
  );
}

// Main Scene Component
function Scene() {
  const projects = [
    {
      title: "AR Autism Therapy",
      description: "MSc dissertation project on AR-based therapeutic applications for autism spectrum disorder with mathematical foundations",
      tech: ["Unity", "AR Foundation", "C#", "Machine Learning"],
      color: "#ff006e"
    },
    {
      title: "SaaS Loan Management",
      description: "Comprehensive multi-tenant loan management system with RBAC middleware and GCP deployment",
      tech: ["Python", "Flask", "PostgreSQL", "GCP", "Docker"],
      color: "#8338ec"
    },
    {
      title: "Fintech Direct Debit",
      description: "Payment processing system with multi-provider integration (Mono, Paystack, Flicker)",
      tech: ["Node.js", "React", "MongoDB", "Payment APIs"],
      color: "#3a86ff"
    },
    {
      title: "Lekki Port Data Warehouse",
      description: "Enterprise data warehouse solution for port operations management",
      tech: ["Java", "Spring Boot", "Oracle", "Kubernetes"],
      color: "#fb5607"
    },
    {
      title: "Student iReport System",
      description: "Campus incident reporting mobile app with real-time notifications",
      tech: ["React Native", "Expo", "FastAPI", "PostgreSQL"],
      color: "#ffbe0b"
    },
    {
      title: "Nigerian Logistics Platform",
      description: "Uber for Trucks - National logistics and freight management system",
      tech: ["Node.js", "React", "PostGIS", "Redis"],
      color: "#06ffa5"
    }
  ];

  const technologies = [
    "Python", "Java", "C#", "JavaScript", "TypeScript",
    "React", "Unity", "Unreal Engine", "Three.js", "Node.js"
  ];

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} color="#00ff88" intensity={0.5} />
      <spotLight
        position={[0, 20, 0]}
        angle={0.3}
        penumbra={1}
        intensity={1}
        castShadow
      />
      
      <Physics gravity={[0, -9.81, 0]}>
        <GroundPlane />
        <HeroAvatar imageUrl="/assets/akin.jpg" />
        
        {/* Icons */}
        {technologies.map((tech, i) => (
          <TechIcon
            key={tech}
            position={[
              Math.sin(i * 0.628) * 8,
              3 + Math.random() * 3,
              Math.cos(i * 0.628) * 8
            ]}
            technology={tech}
          />
        ))}
      </Physics>

      <ParticleField />
      
      {/* Project Cards in 3D Space */}
      {projects.map((project, i) => (
        <ProjectCard
          key={i}
          project={project}
          position={[
            (i % 3 - 1) * 4,
            Math.floor(i / 3) * 3 - 2,
            -5 - Math.floor(i / 3) * 2
          ]}
        />
      ))}

      {/* Navigation Orbs */}
      <NavigationOrb position={[-8, 5, 0]} label="Experience" color="#ff006e" />
      <NavigationOrb position={[-8, 3, 0]} label="Projects" color="#8338ec" />
      <NavigationOrb position={[-8, 1, 0]} label="Skills" color="#3a86ff" />
      <NavigationOrb position={[-8, -1, 0]} label="Contact" color="#06ffa5" />

      {/* Animated Title */}
     
      <AnimatedText 
        text="AKINLOLU ADEBOYE" 
        position={[0, 8, -5]} 
        size={0.8}
      />
      <Suspense fallback={null}>
      <Text
        position={[0, 6.5, -5]}
        fontSize={0.3}
        color="#00ff88"
        anchorX="center"
        anchorY="middle"
      >
        XR-Focused Software Engineer | Bridging Tech & Imagination
      </Text>
</Suspense>
      <Environment preset="city" />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      <EffectComposer>
        <Bloom luminanceThreshold={0.3} luminanceSmoothing={0.9} height={300} />
        <DepthOfField focusDistance={0} focalLength={0.02} bokehScale={2} height={480} />
        <Vignette eskil={false} offset={0.1} darkness={0.5} />
      </EffectComposer>
    </>
  );
}

// HTML Overlay UI
function Overlay() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState('hero');

  return (
    <div className="overlay">
      <nav className="navbar">
        <div className="nav-brand">
          <span className="logo">AK</span>
          <span className="tagline">Software Engineer</span>
        </div>
        
        <button 
          className={`menu-toggle ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`nav-menu ${menuOpen ? 'open' : ''}`}>
          <li><a href="#experience" onClick={() => setCurrentSection('experience')}>Experience</a></li>
          <li><a href="#projects" onClick={() => setCurrentSection('projects')}>Projects</a></li>
          <li><a href="#skills" onClick={() => setCurrentSection('skills')}>Skills</a></li>
          <li><a href="#contact" onClick={() => setCurrentSection('contact')}>Contact</a></li>
          <li>
            <a 
              href="https://www.linkedin.com/in/akinlolu-adeboye-56499922b/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="linkedin-btn"
            >
              LinkedIn
            </a>
          </li>
        </ul>
      </nav>

      <div className="hero-text">
        <h1 className="glitch" data-text="AKINLOLU ADEBOYE">AKINLOLU ADEBOYE</h1>
        <p className="subtitle">Senior Software Engineer | MSc Computer Science</p>
        <p className="description">
          6+ years crafting immersive digital experiences through VR/AR, 
          full-stack development, and cloud architecture
        </p>
        <div className="cta-buttons">
          <button className="btn-primary">View Projects</button>
          <button className="btn-secondary">Download CV</button>
        </div>
      </div>

      <div className="scroll-indicator">
        <span>Scroll to explore</span>
        <div className="mouse">
          <div className="wheel"></div>
        </div>
      </div>

      <div className="stats">
        <div className="stat">
          <span className="stat-value">6+</span>
          <span className="stat-label">Years Experience</span>
        </div>
        <div className="stat">
          <span className="stat-value">20+</span>
          <span className="stat-label">Projects Delivered</span>
        </div>
        <div className="stat">
          <span className="stat-value">10+</span>
          <span className="stat-label">Technologies</span>
        </div>
      </div>
    </div>
  );
}

// Main App Component
function App() {
  return (
    <div className="app">
      <Canvas
        shadows
        camera={{ position: [0, 5, 15], fov: 60 }}
        gl={{ 
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          outputEncoding: THREE.sRGBEncoding
        }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
        <OrbitControls 
          enablePan={false}
          minDistance={5}
          maxDistance={30}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2}
        />
        <Preload all />
      </Canvas>
      <Suspense fallback={<Loader />}>
        <Overlay />
      </Suspense>
    </div>
  );
}

export default App;
