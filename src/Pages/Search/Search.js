import React, { useState } from 'react'
import Filter from './Filtering/Filter'

function Search() {

  const [filteredArray, setFilteredArray] = useState([])

  return (
    <div>
      <Filter object={{}} setFilteredArray={setFilteredArray} ></Filter>
    </div>
  )
}

export default Search