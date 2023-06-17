import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.scss'
import Home from './pages/Home'
import Header from './components/Header'
import Login from './pages/Login'
import useUserData from './context/hooks'
import { USER_ACTION } from './context/UserContext'
import { reqGetUser } from './utils/user'

function App() {
  const { dispatchUser } = useUserData()
  // console.log(user)
  const [isFirstLoad, setIsFirstLoad] = useState(true)
  useEffect(() => {
    reqGetUser()
      .then(data => {
        dispatchUser({ type: USER_ACTION.SET, payload: data })
        setIsFirstLoad(false)
      })
      .catch(error => {
        if (error.message !== 'no token') console.error(error.message)
        setIsFirstLoad(false)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  // const [count, setCount] = useState(0)
  useEffect(() => {
    const items = document.querySelectorAll('.loading, .pre-load')
    if (isFirstLoad) return
    items.forEach(node => { node.remove() })
  }, [isFirstLoad])
  if (isFirstLoad) return null
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
