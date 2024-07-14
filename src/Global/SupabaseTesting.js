import React, { useEffect, useRef, useState } from 'react'
import { supabaseClient } from './ClientSetup'
import { doc } from 'firebase/firestore'

/*
    Create teh project and the tables
    Import the library
    create the client
    
    create users
    create and post data
        create a chat with another user
        post an initial message

    fetch data
        fetch users chats
        fetch most recent message for a chat
        fetch users messages for a chat
    
    post more messages


    ========================================
    The subscriber
    does not call on start 
    only returns an object with the new item
    does not have access to the current state values

    so have to call a seperate function to load the array iniaially (for users)
    then keep a ref as well as state for the usrs array
    then push the new item onto the array with the ref

    this is much more complicated than just getting all of it with an onValue that loads all of the data each time there is a change

    and what of if there is an update? 
    or a deletion

*/
function SupabaseTesting() {

    const [userID, setUserID] = useState()
    const [chats, setChats] = useState([])
    const [selectedChatID, setSelectedChatID] = useState()
    const [messages, setMessages] = useState([])
    
    const [selectedUserID, setSelectedUserID] = useState()
    const [selectedUserData, setSelectedUserData] = useState()

    const [users, setUsers] = useState([])

    useEffect(()=>{
        subscribeToUsers()

    },[])
    useEffect(()=>{
        loadUserData()
        
    },[selectedUserID])

    useEffect(()=>{
        loadChats()
    },[selectedUserID])
    useEffect(()=>{
        loadChat()
    },[selectedChatID])

    // #region Users

    async function loadUsersOnce(){
        let response = await supabaseClient
        .from("user")
        .select("*")

        let tempLoadedUsers = response?.data || []
        setUsers(tempLoadedUsers)

    } 

    function subscribeToUsers() {
        
        loadUsersOnce()

        supabaseClient
        .channel('custom-all-channel')
        .on('postgres_changes',
            { 
                event: '*', 
                schema: 'public', 
                table: 'user',
                // filter: 'name=eq.x' 
            },
            (payload) => {

                loadUsersOnce()
            }
        )
        .subscribe()

    }

    // Load data for one user
    async function loadUserData(){
        if(!selectedUserID){
            setSelectedUserData()
            return
        }
        let response = await supabaseClient
        .from("user")
        .select("*")
        .eq("id", selectedUserID)

        console.log(response)
        if(response?.data && Array.isArray(response?.data)){
            let loadedUserData = response?.data[0]
            setSelectedUserData(loadedUserData)
            // console.log("new selectedUserID ", selectedUserID)
            document.getElementById("nameInput").value = loadedUserData?.name || ""
        
        }
        else
            setSelectedUserData()

    }

    async function createNewUser(){
        
        let nameInput = document.getElementById("nameInput")
        let profileImageUrlInput = document.getElementById("profileImageUrlInput")

        let newUserData = {
            name: nameInput?.value,
            profile_image_url: profileImageUrlInput?.value
        }

        await supabaseClient
        .from("user")
        .insert([newUserData])
        .then(msg => {
            console.log("return msg after new user insert: ", msg)
        })
        .catch(err => {
            console.log("err msg after new user insert: ", err)
        })

        if(nameInput)
            nameInput.value = ""
        if(profileImageUrlInput)
            profileImageUrlInput.value = ""

    }

    async function deleteUser(userID){
        if(!selectedUserID)
            return
        await supabaseClient
        .from('user')
        .delete()
        .eq("id", selectedUserID)
    }
    async function updateUser(){
        if(!selectedUserID) return

        let nameInput = document.getElementById("nameInput")
        let profileImageUrlInput = document.getElementById("profileImageUrlInput")

        let newUserData = {
            name: nameInput?.value,
            profile_image_url: profileImageUrlInput?.value
        }

        console.log("updating user "+selectedUserID+" to ", newUserData)

        // supabaseClient
        // .from("user")
        // .update(newUserData)
        // .eq("id", selectedUserID)
        // .select()

        const { data, error } = await supabaseClient
        .from('user')
        .update(newUserData)
        .eq('id', selectedUserID)
        .select()

    }

    function logUser(){
        console.log("Data for user "+selectedUserID, selectedUserData)
    }

    // #endregion Users

    // #region Chats

    // Load the first 20 chats where this user is a member sorted by most recently active, 
    async function loadChats(){
        if(!selectedUserID){
            setChats([])
        }
        let userChatsResponse = supabaseClient
        .from("chats")
        .select("*")
        .eq("user_ids", selectedUserID)
        setChats(userChatsResponse?.data || [])
    }

    function createChat(initialMessage){

    }

    function deleteChat(){

    }

    function addMostRecentMessageToChat(){

    }

    function markChatAsRead(){

    }

    // #endregion Chats


    // #region Messages

    function addMessage(chatID, fromID, message){

    }

    // #endregion Messages



    // Load the 20 most recent messages for the selected chat
    async function loadChat(){
        // if(!selectedChatID){
        //     setMessages([])
        //     return
        // }
        // let loadedMessages = await supabaseClient
        // .from("message")
        // .select("*")
        // .eq("chat_id", selectedChatID)
        // .limit(20)
        // .then(data => {
        //     console.log("loaded message: ", data)
        // }) 
        // .catch(err => {
        //     console.log("load messages error: ", err)
        // })

        // setMessages(loadedMessages)
    }
    
    // Create a user and set the active user to this one
    function createUser(){

    }
    // Switch to this user
    function switchUser(){

    }

  return (
    <div>
        <div className='box ' style={{height: "200px", width: "500px"}}>
            <input placeholder='name' id='nameInput'></input>
            <input placeholder='profile_image_url' id='profileImageUrlInput'></input>
            <button onClick={createNewUser}>Create</button>
            <button onClick={deleteUser}>Delete</button>
            <button onClick={updateUser}>Update</button>
            <button onClick={logUser}>Log</button>
        </div>
        <div className='box' style={{width: "500px"}}>
            <div style={{paddingBottom: "10px"}}>Select A User</div>
            {/* <select onChange={e=>setSelectedUserID(e.target.value)}> */}
            <select onChange={e=>setSelectedUserID(e.target.value)}>
                {users?.map(userObject => (
                    <option value={userObject?.id} key={userObject?.id}>{userObject?.name}</option>
                ))}
            </select>
        </div>
    </div>
  )
}

export default SupabaseTesting