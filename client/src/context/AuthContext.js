import {createContext, useReducer, useEffect} from 'react';
//creates new react context
export const AuthContext = createContext();
//authentication state reducer
export const authReducer = (state, action) => {
    switch(action.type) {
        case 'LOGIN':
            return { user: action.payload } //set the logged in user in the state
        case 'LOGOUT':
            return { user: null} //set the state to logged out
        default:
            return state //return the current state if action is not regonized
    }
}
//authentication state provider
export const AuthContextProvider = ({children}) => {
    //initialize state using the reducer
    const [state, dispatch] = useReducer(authReducer, {user: null});
    //this effect runs only when the component mounts
    useEffect(() => {
        //check for user data in local storage
        const user = JSON.parse(localStorage.getItem('user'));
        //if user data found, log in the user
        if(user) {
            dispatch({type: 'LOGIN', payload: user})
        }
    },[])
    //logs state
    console.log('AuthContext state:', state)
    //provides context and state to children
    return (
        <AuthContext.Provider value={{...state, dispatch}}>
            { children }
        </AuthContext.Provider>
    )
}