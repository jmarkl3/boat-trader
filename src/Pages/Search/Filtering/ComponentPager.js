import React, { useEffect, useState } from 'react'
import "./ComponentPager.css"

function ComponentPager({usersArray, componentArray, defaultUpperRange}) {

    // const [pageRange, setPageRangeState] = useState([0, (profileData?.userType === "donor" ? 16:6)])
    const [pageRange, setPageRange] = useState([0, defaultUpperRange || 6])
    const [count, setCount] = useState(usersArray?.length)
    const [pagedComponents, setPagedComponents] = useState([])

    useEffect(()=>{
        setPageRangeValues()
        if(!componentArray || !Array.isArray(componentArray)) return
        pageComponents(componentArray)
        setCount(componentArray?.length)
    },[componentArray, pageRange])


    function pageComponents(componentArray){
        let tempPagedComponents = []
        componentArray.forEach((component, index) => {
            if(index >= pageRange[0] && index < pageRange[1])
                tempPagedComponents.push(component)
        })
        
        // setPagedUsers(x)
        setPagedComponents(tempPagedComponents)
    }
    function setPageRangeValues(){
        let startInput = document.getElementById("pageRangeStart")
        let endInput = document.getElementById("pageRangeEnd")
        if(startInput)
            startInput.value = pageRange[0]
        if(endInput)
            endInput.value = pageRange[1]
    }

    function pageNext(){
        let diff = pageRange[1] - pageRange[0]
        let newStart = pageRange[0] + diff
        let newEnd = pageRange[1] + diff
        if(newStart >= count)
            return
        setPageRange([newStart, newEnd])

        // Reset the scroll
        let appScroller = document.querySelector(".appScroller")
        if(appScroller)
            appScroller.scrollTo(0, 0)
    }
    function pageBack(){
        let diff = pageRange[1] - pageRange[0]
        let newStart = pageRange[0] - diff
        let newEnd = pageRange[1] - diff
        if(newStart < 0){
            newStart = 0
            newEnd = diff
        }
        setPageRange([newStart, newEnd])

        if(newStart == 0){
            let appScroller = document.querySelector(".appScroller")
            if(appScroller)
                appScroller.scrollTo(0, 0)
        }
    }
    function toStart(){
        setPageRange([0, 12])
    }
    function updatePageRange(){
        let start = document.getElementById("pageRangeStart").value
        let end = document.getElementById("pageRangeEnd").value
        try{
            start = parseInt(start)
            end = parseInt(end)

            // For invalid inputs
            if(isNaN(start))
                start = pageRange[0]
            if(isNaN(end))
                end = pageRange[1]
                
            if(start == pageRange[0] && end == pageRange[1]) return

            setPageRange([start, end])
        }catch(e){
            console.log("invalid page range input")
        }
    }
    return (
        <>
            <div className='pagerButtons' title={'Showing '+(pageRange[0] + 1)+' to '+ pageRange[1]+' of ' + count + ' results'}>
                <div>
                    <div title="Back" onClick={pageBack} className='rangeButton'>{"<"}</div>
                    {(pageRange[0] + 1) + " - " + pageRange[1] + " of " + count}
                    <div title="Next" onClick={pageNext} className='rangeButton'>{">"}</div>
                </div>
            </div>

            {pagedComponents}

            <div className='pagerButtons' title={'Showing '+(pageRange[0] + 1)+' to '+ pageRange[1]+' of ' + count + ' results'}>
                <div>
                    <div title="Back" onClick={pageBack} className='rangeButton'>{"<"}</div>
                    {(pageRange[0] + 1) + " - " + pageRange[1] + " of " + count}
                    <div title="Next" onClick={pageNext} className='rangeButton'>{">"}</div>
                </div>
            </div>
        </>
    )
}

ComponentPager.defaultProps = {
    userSelected: (userID)=>{console.log("User Selected: "+userID)},
}

export default ComponentPager