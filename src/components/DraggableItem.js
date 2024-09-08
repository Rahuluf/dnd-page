import React from "react";
import { useDraggable } from "@dnd-kit/core";

const DraggableItem = ({ id, children }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id,
  });

  return (
    <div ref={setNodeRef} {...listeners} {...attributes} style={{ padding: "10px", border: "1px dashed #ccc", marginBottom: "10px", cursor: "grab" }}>
      {children}
    </div>
  );
};

export default DraggableItem;
