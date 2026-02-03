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

        <section className="seo-info">
          <h2>About</h2>
          <p>
            ユークリッドリズム（ユークリディアンリズム / Euclidean Rhythm）は、数学的なアルゴリズムを用いて生成されるリズムのパターンです。
            最大公約数を求める「ユークリッドの互除法」を応用した Bjorklund アルゴリズムにより、指定された数の拍を可能な限り均等に配置します。
          </p>
          <p>
            このドラムマシンでは、16分音符や変拍子の中で数学的に美しいリズム構造を簡単に作成でき、
            Tresillo, Cinquillo, Samba, Bembe など、世界中の伝統的な音楽に見られる特徴的なリズムパターンを視覚化して演奏することが可能です。
          </p>
        </section>
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
