import { useReducer } from "react"
import DigitButton  from "./DigitButton"
import { useEffect } from 'react';
import OperationButton  from "./OperationButton"
import "./styles.css"


export const ACTION = {
  ADD_DIGIT: 'add_digit',
  CHOOSE_OPERATION: 'choose_operation',
  CLEAR: 'clear',
  DELETE: 'delete_digit',
  EVALUATE: 'evaluate'
}

function reducer(state, { type, payload }){
  switch (type) {
    case ACTION.ADD_DIGIT:
      if(state.overwrite){
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false
        }
      }
      if(payload.digit === "0" && state.currentOperand === "0")
        return state;
      if(payload.digit === "." && state.currentOperand.includes("."))
        return state;

      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      }
   
    case ACTION.CHOOSE_OPERATION:
      if(state.currentOperand == null && state.previousOperand == null)
        return state
      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation
        }
      }
      if(state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null
        }
      }
        return {
          ...state,
          previousOperand: evaluate(state),
          operation: payload.operation,
          currentOperand: null
        }

    case ACTION.EVALUATE:
      if(state.currentOperand == null || state.operation == null || state.previousOperand == null)
        return state
      
      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state)
      }
    case ACTION.DELETE:
      if(state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null
        }
      }
      if(state.currentOperand == null) return state
      if(state.currentOperand === 1) 
        return {...state, currentOperand: null }

      return {
        ...state,
        currentOperand: state.currentOperand.slice(0,-1)
      }
    case ACTION.CLEAR:
      return {}
    default:
      return state;
  }
}

function evaluate({currentOperand, previousOperand, operation}) {
  const prev = parseFloat(previousOperand)
  const current = parseFloat(currentOperand)

  if(isNaN(prev) || isNaN(current)) return ""

  let computation = ""

  switch(operation){
    case "+":
      computation = prev + current
      break
    case "-":
      computation = prev - current
      break
    case "*":
      computation = prev * current
      break
    case "/":
      computation = prev / current
      break
  }

  return computation.toString();
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
})

function formatOperand(operand) {
  if(operand == null) return
  const [integer, decimal] = operand.split(".")
  if(decimal == null) return INTEGER_FORMATTER.format(integer)

  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}
function App() { 

  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(reducer, {})

  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key;

      if (/[0-9]/.test(key)) {
        // If a number key is pressed
        dispatch({ type: ACTION.ADD_DIGIT, payload: { digit: key } });
      } else if (key === '.') {
        // If the dot key is pressed
        dispatch({ type: ACTION.ADD_DIGIT, payload: { digit: key } });
      } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        // If an operation key (+, -, *, /) is pressed
        dispatch({ type: ACTION.CHOOSE_OPERATION, payload: { operation: key } });
      } else if (key === 'Enter' || key === '=') {
        // If the Enter key or the equal sign key is pressed
        dispatch({ type: ACTION.EVALUATE });
      } else if (key === 'Backspace') {
        // If the Backspace key is pressed
        dispatch({ type: ACTION.DELETE });
      } else if (key === 'Escape') {
        // If the Escape key is pressed
        dispatch({ type: ACTION.CLEAR });
      }
    };

    // Attach the event listener when the component mounts
    document.addEventListener('keydown', handleKeyDown);

    // Detach the event listener when the component unmounts
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []); 

  return (

    <div className="calculator-grid">
    <div className="output">
      <div className="previous-operand">{formatOperand(previousOperand)} {operation}</div>
      <div className="current-operand">{formatOperand(currentOperand)}</div>
    </div>

    <button className="span-two" onClick={(() => dispatch({type: ACTION.CLEAR}))}>AC</button>
    <button onClick={(() => dispatch({type: ACTION.DELETE}))}>DEL</button>

    <OperationButton operation="/" dispatch={dispatch} />
    <DigitButton digit="1" dispatch={dispatch} />
    <DigitButton digit="2" dispatch={dispatch} />
    <DigitButton digit="3" dispatch={dispatch} />
    <OperationButton operation="*" dispatch={dispatch} />
    <DigitButton digit="4" dispatch={dispatch} />
    <DigitButton digit="5" dispatch={dispatch} />
    <DigitButton digit="6" dispatch={dispatch} />
    <OperationButton operation="+" dispatch={dispatch} />
    <DigitButton digit="7" dispatch={dispatch} />
    <DigitButton digit="8" dispatch={dispatch} />
    <DigitButton digit="9" dispatch={dispatch} />
    <OperationButton operation="-" dispatch={dispatch} />
    <DigitButton digit="." dispatch={dispatch} />
    <DigitButton digit="0" dispatch={dispatch} />

    <button className="span-two" onClick={(() => dispatch({type: ACTION.EVALUATE}))}>=</button>

  </div>
  );

}

export default App;
