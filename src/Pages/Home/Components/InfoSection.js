import React from 'react'

function InfoSection({reverseSides}) {
  return (
    <div className='homePageSection'>
        <div className='hInfoSection'>
            <div className='hInfoLeft' style={{float: reverseSides?"left":"right"}}>
                <div className='hilTitle'>Title</div>
                <div className='hilText'>This is some text</div>
                <button className='infoSectoinButton'>Button</button>
            </div>
            <div className='hInfoRight'></div>
        </div>
    </div>
  ) 
}

export default InfoSection