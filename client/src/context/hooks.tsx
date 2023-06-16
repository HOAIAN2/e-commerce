import { useContext } from 'react'
import { UserContext } from './UserContext'

function useUserData() {
    return useContext(UserContext)
}

export default useUserData