import React, { useState, useRef, useEffect, useCallback } from 'react';

interface LetterWheelProps {
  letters: string[]; // e.g. ['C', 'A', 'T', 'S']
  selectedIndices: number[];
  onSelectionChange: (indices: number[]) => void;
  onSubmitWord: () => void;
  onLetterSound?: (index: number) => void;
  shuffleToken?: number;
}

interface Point {
  x: number;
  y: number;
}

export const LetterWheel: React.FC<LetterWheelProps> = ({
  letters,
  selectedIndices,
  onSelectionChange,
  onSubmitWord,
  onLetterSound,
  shuffleToken = 0,
}) => {
  const wheelRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragTouchPoint, setDragTouchPoint] = useState<Point | null>(null);

  // Measure wheel bounds and compute node positions
  const WHEEL_SIZE = 230; // px
  const RADIUS = 80; // px
  const NODE_RADIUS = 26; // px hit radius

  // Calculate coordinates for each letter around the circle
  const getNodePositions = useCallback((): Point[] => {
    const center = WHEEL_SIZE / 2;
    const count = letters.length;
    return letters.map((_, idx) => {
      const angle = (2 * Math.PI * idx) / count - Math.PI / 2; // Start from top 12 o'clock
      return {
        x: center + RADIUS * Math.cos(angle),
        y: center + RADIUS * Math.sin(angle),
      };
    });
  }, [letters]);

  const nodePositions = getNodePositions();

  // Find nearest node index within hit radius
  const getNearestNodeIndex = useCallback(
    (clientX: number, clientY: number): number | null => {
      if (!wheelRef.current) return null;
      const rect = wheelRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      for (let i = 0; i < nodePositions.length; i++) {
        const node = nodePositions[i];
        const dist = Math.hypot(x - node.x, y - node.y);
        if (dist <= NODE_RADIUS + 12) {
          return i;
        }
      }
      return null;
    },
    [nodePositions]
  );

  // Handle start drag / tap
  const handleStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    const hitIdx = getNearestNodeIndex(clientX, clientY);

    if (hitIdx !== null) {
      if (!selectedIndices.includes(hitIdx)) {
        onSelectionChange([hitIdx]);
        if (onLetterSound) onLetterSound(0);
      }
    }

    if (wheelRef.current) {
      const rect = wheelRef.current.getBoundingClientRect();
      setDragTouchPoint({ x: clientX - rect.left, y: clientY - rect.top });
    }
  };

  // Handle drag move
  const handleMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!isDragging || !wheelRef.current) return;

      const rect = wheelRef.current.getBoundingClientRect();
      setDragTouchPoint({ x: clientX - rect.left, y: clientY - rect.top });

      const hitIdx = getNearestNodeIndex(clientX, clientY);

      if (hitIdx !== null) {
        const lastIdx = selectedIndices[selectedIndices.length - 1];
        const secondLastIdx = selectedIndices[selectedIndices.length - 2];

        // Player backtracked to previous node
        if (hitIdx === secondLastIdx) {
          const newSeq = selectedIndices.slice(0, -1);
          onSelectionChange(newSeq);
          if (onLetterSound) onLetterSound(Math.max(0, newSeq.length - 1));
        } else if (!selectedIndices.includes(hitIdx)) {
          // Append new node to sequence
          const newSeq = [...selectedIndices, hitIdx];
          onSelectionChange(newSeq);
          if (onLetterSound) onLetterSound(newSeq.length - 1);
        }
      }
    },
    [isDragging, getNearestNodeIndex, selectedIndices, onSelectionChange, onLetterSound]
  );

  // Handle end drag
  const handleEnd = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      setDragTouchPoint(null);
      if (selectedIndices.length > 0) {
        onSubmitWord();
      }
    }
  }, [isDragging, selectedIndices, onSubmitWord]);

  // Attach window event listeners during drag
  useEffect(() => {
    if (!isDragging) return;

    const onPointerMove = (e: PointerEvent) => handleMove(e.clientX, e.clientY);
    const onPointerUp = () => handleEnd();

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        e.preventDefault();
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const onTouchEnd = () => handleEnd();

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
    window.addEventListener('touchcancel', onTouchEnd);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [isDragging, handleMove, handleEnd]);

  // Tap handler for single letter clicks (accessibility & tap mode)
  const handleNodeTap = (idx: number, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    if (selectedIndices.includes(idx)) {
      // If already selected and tapped again, submit
      onSubmitWord();
    } else {
      const newSeq = [...selectedIndices, idx];
      onSelectionChange(newSeq);
      if (onLetterSound) onLetterSound(newSeq.length - 1);
    }
  };

  return (
    <div className="relative flex items-center justify-center select-none py-2">
      <div
        ref={wheelRef}
        onPointerDown={(e) => handleStart(e.clientX, e.clientY)}
        onTouchStart={(e) => {
          if (e.touches.length > 0) {
            handleStart(e.touches[0].clientX, e.touches[0].clientY);
          }
        }}
        className="relative w-[230px] h-[230px] rounded-full bg-slate-900/90 backdrop-blur-md border-4 border-slate-700/80 shadow-2xl flex items-center justify-center touch-none overflow-visible"
        id="letter-wheel-canvas"
      >
        {/* SVG overlay for connecting line paths */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
          {/* Connected lines between selected letter nodes */}
          {selectedIndices.map((nodeIdx, i) => {
            if (i === 0) return null;
            const prevNode = nodePositions[selectedIndices[i - 1]];
            const currNode = nodePositions[nodeIdx];
            return (
              <line
                key={`line_${i}`}
                x1={prevNode.x}
                y1={prevNode.y}
                x2={currNode.x}
                y2={currNode.y}
                stroke="#f59e0b"
                strokeWidth="7"
                strokeLinecap="round"
              />
            );
          })}

          {/* Line from last selected node to current dragging point */}
          {isDragging && selectedIndices.length > 0 && dragTouchPoint && (
            <line
              x1={nodePositions[selectedIndices[selectedIndices.length - 1]].x}
              y1={nodePositions[selectedIndices[selectedIndices.length - 1]].y}
              x2={dragTouchPoint.x}
              y2={dragTouchPoint.y}
              stroke="#fbbf24"
              strokeWidth="5"
              strokeDasharray="4 4"
              strokeLinecap="round"
            />
          )}
        </svg>

        {/* Circular Letter Nodes */}
        {letters.map((letter, idx) => {
          const pos = nodePositions[idx];
          const isSelected = selectedIndices.includes(idx);
          const selectionOrder = selectedIndices.indexOf(idx) + 1;

          return (
            <button
              key={`node_${idx}_${letter}_${shuffleToken}`}
              onClick={(e) => handleNodeTap(idx, e)}
              style={{
                left: `${pos.x}px`,
                top: `${pos.y}px`,
                transform: 'translate(-50%, -50%)',
              }}
              className={`
                absolute z-20 w-13 h-13 rounded-full font-black text-xl flex items-center justify-center transition-transform duration-200 active:scale-110 shadow-lg cursor-pointer
                ${
                  isSelected
                    ? 'bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 text-slate-950 border-2 border-amber-200 shadow-amber-500/50 shadow-xl scale-110'
                    : 'bg-slate-800 text-slate-100 border-2 border-slate-700/90 hover:border-amber-400'
                }
              `}
              id={`letter-node-${idx}`}
              aria-label={`Letter node ${letter}`}
            >
              <span className="uppercase">{letter}</span>
              {isSelected && (
                <span className="absolute -top-1 -right-1 bg-amber-600 text-slate-950 text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold border border-amber-200">
                  {selectionOrder}
                </span>
              )}
            </button>
          );
        })}

        {/* Center decorative logo ring */}
        <div className="w-16 h-16 rounded-full bg-slate-800/60 border border-slate-700/60 flex items-center justify-center pointer-events-none">
          <div className="w-6 h-6 rounded-full border-2 border-dashed border-amber-400/60 animate-spin" style={{ animationDuration: '12s' }} />
        </div>
      </div>
    </div>
  );
};
