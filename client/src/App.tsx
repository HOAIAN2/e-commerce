import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.scss'
import Home from './pages/Home'
import Header from './components/Header'

function App() {
  // const [count, setCount] = useState(0)
  document.querySelector('.loading')?.remove()
  return (
    <>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
      </Routes>
    </>
  )
}

export default App
