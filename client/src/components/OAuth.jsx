import { GoogleAuthProvider, getAuth, signInWithPopup } from '@firebase/auth'
import { app } from '../firebase'
import {useDispatch} from 'react-redux'
import { signInSuccess } from '../redux/user/userSlice'
import { useNavigate } from'react-router-dom'

export default function OAuth() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider()
            const auth = getAuth(app)

            const result = await signInWithPopup(auth, provider)
            const res = await fetch('/api/auth/google', {
              method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: result.user.displayName, email: result.user.email, photoUrl: result.user.photoURL
                })
            })

            const data = await res.json()
            // the data is stored in the redux state 'current user'
            dispatch(signInSuccess(data))
            navigate('/')

        } catch (error) {
            console.log("could not connect with Google", error)
        }
    }
  return (
    // since this is inside the form the type is changed from submit (default) to button. 
    // else both sign in and google button will submit the form
    <button onClick={handleGoogleClick} type="button" className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95">continue with google</button>
  )
}
