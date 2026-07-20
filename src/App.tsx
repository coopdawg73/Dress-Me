import { StartScreen } from './ui/StartScreen'

export default function App() {
  return (
    <div className="app-shell">
      <main style={{ flex: 1 }}>
        <StartScreen onStartDaily={() => {}} onStartAtelier={() => {}} />
      </main>
      <footer className="app-footer">by Remark</footer>
    </div>
  )
}
