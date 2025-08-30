  
        // Create floating particles
        document.addEventListener('DOMContentLoaded', () => {
            const particlesContainer = document.getElementById('particles');
            const particleCount = 15;
            
            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.classList.add('particle');
                
                // Random size between 5px and 20px
                const size = Math.random() * 15 + 5;
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
                
                // Random position
                particle.style.left = `${Math.random() * 100}%`;
                particle.style.top = `${Math.random() * 100}%`;
                
                // Random opacity
                particle.style.opacity = `${Math.random() * 0.5 + 0.1}`;
                
                // Random animation delay
                particle.style.animationDelay = `${Math.random() * 15}s`;
                
                // Random animation duration
                particle.style.animationDuration = `${Math.random() * 20 + 10}s`;
                
                particlesContainer.appendChild(particle);
            }
        });
        
        // Calculator functionality
        document.addEventListener('DOMContentLoaded', () => {
            const result = document.getElementById('result');
            const expression = document.getElementById('expression');
            const buttons = document.querySelectorAll('button');
            const calculator = document.getElementById('calculator');
            
            let currentInput = '0';
            let currentExpression = '';
            let lastResult = null;
            let waitingForOperand = false;
            
            // Map for keyboard input animation
            const keyMap = {};
            buttons.forEach(button => {
                const key = button.getAttribute('data-key');
                if (key) {
                    keyMap[key] = button;
                }
            });
            
            // Update display with animation
            function updateDisplay() {
                result.textContent = currentInput;
                expression.textContent = currentExpression;
            }
            
            // Clear all
            function clearAll() {
                currentInput = '0';
                currentExpression = '';
                lastResult = null;
                waitingForOperand = false;
                updateDisplay();
            }
            
            // Backspace
            function backspace() {
                if (currentInput.length > 1) {
                    currentInput = currentInput.slice(0, -1);
                } else {
                    currentInput = '0';
                }
                updateDisplay();
            }
            
            // Calculate result with animation
            function calculate() {
                try {
                    // Replace display symbols with JavaScript operators
                    let evalExpression = currentExpression.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
                    
                    // Add the current input if needed
                    if (!waitingForOperand) {
                        evalExpression += currentInput;
                    } else {
                        // Remove the last operator if no operand was entered
                        evalExpression = evalExpression.slice(0, -1);
                    }
                    
                    // Calculate
                    const calculatedResult = eval(evalExpression);
                    
                    // Format the result
                    if (calculatedResult === Infinity || calculatedResult === -Infinity) {
                        currentInput = 'Error';
                    } else {
                        // Handle decimal precision
                        if (Number.isInteger(calculatedResult)) {
                            currentInput = calculatedResult.toString();
                        } else {
                            // Limit decimal places to avoid very long numbers
                            currentInput = calculatedResult.toFixed(8).replace(/\.?0+$/, '');
                        }
                    }
                    
                    lastResult = currentInput;
                    currentExpression = '';
                    waitingForOperand = false;
                    
                    // Add glow effect on calculation
                    calculator.classList.add('glow');
                    setTimeout(() => {
                        calculator.classList.remove('glow');
                    }, 1000);
                    
                } catch (error) {
                    currentInput = 'Error';
                    currentExpression = '';
                    waitingForOperand = false;
                }
                updateDisplay();
            }
            
            // Handle number input
            function inputDigit(digit) {
                if (waitingForOperand) {
                    currentInput = digit;
                    waitingForOperand = false;
                } else {
                    currentInput = currentInput === '0' ? digit : currentInput + digit;
                }
                updateDisplay();
            }
            
            // Handle decimal point
            function inputDecimal() {
                if (waitingForOperand) {
                    currentInput = '0.';
                    waitingForOperand = false;
                } else if (currentInput.indexOf('.') === -1) {
                    currentInput += '.';
                }
                updateDisplay();
            }
            
            // Handle operator
            function inputOperator(operator) {
                const displayOperator = operator === '*' ? '×' : 
                                       operator === '/' ? '÷' : 
                                       operator === '-' ? '−' : operator;
                
                if (waitingForOperand) {
                    // Replace the last operator
                    currentExpression = currentExpression.slice(0, -1) + displayOperator;
                } else {
                    // Add the current input and the operator to the expression
                    currentExpression += currentInput + displayOperator;
                    waitingForOperand = true;
                }
                
                // If there was a previous calculation, use that result
                if (lastResult !== null && currentInput === lastResult) {
                    lastResult = null;
                }
                
                updateDisplay();
            }
            
            // Handle percentage
            function inputPercent() {
                if (currentInput !== '0') {
                    const value = parseFloat(currentInput) / 100;
                    currentInput = value.toString();
                    updateDisplay();
                }
            }
            
            // Handle parenthesis
            function inputParenthesis() {
                if (currentInput === '0' || waitingForOperand) {
                    currentExpression += '(';
                    waitingForOperand = false;
                } else {
                    currentExpression += currentInput + '*(';
                    waitingForOperand = true;
                }
                currentInput = '0';
                updateDisplay();
            }
            
            // Button click handler with enhanced animation
            buttons.forEach(button => {
                button.addEventListener('click', () => {
                    const value = button.textContent;
                    
                    // Add active class for animation
                    button.classList.add('button-active');
                    setTimeout(() => {
                        button.classList.remove('button-active');
                    }, 150);
                    
                    if (value >= '0' && value <= '9') {
                        inputDigit(value);
                    } else if (value === '.') {
                        inputDecimal();
                    } else if (value === 'C') {
                        clearAll();
                    } else if (value === '⌫') {
                        backspace();
                    } else if (value === '%') {
                        inputPercent();
                    } else if (value === '=') {
                        calculate();
                    } else if (value === '(') {
                        inputParenthesis();
                    } else {
                        // Operators: +, −, ×, ÷
                        const op = button.getAttribute('data-op');
                        if (op) {
                            inputOperator(op);
                        }
                    }
                });
            });
            
            // Keyboard support with enhanced animation
            document.addEventListener('keydown', (event) => {
                const key = event.key;
                
                // Animate the corresponding button if it exists
                if (keyMap[key]) {
                    keyMap[key].classList.add('button-active');
                    setTimeout(() => {
                        keyMap[key].classList.remove('button-active');
                    }, 150);
                    
                    // Trigger the button's click event
                    keyMap[key].click();
                    event.preventDefault();
                }
            });
            
            // Initialize display
            updateDisplay();
        });
    
