import React, { useEffect, useImperativeHandle, useState } from 'react'
import Filter from './Filter'
import "./Search.css"
import {useSelector } from 'react-redux'
import PagedUsersComponent from './PagedUsersComponent'
import { sortUsers } from '../../Functions'

function Search({inAdminScreen, userApplicationState, inAdmin, selectUser}) {

  // The d profiles loaded on start in the LoadData component
  const searchableProfiles = useSelector(state => state.appSlice.searchableProfiles)
  const userID = useSelector(state => state.appSlice.userID)

  const [sortedUsersArray, setSortedUsersArray] = useState([])
  function setFilteredObject(filteredObject){

    let sortedUsers = sortUsers(filteredObject)
    setSortedUsersArray(sortedUsers)
  }

  return (
    <>
      <Filter setFilteredObject={setFilteredObject} object={searchableProfiles} inAdminScreen={inAdminScreen} userApplicationState={userApplicationState}></Filter>

      <div className='searchResultsTopBar'>Search</div>

      <div className='appScroller' id={'appScroller'+(userApplicationState?.userID || userID)}>
          <PagedUsersComponent usersArray={sortedUsersArray} selectUser={selectUser} inAdmin={inAdmin} userApplicationState={userApplicationState}></PagedUsersComponent>
      </div>
    </>
  )
}

export default Search