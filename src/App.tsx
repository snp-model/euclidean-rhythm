import './App.css'
import DrumMachine from './components/DrumMachine'
import { useCmajor } from './hooks/useCmajor'
import { useState } from 'react'

function App() {
  const { isLoaded, patchConnection, initAudio, error } = useCmajor();
  const [started, setStarted] = useState(false);

  const handleStart = async () => {
    try {
      await initAudio();
      setStarted(true);
    } catch (e) {
      console.error('[App.tsx] Error:', e);
    }
  };

  if (!started) {
    return (
      <div className="app-container start-screen">
        <h1>Euclidean Drum Machine</h1>
        
        {error && (
          <div style={{ color: 'red', border: '1px solid red', padding: '10px', marginBottom: '20px' }}>
            Error: {error}
          </div>
        )}

        <button className="start-button" onClick={handleStart}>
          Start
        </button>
      </div>
    );
  }

  return (
    <div className="app-container">
      {isLoaded ? (
        <DrumMachine patchConnection={patchConnection} />
      ) : (
        <>
          <p style={{ marginTop: '20px', opacity: 0.7 }}>
            Click to initialize Cmajor Audio Engine
          </p>
          <footer className="site-footer">
            <p>© 2026 snp. All rights reserved.</p>
          </footer>
        </>
      )}
      {isLoaded && (
        <footer className="site-footer">
          <p>© 2026 snp. All rights reserved.</p>
        </footer>
      )}
    </div>
  )
}

export default App
