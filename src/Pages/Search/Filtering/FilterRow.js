import React, { useState } from 'react'

function FilterRow({children, imageSrc, title}) {

    const [open, setOpen] = useState()

  return (
    <div className='filterRow'>
        <div className='filterRowDescription' onClick={()=>setOpen(!open)}>
            <div className='filterRowImage'>
                <img src={imageSrc}></img>
            </div>
            <div className='filterRowTitle'>{title}</div>
            <div className='filterRowOpenButton' title={open ? "Close":"Open"}>
                {open ?
                    "△"
                    :
                    "▽"
                }
            </div>
        </div>
        {open &&
            <div className='filterRowInner'>
                {children}
            </div>
        }
    </div>
  )
}

export default FilterRow