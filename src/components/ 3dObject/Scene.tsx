'use client'

import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei'
import * as THREE from 'three'

const Pokeball = () => {
  const pokeballRef = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    if (pokeballRef.current) {
      pokeballRef.current.rotation.y += delta * 0.3
    }
  })

  const whiteMaterial = new THREE.MeshPhysicalMaterial({
    color: 'white',
    metalness: 0.2,
    roughness: 0.3,
    clearcoat: 0.8,
    clearcoatRoughness: 0.2,
  })

  const redMaterial = new THREE.MeshPhysicalMaterial({
    color: 'red',
    metalness: 0.2,
    roughness: 0.3,
    clearcoat: 0.8,
    clearcoatRoughness: 0.2,
  })

  const blackMaterial = new THREE.MeshPhysicalMaterial({
    color: 'black',
    metalness: 0.6,
    roughness: 0.4,
    clearcoat: 0.5,
    clearcoatRoughness: 0.4,
  })

  return (
      <group ref={pokeballRef}>
        {/* White bottom half */}
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[1, 64, 64, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]}/>
          <primitive object={whiteMaterial} attach="material"/>
        </mesh>

        {/* Red top half */}
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[1, 64, 64, 0, Math.PI * 2, 0, Math.PI / 2]}/>
          <primitive object={redMaterial} attach="material"/>
        </mesh>

        {/* Black dividing line */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.01, 1.01, 0.1, 64]}/>
          <primitive object={blackMaterial} attach="material"/>
        </mesh>

        {/* White center button */}
        <mesh position={[0, 0, 1.0]}
              rotation={[Math.PI / 2, 0, 0]}
              castShadow receiveShadow>
          <cylinderGeometry args={[0.2, 0.22, 0.12]}/>
          <primitive object={whiteMaterial} attach="material"/>
        </mesh>

        {/* Black center button outline */}
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
          <primitive object={blackMaterial} attach="material"/>
        </mesh>
      </group>
  )
}

const Scene = () => {
  return (
      <div className="w-full h-1/2 ">
        <Canvas shadows>
          <PerspectiveCamera makeDefault position={[0, 0, 5]}/>

          {/* 향상된 조명 설정 */}
          <ambientLight intensity={0.5}/>
          <spotLight
              position={[10, 10, 10]}
              angle={0.3}
              penumbra={1}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />

        {/* 3D 포켓볼 */}
        <Pokeball />
        {/* 환경 맵 추가 */}
        <Environment preset="sunset" />
        {/* 카메라 컨트롤 */}
        <OrbitControls enablePan={false} enableZoom={false} minDistance={3} maxDistance={8} />
      </Canvas>
    </div>
  )
}

export default Scene