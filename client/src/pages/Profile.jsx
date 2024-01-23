import { useSelector } from 'react-redux'
import { useEffect, useRef, useState } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase'

export default function Profile() {
    const fileRef = useRef(null)
    const { currentUser }= useSelector(state => state.user)
    const [ file, setFile] = useState(undefined)
    const [filePercent, setFilePercent] = useState()
    const [fileUploadError, setFileUploadError] = useState(false)
    const [formData, setFormData] = useState({})   
    
    const handleFileUpload = (file) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name
      const storageRef = ref(storage,fileName)
      const uploadTask = uploadBytesResumable(storageRef, file)
     
      uploadTask.on('state_changes', (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setFilePercent(Math.round(progress))
      },
      (error)=>{
        setFileUploadError(true)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({...formData, avatar: downloadURL})
        })
      }
      )
    }
    
    useEffect(() => {
      if(file){
        handleFileUpload(file)
      }
    },[file])

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className='flex flex-col gap-4'>
        <input type='file' onChange={(e) => setFile(e.target.files[0])} ref={fileRef} hidden accept='image/*'></input>
        <img onClick={() => fileRef.current.click()} src={formData.avatar || currentUser.avatar} alt="profile" className='rounded-fill h-24 w-24 object-cover cursor-pointer self-center mt-2' />
        <p className='text-sm text-center'>
          {fileUploadError ? (<span className='text-red-700'>error image upload</span> ) : 
          filePercent > 0 && filePercent < 100 ? 
          (<span className='text-red-700'>Uploading... {filePercent}%</span>) : filePercent=== 100 ? (
            <span className='text-green-700'>Uploaded</span>) :
            ( '' )}
        </p>
        <input id="username" type = 'text' placeholder = 'username' className='border p-3 rounded-lg '/>
        <input id="email" type = 'text' placeholder = 'email' className='border p-3 rounded-lg '/>
        <input id="password" type = 'text' placeholder = 'password' className='border p-3 rounded-lg '/>
        <button className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>update</button>
      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer'>delete account</span>
        <span className='text-red-700 cursor-pointer'>sign out</span>
      </div>
    </div>
  )
}