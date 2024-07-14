import React, { useState } from 'react'
import { supabaseClient } from '../../Global/Supabase'

function SignInForm() {
  
  
    const [createNewUser, setCreateNewUser] = useState()
  
    async function createAccount(){
        let emailInput = document.getElementById("emailInput")?.value
        let passInput = document.getElementById("passInput")?.value

        let newAccountObject = {
            email: emailInput,
            pass: passInput,
        }

        console.log("creating user: ", newAccountObject)

        let newAccountResponse = await supabaseClient.auth.signUp(newAccountObject)

        console.log("newAccountResponse: ", newAccountResponse)

    }
    async function signIn(){
        let emailInput = document.getElementById("emailInput")?.value
        let passInput = document.getElementById("passInput")?.value

        let signInObject = {
            email: emailInput,
            pass: passInput,
        }

        console.log("logging in user: ", signInObject)

        let signInResponse = await supabaseClient.auth.signInWithPassword(signInObject)

        console.log("signInResponse: ", signInResponse)
    }

    return (
        <div className='signInForm'>
            <div className='title'>{createNewUser? "Create an Account": "Sign In"}</div>
            <div>
                <input placeholder='email' className='signInInput' id='emailInput'></input>
            </div>
            <div>
                <input placeholder='password' type='password' className='signInInput' id='passInput'></input>
            </div>
            <div>
                {createNewUser? 
                    <button className='signInInputButton' onClick={createAccount}>Create Account</button>
                    :
                    <button className='signInInputButton' onClick={signIn}>Sign In"</button>
                }
            </div>
            <div className='padded'>
                {createNewUser? 
                    <>
                        Have an account? <span onClick={()=>setCreateNewUser(false)} className='selectableText'> Sign in instead</span>
                    </>
                    :
                    <>
                        New to the site? <span onClick={()=>setCreateNewUser(true)} className='selectableText'>create an account</span>
                    </>
                }
                
            </div>
        </div>
    )
}

export default SignInForm