import React from 'react'
import Banner from './Components/Banner'
import "./Home.css"
import TilesSection from './Components/TilesSection'
import InfoSection from './Components/InfoSection'

function Home() {
  return (
    <div className='homePage'>
        <Banner></Banner>
        <TilesSection></TilesSection>
        <InfoSection></InfoSection>
        <TilesSection tyleType='tile2'></TilesSection>
        <InfoSection reverseSides></InfoSection>
        <TilesSection tyleType='tile2'></TilesSection>
    </div>
  )
}

export default Home