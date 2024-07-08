import ModelView from "./ModelView";
import { useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";

const Model = ({ selectedVehicle }) => {
  const cameraControl = useRef();
  const [rotation, setRotation] = useState(0);

  return (
    <div className="w-full h-full md:h-[90vh] overflow-hidden relative">
      <Canvas
        className="w-full h-full"
        style={{
          position: "fixed",
          top: 0,
          bottom: 0,
          left: 400,
          right: 0,
          overflow: "hidden",
        }}
        eventSource={document.getElementById("root")}
      >
        <ModelView controlRef={cameraControl} setRotation={setRotation} selectedVehicle={selectedVehicle}/>
      </Canvas>
    </div>
  );
};

export default Model;
