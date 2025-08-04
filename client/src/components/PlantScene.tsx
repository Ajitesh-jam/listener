import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, useTexture } from "@react-three/drei";
import { Suspense, useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { GLTF } from "three-stdlib";

// Preload the custom tree model
useGLTF.preload('/models/tree.glb');

function Tree() {
  const treeRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  
  // Load the custom tree model and texture
  const { scene: customTreeModel } = useGLTF('/models/tree.glb') as GLTF & {
    scene: THREE.Group
  };
  
  const treeTexture = useTexture("/textures/tree-parts.png");
  
  useEffect(() => {
    if (customTreeModel && treeTexture) {
      // Apply textures to the tree model
      customTreeModel.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (child.material) {
            // Create new material with texture
            const material = child.material.clone();
            material.map = treeTexture;
            material.needsUpdate = true;
            child.material = material;
            child.castShadow = true;
            child.receiveShadow = true;
          }
        }
      });
      
      setModelLoaded(true);
      console.log("Custom tree model loaded successfully");
    }
  }, [customTreeModel, treeTexture]);
  
  useFrame((state) => {
    if (treeRef.current) {
      // Gentle swaying animation
      treeRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
      
      // Scale slightly when hovered
      const targetScale = hovered ? 1.1 : 1;
      treeRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  return (
    <group 
      ref={treeRef}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onClick={() => console.log("Tree tapped!")}
      position={[0, -2, 0]}
      scale={[1.5, 1.5, 1.5]}
    >
      {modelLoaded && customTreeModel ? (
        <Suspense fallback={
          <mesh castShadow>
            <boxGeometry args={[1, 2, 1]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
        }>
          <primitive 
            object={customTreeModel.clone()} 
            castShadow 
            receiveShadow 
          />
        </Suspense>
      ) : (
        <mesh castShadow>
          <boxGeometry args={[1, 2, 1]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
      )}
    </group>
  );
}

function Ground() {
  const grassTexture = useTexture("/textures/grass-painted.png");
  
  // Configure texture for seamless tiling
  grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
  grassTexture.repeat.set(4, 4);
  
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
      <circleGeometry args={[3.5]} />
      <meshLambertMaterial 
        map={grassTexture} 
        color="#228B22"
      />
    </mesh>
  );
}

export default function PlantScene() {
  return (
    <div className="w-full h-full">
      <Canvas
        shadows
        camera={{
          position: [0, 0.5, 12],
          fov: 35,
        }}
      >
        {/* Enhanced Ambient Light - Brighter overall illumination */}
        <ambientLight intensity={2.5} color="#ffffff" />
        
        {/* Main Directional Light - Sun-like lighting */}
        <directionalLight 
          position={[8, 12, 8]} 
          intensity={4.5} 
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
          color="#ffffff"
        />
        
        {/* Secondary Directional Light - Fill light */}
        <directionalLight 
          position={[-5, 6, -5]} 
          intensity={2.0} 
          color="#87CEEB"
        />
        
        {/* Top Fill Light */}
        <pointLight 
          position={[0, 8, 0]} 
          intensity={3.0} 
          color="#ffffff"
          distance={15}
        />
        
        {/* Front Fill Light */}
        <pointLight 
          position={[0, 2, 8]} 
          intensity={2.5} 
          color="#ffeeaa"
          distance={12}
        />
        
        {/* Left Side Light */}
        <pointLight 
          position={[-4, 3, 2]} 
          intensity={1.8} 
          color="#87CEEB"
          distance={10}
        />
        
        {/* Right Side Light */}
        <pointLight 
          position={[4, 3, -2]} 
          intensity={1.8} 
          color="#ffd700"
          distance={10}
        />
        
        {/* Bottom Fill Light */}
        <pointLight 
          position={[0, -1, 0]} 
          intensity={1.0} 
          color="#90EE90"
          distance={8}
        />
        
        {/* Spotlight for dramatic effect */}
        <spotLight 
          position={[0, 6, 4]} 
          intensity={2.5} 
          angle={0.8} 
          penumbra={0.3} 
          target-position={[0, -2, 0]}
          color="#ffffff"
          castShadow
        />
        
        {/* Rim Light for depth */}
        <spotLight 
          position={[0, 4, -6]} 
          intensity={1.5} 
          angle={0.4} 
          penumbra={0.5} 
          target-position={[0, 0, 0]}
          color="#87CEEB"
        />
        
        <Suspense fallback={null}>
          <Tree />
          <Ground />
        </Suspense>
        
        <OrbitControls 
          enablePan={false} 
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 4}
          target={[0, 0, 0]}
        />
      </Canvas>
    </div>
  );
}