import React from 'react'
import Search from './Search'
import { useDispatch } from 'react-redux'
import { setViewProfileID } from '../../GlobalState/AppSlice'
import Navbar2 from '../NavBar/Navbar2'

function SearchPage({userApplicationState}) {

    const dispatcher = useDispatch()

    function selectUser(userID){
      dispatcher(setViewProfileID(userID))
    }

  return (
    <>
        <Navbar2 userApplicationState={userApplicationState}></Navbar2>
        <div className='searchPage'>
            <Search selectUser={selectUser} userApplicationState={userApplicationState}></Search>
        </div>
    </>
  )
}

export default SearchPage