import React, { useEffect, useState } from 'react'
import "./Filter.css"
// import { useDispatch, useSelector } from 'react-redux'
import FilterRow from './FilterRow'
// General Images
import backIcon from "./FilterImages/backIconWhite.png"
// Filter Images
import filterIcon from "./FilterImages/filterIconWhite.png"
import ageIcon from "./FilterImages/calendarAgeIconGold.png"
import eyeIcon from "./FilterImages/eyeIconGold.png"
import sortIcon from "./FilterImages/sortIconGold.png"
import hairIcon from "./FilterImages/hairIconsGold.png"
import heightIcon from "./FilterImages/heightIconGold.png"
import idIcon from "./FilterImages/idIconGold.png"
import locationIcon from "./FilterImages/locationIconGold.png"
import accountIcon from "./FilterImages/accountIconGold.png"
// import { setShowFilter } from '../../Global/AppSlice'
import { objectsToArray } from '../../../Global/Functions'
// import { setshowUserFilter } from '../../Global/AppSlice'


function Filter({ object, setFilteredArray, userApplicationState}) {
    
    // const showFilter = useSelector(state => state.appSlice.showFilter)
    // const showFilter = useSelector(state => state.showFilter)
    const [showFilter, setShowFilter] = useState(false)
    
    // const dispatcher = useDispatch()

    const [filterFadeOn, setFilterFadeOn] = useState(true)
    const [showFilterRows, setShowFilterRows] = useState()
    // object with attribute values pairs. Keys are keys in the profile data that must include the value
    const [filterObject, setFilterObjectState] = useState((userApplicationState ? {userType: ["donor"]}:{}))
    const [sortAttribute, setSortAttribute] = useState("lastActive")
    const [sortReversed, setSortReversed] = useState(true)



    // ========================================
    // #region Display

    // Make sure it defaults to closed
    useEffect(()=>{
        // dispatcher(setshowUserFilter(false))
    },[])
    useEffect(()=>{
        filtersAnimation()
    },[showFilter])

    // Sets state to open or close the sidebar, display the content, and start fade in
    function openCloseFilterBox(e, onTitle){

        e.stopPropagation()

        let hasEffect
        // On the title bar it will alway open or close it
        if(onTitle)
            hasEffect = true
        // If its on the body of the filter bar it will only have an effect if the bar is closed
        else
            if(!showFilter)
                hasEffect = true
        if(!hasEffect) return

        // filtersAnimation()

        // dispatcher(setShowFilter(!showFilter))
        setShowFilter(!showFilter)
        
    }
    function filtersAnimation(){
        if(!showFilter){
            setShowFilterRows(false)
            setFilterFadeOn(true)
        }else{
            setTimeout(() => {
                setShowFilterRows(true)
            }, 300);
            setTimeout(() => {
                setFilterFadeOn(false)
            }, 350);
        }
    }

    // #endregion Display

    // ========================================
    // #region Filtering

    // If the users object loads or updates, or if the filterObject changes filter the users
    useEffect(()=>{
        filterAndSort(object)
    },[object, filterObject, sortAttribute, sortReversed])

    // Intercept the filter object state set to the userApplicatoinState can be updated
    function setFilterObjectFunction(newFilterObject){
        // console.log("newFilterObject")
        // console.log(newFilterObject)
        // dispatcher(updateApplicationState({filterObject: newFilterObject}))
        // let tempNewFilterObject = newFilterObject
        // if(userApplicationState)
        //     tempNewFilterObject.userType = ["donor"]
        // dispatcher(updateApplicationState({filterObject: newFilterObject}))

        setFilterObjectState(newFilterObject)
    }
    function filterAndSort(){
        let filteredSortedObjectTemp = filter(object)
        filteredSortedObjectTemp = sort(filteredSortedObjectTemp, sortAttribute)
        setFilteredArray(filteredSortedObjectTemp)
    }
    // Filter based on the input values
    function filter(){
        // The object contains all userData objects
        let filteredObject = {...object}
        // console.log("==========================object")
        // console.log(object)
        // console.log("filtering based on given object: ")
        // console.log(filterObject)

        // The filter object is an object of attribute: searchValue pairs 
        Object.entries(filterObject).forEach(([attribute, value]) => {            
            filteredObject = filterIncludes2(filteredObject, attribute, value)
        })

        return filteredObject

    }
    function sort(object, attribute) {

        // Return the array as is if there's no valid attribute to sort by
        if (!attribute || typeof attribute !== 'string' || attribute.replaceAll(" ", "") === "") {
            return objectsToArray(object);
        }
    
        // Sort the array based on the attribute, placing objects without the attribute at the end
        const sortedArray = objectsToArray(object).sort((a, b) => {
            // Check if either object does not have the attribute
            const aHasAttribute = a.hasOwnProperty(attribute);
            const bHasAttribute = b.hasOwnProperty(attribute);
    
            // If both have the attribute, compare them normally
            if (aHasAttribute && bHasAttribute) {
                if(sortReversed){
                    if (a[attribute] > b[attribute]) {
                        return -1;
                    }
                    if (a[attribute] < b[attribute]) {
                        return 1;
                    }
                }else{
                    if (a[attribute] < b[attribute]) {
                        return -1;
                    }
                    if (a[attribute] > b[attribute]) {
                        return 1;
                    }
                }
                // a must be equal to b
                return 0;
            }
    
            // If only a has the attribute, it comes first
            if (aHasAttribute && !bHasAttribute) {
                return -1;
            }
    
            // If only b has the attribute, it comes first
            if (!aHasAttribute && bHasAttribute) {
                return 1;
            }
    
            // If neither has the attribute, they are considered equal in terms of sorting
            return 0;
        });
    
        return sortedArray;
    }
    
    // Return an object filtered based on the filterObject
    function filterIncludes2(objectToFilter, attribute, searchValue){
        // console.log("allUsersObject "+attribute)
        // console.log(allUsersObject)

        let tempResultsObject = {}
        Object.entries(objectToFilter).forEach(([objectID, objectData]) => {

            // if(userID === "v9euCYVZG6MtMdx6JqD0SXtDmD53")
            //  console.log("looking at v9euCYVZG6MtMdx6JqD0SXtDmD53")
            // if(userData?.profileData?.userType === "donor")
            // tempResultsObject[userID] = userData

            // Get the profile data
            // let profileData = userData?.profileData
            // If there is no profile data for this user return (they will be omited from the filtered list)            
            // if(!profileData) return

            // When the filter value is a string see if the profile data contains the value
            if(typeof searchValue === "string") {
                // If the filter value is an empty string add the user even if they have no value for that attribute
                if(searchValue.replaceAll(" ","") === ""){
                    tempResultsObject[objectID] = objectData
                }else{
                    // If the user has no valid data for that attribute value pair omit them from the results
                    if(!objectData?.[attribute]) return

                    if(attribute.includes("!")){
                        // If the user has a value for that attribute that includes the search value include them in the results
                        if(!objectData?.[attribute]?.toLowerCase().includes(searchValue.toLowerCase()))
                            tempResultsObject[objectID] = objectData
                    }
                    else
                        // If the user has a value for that attribute that includes the search value include them in the results
                        if(objectData?.[attribute]?.toLowerCase().includes(searchValue.toLowerCase()))
                            tempResultsObject[objectID] = objectData

                }
            }

            // If the filter value is an array see if the profile data has any of those values in it
            if(Array.isArray(searchValue)){

                let profileDataContains = false
                searchValue.forEach(value => {
                    // If filter is excluding the string
                    if(value.includes("!")){
                        // If the user has a value for that attribute and it includes the search term add them to the results
                        if(!objectData?.[attribute] || !objectData?.[attribute].toLowerCase().includes(value.replaceAll("!","").toLowerCase()))
                            profileDataContains = true
                    }
                    // If filter is including the string
                    else{
                        // If the user has a value for that attribute and it includes the search term add them to the results
                        if(objectData?.[attribute] && objectData?.[attribute].toLowerCase().includes(value.toLowerCase()))
                            profileDataContains = true
                    }

                    // If one of the values is any include all users regardless if the value matches or if there even is a value
                    if(value === "any")
                        profileDataContains = true
                })
                // If the profile data contained one of the values in the array add the user object to the search results 
                // profileDataContains = true
                if(profileDataContains)
                    tempResultsObject[objectID] = objectData

            }
            // If the value is an object it contains min max data
            else if(typeof searchValue === "object"){
                // console.log("parsing min max value for attribute " + attribute)
                // console.log("object of objects:")
                // console.log(searchValue)

                // If its an empty object add the user
                if(Object.entries(searchValue).length == 0){
                    tempResultsObject[objectID] = objectData
                    return
                }

                // Find the lowest min (or any) and higest max (or any) 
                let parsedMinMaxValuesObject = {min: null, max: null}
                Object.entries(searchValue).forEach(([minMaxObjectName, minMaxObject]) => {
                    // console.log("looking at min max value object: ")
                    // console.log(minMaxObject)
                    // If there is a min value in this minMaxObject
                    if(minMaxObject.min){
                        // If the new or existing value is any set the saved value to any 
                        if(minMaxObject.min === "any" || parsedMinMaxValuesObject.min === "any")
                            parsedMinMaxValuesObject.min = "any"

                        // If no min value has been set use this one
                        if(!parsedMinMaxValuesObject.min){
                            // console.log("added min value: "+minMaxObject.min)
                            parsedMinMaxValuesObject.min = minMaxObject.min
                        }
                        // If there is already a min value check to see if this min value is lower
                        else{
                            if(minMaxObject.min < parsedMinMaxValuesObject.min && parsedMinMaxValuesObject.min !== "any")
                                parsedMinMaxValuesObject.min = minMaxObject.min
                        }
                    }
                    // If there is a max value in this minMaxObject
                    if(minMaxObject.max){
                        // If the new or existing value is any set the saved value to any 
                        if(minMaxObject.max === "any" || parsedMinMaxValuesObject.max === "any")
                            parsedMinMaxValuesObject.max = "any"

                        // If no max value has been set use this one
                        else if(!parsedMinMaxValuesObject.max)
                            parsedMinMaxValuesObject.max = minMaxObject.max
                        // If there is already a max value check to see if this max value is higher
                        else{
                            if(minMaxObject.max > parsedMinMaxValuesObject.max)
                                parsedMinMaxValuesObject.max = minMaxObject.max
                        }

                    }
                })

                // If no min value was found set it to any
                if(!parsedMinMaxValuesObject.min)
                    parsedMinMaxValuesObject.min = "any"
                // If no max value was found set it to any
                if(!parsedMinMaxValuesObject.max)
                    parsedMinMaxValuesObject.max = "any"

                // console.log("====================")
                // console.log("parsedMinMaxValuesObject:")
                // console.log(parsedMinMaxValuesObject)

                // If both values are any add the user even if they have no data at that attribute
                if(parsedMinMaxValuesObject.min === "any" && parsedMinMaxValuesObject.max === "any")
                    tempResultsObject[objectID] = objectData

                // If the user has no value at this attribute don't add them to the filtered results
                if(!objectData[attribute]){

                    return
                }

                // If the users value for that attribute is between min and max add the user
                let userValue = objectData[attribute]
                let isAboveMin, isBelowMax
                if(parsedMinMaxValuesObject.min === "any")
                    isAboveMin = true
                if(userValue >= parsedMinMaxValuesObject.min)
                    isAboveMin = true
                if(parsedMinMaxValuesObject.max === "any")
                    isBelowMax = true
                if(userValue <= parsedMinMaxValuesObject.max)
                    isBelowMax = true

                // console.log(userValue+" >= "+parsedMinMaxValuesObject.min+": "+(userValue >= parsedMinMaxValuesObject.min))
                // console.log(userValue+" <= "+parsedMinMaxValuesObject.max+": "+(userValue <= parsedMinMaxValuesObject.max))

                if(isAboveMin && isBelowMax)
                    tempResultsObject[objectID] = objectData

                // If the users value for that attribute is between min and max add the user
                
                //tempResultsObject[userID] = userData

            }


        })

        // console.log("tempResultsObject")
        // console.log(tempResultsObject)

        return tempResultsObject

    }
    // Add a string filter to the filterObject
    function updateFilterAttribute(e, filterAttribute){

        let value = e?.target?.value
        let tempFilterObject = {...filterObject}
        // When the value is removed remove it from the filter list
        if(value === "" || value?.toLowerCase().includes("select") || value === "any")
            delete tempFilterObject[filterAttribute]
        // Else add the attribute and value
        else
            tempFilterObject[filterAttribute] = value

        // console.log("updateFilterAttribute")
        // console.log(tempFilterObject)
        // dispatcher(updateApplicationState({filterVallues: tempFilterObject}))

        setFilterObjectFunction(tempFilterObject)

    }
    // Updates the filterObject based on checkbox input. 
    /*
        Updates the filterObject based on checkbox input. 
        Takes click event, value (ex: brown), filter attribute (ex: hairColor)
        Adds or removes strings from an array (filter function will see if any of those is at the filter attribute in user data)
    */
    function updateFilterArray(e, value, filterAttribute){
        let add = e?.target?.checked
        //console.log("updateFilterArray. add: "+add+"filterAttribute: "+filterAttribute+" value: "+ value)
        let tempFilterObject = {...filterObject}
        if(add){
            // If there is no array there create it
            if(!Array.isArray(tempFilterObject[filterAttribute]))
                tempFilterObject[filterAttribute] = []
            tempFilterObject[filterAttribute].push(value)
        }else{
            // If theres no array there already no action is needed
            if(!Array.isArray(tempFilterObject[filterAttribute]))
                return
            // Get the index of the value
            const index = tempFilterObject[filterAttribute].indexOf(value)
            // If the value is in the array remove it
            if(index >= 0)
                tempFilterObject[filterAttribute].splice(index, 1)
            // If the array is not empty remove it
            if(Array.isArray(tempFilterObject[filterAttribute]) && tempFilterObject[filterAttribute].length == 0)
                delete tempFilterObject[filterAttribute]
        }

        // Set the new filter object so the filter function will update and filter based on the values
        setFilterObjectFunction(tempFilterObject)

    }
    // update the updateFilterObject based on input
    /**
     * @param {*} e = the click even that will be used to get the value of the input (checked boolean || string)
     * @param {*} optionName = the name of the object. ex: ageMin, height1, height2
     * @param {*} minMaxObject = the object containing the min/max values. ex: {min: 67, max: 69} 
     * @param {*} filterAttribute = the name of the attribute this min max value will filter for. ex: age
     * 
     * The filter object will contain: attribute: {
     *  name: {min: minValue, max: maxValue},
     *  name: {min: minValue, max: maxValue},
     * }
     * 
     * examples: 
     * 
     * Inputs:
     * optionName: ageMin
     * minMaxObject: {min: 20}
     * filterAttribute: age
     * 
     * Added to filter object like this:
     * filterObject: {
     *  age: {
     *      ageMin: {min: 20}, (newly added)
     *      ageMax: {max: 40}, (was already in filter object)
     *  }
     * }
     * This will be parsed into an object in the filter function like this: 
     *   {min: 20, max: 40}
     * 
     * Inputs:
     * optionName: height2
     * minMaxObject: {min: 67, max: 69}
     * filterAttribute: height
     * 
     * filterObject: {
     *  height: {
     *    height2: {min: 67, max: 69}, (newly added)
     *    height3: {min: 70, max: 72}, (was already in filter object)
     *  }
     * }
     * This will be parsed into an object in the filter function like this:
     *   {min: 67, max: 72}

    */
    function updateFilterObject(e, optionName, minMaxObject, filterAttribute){

        // Create a local copy of the filter object and ensure it has a valid structure for this function call
        let tempFilterObject = {...filterObject}
        if (!tempFilterObject)
            tempFilterObject = {}
        if(!tempFilterObject[filterAttribute])
            tempFilterObject[filterAttribute] = {}

        if(e?.target?.type === "checkbox"){
            // And it has been checked
            if(e.target.checked){
                // console.log("attribute: "+filterAttribute+" option: "+optionName+" adding min max object: ")
                // console.log(minMaxObject)
                // add the object with min/max values
                tempFilterObject[filterAttribute][optionName] = minMaxObject
            }
            // And it has been unchecked
            else{
                // console.log("attribute: "+filterAttribute+" option: "+optionName+" removing min max object: ")
                // console.log(minMaxObject)
                // remove those values from the object (remove values at option value)
                if(tempFilterObject[filterAttribute][optionName])
                    delete tempFilterObject[filterAttribute][optionName]
            }
        }
        // If the event came from a string input (the min max value has already been set from where the function was called)
        else{
            // console.log("attribute: "+filterAttribute+" option: "+optionName+" adding min max object: ")
            // console.log(minMaxObject)

            // if the string is empty for any of them either handle that in filter function or add any flag here
            tempFilterObject[filterAttribute][optionName] = minMaxObject
        }

        // dispatcher(updateApplicationState({filterObject: tempFilterObject}))
        
        setFilterObjectFunction(tempFilterObject)
    }
    // Used for getting value from the filterObject so they can be displayed in the inpus when the menu opens and closes
    /**
     * Look through filterObject to see get the value of the input or return a boolean for checked / unchecked 
     * @param {*} attribute The attribute that would be in the filter object
     * @param {*} name The name of the checkbox if it is a min max
     */
    function getFilterInputValue(attribute, name){
        if(!attribute) return
        
        if(typeof filterObject !== "object")
            return 
        // The default value of the input (string or boolean)
        let returnValue
        // Look at each item in the filter object (the object of things the users are filtered by)
        Object.entries(filterObject).forEach(([filterAttribute, filterValue]) => {
            // If this is the attribute we are looking for
            if(attribute === filterAttribute){
                // console.log("found "+filterAttribute)
                // If the filter value is a string this is on an input fild and the return value is the string value
                if(typeof filterValue === "string")
                    returnValue = filterValue
                // If the filter value is an array it is an array of possible values, each associated with a checkbox. If the value corresponds with the checkbox this is in return true to show that the box is checked
                else if(Array.isArray(filterValue)){
                    // Look through each string in the array, if the string === name parameter return value is true
                    filterValue.forEach(nameString => {
                        if(nameString === name)
                            returnValue = nameString
                    })
                }
                else if(typeof filterValue === "object"){
                    // Look at each filter value object name, if that name matches the name parameter return value is true
                    Object.entries(filterValue).forEach(([flilterValueNameString, filterValueMinMaxObject]) => {
                        if(flilterValueNameString === name)
                            returnValue = filterValueMinMaxObject?.min || filterValueMinMaxObject?.max
                    })
                }
            }
        })

        return returnValue
    }
    // Reset the filter object and all inputs
    function resetAllFilters(){
        // Reset the filter object so no filters are applied to the user search
        setFilterObjectFunction({})

        // Reset the inputs that are showing
        // Use document.querySelector(".className") to get all visible filter row inputs inputs
        let inputArray = document.querySelectorAll(".filterRowInput")
        inputArray.forEach(input => {
            // If it is a text fiels reset the value to an empty string
            if(input.type === "text")
                input.value = ""
            // If it is a checkbox set it to unchecked
            if(input.type === "checkbox")
                input.checked = false
            // If it is a selctor select the top option (so it says "Select One")
            if(input.type === "select-one"){
                if(Array.isArray(input?.options))
                    input.value = input?.options[0].value
            }
        })

    }

    // #endregion Filter

  return (
    <div className={'filterBar ' + (showFilter ? "filterBarOpen":"")} onClick={openCloseFilterBox}>
        
        <div className='filterBoxTop filterBoxTopMobile' onClick={e=>openCloseFilterBox(e, true)}>
            {/* {showFilter &&  */}
                <div className={'filtersTitle '+(filterFadeOn ? " filtersTitleRotated":" ")}>
                {/* <div className={'filtersTitle '+(filterFadeOn ? " ":" filtersTitleRotated")+(filterFadeOn ? " fade ":"")}> */}
                    <div className={filterFadeOn ? " filtersTitleRotatedInner":" "}>
                    Filters
                    </div>
                </div>
            {/* } */}
            <div className='filterBarButton filterBarButtonMobile' title={showFilter ? "Hide Filter":"Show Filter"}>
                {showFilter ?
                    <img src={backIcon}></img>
                    :
                    <img src={filterIcon}></img>
                }
            </div>
        </div>
        {showFilterRows && 
            <div className={'filtersBox '+(filterFadeOn ? " fade ":"")}>

                {/* Sort By */}

                <FilterRow
                    title={"Sort By"}
                    imageSrc={sortIcon}
                >
                    <input 
                        className='filterRowInput'              
                        onChange={e=>setSortAttribute(e.target.value)} 
                        defaultValue={sortAttribute}
                    ></input>

                    <div className='filterCheckRow' >
                        <input 
                            type='checkbox' 
                            className='checkBox filterRowInput' 
                            onChange={(e)=>setSortReversed(e.target.checked)}
                            defaultChecked={sortReversed}
                        ></input>
                        <div className='filterCheckRowText'>
                            Reverse Sort
                        </div>
                    </div>
                </FilterRow>

                {/* Location */}

                <FilterRow
                    title={"Location"}
                    imageSrc={locationIcon}
                >
                    {/* <input placeholder='Miles From (ex: 100)'></input>
                    <input placeholder='Zip Code' onChange={zipCodeUpdate} id="zipCodeInput"></input>
                    <div>or</div> */}
                    {/* <input placeholder='Country'></input> */}
                    {/* <input placeholder='State'></input> */}
                    {/* <select onChange={e=>updateFilterAttribute(e, "state")} className='filterRowInput' defaultValue={getFilterInputValue("state", null)}>
                        <option value={"any"}>Select State</option>
                        <option>Alabama</option>
                        <option>Alaska</option>
                        <option>Arizona</option>
                        <option>Arkansas</option>
                        <option>California</option>
                        <option>Colorado</option>
                        <option>Connecticut</option>
                        <option>Delaware</option>
                        <option>Florida</option>
                        <option>Georgia</option>
                        <option>Hawaii</option>
                        <option>Idaho</option>
                        <option>Illinois</option>
                        <option>Indiana</option>
                        <option>Iowa</option>
                        <option>Kansas</option>
                        <option>Kentucky</option>
                        <option>Louisiana</option>
                        <option>Maine</option>
                        <option>Maryland</option>
                        <option>Massachusetts</option>
                        <option>Michigan</option>
                        <option>Minnesota</option>
                        <option>Mississippi</option>
                        <option>Missouri</option>
                        <option>Montana</option>
                        <option>Nebraska</option>
                        <option>Nevada</option>
                        <option>New Hampshire</option>
                        <option>New Jersey</option>
                        <option>New Mexico</option>
                        <option>New York</option>
                        <option>North Carolina</option>
                        <option>North Dakota</option>
                        <option>Ohio</option>
                        <option>Oklahoma</option>
                        <option>Oregon</option>
                        <option>Pennsylvania</option>
                        <option>Rhode Island</option>
                        <option>South Carolina</option>
                        <option>South Dakota</option>
                        <option>Tennessee</option>
                        <option>Texas</option>
                        <option>Utah</option>
                        <option>Vermont</option>
                        <option>Virginia</option>
                        <option>Washington</option>
                        <option>West Virginia</option>
                        <option>Wisconsin</option>
                        <option>Wyoming</option>
                    </select> */}
                    <select onChange={e=>updateFilterAttribute(e, "country")} className='filterRowInput' defaultValue={getFilterInputValue("country", null)} key={"filterItem"+(filterObject && Object.entries(filterObject).length)}>
                        <option value={"any"}>Select Country</option>
                        <option>USA</option>
                        <option>UK</option>
                        <option>Ireland</option>
                        <option>Australia</option>
                        <option>Canada</option>
                    </select>
                    {/* <input placeholder='City'  onChange={e=>updateFilterAttribute(e, "city")}></input> */}
                </FilterRow>

                {/* Age */}

                <FilterRow
                    title={"Age"}
                    imageSrc={ageIcon}
                >
                    <input         
                        className='filterRowInput'                
                        placeholder='Min' 
                        onChange={e=>updateFilterObject(e, "ageMin", {min: e?.target?.value}, "age")}
                        defaultValue={getFilterInputValue("age", "ageMin")}
                    ></input>
                    <input           
                        className='filterRowInput'              
                        placeholder='Max' 
                        onChange={e=>updateFilterObject(e, "ageMax", {max: e?.target?.value}, "age")}
                        defaultValue={getFilterInputValue("age", "ageMax")}
                    ></input>
                </FilterRow>
                
                {/* Name */}

                <FilterRow
                    title={"Name"}
                    imageSrc={idIcon}
                >
                    <input 
                        className='filterRowInput'              
                        onChange={e=>updateFilterAttribute(e, "name")} 
                        defaultValue={getFilterInputValue("name")}
                    ></input>
                </FilterRow>

                {/* Height */}

                <FilterRow
                    title={"Height"}
                    imageSrc={heightIcon}
                >
                    <div className='filterCheckRow'>
                        <input 
                            type='checkbox' 
                            className='checkBox filterRowInput' 
                            onChange={e=>updateFilterObject(e, "heightAny", {min: "any", max: "any"}, "height")}
                            defaultChecked={getFilterInputValue("height", "heightAny")}
                        ></input>
                        <div className='filterCheckRowText'>
                            Any
                        </div>
                    </div>
                    <div className='filterCheckRow'>
                        <input 
                            type='checkbox' 
                            className='checkBox filterRowInput' 
                            onChange={e=>updateFilterObject(e, "height1", {min: "any", max: 66}, "height")}
                            defaultChecked={getFilterInputValue("height", "height1")}
                        ></input>
                        <div className='filterCheckRowText'>
                            5'6" or -
                        </div>
                    </div>
                    <div className='filterCheckRow'>
                        <input                             
                            type='checkbox' 
                            className='checkBox filterRowInput' 
                            onChange={e=>updateFilterObject(e, "height2", {min: 67, max: 69}, "height")}
                            defaultChecked={getFilterInputValue("height", "height2")}
                        ></input>
                        <div className='filterCheckRowText'>
                            5'7" - 5'9"
                        </div>
                    </div>
                    <div className='filterCheckRow'>
                        <input 
                            type='checkbox' 
                            className='checkBox filterRowInput' 
                            onChange={e=>updateFilterObject(e, "height3", {min: 70, max: 72}, "height")}
                            defaultChecked={getFilterInputValue("height", "height3")}
                        ></input>
                        <div className='filterCheckRowText'>
                            5'10" - 6'0"
                        </div>
                    </div>
                    <div className='filterCheckRow'>
                        <input 
                            type='checkbox' 
                            className='checkBox filterRowInput' 
                            onChange={e=>updateFilterObject(e, "height4", {min: 73, max: "any"}, "height")}
                            defaultChecked={getFilterInputValue("height", "height4")}
                        ></input>
                        <div className='filterCheckRowText'>
                            6'1" or +
                        </div>
                    </div>
                </FilterRow>

                {/* Eye Color */}

                <FilterRow
                    title={"Eye Color"}
                    imageSrc={eyeIcon}
                >
                    <div className='filterCheckRow' >
                        <input 
                            type='checkbox' 
                            className='checkBox filterRowInput' 
                            onChange={(e)=>updateFilterArray(e, "any", "eyeColor")}
                            defaultChecked={getFilterInputValue("eyeColor", "any")}
                        ></input>
                        <div className='filterCheckRowText'>
                            Any
                        </div>
                    </div>
                    <div className='filterCheckRow'>
                        <input 
                            type='checkbox' 
                            className='checkBox filterRowInput' 
                            onChange={(e)=>updateFilterArray(e, "blue", "eyeColor")}
                            defaultChecked={getFilterInputValue("eyeColor", "blue")}
                        ></input>
                        <div className='filterCheckRowText'>
                            Blue
                        </div>
                    </div>
                    <div className='filterCheckRow'>
                        <input 
                            type='checkbox' 
                            className='checkBox filterRowInput' 
                            onChange={(e)=>updateFilterArray(e, "green", "eyeColor")}
                            defaultChecked={getFilterInputValue("eyeColor", "green")}
                        ></input>
                        <div className='filterCheckRowText'>
                            Green
                        </div>
                    </div>
                    <div className='filterCheckRow'>
                        <input 
                            type='checkbox' 
                            className='checkBox filterRowInput' 
                            onChange={(e)=>updateFilterArray(e, "hazel", "eyeColor")}
                            defaultChecked={getFilterInputValue("eyeColor", "hazel")}
                        ></input>
                        <div className='filterCheckRowText'>
                            Hazel
                        </div>
                    </div>
                    <div className='filterCheckRow' >
                        <input 
                            type='checkbox' 
                            className='checkBox filterRowInput' 
                            onChange={(e)=>updateFilterArray(e, "brown", "eyeColor")}
                            defaultChecked={getFilterInputValue("eyeColor", "brown")}
                        ></input>
                        <div className='filterCheckRowText'>
                            Brown
                        </div>
                    </div>
                </FilterRow>

                {/* Hair Color */}

                <FilterRow
                    title={"Hair Color"}
                    imageSrc={hairIcon}
                >
                    <div className='filterCheckRow'>
                        <input 
                            type='checkbox' 
                            className='checkBox filterRowInput' 
                            onChange={(e)=>updateFilterArray(e, "any", "hairColor")}
                            defaultChecked={getFilterInputValue("hairColor", "any")}
                        ></input>
                        <div className='filterCheckRowText'>
                            Any
                        </div>
                    </div>
                    <div className='filterCheckRow' >
                        <input 
                            type='checkbox' 
                            className='checkBox filterRowInput' 
                            onChange={(e)=>updateFilterArray(e, "brown", "hairColor")}
                            defaultChecked={getFilterInputValue("hairColor", "brown")}
                        ></input>
                        <div className='filterCheckRowText'>
                            Brown
                        </div>
                    </div>
                    <div className='filterCheckRow'>
                        <input 
                            type='checkbox' 
                            className='checkBox filterRowInput' 
                            onChange={(e)=>updateFilterArray(e, "blonde", "hairColor")}
                            defaultChecked={getFilterInputValue("hairColor", "blonde")}
                        ></input>
                        <div className='filterCheckRowText'>
                            Blonde
                        </div>
                    </div>
                    <div className='filterCheckRow'>
                        <input 
                            type='checkbox' 
                            className='checkBox filterRowInput'
                            onChange={(e)=>updateFilterArray(e, "red", "hairColor")} 
                            defaultChecked={getFilterInputValue("hairColor", "red")}
                        ></input>
                        <div className='filterCheckRowText'>
                            Red
                        </div>
                    </div>
                    <div className='filterCheckRow'>
                        <input 
                            type='checkbox' 
                            className='checkBox filterRowInput' 
                            onChange={(e)=>updateFilterArray(e, "black", "hairColor")}
                            defaultChecked={getFilterInputValue("hairColor", "black")}
                        ></input>
                        <div className='filterCheckRowText'>
                            Black
                        </div>
                    </div>
                </FilterRow>
                {/* {(userProfileData?.userType === "donor") && */}

                    <>

                        {/* User Type */}

                        <FilterRow
                            title={"User Type"}
                            imageSrc={accountIcon}
                        >
                            <div className='filterCheckRow'>
                                <input 
                                    type='checkbox' 
                                    className='checkBox filterRowInput' 
                                    // onChange={(e)=>updateFilterArray(e, "brown", "hairColor")}
                                    // defaultChecked={getFilterInputValue("hairColor", "brown")}
                                    onChange={(e)=>updateFilterArray(e, "donor", "userType")}
                                    defaultChecked={getFilterInputValue("userType", "donor")}
                                ></input>
                                <div className='filterCheckRowText'>
                                    Donor
                                </div>
                            </div>
                            <div className='filterCheckRow'>
                                <input 
                                    type='checkbox' 
                                    className='checkBox filterRowInput' 
                                    onChange={(e)=>updateFilterArray(e, "!donor", "userType")}
                                    defaultChecked={getFilterInputValue("userType", "!donor")}
                                ></input>
                                <div className='filterCheckRowText'>
                                    User
                                </div>
                            </div>
                            <div className='filterCheckRow' >
                                <input 
                                    type='checkbox' 
                                    className='checkBox filterRowInput'
                                    onChange={(e)=>updateFilterArray(e, "any", "userType")}
                                    defaultChecked={getFilterInputValue("userType", "any")}
                                ></input>
                                <div className='filterCheckRowText'>
                                    Any
                                </div>
                            </div>
                        </FilterRow>

                        {/* Note */}

                        <FilterRow
                            title={"Note"}
                            imageSrc={idIcon}
                        >
                            <input 
                                className='filterRowInput'              
                                onChange={e=>updateFilterAttribute(e, "note")} 
                                defaultValue={getFilterInputValue("note")}
                            ></input>
                        </FilterRow>

                    </>
                {/* } */}
                <div className='filterRow'>
                    <button className='filterRowButton' onClick={resetAllFilters}>Reset All</button>
                </div>
            </div>
        }
    </div>
  )
}
Filter.defaultProps = {
    setFilteredObject: (object) => {console.log("Filterd object:"); console.log(object)}

}
export default Filter