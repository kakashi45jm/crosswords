import React, { useMemo } from 'react';
import { GridWord, GridCell } from '../types';

interface CrosswordGridProps {
  gridWords: GridWord[];
  gridRows: number;
  gridCols: number;
  solvedWordIds: string[];
  revealedHints: { row: number; col: number }[];
  onSelectWord?: (word: string) => void;
  onSelectCell?: (row: number, col: number) => void;
  targetHintCell?: { row: number; col: number } | null;
}

export const CrosswordGrid: React.FC<CrosswordGridProps> = ({
  gridWords,
  gridRows,
  gridCols,
  solvedWordIds,
  revealedHints,
  onSelectWord,
  onSelectCell,
  targetHintCell,
}) => {
  // Construct 2D grid matrix
  const { matrix, solvedWordsSet, hintsSet } = useMemo(() => {
    const solvedSet = new Set(solvedWordIds);
    const hSet = new Set(revealedHints.map((h) => `${h.row}_${h.col}`));

    // Initialize 2D matrix with nulls
    const grid: (GridCell | null)[][] = Array.from({ length: gridRows }, () =>
      Array.from({ length: gridCols }, () => null)
    );

    gridWords.forEach((gw) => {
      const isWordSolved = solvedSet.has(gw.id);
      const letters = gw.word.split('');

      letters.forEach((char, idx) => {
        const r = gw.direction === 'vertical' ? gw.row + idx : gw.row;
        const c = gw.direction === 'horizontal' ? gw.col + idx : gw.col;

        if (r >= 0 && r < gridRows && c >= 0 && c < gridCols) {
          if (!grid[r][c]) {
            grid[r][c] = {
              row: r,
              col: c,
              letter: char,
              wordIds: [gw.id],
              isSolved: isWordSolved,
              isHinted: hSet.has(`${r}_${c}`),
            };
          } else {
            // Shared intersection cell
            grid[r][c]!.wordIds.push(gw.id);
            if (isWordSolved) {
              grid[r][c]!.isSolved = true;
            }
          }
        }
      });
    });

    return { matrix: grid, solvedWordsSet: solvedSet, hintsSet: hSet };
  }, [gridWords, gridRows, gridCols, solvedWordIds, revealedHints]);

  // Handle cell click
  const handleCellClick = (cell: GridCell | null) => {
    if (!cell) return;

    // If cell is solved, check if we can show word definition
    if (cell.isSolved || cell.isHinted) {
      const associatedWord = gridWords.find((gw) => cell.wordIds.includes(gw.id) && solvedWordsSet.has(gw.id));
      if (associatedWord && onSelectWord) {
        onSelectWord(associatedWord.word);
        return;
      }
    }

    // Otherwise trigger target cell hint callback
    if (!cell.isSolved && onSelectCell) {
      onSelectCell(cell.row, cell.col);
    }
  };

  // Determine cell sizing based on grid dimensions (max grid size ~8x8)
  const cellSizeClass =
    Math.max(gridRows, gridCols) <= 4
      ? 'w-11 h-11 text-xl sm:w-13 sm:h-13 sm:text-2xl'
      : Math.max(gridRows, gridCols) <= 6
      ? 'w-9 h-9 text-lg sm:w-11 sm:h-11 sm:text-xl'
      : 'w-8 h-8 text-base sm:w-9 sm:h-9 sm:text-lg';

  return (
    <div className="w-full flex-1 flex items-center justify-center p-2 overflow-hidden select-none">
      <div
        className="grid gap-1.5 p-3.5 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-700/60 shadow-2xl max-w-full max-h-full overflow-auto"
        style={{
          gridTemplateRows: `repeat(${gridRows}, minmax(0, 1fr))`,
          gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
        }}
      >
        {matrix.map((rowArr, rIdx) =>
          rowArr.map((cell, cIdx) => {
            if (!cell) {
              return (
                <div
                  key={`empty_${rIdx}_${cIdx}`}
                  className={`${cellSizeClass} rounded-lg bg-transparent border border-transparent`}
                />
              );
            }

            const isCellSolved = cell.isSolved;
            const isCellHinted = cell.isHinted && !cell.isSolved;
            const isTargetSelected = targetHintCell?.row === cell.row && targetHintCell?.col === cell.col;

            return (
              <button
                key={`cell_${rIdx}_${cIdx}`}
                onClick={() => handleCellClick(cell)}
                className={`
                  ${cellSizeClass}
                  rounded-xl font-extrabold flex items-center justify-center transition-all duration-200
                  ${
                    isCellSolved
                      ? 'bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 text-slate-950 shadow-lg border-2 border-amber-200 animate-tile-pop cursor-pointer hover:scale-105'
                      : isCellHinted
                      ? 'bg-amber-500/30 text-amber-300 border-2 border-amber-400/80 shadow-md animate-tile-pop'
                      : isTargetSelected
                      ? 'bg-amber-400/30 border-2 border-amber-400 animate-pulse text-amber-200 ring-2 ring-amber-300'
                      : 'bg-slate-800/90 text-transparent border border-slate-700/70 shadow-inner hover:bg-slate-800'
                  }
                `}
                id={`grid-cell-${rIdx}-${cIdx}`}
                aria-label={`Grid cell ${rIdx}, ${cIdx}`}
              >
                {(isCellSolved || isCellHinted) ? cell.letter : ''}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};
