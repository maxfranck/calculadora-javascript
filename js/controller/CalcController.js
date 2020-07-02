class CalcController {
    constructor() {
        this._audio = new Audio('click.mp3'); //Fala qual audio tocar
        this._audioOnOff = true; //Padrão se o audio inicia ligado ou desligado
        
        this._finalResult = '';
        this._lastOperator = '';
        this._lastNumber = '';
        this._operation = []; //Array para guardar as operações

        this._locale = 'pt-BR'; // variavel para local
        this._displayCalcEl = document.querySelector('#display'); //Display da calculadora
        this._dateEl = document.querySelector('#date'); //Data da calculadora
        this._timeEl = document.querySelector('#time'); // Hora da caalculadora
        this._currentDate;
        this.initialize(); // Funçao de inicialização
        this.initButtonsEvents(); // Função de eventos dos botões
        this.initKeyboard(); // Função de eventos dos botões do teclado
    }

    initialize() {
        this.setDisplayDateTime();

        //Função executada em um intervalo de tempo em milissegundos
        setInterval(()=>{
            this.setDisplayDateTime();
        }, 1000);

        this.setLastNumberToDisplay();
        this.pasteFromClipboard();

        //Se der duplo click no botão AC o audio liga ou desliga
        document.querySelectorAll('.btn-ac').forEach(btn =>{
            btn.addEventListener('dblclick', e =>{
                this.toggleAudio();
            });
        });
    }

    //AUDIO ON AND OFF
    toggleAudio() {
        this._audioOnOff = !this._audioOnOff;
    }

    //PLAY AUDIO
    playAudio() {
        if (this._audioOnOff) {
            this._audio.currentTime = 0;
            this._audio.play();
        }
    }

    //COPY DATA FROM DISPLAY TO THE CLIPBOARD
    copyToClipboard() {
        let input = document.createElement('input');

        input.value = this.displayCalc;

        document.body.appendChild(input);

        input.select();

        document.execCommand("Copy");

        input.remove();
    }

    //PASTE DATA FROM CLIPBOARD
    pasteFromClipboard() {
        document.addEventListener('paste', e =>{
            let text = e.clipboardData.getData('Text');
            this.displayCalc = parseFloat(text);
        });
    }

    //SETTING UP KEYBOARD EVENTS
    initKeyboard() {
        document.addEventListener('keyup', e =>{
            this.playAudio();

            switch(e.key) {

                case'Escape':
                    this.clearAll();
                    break;

                case 'Backspace':
                    this.clearEntry();
                    break;

                case '+':
                case '-':
                case '/':
                case '*':
                case '%':
                    this.addOperation(e.key);
                    break;

                case 'Enter':
                case '=':
                    this.calc();
                    break;

                case '.':
                case ',':
                    this.addDot();
                    break;

                case '0': 
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.addOperation(parseInt(e.key));
                    break;

                case 'c':
                    if (e.ctrlKey) this.copyToClipboard();
                    break;
            }
        });
    }

    //METHOD TO SET EVENTS TO ALL BUTTONS
    addEventListenerAll(element, events, fn) {
        events.split(' ').forEach(event =>{
            element.addEventListener(event, fn, false);
        });
    }

    //FUNCTION: RESET THE OPERATION TO EMPTY
    clearAll() {
        this._operation = [];
        this._lastNumber = '';
        this._lastOperator = '';
        this.setLastNumberToDisplay();
    }

    //FUNCTION: ERASE THE LAST ENTRY OF THE OPERATION
    clearEntry() {
        this._operation.pop();
        this.setLastNumberToDisplay();
    }

    //DISPLAYS ERROR
    setError() {
        this.displayCalc = "Error";
    }

    //GETS THE LAST OPERATION OF THE ARRAY
    getLastOperation() {
        return this._operation[this._operation.length-1];
    }

    //VALIDATES IF LAST VALUE IS AN OPERATOR
    isOperator(value) {
        if (['+', '-', '*', '/', '%'].indexOf(value) > -1) {
            return true;
        } else {
            return false;
        }
    }

    //SET THE LAST OPERATION TO THE INPUT VALUE
    setLastOperation(value) {
        this._operation[this._operation.length-1] = value;
    }

    //PUSH VALUE TO OPERATION
    pushOperation(value) {
        this._operation.push(value);

        if(this._finalResult){
            this._finalResult = '';
        }

        if (this._operation.length > 3) {
            this.calc();
        }
    }

    //RETURN THE RESULT OF THE CALCULATION
    getResult() {
        //Add Try Catch para pegar algum erro
        try {
            return eval(this._operation.join(""));
        } catch(e) {
            setTimeout(() =>{
                this.setError();
            }, 1); 
        }
    }

    //CALCULATES THE OPERATION
    calc() {
        let last = '';

        this._lastOperator = this.getLastItem();

        if (this._operation.length < 3) {
            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator, this._lastNumber];
        }

        if (this._operation.length > 3) {
            last = this._operation.pop();
            this._lastNumber = this.getResult();
        } else if (this._operation.length == 3) {
            this._lastNumber = this.getLastItem(false);
        }

        let result = this.getResult();

        //Calcula porcentagem
        if (last == '%') {
            result /= 100;
            this._operation = [result];
        } else {
        //retornar a operação para array
        this._operation = [result];
        if (last) this._operation.push(last);
        }

        this._finalResult = this.getResult();
        
        this.setLastNumberToDisplay();
    }

    //RETURN THE LAST ITEM OF THE OPERATION
    getLastItem(isOperator = true) {
        let lastItem;

        for (let i = this._operation.length-1; i>= 0; i--) {
            if (this.isOperator(this._operation[i]) == isOperator) {
                lastItem = this._operation[i];
                break;
            }
        }

        if (lastItem == 0){
            return lastItem;
        } else if (!lastItem) {
            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
        }

        return lastItem;
    }

    //SHOW LAST NUMBER ON DISPLAY
    setLastNumberToDisplay() {
        let lastNumber = this.getLastItem(false);

        if (!lastNumber) lastNumber = 0;

        this.displayCalc = lastNumber;
    }
    
    //ADD TO THE OPERATION
    addOperation(value) {
        if (isNaN(this.getLastOperation())) {
            if (this.isOperator(value)) {
                this.setLastOperation(value);
            } else {
                this.pushOperation(value);
                this.setLastNumberToDisplay();
            }
        } else {
            if (this.isOperator(value)) {
                this.pushOperation(value);
            } else {
                if(!this._finalResult){
                    let newValue = this.getLastOperation().toString() + value.toString();
                    this.setLastOperation(newValue);
                    this.setLastNumberToDisplay();
                } else {
                    this._lastNumber = '';
                    this._lastOperator = '';
                    this._operation = [];
 
                    this.addOperation(value);
                    this.setLastNumberToDisplay();
                }
            }
        }
    }

    //METHOD TO TURN NUMBERS INTO FLOAT TYPE
    addDot() {
        let lastOperation = this.getLastOperation();

        if (typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return;

        if(this._finalResult){
            this._operation = [];
            this.pushOperation("0.");
        } else if (this.isOperator(lastOperation) || !lastOperation || lastOperation == undefined) {
            this.pushOperation('0.')
        } else {
            this.setLastOperation(lastOperation.toString() + '.');
        }

        this.setLastNumberToDisplay();
    }

    //SETTING ATTRIBUTES FOR THE BUTTONS
    execBtn(value){
        this.playAudio();

        switch(value) {
            case'ac':
                this.clearAll();
                break;

            case 'ce':
                this.clearEntry();
                break;

            case 'soma':
                this.addOperation('+');
                break;

            case 'subtracao':
                this.addOperation('-');
                break;

            case 'divisao':
                this.addOperation('/');
                break;

            case 'multiplicacao':
                this.addOperation('*');
                break;

            case 'porcento':
                this.addOperation('%');
                break;

            case 'igual':
                this.calc();
                break;

            case 'ponto':
                this.addDot();
                break;

            case '0': 
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value));
                break;
            
            default:
                this.setError();
                break;
        }
    }

    //SETUP THE BUTTON EVENTS
    initButtonsEvents() {
        //pega todas as tags g que são filhas de buttons e parts
        let buttons = document.querySelectorAll('#buttons > g, #parts > g');

        buttons.forEach((btn, index)=>{
            //Evento mouse click e drag
            this.addEventListenerAll(btn, 'click drag', e=>{
                let textBtn = btn.className.baseVal.replace("btn-", "");
                this.execBtn(textBtn);
            });

            //Adiciona mão ao passar o mouse sobre os botões
            this.addEventListenerAll(btn, 'mouseover mouseup mousedown', e=>{
                btn.style.cursor = "pointer";
            });
        });
    }

    //SETS THE DATE AND TIME TO DISPLAY
    setDisplayDateTime() {
        this.displayDate = this.currentDate.toLocaleDateString(this._locale,{
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });

        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
    }

    //GETTERS AND SETTERS
    get displayTime() {
        return this._timeEl.innerHTML;
    }
    
    set displayTime(value) {
        return this._timeEl.innerHTML = value;
    }
    
    get displayDate() {
        return this._dateEl.innerHTML;
    }
    
    set displayDate(value) {
        return this._dateEl.innerHTML = value;
    }

    get currentDate() {
        return new Date();
    }

    set currentDate(value) {
        return this._currentDate = value;
    }

    get displayCalc() {
        return this._displayCalcEl.innerHTML;
    }

    set displayCalc(value) {
        if (value.toString().length > 10) {
            this.setError();
            return false;
        }

        return this._displayCalcEl.innerHTML = value;
    }

}
