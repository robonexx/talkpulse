
import { Outlet } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'

function App() {
  

  return (
    <main className='w-full min-h-screen'>
      <Header />
      <Outlet />
      <Footer />
    </main>
  )
}

export default App
