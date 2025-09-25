import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Layout from './pages/Layout'
import Dashboard from './pages/Dashboard'
import WriteArticle from './pages/WriteArticle'
import Blogtitles from './pages/Blogtitles'
import GenerateImages from './pages/GenerateImages'
import Removebackground from './pages/Removebackground'
import Reviewresume from './pages/Reviewresume'
import Removeobject from './pages/Removeobject'
import Community from './pages/Community'
import { useAuth } from '@clerk/clerk-react'
import { useEffect } from 'react'


const App = () => {

  const {getToken} = useAuth();
  useEffect(()=>{
    getToken().then((token)=>console.log(token));
  },[])
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/ai" element={<Layout/>} >
          <Route index element={<Dashboard/>}/>
          <Route path="write-article" element={<WriteArticle/>}/>
          <Route path="blog-titles" element={<Blogtitles/>}/>
          <Route path="generate-images" element={<GenerateImages/>} />
          <Route path="remove-background" element={<Removebackground/>} />
          <Route path="review-resume" element={<Reviewresume/>} />
          <Route path="remove-object" element={<Removeobject/>} />
          <Route path="community" element={<Community/>} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
