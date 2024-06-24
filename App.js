import React, { useState, useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  ImageBackground,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';

const gradientColors = ['#1037e5', '#B38DFD', '#9456FE', '#6305fc'];

const image = require('./assets/background.jpg') || {
  uri: 'https://snack-code-uploads.s3.us-west-1.amazonaws.com/~asset/5f1fe181767506fa35e5794687c91399',
};

export default function App() {
  // Initialize the Tic-Tac-Toe board as a 3x3 matrix
  const [board, setBoard] = useState([
    ['◯', '◯', '◯'],
    ['X', '◯', 'X'],
    ['◯', 'X', 'X'],
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
        alert("It's a draw!");
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
      (board[0][0] === currentPlayer &&
        board[1][1] === currentPlayer &&
        board[2][2] === currentPlayer) ||
      // Check for diagonal line (top-right to bottom-left)
      (board[0][2] === currentPlayer &&
        board[1][1] === currentPlayer &&
        board[2][0] === currentPlayer)
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
      ['', '', ''],
    ]);
    setCurrentPlayer('X'); // Reset the current player to X
    setGameOver(false); // Mark the game as not over
  };

  // Animated border styles
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 5000,
            easing: Easing.linear,
            useNativeDriver: false,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 5000,
            easing: Easing.linear,
            useNativeDriver: false,
          }),
        ])
      ).start();
    };

    startAnimation();
  }, [animatedValue]);

  const borderColor = animatedValue.interpolate({
    inputRange: [0, 0.33, 0.66, 1],
    outputRange: gradientColors,
  });

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
          } else if (
            (rowIndex === 0 && colIndex === 1) ||
            (rowIndex === 2 && colIndex === 1)
          ) {
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
              <Text
                style={[
                  styles.cellText,
                  cell === 'X' ? styles.blueText : styles.redText,
                ]}>
                {cell}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <ImageBackground source={image} resizeMode="cover" style={styles.image}>
        <Animated.View style={[styles.innerContainer, { borderColor }]}>
          {renderBoard()}

          <TouchableOpacity style={styles.resetButton} onPress={resetBoard}>
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
          <Text style={styles.smallText}>
            Tap <Text style={styles.boldText}>reset</Text> to play
          </Text>
        </Animated.View>
      </ImageBackground>
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
  image: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    borderWidth: 5,
    padding: 15,
    marginHorizontal: 5,
    backgroundColor: '#000000d0',
  },
  row: {
    flexDirection: 'row',
  },
  col: {
    width: windowWidth / 3, // Divide window width by the number of columns
    aspectRatio: 1, // Maintain aspect ratio (height will be calculated automatically)
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
  },
  cellText: {
    fontSize: 80,
  },
  boxFullBorder: {
    borderWidth: 2,
    borderColor: '#fff',
  },
  boxTopBottomBorder: {
    borderTopColor: '#fff',
    borderTopWidth: 2,
    borderBottomColor: '#fff',
    borderBottomWidth: 2,
  },
  boxLeftRightBorder: {
    borderRightColor: '#fff',
    borderRightWidth: 2,
    borderLeftColor: '#fff',
    borderLeftWidth: 2,
  },
  resetButton: {
    backgroundColor: '#6305fc',
    padding: 10,
    marginTop: 20,
    borderRadius: 5,
  },
  resetButtonText: {
    fontSize: 20,
    color: '#ccc',
  },
  smallText: {
    marginTop: 5,
    fontSize: 15,
    color: '#ccc',
  },
  boldText: {
    color: "#6999fc",
    fontWeight: 'bold',
  },
  redText: {
    color: '#ea5b5b',
    textShadowColor: '#b22222',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  blueText: {
    color: '#45bbd8',
    textShadowColor: '#00f',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
});
