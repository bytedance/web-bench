import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from '../router';
import { toast } from '../utils/toast';

type Player = 'black' | 'white';
type BoardState = (Player | null)[][];
type GameRecord = { player: Player; position: [number, number] }[];

const Game: React.FC = () => {
  const { navigate } = useRouter();
  const [currentPlayer, setCurrentPlayer] = useState<Player>('black');
  const [board, setBoard] = useState<BoardState>(
    Array(15).fill(null).map(() => Array(15).fill(null))
  );
  const [winner, setWinner] = useState<Player | null>(null);
  const [gameRecords, setGameRecords] = useState<GameRecord>([]);

  // Check for a win condition
  const checkWin = useCallback((board: BoardState, row: number, col: number, player: Player): boolean => {
    const directions = [
      [1, 0],   // horizontal
      [0, 1],   // vertical
      [1, 1],   // diagonal down-right
      [1, -1],  // diagonal down-left
    ];

    for (const [dx, dy] of directions) {
      let count = 1; // Count the current piece

      // Check in positive direction
      for (let i = 1; i < 5; i++) {
        const newRow = row + i * dx;
        const newCol = col + i * dy;
        if (
          newRow < 0 || newRow >= 15 || 
          newCol < 0 || newCol >= 15 || 
          board[newRow][newCol] !== player
        ) {
          break;
        }
        count++;
      }

      // Check in negative direction
      for (let i = 1; i < 5; i++) {
        const newRow = row - i * dx;
        const newCol = col - i * dy;
        if (
          newRow < 0 || newRow >= 15 || 
          newCol < 0 || newCol >= 15 || 
          board[newRow][newCol] !== player
        ) {
          break;
        }
        count++;
      }

      if (count >= 5) {
        return true;
      }
    }

    return false;
  }, []);

  const handleCellClick = (row: number, col: number) => {
    if (board[row][col] !== null || winner) return;

    const newBoard = [...board.map(row => [...row])];
    newBoard[row][col] = currentPlayer;
    setBoard(newBoard);

    // Add to game records
    setGameRecords(prev => [...prev, { player: currentPlayer, position: [row, col] }]);

    // Check for win
    if (checkWin(newBoard, row, col, currentPlayer)) {
      setWinner(currentPlayer);
      toast(`${currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)} Wins!`, 3000);
      setTimeout(() => {
        toast('Congratulations!', 3000);
      }, 1000);
      return;
    }

    // Switch player
    setCurrentPlayer(currentPlayer === 'black' ? 'white' : 'black');
  };

  const handlePostGameRecords = () => {
    if (!winner) return;

    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().split(' ')[0];
    const title = `Game-${dateStr}-${timeStr}`;

    // Format game records
    let detail = `# ${winner.charAt(0).toUpperCase() + winner.slice(1)} is Winner!\n\`\`\`game\n`;
    gameRecords.forEach(record => {
      detail += `${record.player.charAt(0).toUpperCase() + record.player.slice(1)}(${record.position[0]},${record.position[1]});\n`;
    });
    detail += '\`\`\`';

    // Store the blog data in sessionStorage to retrieve it in the blog page
    sessionStorage.setItem('gameRecordBlog', JSON.stringify({ title, detail }));
    
    // Navigate back to blog page
    navigate('/');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Hello Game</h1>
      
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {!winner ? (
          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
            {currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)}'s Turn
          </div>
        ) : (
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#e74c3c' }}>
            {winner.charAt(0).toUpperCase() + winner.slice(1)} Wins!
          </div>
        )}
        
        <div>
          <button 
            onClick={() => navigate('/')}
            style={{
              backgroundColor: '#4a90e2',
              color: 'white',
              border: 'none',
              padding: '8px 15px',
              borderRadius: '4px',
              marginRight: '10px',
              cursor: 'pointer'
            }}
          >
            Back to Blog
          </button>
          
          {winner && (
            <button 
              onClick={handlePostGameRecords}
              style={{
                backgroundColor: '#2ecc71',
                color: 'white',
                border: 'none',
                padding: '8px 15px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Post Game Records
            </button>
          )}
        </div>
      </div>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(15, 30px)',
        gridTemplateRows: 'repeat(15, 30px)',
        gap: '1px',
        backgroundColor: '#d9b38c',
        padding: '10px',
        borderRadius: '4px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
      }}>
        {board.map((row, rowIndex) => (
          row.map((cell, colIndex) => (
            <div 
              key={`${rowIndex}-${colIndex}`}
              className={`chess-pos-${rowIndex}-${colIndex}`}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              style={{
                width: '30px',
                height: '30px',
                backgroundColor: '#e6c19c',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: cell ? 'not-allowed' : 'pointer',
                position: 'relative'
              }}
            >
              {cell && (
                <div 
                  className={`chess-${cell}`}
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    backgroundColor: cell === 'black' ? '#000' : '#fff',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                  }}
                />
              )}
            </div>
          ))
        ))}
      </div>
    </div>
  );
};

export default Game;