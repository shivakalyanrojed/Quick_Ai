import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Layout from './pages/Layout'
import Dashboard from './pages/Dashboard'
import WriteArticle from './pages/WriteArticle'
import Blogtitles from './pages/Blogtitles'
import GenerateImages from './pages/GenerateImages'
import Removebackground from './pages/Removebackground'
import Removeobject from './pages/Removeobject'
import Community from './pages/Community'
import { useAuth } from '@clerk/clerk-react'
import { useEffect } from 'react'
import axios from 'axios'
import {Toaster} from 'react-hot-toast';


const App = () => {
  return (
    <div>
      <Toaster />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/ai" element={<Layout/>} >
          <Route index element={<Dashboard/>}/>
          <Route path="write-article" element={<WriteArticle/>}/>
          <Route path="blog-titles" element={<Blogtitles/>}/>
          <Route path="generate-images" element={<GenerateImages/>} />
          <Route path="remove-background" element={<Removebackground/>} />
          <Route path="remove-object" element={<Removeobject/>} />
          <Route path="community" element={<Community/>} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
