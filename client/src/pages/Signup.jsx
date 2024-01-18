import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";


export default function Signup() {

  const [formData, setFormData] = useState({})
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()


  // e is the event object
  // [e.target.id] is a computed property. As the key itself is a variable the square brackets are used. 
  // is JS object literal the key can be with or without quotes. But a JSON key should have quotes.

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }
  console.log(formData)
  const handleSubmit = async(e) => {
    // to prevent refrenshing the page
    e.preventDefault()

    try{
      setLoading(true)
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers:{
          'Content-type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await res.json()
      console.log(data)
      if(data.success === false){
        setLoading(false)
        setError(data.message)
        return
      }
      setLoading(false)
      setError(null)
      navigate('/Sign-in')
      }catch(err){
        setError(err.message)
        setLoading(false)
      }
  }
  console.log(error)
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">
        Sign Up
      </h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input type="text" placeholder="username"  className="border p-3 rounded-lg" id='username'
        onChange={handleChange}/>
        <input type="email" placeholder="email"  className="border p-3 rounded-lg" id='email'
        onChange={handleChange}/>
        <input type="password" placeholder="password"  className="border p-3 rounded-lg" id='password'
        onChange={handleChange}/>
        <button disabled={loading} className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
          {loading ? 'Loading...' : 'Sign Up'}
        </button>
      </form>
      <div className="flex gap-2 mt-5">
        <p>have an account?</p>
        <Link to="/Sign-in">
          <span className="text-blue-700 ">Sign In</span>
        </Link>
       
      </div>
      {error && <p>{error}</p>}
    </div>
  )
}
