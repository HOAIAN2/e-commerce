import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.scss'
import Home from './pages/Home'
import Header from './components/Header'
import Login from './pages/Login'

function App() {
  // const [count, setCount] = useState(0)
  document.querySelector('.loading')?.remove()
  return (
    <>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </>
  )
}

export default App
