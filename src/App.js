import { useState } from 'react';

function Square({ value, highlight, onSquareClick }) {
  return <button
          className= {highlight ? "square highlight" : "square" }
          onClick={onSquareClick}>
            {value}
        </button>;
}

function Board({xIsNext, squares, onPlay}) {
  function handleClick(i) {
    if(squares[i] || calculateWin(squares) !== null) return;

    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";

    onPlay(nextSquares);
  }

  const winningLine = calculateWin(squares);
  let status;
  if(winningLine) {
    status = "Winner: " + squares[winningLine[0]];
  } else {
    status = "Next to play: " + (xIsNext ? "X" : "O");
  }

  //{[0,1,2].map((column) => ((row * 3) * column)).map((cell) => (
  //  <Square value={squares[cell]} highlight={winningLine && winningLine.indexOf(cell) > -1} onSquareClick={() => handleClick(cell)} />

  return (
    <>
      <div className="status">{status}</div>
      {[0,1,2].map((row) => (
        <div key={row} className="board-row">
          {[0,1,2].map((column) => (
            <Square value={squares[(row*3) + column]} highlight={winningLine && winningLine.indexOf((row*3) + column) > -1} onSquareClick={() => handleClick((row*3) + column)} />
          ))}
        </div>
      ))}
    </>
  );
}

function calculateWin(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for(let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];

    if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i]; //squares[a];
    }
  }

  return null;
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    const description = () => {
      if(move === currentMove) {
        return "You are at " + (move === 0 ? "game start" : "move #" + move);
      }
      return (move > 0 ? 'Go to move #' + move : 'Go to game start');
    };

    if(move === currentMove) {
      return (
        <li key={move}>{description()}</li>
      );
    } else {
      return (
        <li key={move}>
          <button onClick={() => jumpTo(move)}>{description()}</button>
        </li>
      );
    }

  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}