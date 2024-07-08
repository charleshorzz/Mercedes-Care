import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import Lights from "./Lights";
import { Suspense, useEffect } from "react";
import RotatingModel from "./RotatingModel"; // Import the rotating model component
import * as THREE from "three";

const ModelView = ({ controlRef, setRotation, selectedVehicle }) => {
  useEffect(() => {
    // This effect ensures that the component re-renders when selectedVehicle changes
  }, [selectedVehicle]);
  return (
    <>
      {/* Ambient Light */}
      <ambientLight intensity={0.3} />

      <PerspectiveCamera makeDefault position={[2.5, 1, 5]} />

      <Lights />

      <OrbitControls
        makeDefault
        ref={controlRef}
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.7}
        target={new THREE.Vector3(0, 1, 0)}
        onEnd={() => setRotation(controlRef.current.getAzimuthalAngle())}
      />

      <group position={[0, 0, 0]} scale={[0.9, 0.9, 0.9]}>
        <Suspense fallback={null}>
          <RotatingModel selectedVehicle={selectedVehicle} />
        </Suspense>
      </group>
    </>
  );
};

export default ModelView;
