import React from 'react'
import { Link } from 'react-router-dom'
import logo from "../Media/autoTraderLogo.JPG"
import "./Nav.css"

function BottomNav() {
  return (
    <div className='homePageSection'>
      <div className='bottomNav'>
          <Link to={"/"}>
            <img src={logo} className='topNavLogo'></img>
          </Link>
          <div>
            <div className='bnLinksSection'>
              <Link to={"search"} className='navItem bottomNavItem'>Search</Link>
              <Link to={"create"} className='navItem bottomNavItem'>Create</Link>
              <Link to={"account"} className='navItem bottomNavItem'>Account</Link>
            </div>
            <div className='bnLinksSection'>
              <Link to={"search"} className='navItem bottomNavItem'>Search</Link>
              <Link to={"create"} className='navItem bottomNavItem'>Create</Link>
              <Link to={"account"} className='navItem bottomNavItem'>Account</Link>
            </div>
            <div className='bnLinksSection'>
              <Link to={"search"} className='navItem bottomNavItem'>Search</Link>
              <Link to={"create"} className='navItem bottomNavItem'>Create</Link>
              <Link to={"account"} className='navItem bottomNavItem'>Account</Link>
            </div>
          </div>
      </div>
    </div>
  )
}

export default BottomNav