"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { motion, AnimatePresence } from "framer-motion"

// Dynamically import the Confetti component with SSR disabled
const Confetti = dynamic(() => import("react-confetti").then((mod) => mod.default), {
  ssr: false,
})

// Square component represents a single cell in the game
function Square({ value, onSquareClick }: { value: string | null; onSquareClick: () => void }) {
  return (
    <button
      className={`h-16 w-16 border border-gray-400 flex items-center justify-center text-2xl font-bold hover:bg-gray-100 transition-colors ${
        value === "X"
          ? "bg-green-200 hover:bg-green-300 text-green-800"
          : value === "O"
            ? "bg-blue-200 hover:bg-blue-300 text-blue-800"
            : "bg-white"
      }`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  )
}

// Result popup component
function ResultPopup({ result }: { result: string }) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
    >
      <div
        className={`px-8 py-6 rounded-lg shadow-lg ${
          result.includes("X")
            ? "bg-green-500 text-white"
            : result.includes("O")
              ? "bg-blue-500 text-white"
              : "bg-gray-700 text-white"
        }`}
      >
        <h2 className="text-3xl font-bold text-center">{result}</h2>
      </div>
    </motion.div>
  )
}

export default function TicTacToe() {
  // Initialize the board with 9 null values (empty squares)
  const [squares, setSquares] = useState<(string | null)[]>(Array(9).fill(null))
  // X goes first
  const [xIsNext, setXIsNext] = useState(true)
  // State for window dimensions (for confetti)
  const [windowDimensions, setWindowDimensions] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  })
  // State to control confetti
  const [showConfetti, setShowConfetti] = useState(false)
  // State to control result popup
  const [showResult, setShowResult] = useState(false)
  // State to store the result message
  const [resultMessage, setResultMessage] = useState("")

  // Get window dimensions for confetti
  useEffect(() => {
    const { innerWidth: width, innerHeight: height } = window
    setWindowDimensions({ width, height })

    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Handle click on a square
  function handleClick(i: number) {
    // If square is already filled or there's a winner, do nothing
    if (squares[i] || calculateWinner(squares)) {
      return
    }

    // Create a copy of the squares array
    const nextSquares = squares.slice()
    // Set the value of the clicked square to X or O
    nextSquares[i] = xIsNext ? "X" : "O"

    // Update the state
    setSquares(nextSquares)
    setXIsNext(!xIsNext)

    // Check if this move resulted in a win or draw
    const winner = calculateWinner(nextSquares)
    if (winner) {
      setShowConfetti(true)
      setResultMessage(`${winner} Wins!`)
      setShowResult(true)

      // Hide the result after 2 seconds
      setTimeout(() => {
        setShowResult(false)
      }, 2000)
    } else if (nextSquares.every((square) => square !== null)) {
      setResultMessage("It's a Draw!")
      setShowResult(true)

      // Hide the result after 2 seconds
      setTimeout(() => {
        setShowResult(false)
      }, 2000)
    }
  }

  // Determine the game status
  const winner = calculateWinner(squares)
  let status
  if (winner) {
    status = `Winner: ${winner}`
  } else if (squares.every((square) => square !== null)) {
    status = "Draw: Game Over"
  } else {
    status = `Next player: ${xIsNext ? "X" : "O"}`
  }

  // Reset the game
  function resetGame() {
    setSquares(Array(9).fill(null))
    setXIsNext(true)
    setShowConfetti(false)
    setShowResult(false)
  }

  return (
    <div className="flex flex-col items-center">
      {showConfetti && (
        <Confetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.2}
        />
      )}

      <AnimatePresence>{showResult && <ResultPopup result={resultMessage} />}</AnimatePresence>

      <div className="mb-4 text-xl font-medium">{status}</div>
      <div className="grid grid-cols-3 gap-1 mb-4">
        {squares.map((value, index) => (
          <Square key={index} value={value} onSquareClick={() => handleClick(index)} />
        ))}
      </div>
      <button onClick={resetGame} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Reset Game
      </button>
    </div>
  )
}

// Helper function to calculate the winner
function calculateWinner(squares: (string | null)[]) {
  // All possible winning combinations
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]

  // Check if any winning combination is satisfied
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }

  return null
}
