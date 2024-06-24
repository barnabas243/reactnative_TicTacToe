import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';

export default function App() {
  // Initialize the Tic-Tac-Toe board as a 3x3 matrix
  const [board, setBoard] = useState([
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ]);

  // Track the current player (X or O)
  const [currentPlayer, setCurrentPlayer] = useState('X');

  // Track if the game is over
  const [gameOver, setGameOver] = useState(false);

  // Function to handle a move on the board
  const handleMove = (row, col) => {
    // If the game is over, do nothing
    if (gameOver) return;

    // Make a copy of the current board
    let newBoard = [...board];
    // Check if the selected cell is empty
    if (newBoard[row][col] === '') {
      // Update the value at the selected position with the current player's mark
      newBoard[row][col] = currentPlayer;
      // Check for winning condition
      if (checkWinner(newBoard, row, col, currentPlayer)) {
        alert(`Player ${currentPlayer} wins!`);
        setGameOver(true); // Mark the game as over
        return;
      }
      // Check for draw condition
      if (checkDraw(newBoard)) {
        alert('It\'s a draw!');
        setGameOver(true); // Mark the game as over
        return;
      }
      // Alternate between X and O for the next move
      setCurrentPlayer(currentPlayer === 'X' ? '◯' : 'X');
      // Update the state with the new board
      setBoard(newBoard);
    }
  };

  // Function to check for winning condition
  const checkWinner = (board, row, col, currentPlayer) => {
    // Check for horizontal line
    if (
      board[row][0] === currentPlayer &&
      board[row][1] === currentPlayer &&
      board[row][2] === currentPlayer
    ) {
      return true;
    }
    // Check for vertical line
    if (
      board[0][col] === currentPlayer &&
      board[1][col] === currentPlayer &&
      board[2][col] === currentPlayer
    ) {
      return true;
    }
    // Check for diagonal line (top-left to bottom-right)
    if (
      (board[0][0] === currentPlayer && board[1][1] === currentPlayer && board[2][2] === currentPlayer) ||
      // Check for diagonal line (top-right to bottom-left)
      (board[0][2] === currentPlayer && board[1][1] === currentPlayer && board[2][0] === currentPlayer)
    ) {
      return true;
    }
    return false;
  };

  // Function to check for draw condition
  const checkDraw = (board) => {
    for (let row of board) {
      for (let cell of row) {
        if (cell === '') {
          return false; // Grid is not full
        }
      }
    }
    return true; // Grid is full
  };

  // Function to reset the board
  const resetBoard = () => {
    setBoard([
      ['', '', ''],
      ['', '', ''],
      ['', '', '']
    ]);
    setCurrentPlayer('X'); // Reset the current player to X
    setGameOver(false); // Mark the game as not over
  };

  // Render the board
  const renderBoard = () => {
    return board.map((row, rowIndex) => (
      <View key={rowIndex} style={styles.row}>
        {row.map((cell, colIndex) => {
          // Determine the border style for the current cell
          let borderStyle = {};
          // middle cell to have a full border
          if (rowIndex === 1 && colIndex === 1) {
            borderStyle = styles.boxFullBorder;
            // the middle top and bottom cells to have leftright border
          } else if (rowIndex === 0 && colIndex === 1 || rowIndex === 2 && colIndex === 1) {
            borderStyle = styles.boxLeftRightBorder;
            // the middle left and right cells to have topbottom border
          } else if (rowIndex === 1 && (colIndex === 0 || colIndex === 2)) {
            borderStyle = styles.boxTopBottomBorder;
          }
          return (
            <TouchableOpacity
              key={colIndex}
              style={[styles.col, borderStyle]}
              onPress={() => handleMove(rowIndex, colIndex)}
              disabled={cell !== '' || gameOver} // Disable cell if it's not empty or the game is over
            >
              <Text style={styles.cellText}>{cell}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      {renderBoard()}
      <TouchableOpacity style={styles.resetButton} onPress={resetBoard}>
        <Text style={styles.resetButtonText}>Reset</Text>
      </TouchableOpacity>
    </View>
  );
}


const windowWidth = Dimensions.get('window').width - 50;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  col: {
    width: windowWidth / 3, // Divide window width by the number of columns
    aspectRatio: 1, // Maintain aspect ratio (height will be calculated automatically)
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellText: {
    fontSize: 60,
  },
  boxFullBorder: {
    borderWidth: 1,
  },
  boxTopBottomBorder: {
    borderTopColor: 'black',
    borderTopWidth: 1,
    borderBottomColor: 'black',
    borderBottomWidth: 1,
  },
  boxLeftRightBorder: {
    borderRightColor: 'black',
    borderRightWidth: 1,
    borderLeftColor: 'black',
    borderLeftWidth: 1,
  },
  resetButton: {
    backgroundColor: 'lightgray',
    padding: 10,
    marginTop: 20,
    borderRadius: 5,
  },
  resetButtonText: {
    fontSize: 20,
  },
});

