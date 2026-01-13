import { useState } from 'react'
import './App.css'
import WordSearch from './WordSearch'

function App() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="christmas-container">
      {/* Flocons de neige animés */}
      <div className="snowflakes" aria-hidden="true">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="snowflake">❄</div>
        ))}
      </div>

      <div className={`card ${isOpen ? 'open' : ''}`}>
        {!isOpen ? (
          <div className="card-front" onClick={() => setIsOpen(true)}>
            <div className="ribbon">🎀</div>
            <h1 className="title">Joyeux Noël Maya</h1>
            <div className="tree">🎄</div>
            <p className="subtitle">Petit cœur</p>
            <p className="click-hint">✨ Clique pour ouvrir ✨</p>
          </div>
        ) : (
          <div className="card-inside">
            <div className="hearts">💕</div>
            <h2 className="message-title">Pour toi, mon amour</h2>
            <div className="message">
              <p>
                Joyeux Noël !
              </p>
              <p>
                Tu es mon plus beau cadeau, je t’aime plus que<br/>
                tout au monde. 🎁<br/>
                Petit jeu pour toi 👀
              </p>
            </div>
            <div className="decorations">
              <span>🦌</span>
              <span>⭐</span>
              <span>🎅</span>
              <span>⭐</span>
              <span>🦌</span>
            </div>
            <WordSearch />
            <p className="signature">💝💝</p>
          </div>
        )}
      </div>
      <div className="footer-decoration">
        🎁 🍪 🥛 🎁
      </div>
    </div>
  )
}

export default App
