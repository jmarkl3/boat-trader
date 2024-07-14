import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { readableDateString } from '../../Functions'
import { setAdminEditUserID, setChatUserID, setShowChat, setViewProfileID } from '../../GlobalState/AppSlice'
import { Link } from 'react-router-dom'
import menuIcon from "../../Media/menu icon 2 blue.png"
import chatIcon from "../../Media/chatIconBlue.png"
import { isMobile } from 'react-device-detect'

function UserTile({profileData, tileUserID}) {
  const userID = useSelector(state => state.appSlice.userID)
  const userProfileData = useSelector(state => state.appSlice.profileData)  
  const dispatcher = useDispatch()

  function openChat(){
    dispatcher(setChatUserID(tileUserID))
    dispatcher(setShowChat(true))
  }

  return (
    <>
      <div 
        className={'userTile '+(isMobile ? "":" userTileDesktop")} 
        onClick={()=>dispatcher(setViewProfileID(tileUserID))} 
        key={userID}
        title={userProfileData?.userType === "donor" ? (profileData?.note || "no note"):""}
      > 
          {userProfileData?.userType === "donor" ?
            <div className='userTileOptionsButton'>
              <img src={menuIcon}></img>
              {/* {profileData?.displayIndex} */}
              <div className='userTileOptions'>
                <Link to={"/profile/"+userID} target='_blank' onClick={(e)=>{e.stopPropagation()}}>
                  <div className='userTileOptionsOption' >Open Profile</div>
                </Link>
                <Link to={"/adminUserTile/"+userID} target='_blank' onClick={(e)=>{e.stopPropagation()}}>
                  <div className='userTileOptionsOption' >Admin Window</div>
                </Link>
                <div className='userTileOptionsOption' onClick={(e)=>{e.stopPropagation(); dispatcher(setAdminEditUserID(userID));}}>Edit User</div>
                <div className='userTileOptionsOption' onClick={(e)=>{e.stopPropagation(); openChat()}}>Open Chat</div>
              </div>
            </div>
            :
            <div className='userTileChat' onClick={(e)=>{e.stopPropagation(); openChat();}}>
              <img src={chatIcon}></img>
            </div>
          }
          <div className='userTileImage'>
            <img src={profileData?.images?.main?.downloadURL}></img>
            {/* Need a new solution for this, could set active state in profileData */}
            {/* {localUserData?.activeSessions && 
              <div className='activeBanner'>
                <div className='activeBannerCircle'></div>
                <div className='activeBannerCircleText'>
                  Active Now
                </div>
              </div>
            } */}
          </div>
          <div className='userTileText'>              
            <div>{profileData?.name + " " + (profileData?.age || "")}</div>
            {/* Put the last active date in the profile data */}
            {userProfileData?.userType === "donor" && <div>{readableDateString(profileData?.lastActive)}</div>}
            <div>{(profileData?.state || "") + " " + (profileData?.country || "")}</div>
          </div>                  
      </div>
    </>
  )
}

UserTile.defaultProps = {
  selectUser: (userID) => {console.log("Selected user: "+userID)},
}

export default UserTile