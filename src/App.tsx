import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import JourneyBuilder from './components/JourneyBuilder'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <JourneyBuilder />
    </>
  )
}

export default App
