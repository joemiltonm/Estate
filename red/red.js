
const redux = require('redux')
const produce = require('immer').produce

const thunkMiddleware = require('redux-thunk').default
const axios = require('axios')
const createStore = redux.createStore
const bindActionCreators = redux.bindActionCreators // this is a helper function. Alternate to store.dispatch(). 
const combineReducers = redux.combineReducers
const applyMiddleware = redux.applyMiddleware

const reduxLogger = require('redux-logger')
const logger = reduxLogger.createLogger()

const CAKE_ORDERED = "CAKE_ORDERED"
const CAKE_RESTOCKED = "CAKE_RESTOCKED"

const ICECREAM_ORDERED = "ICECREAM_ORDERED"
const ICECREAM_RESTOCKED = "ICECREAM_RESTOCKED"

// action is a object. 

// action creator is a function that returns the object.

function orderCake(){
    return {
        type: CAKE_ORDERED,
    }
}

function restockCake(qty = 1){
    return {
        type: CAKE_RESTOCKED,
        payload : qty
    }
}

function orderIcecream (qty=1){
    return{
        type: ICECREAM_ORDERED,
        payload: qty
    }
}

function restockIcecream(qty=1){
    return{
        type: ICECREAM_RESTOCKED,
        payload: qty
    }
}

// Reducer is a function that accepts state and action as args and returns the next state


//(previousState, action) => newState

//Application state

// initialState = {
//         numOfCakes : 10,
//         numOfIcecreams: 20
// }

const initialCakeState = {
    numOfCakes : 10
}

const initialIcecreamState = {
    numOfIcecream : 10
}



// if there are lot of state to manage then just having one reducer will be difficult to handle with too many switch cases. 


//In the below the spreading state and making the change and returning the state is good here, but in nested state it is tedious. 
// spreading has to happen at each level in nested state object. Immer library is used to simplify this. 
// produce in immer gives the draft state persumably by deep copying the state. 
// return produce(state, (draft) => { state.address.street = action.payload })

const cakeReducer = (state = initialCakeState, action) =>{
    switch(action.type){
        case CAKE_ORDERED:
            return {
                ...state, numOfCakes : state.numOfCakes - 1
            }
        case CAKE_RESTOCKED:
            return{
                ...state, numOfCakes: state.numOfCakes + action.payload
            }
        default:
            return state
    }
}

const icecreamReducer = ( state = initialIcecreamState, action) => {
    switch(action.type){
        case ICECREAM_ORDERED:
            return{
                ...state, numOfIcecream : state.numOfIcecream - action.payload
            }
        case ICECREAM_RESTOCKED:
            return{
                ...state, numOfIcecream : state.numOfIcecream + action.payload
            }
        default:
            return state
    }
}

// Redux store allows access to state via getState()
// update using dispatch(action)
// listeners via subscribe(listener), listener is a function. 


// here reducer has the initial state. 
// while having multiple reducers the issue is the createStore can accept only one reducer. The solution is combining reducers. 

const rootReducer = combineReducers({
    cake: cakeReducer,
    icecream: icecreamReducer
})

// Thunk Middleware gives ability for action creator to return another function. Normally it returns the action object. 
// This function can be Async and can dispatch actions. 

// when a action is dispatched both the reducers recive the action but only the relevant reducer acts on it. 
const store = createStore(rootReducer, applyMiddleware(thunkMiddleware))

console.log("initial state", store.getState())

const unsubscribe = store.subscribe(() => {})

// dispatch get the action object as arg, we pass the action generator
// that returns the action object

// store.dispatch(orderCake())
// store.dispatch(restockCake(5))
// store.dispatch(orderCake())

// binding makes an object with action creators wrapped with dispatch. like below. 
// {
//     orderCake: [Function (anonymous)],
//     restockCake: [Function (anonymous)]
// }
// Now it is not used. 
const actions = bindActionCreators({orderCake, restockCake, orderIcecream, restockIcecream}, store.dispatch)

actions.orderCake()
actions.orderCake()
actions.restockCake(3)
actions.restockCake(1)

actions.orderIcecream(2)
actions.orderIcecream(2)
actions.restockIcecream(4)

unsubscribe()

// Middlewares in Redux. way to extend redux with custom functionality. 
// Provides 3rd party extension point between the point of dispatching an action and the moment it reaches the reducer. 
// 3rd party like redux-logger
// for logging, crash reporting and Async tasks. 

// Async action creators. Basically how to make API request while using redux. need to install axios, redux-thunk
// Async actions looks very different from plain action generators. 
// It has a nested function that receives dispatch as its arg. 
// To use this kind of action creators we need thunk middleware. 

// const fetchUsers = () => {
//     return function(dispatch) {
//         dispatch(fetchUsersRequest())
//         axios.getAdapter('https://jsonplaceholder.typicode.com/users').then(response => {
//             const users = response.data.map((user => user.id))
//             dispatch(fetchUsersSuccess(users))
//         }).catch(error => {
//             dispatch(fetchUsersFailed(error.message))})
//     }
// }

// -----------------Above all concludes the Redux concepts------------------------

// Redux concers ----
// requires too much boiler plate code like writing the action, action object, action generator, switch statement in the reducer.
// more libs needed like redux-think, immer, redux-devtool 

// This led to redux-toolkit library. 