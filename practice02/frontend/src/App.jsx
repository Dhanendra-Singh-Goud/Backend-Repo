import { useEffect, useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import axios from 'axios';
import './App.css'

function App() {
  const [jokes, setJokes] = useState([])

  useEffect(()=>{
    axios.get("/api/jokes") //isko humne proxy laga di hai toh http nhi likhnapdega khud hi le lega or sever bhi isko hamesh accesss de dega
      .then((response)=>{
          setJokes(response.data)
      })
      .catch((error)=>{
        console.log(error)
      }
    ) 
  },[jokes])
  return (
    <>
       <h1>Chai aur code with Hitesh sir</h1>
       <p>Jokes:{jokes.length}</p>
       {
        jokes.map((joke)=>{
         return <div key={joke.id}>
            <h3>{joke.title}</h3>
            <p>{joke.content}</p>
          </div>
        })
       }
    </>
  )
}

export default App
