import React from "react";
import { useDroppable } from "@dnd-kit/core";

const DroppableArea = ({ id, children }) => {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <div ref={setNodeRef} style={{ padding: "20px", border: "2px solid #000", minHeight: "400px" }}>
      {children}
    </div>
  );
};

export default DroppableArea;
