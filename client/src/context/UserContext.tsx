import { createContext, useReducer, ReactNode, Reducer, Dispatch } from 'react'
import { baseIMG } from '../utils/api-config'


interface UserData {
    userID: number
    username: string
    firstName: string
    lastName: string
    birthDate: Date | string
    sex: string
    address: string
    email: string
    phoneNumber: string
    avatar: string
    orderCount: number
}

const init: unknown = null
interface UserType {
    user: UserData | null
    dispatchUser: Dispatch<Action>
}
const UserContext = createContext<UserType>(init as UserType)
const USER_ACTION = {
    SET: 'SET',
    REMOVE: 'REMOVE'
}
interface Action {
    type: string
    payload: UserData | null
}
const userReducer: Reducer<UserData | unknown, Action> = (state, action) => {
    switch (action.type) {
        case USER_ACTION.SET: {
            if (action.payload === null) return null
            const birthDate = new Date(action.payload.birthDate)
            let avatar = `${baseIMG}avatars/${action.payload.avatar}`
            if (action.payload?.avatar === 'user.png') avatar = `${baseIMG}default/${action.payload?.avatar}`
            return {
                ...action.payload,
                birthDate: birthDate,
                avatar: avatar
            }
        }
        case USER_ACTION.REMOVE:
            return null
        default:
            return state;
    }
}
function UserProvider({ children }: { children: ReactNode }) {
    const [user, dispatchUser] = useReducer(userReducer, init)
    return (
        <UserContext.Provider value={{ user, dispatchUser } as never}>
            {children}
        </UserContext.Provider>
    )
}

export {
    UserProvider,
    UserContext
}