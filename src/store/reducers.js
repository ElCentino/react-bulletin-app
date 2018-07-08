import { combineReducers } from 'redux'
import initialState from '../initialState'
import C from '../constants'

export const addNote = (state = [], action) => {

  return action.type === C.ADD_NOTE ?
    [
      ...state,
      action.payload
    ] :
    state
}

export const saveNote = (state = {}, action) => {

  return action.type === C.SAVE_NOTE ?
    action.payload :
    state
}

export const editNote = (state = {}, action) => {

  return action.type === C.EDIT_NOTE ?
    action.payload :
    state
}

export const errorOperation = (state = [], action) => {

  switch(action.type) {

    case C.ADD_ERROR:

      const hasError = state.some(error => error === action.payload)

      return hasError ?
        "" :
        [
          ...state,
          action.payload
        ]

    case C.REMOVE_ERROR:

      const hasErrorAlready = action.payload.some(error => error === action.payload)

      return (hasErrorAlready) ? action.payload.filter((error, index) => index !== action.payload) : ""

    default:
      return state;
  }
}

export default combineReducers({ addNote, saveNote, editNote, errorOperation});
