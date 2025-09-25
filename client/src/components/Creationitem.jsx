import React, { useState } from 'react'
import Markdown from 'react-markdown'

const Creationitem = ({item}) => {
    const [expanded, setExpanded] = useState(false)
  return (
    <div  onClick={()=>setExpanded(!expanded)} className='p-4 max-w-5xl text-sm bg-white border
    border-gray-200 rounded-lg cursor-pointer'>
        <div className='flex items-center justify-between gap-4'>
            <div>
                <h2>
                    {item.prompt}
                </h2>
                <p>{item.type} - {new Date(item.created_at).toLocaleDateString()}</p>
            </div>
            <button className='bg-[#EFFGFF] border border-[#BFDBFE] text-[#1E40AF]
            px-4 py-1 rounded-full'>{item.type}</button>
        </div>
        {
            expanded && (
                <div>
                    {item.type === 'image' ? (
                        <div>
                            <img src ={item.content} alt="image" className='mt-3 w-full max-w-md'/>
                        </div>
                    ) : (
                        <div className='reset-tw'>
                            <Markdown>{item.content}</Markdown>
                            
                        </div>
                    )}
                </div>
            )
        }   
    </div>
  )
}

export default Creationitem
