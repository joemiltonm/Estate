import { useState } from "react"
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from '../firebase'


export default function CreateListing() {

    const [files, setFiles] = useState([])

    const [formData, setFormData] = useState({
        imageURLs: [],
    })
    
    const [imageUploadError, setImageUploadError] = useState(false)

    const [uploading, setUploading] = useState(false)

    const handleImageSubmit = (e) => {
        if(files.length > 0 && files.length + formData.imageURLs.length  < 7){
            setUploading(true)
            setImageUploadError(false)
            const promises = [];

            for (let i = 0; i < files.length; i++){
                promises.push(storeImage(files[i]));
            }
        Promise.all(promises).then((urls) => {
                setFormData({
                   ...formData,
                    imageURLs: formData.imageURLs.concat(urls),
                })
                setImageUploadError(false)
                setUploading(false)
            }).catch((error) => {
                setImageUploadError("image upload failed 2 mb max per image")               
            }) 
        }
        else{
                setImageUploadError("image upload failed 7 images max")
                setUploading(false)
            }
        }
    
    const storeImage = async (file) => {
            return new Promise((resolve, reject) => {
                const storage = getStorage(app)
                const fileName = new Date().getTime() + file.name;
                const storageRef = ref(storage, fileName)
                const uploadTask = uploadBytesResumable(storageRef, file)
                uploadTask.on(
                    "state_changed",(snapshot) => {
                        const progress = Math.round(
                            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                        )
                        console.log(progress)
                    }, (error) => {
                        reject(error)
                    }, 
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL)
                    })
                })        
            })
    }

    const handleRemoveImage = (index) => {
        setFormData({
           ...formData,
            imageURLs: formData.imageURLs.filter((_, i) => i!== index),
        })
    }

    return (
        <main className="p-3 max-w-4xl mx-auto">
            <h1 className="text-3xl font-semibold text-center my-7"> Create a Listing</h1>
            <form className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col gap-4 flex-1">

                    <input type="text" placeholder="name" className="border p-3 rounded-lg" id='name' maxLength='62' minLength='10' required/>

                    <input type="text" placeholder="description" className="border p-3 rounded-lg" id='description' required/>

                    <input type="text" placeholder="address" className="border p-3 rounded-lg" id='address' required/>
                <div className="flex gap-6 flex-wrap">
                    <div className="flex gap-2">
                        <input type="checkbox" className="w-5" id="sale"/>
                        <span>sell</span>
                    </div>
                    <div className="flex gap-2">
                        <input type="checkbox" className="w-5" id="rent"/>
                        <span>rent</span>
                    </div>
                    <div className="flex gap-2">
                        <input type="checkbox" className="w-5" id="parking"/>
                        <span>parking spot</span>
                    </div>
                    <div className="flex gap-2">
                        <input type="checkbox" className="w-5" id="furnished"/>
                        <span>furnished</span>
                    </div>
                    <div className="flex gap-2">
                        <input type="checkbox" className="w-5" id="offer"/>
                        <span>offer</span>
                    </div>
                </div>
                <div className="flex flex-wrap gap-6">
                    <div className="flex items-center gap-2">
                        <input type="number" id="bedrooms" min='1' max='10' required className="p-3 border border-gray-300 rounded-lg"/>
                        <p>beds</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="number" id="bathrooms" min='1' max='10' required className="p-3 border border-gray-300 rounded-lg"/>
                        <p>bath</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="number" id="regularPrice" min='1' max='10' required className="p-3 border border-gray-300 rounded-lg"/>
                        <div className="felx flex-col items-center">
                            <p>regular price</p> <span>($/month)</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="number" id="discountedPrice" min='1' max='10' required className="p-3 border border-gray-300 rounded-lg"/>
                        <div className="felx flex-col items-center">
                            <p>discounted price</p> <span>($/month)</span>
                        </div>
                    </div>
                </div>
                </div>
                <div className="flex flex-col flex-1 gap-4">
                    <p className="font-semibold">Images:</p>
                    <span className="font-normal text-gray-600 ml-2">The first image will be the cover (max6) </span>

                    <div className="flex gap-4">
                        <input onChange={(e) => {setFiles(e.target.files)}} className="p-3 border border-gray-300 rounded w-full" type="file" id="images" accept='imag/*' multiple/>
                        <button onClick={handleImageSubmit} type="button" 
                        className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80">
                            {uploading ? 'uploading...' : 'upload'}</button>
                    </div>
                    <p className="text-red-700 text-sm">{imageUploadError && imageUploadError}</p>
                    {
                        formData.imageURLs.length > 0 && formData.imageURLs.map((url, index) => (
                            <div key={url} className="flex justify-between p-3 border items-center"> 
                                <img src={url} key={url} alt="listing image" className="w-20 h-20 object-contain rounded-lg" />
                                <button type="button" onClick={() => {handleRemoveImage(index)}} className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75">delete</button>
                            </div>
                        ))
                    }
                    <button className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">Create Listing</button>
                </div>
                
            </form>
        </main>
    )
}