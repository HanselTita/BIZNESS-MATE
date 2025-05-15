import React, { useState } from 'react';
import './Calculator.css';

function Calculator() {
  const [display, setDisplay] = useState('0');
  const [operator, setOperator] = useState(null);
  const [firstValue, setFirstValue] = useState(null);
  const [expression, setExpression] = useState(''); // New state for the expression

  const handleNumberClick = (number) => {
    if (display === '0') {
      setDisplay(String(number));
      setExpression(String(number)); // Start the expression
    } else {
      setDisplay(display + number);
      setExpression(expression + number); // Append to the expression
    }
  };

  const handleOperatorClick = (op) => {
    if (operator && firstValue !== null) {
      calculateResult();
      setFirstValue(parseFloat(display));
    } else {
      setFirstValue(parseFloat(display));
    }
    setOperator(op);
    setExpression(expression + op); // Append the operator to the expression
    setDisplay(''); // Clear the display for the next number
  };

  const handleEqualsClick = () => {
    if (operator && firstValue !== null) {
      calculateResult();
      setOperator(null);
    }
  };

  const handleClearClick = () => {
    setDisplay('0');
    setOperator(null);
    setFirstValue(null);
    setExpression(''); // Clear the expression
  };

  const handlePercentageClick = () => {
    const percentageValue = parseFloat(display) / 100;
    setDisplay(String(percentageValue));
    setExpression(`${expression}%=${percentageValue}`); // Using a template literal
  };

  const calculateResult = () => {
    const secondValue = parseFloat(display);
    if (firstValue !== null && operator) {
      let result = 0;
      switch (operator) {
        case '+':
          result = firstValue + secondValue;
          break;
        case '-':
          result = firstValue - secondValue;
          break;
        case '*':
          result = firstValue * secondValue;
          break;
        case '/':
          result = firstValue / secondValue;
          break;
        default:
          return;
      }
      setDisplay(String(result));
      setOperator(null);
      setFirstValue(result);
      setExpression(expression + '=' + result); // Update expression with result
    }
  };

  return (
    <div className="calculator">
      <div className="expression-display">{expression}</div> {/* New display for the expression */}
      <div className="display">{display}</div>
      <div className="buttons">
        <button className="clear" onClick={handleClearClick}>Clear</button>
        <button onClick={handlePercentageClick}>%</button>
        <button onClick={() => handleOperatorClick('/')}>/</button>
        <button onClick={() => handleNumberClick(7)}>7</button>
        <button onClick={() => handleNumberClick(8)}>8</button>
        <button onClick={() => handleNumberClick(9)}>9</button>
        <button onClick={() => handleOperatorClick('*')}>*</button>
        <button onClick={() => handleNumberClick(4)}>4</button>
        <button onClick={() => handleNumberClick(5)}>5</button>
        <button onClick={() => handleNumberClick(6)}>6</button>
        <button onClick={() => handleOperatorClick('-')}>-</button>
        <button onClick={() => handleNumberClick(1)}>1</button>
        <button onClick={() => handleNumberClick(2)}>2</button>
        <button onClick={() => handleNumberClick(3)}>3</button>
        <button onClick={() => handleOperatorClick('+')}>+</button>
        <button onClick={() => handleNumberClick(0)}>0</button>
        <button onClick={() => handleNumberClick('00')}>00</button>
        <button onClick={() => setDisplay(display.includes('.') ? display : display + '.')}>.</button>
        <button className="equals" onClick={handleEqualsClick}>=</button>
      </div>
    </div>
  );
}

export default Calculator;