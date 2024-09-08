import React, { useState } from "react";
import { DndContext } from "@dnd-kit/core";
import DraggableItem from "./components/DraggableItem";
import DroppableArea from "./components/DroppableArea";
import { doc, setDoc, getDoc } from "firebase/firestore"; // Firestore functions
import { db } from "./firebase"; // Firebase configuration

function App() {
  const [layout, setLayout] = useState([]);
  const [layoutName, setLayoutName] = useState("");

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over) {
      setLayout([...layout, active.id]);
    }
  };

  // Save layout to Firestore
  const saveLayout = async () => {
    if (!layoutName) {
      alert("Please enter a layout name");
      return;
    }

    try {
      const layoutRef = doc(db, "layouts", layoutName);
      await setDoc(layoutRef, {
        name: layoutName,
        layoutData: layout,
      });
      alert("Layout saved successfully!");
    } catch (error) {
      console.error("Error saving layout: ", error);
      alert("Failed to save layout.");
    }
  };

  // Load layout from Firestore
  const loadLayout = async () => {
    if (!layoutName) {
      alert("Please enter a layout name");
      return;
    }

    try {
      const layoutRef = doc(db, "layouts", layoutName);
      const layoutSnap = await getDoc(layoutRef);

      if (layoutSnap.exists()) {
        const savedLayout = layoutSnap.data().layoutData;
        setLayout(savedLayout); // Set layout from Firestore data
        alert("Layout loaded successfully!");
      } else {
        alert("Layout not found.");
      }
    } catch (error) {
      console.error("Error loading layout: ", error);
      alert("Failed to load layout.");
    }
  };

  // Publish layout to new tab (Simple Render)
  const publishLayout = () => {
    const publishWindow = window.open();
    if (publishWindow) {
      publishWindow.document.write("<html><head><title>Published Layout</title></head><body>");
      publishWindow.document.write("<h1>Dynamic Page</h1>");
      layout.forEach((item) => {
        if (item === "label") publishWindow.document.write("<div>Enter Your Name</div>");
        if (item === "input-box") publishWindow.document.write('<input type="text" placeholder="Enter your name" />');
        if (item === "check-box") publishWindow.document.write('<div><input type="checkbox" /> Is Working?</div>');
        if (item === "button") publishWindow.document.write('<button>Save</button>');
        if (item === "table") publishWindow.document.write("<div>A Sample Dynamic Page</div>");
      });
      publishWindow.document.write("</body></html>");
      publishWindow.document.close();
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div style={{ display: "flex", height: "100vh" }}>
        {/* Sidebar for Draggable Items */}
        <div style={{ width: "20%", borderRight: "1px solid #000", padding: "10px" }}>
          <h3>Controls to Drag n Drop</h3>
          <DraggableItem id="label">Label</DraggableItem>
          <DraggableItem id="input-box">Input Box</DraggableItem>
          <DraggableItem id="check-box">Check Box</DraggableItem>
          <DraggableItem id="button">Button</DraggableItem>
          <DraggableItem id="table">Table</DraggableItem>
        </div>

        {/* Main Content Area */}
        <div style={{ width: "80%", padding: "10px" }}>
          {/* Top Section with Layout Controls */}
          <div style={{ display: "flex", marginBottom: "20px" }}>
            <input
              type="text"
              placeholder="Enter Layout Name"
              value={layoutName}
              onChange={(e) => setLayoutName(e.target.value)}
              style={{ marginRight: "10px", flex: 1 }}
            />
            <button onClick={saveLayout} style={{ marginRight: "10px" }}>
              Save Layout
            </button>
            <button onClick={loadLayout} style={{ marginRight: "10px" }}>
              Load Layout
            </button>
            <button onClick={publishLayout}>Publish</button>
          </div>

          {/* Droppable Area */}
          <DroppableArea id="page-layout">
            {layout.map((item, index) => (
              <div key={index}>
                {item === "label" && <div>Enter Your Name</div>}
                {item === "input-box" && <input type="text" placeholder="Enter your name" />}
                {item === "check-box" && <div><input type="checkbox" /> Is Working?</div>}
                {item === "button" && <button>Save</button>}
                {item === "table" && <div>A Sample Dynamic Page</div>}
              </div>
            ))}
          </DroppableArea>
        </div>
      </div>
    </DndContext>
  );
}

export default App;
