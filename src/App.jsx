import { Children, useState } from "react"
import confetti from "canvas-confetti"
import {Square} from "./components/Square.jsx"
import {turns, winner_combos} from "./constants.js"
function App(){

    const [board, setBoard] = useState(()=>{
        const boardFromStorage = window.localStorage.getItem('board')
        if (boardFromStorage) return JSON.parse(boardFromStorage)
        return Array(9).fill(null)
    })
    const [turn, setTurn] = useState(()=>{
        const turnFromStorage = window.localStorage.getItem('turn')
        return turnFromStorage ?? turns.X
    })
    const [winner, setWinner] = useState(null)

    const checkWinner = (boardToCheck) => {
        for (const combo of winner_combos){
            const [a, b, c] = combo
            if (
                boardToCheck[a] &&
                boardToCheck[a] == boardToCheck[b] &&
                boardToCheck[a] == boardToCheck[c]
            ) {
                return boardToCheck[a]
            }
        }
        return null
    }

    const resetGame = () => {
        setBoard(Array(9).fill(null))
        setTurn(turns.X)
        setWinner(null)
        window.localStorage.removeItem('board')
        window.localStorage.removeItem('turn')
    }

    const checkEndGame = (newBoard) => {
        return newBoard.every((square) => square != null)
    }

    const updateBoard = (index) => {
        if(board[index] || winner) return
        const newBoard = [... board]
        newBoard[index] = turn
        setBoard(newBoard)
        const newTurn = turn === turns.X ? turns.O : turns.X
        setTurn(newTurn)
        window.localStorage.setItem('board',JSON.stringify(newBoard))
        window.localStorage.setItem('turn', newTurn)
        const newWinner = checkWinner(newBoard)
        if (newWinner) {
            confetti()
            setWinner(newWinner)
        } else if (checkEndGame(newBoard)) {
            setWinner(false)
        }
    }

    return (
        <main className="board">
            <h1>Tic tac toe</h1>
            <button onClick={resetGame}>Reset del juego</button>
            <section className="game">
                {
                    board.map((_, index) => {
                        return (
                            <Square 
                                key={index} 
                                index={index}
                                updateBoard={updateBoard}
                            >
                                {board[index]}
                            </Square>
                        )
                    })
                }
            </section>

            <section className="turn">
                <Square isSelected={turn == turns.X}>
                    {turns.X}
                </Square>
                <Square isSelected={turn == turns.O}>
                    {turns.O}
                </Square>
            </section>

            {
                winner != null && (
                    <section className="winner">
                        <div className="text">
                            <h2>
                                {
                                    winner == false
                                        ? 'Empate'
                                        : 'Ganó: '+ winner
                                }
                            </h2>
                            <header className="win">
                                {winner && <Square>{winner}</Square>}
                            </header>
                            <footer>
                                <button onClick={resetGame}>Empezar de nuevo</button>
                            </footer>
                        </div>
                    </section>
                )
            }
        </main>
    )
}

export default App