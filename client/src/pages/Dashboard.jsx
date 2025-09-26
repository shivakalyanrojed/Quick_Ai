import React, { useEffect, useState } from 'react'
import Layout from './Layout'
import { dummyCreationData } from '../assets/assets'
import { Gem, Sparkle, Sparkles } from 'lucide-react'
import { Protect, useAuth } from '@clerk/clerk-react'
import Creationitem from '../components/Creationitem'
import axios from 'axios'
import toast from 'react-hot-toast'
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Dashboard = () => {
  const [creations,setCreations] = useState([])
  const [loading,setLoading]=useState(true);
  const {getToken}=useAuth();
  const getDashboarddata = async () => {
    try {
      const {data} = await axios.get('/api/user/get-user-creations',{
        headers: {
          Authorization: `Bearer ${await getToken()}`
        }
      });
      if (data.success){
        setCreations(data.creations)
      }else{
        toast.error(data.message);
      }
      setLoading(false);  
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  }

  useEffect(() => {
    getDashboarddata()
},[])
  return (
    <div className='h-full overflow-y-scroll p-6'>
      <div className='flex justify-start gap-4 flex-wrap '>
        <div className='flex justify-between items-center w-72 p-4 px-6 bg-white rounded-lx
        border border-gray-200'>
          <div className='text-slate-600'>
            <p className='text-sm'>Total Creations</p>
            <h2 className='text-xl font-semibold'>{creations.length}</h2>
          </div>
          <div className='w-10 h-10 rounded-lg bg-gradient-to-br from-[#3588F2] to-[#0BB0D7]
           text-white flex items-center justify-center'>
            <Sparkles className='w-5 text-white'/>
          </div>
        </div>


        <div className='flex justify-between items-center w-72 p-4 px-6 bg-white rounded-lx
        border border-gray-200'>
          <div className='text-slate-600'>
            <p className='text-sm'>Active Plan</p>
            <h2 className='text-xl font-semibold'>
              <Protect plan='premium' fallback="Free">
                Premium
              </Protect>
            </h2>
          </div>
          <div className='w-10 h-10 rounded-lg bg-gradient-to-br from-[#FF61C5] to-[#9E53EE]
           text-white flex items-center justify-center'>
            <Gem className='w-5 text-white'/>
          </div>
        </div>

      </div>
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <span className='w-10 h-10 my-1 rounded-full border-3 border-primary border-t-transparent animate-spin'></span>
        </div>
      ):(
        <div className='space-y-3'>
        <p className='mt-6 mb-4'>Recent Creation</p>
      {
        creations.map((item)=> <Creationitem key={item.id} item={item}/>)
      }
      </div>
      )
      }
    

    </div>
  )
}

export default Dashboard
