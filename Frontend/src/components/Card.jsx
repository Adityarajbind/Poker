import React from 'react'

const Card = ({name,suit}) => {
  return (
    <div className='w-15  border  border-gray-600  rounded-sm' >
      <img src={`/Cards/${name}_of_${suit}.svg`} className='w-full h-full'/>
    </div>
  )
}

export default Card