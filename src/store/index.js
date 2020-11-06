import React, { createContext, useReducer, useEffect } from 'react'
import PropTypes from 'prop-types'
import { get } from 'axios'
import { apiUrl, useHardcodeData } from '../constants/config'
import assets from '../mocks/assets.json'
import ReactGA from 'react-ga'
import { TOGGLE_FILTER, toggleFilterReducer } from './filters'
import { useLocalStorage } from './localStore'
/*
Example usage:
import {useContext} from 'react'
import { store } from '../store'

const globalState = useContext(store)
const { dispatch, state } = globalState
const { tabViewing } = state

return(
  <button onClick={() => dispatch({ type: 'tabViewing', data: 'idk'})}>Name of tab: {tabViewing}</button>
)
*/

/* We may want to consider using 'immer' and 'useImmer' */

const initialState = {
  loading: false,
  assets: assets,
  selectedFilters: {},
  prefersDarkMode: window.localStorage.darkmode === 'true',
}
const store = createContext()
const { Provider } = store

const StateProvider = ({ children }) => {
  const [storedDarkMode, setDarkMode] = useLocalStorage('darkmode')
  console.log(storedDarkMode)
  const [state, dispatch] = useReducer((state, action) => {
    ReactGA.event({
      category: 'reducer',
      action: action.type,
    })
    switch (action.type) {
    case 'fetchData':
      return { ...state, loading: true }
    case 'fetchDataSuccess':
      return {
        ...state,
        assets: action.payload,
        loading: false,
      }
    case 'fetchDataFailure':
      return { ...state, error: action.payload, loading: false }
    case 'tooglePrefersDarkMode':
      console.log('TOGGLE TOGGLE')
      setDarkMode(!state.prefersDarkMode)
      return { ...state, prefersDarkMode: !state.prefersDarkMode }
    case TOGGLE_FILTER:
      return {
        ...state,
        selectedFilters: toggleFilterReducer(state.selectedFilters, action),
      }
    default:
      throw new Error()
    }
  }, initialState)

  useEffect(() => {
    dispatch({
      type: 'fetchData',
    })
    if (process.env.NODE_ENV !== 'production' || useHardcodeData) {
      dispatch({ type: 'fetchDataSuccess', payload: assets })
    } else {
      get(`${apiUrl}/assets`)
        .then(({ data }) => {
          dispatch({ type: 'fetchDataSuccess', payload: data })
        })
        .catch(e => {
          console.error(e)
          //TODO: handle errors
          dispatch({ type: 'fetchDataFailure', payload: e })
        })
    }
  }, [dispatch])
  return <Provider value={{ state, dispatch }}>{children}</Provider>
}

StateProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export { store, StateProvider }
