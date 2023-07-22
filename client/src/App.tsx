import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.scss'
import Home from './pages/Home'
import Header from './components/Header'
import Footer from './components/Footer'
import NotFound from './pages/NotFound'
import Login from './pages/Login'
import Register from './pages/Register'
import Search from './pages/Search'
import ProductPage from './pages/ProductPage'
import Profile from './pages/Profile'
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
        <Route path='/register' element={<Register />} />
        <Route path='/search' element={<Search />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/product/:id' element={<ProductPage />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
