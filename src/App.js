import './App.css';
import DigitButton from './DigitButton';
import OperationButton from './OperationButton';
import { useReducer } from "react";
export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  CHOOSE_OPERATION: 'choose-operation',
  EVALUATE: 'evaluate'
}
function reducer(state, action) {
  switch(action.type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite){
        return {
          ...state,
          currentInput: action.payload.digit,
          overwrite: false
        }
      }
      if (action.payload.digit === "0" && state.currentInput === "0") return state
      if (action.payload.digit === "." && state.currentInput == null) return state
      if (action.payload.digit === "." && state.currentInput.includes(".")) return state
      return {
        ...state,
        currentInput: `${state.currentInput || ""}${action.payload.digit}`
      }
    case ACTIONS.CLEAR:
      return {}
    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentInput == null && state.previousInput == null) {
        return state
      }

      if (state.currentInput == null) {
        return {
          ...state,
          operation: action.payload.operation
        }
      }

      if (state.previousInput == null){
        return {
          ...state,
          operation: action.payload.operation,
          previousInput: state.currentInput,
          currentInput: null,
        }
      }
      return {
        ...state,
        previousInput: evaluate(state),
        operation: action.payload.operation,
        currentInput: null
      }
    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentInput: null
        }
      }
      if (state.currentInput == null) return state
      if (state.currentInput.length === 1){
        return {...state, currentInput: null }
      }
      return {
        ...state,
        currentInput: state.currentInput.slice(0, -1)
      }
    case ACTIONS.EVALUATE:
      if (state.operation == null || state.currentInput == null || state.previousInput == null) return state
      return {
        ...state,
        overwrite: true,
        previousInput: null,
        operation: null,
        currentInput: evaluate(state)
      }
    default:
      throw new Error();
  }
}

function evaluate({currentInput, previousInput, operation}){
  const prev = parseFloat(previousInput)
  const current = parseFloat(currentInput)
  if (isNaN(prev) || isNaN(current)) return ""
  let compuation = ""
  switch (operation) {
    case "+":
      compuation = prev + current
      break
    case "-":
      compuation = prev - current
      break
    case "÷":
      compuation = prev/current
      break
    case "*":
      compuation = prev * current
      break
    default:
      throw new Error();
  }
  return compuation.toString()
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {maximumFractionDigits: 0,})
function formatInput(input){
  if (input == null) return
  const [integer, decimal] = input.split('.')
  if (decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}
function App() {
  const [state, dispatch] = useReducer(reducer, {})
  
  return (
    <div className="App">
      <div className="calculator">
        <div className="display">
          <div className="previous-input">
            {formatInput(state.previousInput)} {state.operation}
          </div>
          <div className="input">{formatInput(state.currentInput)}</div>
        </div>
        <button className="bigButton" onClick={()=>dispatch({type: ACTIONS.CLEAR })}>Clear</button>
        <button onClick={()=>dispatch({type: ACTIONS.DELETE_DIGIT })}>DEL</button>
        <OperationButton operation="÷" dispatch={dispatch}/>
        <DigitButton digit="1" dispatch={dispatch}/>
        <DigitButton digit="2" dispatch={dispatch}/>
        <DigitButton digit="3" dispatch={dispatch}/>
        <OperationButton operation="*" dispatch={dispatch}/>
        <DigitButton digit="4" dispatch={dispatch}/>
        <DigitButton digit="5" dispatch={dispatch}/>
        <DigitButton digit="6" dispatch={dispatch}/>
        <OperationButton operation="+" dispatch={dispatch}/>
        <DigitButton digit="7" dispatch={dispatch}/>
        <DigitButton digit="8" dispatch={dispatch}/>
        <DigitButton digit="9" dispatch={dispatch}/>
        <OperationButton operation="-" dispatch={dispatch}/>
        <DigitButton digit="." dispatch={dispatch}/>
        <DigitButton digit="0" dispatch={dispatch}/>
        <button className="bigButton" onClick={()=>dispatch({type: ACTIONS.EVALUATE })}>=</button>
        <button className="matti pics feet*L">secre bujton</button>
      </div>
    </div>
  );
}

export default App;
