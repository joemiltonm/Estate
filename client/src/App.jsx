import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home' 
import About from './pages/About'
import Signin from './pages/Signin'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import Header from './components/Header'
import PrivateRoute from './components/PrivateRoute'
import CreateListing from './pages/CreateListing'

export default function App() {
  
  return (
    <BrowserRouter>
      <Header/>
      <Routes>
        <Route path="/" element = {<Home/>}/>
        <Route path="/About" element = {<About/>}/>
        <Route path="/Sign-in" element = {<Signin/>}/>
        <Route path="/Sign-up" element = {<Signup/>}/>
        <Route element = {<PrivateRoute/>} >
          <Route path="/Profile" element = {<Profile/>}/>
          <Route path="/create-listing" element = {<CreateListing/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
