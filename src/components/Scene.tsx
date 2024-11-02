'use client'  // Next.js에서 클라이언트 컴포넌트임을 명시

import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useRef } from 'react'
import { Mesh } from 'three'

const Box = () => {
  const meshRef = useRef<Mesh>(null)

  return (
    <mesh ref={meshRef}>
      {/* 박스 모양 정의 (가로, 세로, 깊이) */}
      <boxGeometry args={[1, 1, 1]} />
      {/* 박스 재질 정의 */}
      <meshStandardMaterial color="orange" />
    </mesh>
  )
}

const Scene = () => {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Canvas>
        {/* 기본 조명 */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />

        {/* 3D 박스 */}
        <Box />

        {/* 카메라 컨트롤 - 마우스로 화면을 돌릴 수 있게 해줌 */}
        <OrbitControls />
      </Canvas>
    </div>
  )
}

export default Scene