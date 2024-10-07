import { auth, signOut } from '@/auth'
import React from 'react'

const SettingsPage = async () => {
    const sessions = await auth()

    return (
        <div>
            {JSON.stringify(sessions)}
            <form action={
                async () => {
                    'use server'
                    console.log("siggned out");

                    await signOut()
                }


            }>


                <button type='submit' > signout</button>
            </form>
        </div>
    )
}

export default SettingsPage