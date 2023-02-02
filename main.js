import React, { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { saveAs } from 'file-saver';

const Module = ({ id, text, function, moveModule }) => {
  const [{ isDragging }, drag] = useDrag({
    item: { type: 'MODULE', id, text, function },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'MODULE',
    drop: item => {
      if (id === 1) {
        item.function();
      }
      moveModule(item.id, id);
    },
  });

  return (
    <div ref={node => drag(drop(node))}>
      {text}
    </div>
  );
};

const DragAndDropModule = () => {
  const [modules, setModules] = useState([
    { id: 1, text: 'Module 1', function: () => {
      const file = new Blob(['Module 1 function called'], { type: 'text/plain;charset=utf-8' });
      saveAs(file, 'module1.txt');
    } },
    { id: 2, text: 'Module 2', function: () => {
      const file = new Blob(['Module 2 function called'], { type: 'text/plain;charset=utf-8' });
      saveAs(file, 'module2.txt');
    } },
    { id: 3, text: 'Module 3', function: () => {
      const file = new Blob(['Module 3 function called'], { type: 'text/plain;charset=utf-8' });
      saveAs(file, 'module3.txt');
    } },
  ]);

  const moveModule = (id, targetId) => {
    const module = modules.find(m => m.id === id);
    const targetIndex = modules.findIndex(m => m.id === targetId);
    const newModules = [...modules];
    newModules.splice(newModules.indexOf(module), 1);
    newModules.splice(targetIndex, 0, module);
    setModules(newModules);
  };

  return (
    <div>
      {modules.map(m => (
        <Module key={m.id} id={m.id} text={m.text} function={m.function} moveModule={moveModule} />
      ))}
      <button onClick={() => {
        const file = new Blob(['Module function called'], { type: 'text/plain;charset=utf-8' });
        saveAs(file, 'module.txt');
      }}>Download File</button>
    </div>
  );
};

export default DragAndDropModule;
