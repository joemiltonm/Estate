import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice.js'

export default function Signin() {
  const [formData, setFormData] = useState({})
  const { loading, error } = useSelector((state) => state.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()


  // e is the event object
  // [e.target.id] is a computed property. As the key itself is a variable the square brackets are used. 
  // is JS object literal the key can be with or without quotes. But a JSON key should have quotes.

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }
 
  const handleSubmit = async(e) => {
    // to prevent refrenshing the page
    e.preventDefault()
    console.log("im here")
    try{
      dispatch(signInStart())
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers:{
          'Content-type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if(data.success === false){
        dispatch(signInFailure(data.message))
        return;
      }
      dispatch(signInSuccess(data))
      navigate('/')
      }catch(err){
        dispatch(signInFailure(err.message))
      }
  }
 
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">
        Sign In
      </h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input type="email" placeholder="email"  className="border p-3 rounded-lg" id='email'
        onChange={handleChange}/>
        <input type="password" placeholder="password"  className="border p-3 rounded-lg" id='password'
        onChange={handleChange}/>
        <button disabled={loading} className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
          {loading ? 'Loading...' : 'Sign In'}
        </button>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Dont have an account?</p>
        <Link to="/Sign-up">
          <span className="text-blue-700 ">Sign Up</span>
        </Link>
      </div>
      {error && <p>{error}</p>}
    </div>
  )
}
