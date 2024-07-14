import React from 'react'
import { Link } from 'react-router-dom'
import "./Nav.css"
import logo from "../Media/autoTraderLogo.JPG"

function Topnav() {
  return (
    <div className='topNav'>
        <div className='topNavInner'>
            
            <Link className='topNavItem' to={"/"}>
                <div className='topNavLogo'><img src={logo}></img></div>
            </Link>
            <div className='topNavLinks'>
                <Link className='navItem' to={"search"}>Search</Link>
                <Link className='navItem' to={"create"}>Create a Listing</Link>
                <Link className='navItem' to={"account"}>Account</Link>
            </div>
        </div>
    </div>
  )
}

export default Topnav