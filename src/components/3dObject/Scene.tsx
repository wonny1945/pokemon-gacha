'use client'
import { Suspense }  from 'react'
import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'



const Pokeball = () => {
  const pokeballRef = useRef<THREE.Group>(null)
  const { viewport } = useThree()
  
  const scale = Math.min(viewport.width, viewport.height) * 0.18

  useFrame((state, delta) => {
    if (pokeballRef.current) {
      pokeballRef.current.rotation.y += delta * 0.3
    }
  })

  const materials = {
    white: new THREE.MeshPhysicalMaterial({
      color: 'white',
      metalness: 0.2,
      roughness: 0.3,
      clearcoat: 0.8,
      clearcoatRoughness: 0.2,
    }),
    red: new THREE.MeshPhysicalMaterial({
      color: 'red',
      metalness: 0.2,
      roughness: 0.3,
      clearcoat: 0.8,
      clearcoatRoughness: 0.2,
    }),
    black: new THREE.MeshPhysicalMaterial({
      color: 'black',
      metalness: 0.6,
      roughness: 0.4,
      clearcoat: 0.5,
      clearcoatRoughness: 0.4,
    })
  }

  const geometries = useMemo(() => ({
    bottomHalf: new THREE.SphereGeometry(1, 32, 32, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2),
    topHalf: new THREE.SphereGeometry(1, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2),
    divider: new THREE.CylinderGeometry(1.01, 1.01, 0.1, 32),
    button: new THREE.CylinderGeometry(0.2, 0.22, 0.12),
  }), [])

  return (
      <group 
        ref={pokeballRef} 
        scale={scale}
        position={[0, 0.8, 0]}
      >
        <mesh castShadow receiveShadow geometry={geometries.bottomHalf}>
          <primitive object={materials.white} attach="material"/>
        </mesh>

        <mesh castShadow receiveShadow geometry={geometries.topHalf}>
          <primitive object={materials.red} attach="material"/>
        </mesh>

        <mesh position={[0, 0, 0]} castShadow receiveShadow geometry={geometries.divider}>
          <primitive object={materials.black} attach="material"/>
        </mesh>

        <mesh position={[0, 0, 1.0]}
              rotation={[Math.PI / 2, 0, 0]}
              castShadow receiveShadow geometry={geometries.button}>
          <primitive object={materials.white} attach="material"/>
        </mesh>

        <mesh position={[0, 0, 1]} rotation={[Math.PI/2, 0, 0]} castShadow receiveShadow>
          <latheGeometry
              args={[
                [
                  new THREE.Vector2(0.15, -0.02),
                  new THREE.Vector2(0.3, -0.02),
                  new THREE.Vector2(0.3, 0.02),
                  new THREE.Vector2(0.15, 0.02),
                ],
                32
              ]}
          />
          <primitive object={materials.black} attach="material"/>
        </mesh>
      </group>
  )
}

const Scene = () => {
  return (
    <div className="w-full h-1/2 -mb-20 md:-mb-36" >
      <Canvas shadows gl={{ antialias: true }}>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <ambientLight intensity={0.3} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={0.8}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <spotLight
          position={[10, 10, 10]}
          angle={0.2}
          penumbra={0.5}
          intensity={1.5}
          castShadow
        />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <pointLight position={[0, 5, 0]} intensity={0.7} color="blue" />
        <pointLight position={[0, -5, 0]} intensity={0.7} color="red" />
        <Suspense fallback={null}>
          <Pokeball />
          <OrbitControls enablePan={false} enableZoom={false} minDistance={3} maxDistance={8} />
        </Suspense>
      </Canvas>
    </div>
  )
}
export default Scene