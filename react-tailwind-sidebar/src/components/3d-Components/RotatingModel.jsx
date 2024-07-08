import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import CLA45 from "./CLA45"; // Import your car model here
import SL63 from "./SL63"; // Import your car models here

const RotatingModel = ({ selectedVehicle }) => {
  const groupRef = useRef();

  useEffect(() => {
    // This effect ensures that the component re-renders when selectedVehicle changes
  }, [selectedVehicle]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2; // Adjust the speed as needed
    }
  });

  let ModelComponent;
  switch (selectedVehicle?.name) {
    case "AMG SL63":
      ModelComponent = SL63;
      break;
    case "CLA 45 S Coupe":
      ModelComponent = CLA45;
      break;
    default:
      ModelComponent = null;
  }

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {ModelComponent && <ModelComponent />}
    </group>
  );
};

export default RotatingModel;
