import { useState, useCallback } from 'react'
import './WordSearch.css'

// Grille 10x10 avec les mots cachés
// SAUNA (horizontal), GRENOUILLE (horizontal), WEEKEND (vertical), PHOTO (horizontal)
const GRID = [
  ['G', 'R', 'E', 'N', 'O', 'U', 'I', 'L', 'L', 'E'],
  ['X', 'W', 'B', 'T', 'P', 'H', 'O', 'T', 'O', 'J'],
  ['F', 'E', 'R', 'Q', 'Z', 'V', 'C', 'D', 'U', 'I'],
  ['L', 'E', 'S', 'A', 'U', 'N', 'A', 'P', 'E', 'M'],
  ['O', 'K', 'Y', 'J', 'N', 'B', 'X', 'W', 'R', 'A'],
  ['C', 'E', 'T', 'R', 'I', 'O', 'P', 'L', 'K', 'G'],
  ['O', 'N', 'A', 'M', 'O', 'U', 'R', 'S', 'Q', 'I'],
  ['N', 'D', 'H', 'U', 'G', 'V', 'W', 'X', 'Y', 'E'],
  ['S', 'P', 'Q', 'C', 'A', 'D', 'E', 'A', 'U', 'X'],
  ['J', 'O', 'I', 'E', 'F', 'E', 'T', 'E', 'S', 'N'],
]

// Positions des mots dans la grille
const WORDS_CONFIG = {
  'GRENOUILLE': { positions: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8], [0, 9]] },
  'PHOTO': { positions: [[1, 4], [1, 5], [1, 6], [1, 7], [1, 8]] },
  'SAUNA': { positions: [[3, 2], [3, 3], [3, 4], [3, 5], [3, 6]] },
  'WEEKEND': { positions: [[1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1], [7, 1]] },
}

const WORDS_TO_FIND = ['SAUNA', 'GRENOUILLE', 'WEEKEND', 'PHOTO']

// Descriptions des cadeaux
const GIFT_DESCRIPTIONS = {
  'SAUNA': 'Sauna/spa tous les deux 🧖‍♀️',
  'GRENOUILLE': 'Écharpe grenouille, si elle arrive un jour 🐸',
  'WEEKEND': 'Weekend tous les deux à la campagne, où tu veux, quand tu veux 🏡',
  'PHOTO': 'Stage photo argentique, pour que tu puisses utiliser ton réflex sereinement 📷',
}

function WordSearch({ onComplete }) {
  const [foundWords, setFoundWords] = useState([])
  const [selectedCells, setSelectedCells] = useState([])
  const [isSelecting, setIsSelecting] = useState(false)
  const [highlightedCells, setHighlightedCells] = useState({})

  const getCellKey = (row, col) => `${row}-${col}`

  const handleMouseDown = (row, col) => {
    setIsSelecting(true)
    setSelectedCells([{ row, col }])
  }

  const handleMouseEnter = (row, col) => {
    if (!isSelecting) return
    
    const newCell = { row, col }
    const alreadySelected = selectedCells.some(c => c.row === row && c.col === col)
    
    if (!alreadySelected) {
      setSelectedCells(prev => [...prev, newCell])
    }
  }

  const handleMouseUp = useCallback(() => {
    if (!isSelecting) return
    setIsSelecting(false)

    // Vérifier si la sélection correspond à un mot
    const selectedKeys = selectedCells.map(c => getCellKey(c.row, c.col)).sort()
    
    for (const word of WORDS_TO_FIND) {
      if (foundWords.includes(word)) continue
      
      const wordKeys = WORDS_CONFIG[word].positions.map(([r, c]) => getCellKey(r, c)).sort()
      
      if (selectedKeys.length === wordKeys.length && 
          selectedKeys.every((key, i) => key === wordKeys[i])) {
        // Mot trouvé !
        setFoundWords(prev => [...prev, word])
        
        // Ajouter les cellules aux cellules surlignées
        const newHighlighted = { ...highlightedCells }
        WORDS_CONFIG[word].positions.forEach(([r, c]) => {
          newHighlighted[getCellKey(r, c)] = word
        })
        setHighlightedCells(newHighlighted)
        
        // Vérifier si tous les mots sont trouvés
        if (foundWords.length + 1 === WORDS_TO_FIND.length) {
          setTimeout(() => onComplete?.(), 500)
        }
        break
      }
    }
    
    setSelectedCells([])
  }, [isSelecting, selectedCells, foundWords, highlightedCells, onComplete])

  const isSelected = (row, col) => {
    return selectedCells.some(c => c.row === row && c.col === col)
  }

  const getHighlightColor = (row, col) => {
    const key = getCellKey(row, col)
    const word = highlightedCells[key]
    if (!word) return null
    
    const colors = {
      'SAUNA': '#ff6b6b',
      'GRENOUILLE': '#4ecdc4',
      'WEEKEND': '#ffe66d',
      'PHOTO': '#a8e6cf',
    }
    return colors[word]
  }

  return (
    <div className="word-search" onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
      <h3 className="word-search-title">🔍 Trouve les cadeaux !</h3>
      
      <div className="score">
        <span className="score-number">{foundWords.length}</span>
        <span className="score-separator">/</span>
        <span className="score-total">4</span>
      </div>

      <div className="words-list">
        {WORDS_TO_FIND.map(word => (
          <div key={word} className="word-item-container">
            <span 
              className={`word-item ${foundWords.includes(word) ? 'found' : ''}`}
            >
              {foundWords.includes(word) ? word : '?'.repeat(word.length)}
            </span>
            {foundWords.includes(word) && (
              <div className="tooltip">
                <span className="tooltip-icon">🎁</span>
                <span className="tooltip-text">{GIFT_DESCRIPTIONS[word]}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="grid-container">
        <div 
          className="grid"
          onMouseLeave={() => {
            if (isSelecting) {
              setIsSelecting(false)
              setSelectedCells([])
            }
          }}
        >
          {GRID.map((row, rowIndex) => (
            <div key={rowIndex} className="grid-row">
              {row.map((letter, colIndex) => {
                const highlightColor = getHighlightColor(rowIndex, colIndex)
                return (
                  <div
                    key={colIndex}
                    className={`grid-cell ${isSelected(rowIndex, colIndex) ? 'selected' : ''} ${highlightColor ? 'found-cell' : ''}`}
                    style={highlightColor ? { backgroundColor: highlightColor } : {}}
                    onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                    onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                  >
                    {letter}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default WordSearch
