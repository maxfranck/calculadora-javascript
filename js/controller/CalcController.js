class CalcController {

    constructor() {

        //Usamos 'this.' para criar uma variável em uma classe
        //O underline representa uma classe privada
        //Convencionando o uso do 'El' para referir que estamos pegando o elemento do HTML
        this._audio = new Audio('click.mp3'); //Fala qual audio tocar
        this._audioOnOff = true; //Padrão se o audio inicia ligado ou desligado
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

    //Funções dentro de uma classe recebe o nome de método


    copyToClipboard() {

        //Criando um input aqui pois estamos usando SVG. 
        //Se criar em html não precisa criar o input aqui.
        let input = document.createElement('input');

        input.value = this.displayCalc;

        document.body.appendChild(input);

        input.select();

        document.execCommand("Copy");

        input.remove();

    }

    pasteFromClipboard() {

        document.addEventListener('paste', e => {

            let text = e.clipboardData.getData('Text');

            this.displayCalc = parseFloat(text);

        });
    }

    //Método de inicialização - Principal
    initialize() {

        this.setDisplayDateTime();

        //Função executada em um intervalo de tempo em milissegundos
        setInterval(()=> {

            this.setDisplayDateTime();

        }, 1000);

        this.setLastNumberToDisplay();
        this.pasteFromClipboard();

        //Se der duplo click no botão AC o audio liga ou desliga
        document.querySelectorAll('.btn-ac').forEach(btn => {

            btn.addEventListener('dblclick', e => {

                this.toggleAudio();

            });

        });

    }

    //Liga e desliga audio
    toggleAudio() {

        this._audioOnOff = !this._audioOnOff;

    }

    //Toca audio
    playAudio() {

        if (this._audioOnOff) {

            this._audio.currentTime = 0;
            this._audio.play();

        }

    }

    //Utilizando o teclado numérico
    initKeyboard() {

        document.addEventListener('keyup', e => {

            this.playAudio(); //Colocar ordem de tocar audio ao clicar na tecla

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
                    if (e.ctrlKey) this.copyToClipboard(); //Add tecla Ctrl+C para copiar valor
                    break;

            }

        });

    }

    //Método para separar o evento de click e drag
    addEventListenerAll(element, events, fn) {

        events.split(' ').forEach(event => {

            element.addEventListener(event, fn, false);

        });

    }

    clearAll() {

        this._operation = [];
        this._lastNumber = '';
        this._lastOperator = '';

        this.setLastNumberToDisplay();

    }

    clearEntry() {

        this._operation.pop();

        this.setLastNumberToDisplay();

    }

    getLastOperation() {

        return this._operation[this._operation.length-1];

    }

    setLastOperation(value) {

        this._operation[this._operation.length-1] = value;

    }

    //Verifica se é um operador ou não
    isOperator(value) {

        //indexOf procura um valor dentro do array
        if (['+', '-', '*', '/', '%'].indexOf(value) > -1) {

            return true;

        } else {

            return false;

        }

    }

    //Mudar de array para string juntando a operação
    getResult() {

        return eval(this._operation.join(""));

    }

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

        this.setLastNumberToDisplay();

    }

    pushOperation(value) {

        this._operation.push(value);

        if (this._operation.length > 3) {

            this.calc();

        }

    }

    getLastItem(isOperator = true) {

        let lastItem;

        for (let i = this._operation.length-1; i>= 0; i--) {

            if (this.isOperator(this._operation[i]) == isOperator) {

                lastItem = this._operation[i];
                break;

            }

        }

        if (!lastItem) {

            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;

        }

        return lastItem;

    }

    //Atualiza e mostra número no display
    setLastNumberToDisplay() {

        let lastNumber = this.getLastItem(false);

        if (!lastNumber) lastNumber = 0;

        this.displayCalc = lastNumber;

    }
    
    //Adicionando nova operação
    addOperation(value) {

        console.log('A', this.getLastOperation());

        if (isNaN(this.getLastOperation())) {

            //Troca o operador caso já tenha clicado em um anteriormente
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

                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(newValue);
                this.setLastNumberToDisplay();

            }

        }

    }

    setError() {

        this.displayCalc = "Error";

    }

    addDot() {

        let lastOperation = this.getLastOperation();

        if (typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return;

        if (this.isOperator(lastOperation) || !lastOperation) {

            this.pushOperation('0.')

        } else {

            this.setLastOperation(lastOperation.toString() + '.');

        }

        this.setLastNumberToDisplay();

    }

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

    // Função de Inicialização dos Botões - lê do HTML os dados da calculadora 
    initButtonsEvents() {

        //pega todas as tags g que são filhas de buttons e parts
        let buttons = document.querySelectorAll('#buttons > g, #parts > g');

        //Foreach para percorrer todos os botões
        buttons.forEach((btn, index)=> {

            //Evento mouse click e drag
            this.addEventListenerAll(btn, 'click drag', e=> {

                let textBtn = btn.className.baseVal.replace("btn-", "");

                this.execBtn(textBtn);

            });
            //Adiciona mão ao passar o mouse sobre os botões
            this.addEventListenerAll(btn, 'mouseover mouseup mousedown', e=> {

                btn.style.cursor = "pointer";

            });

        });

    }

    setDisplayDateTime() {

        //Pegando data e hora no formato definodo no locale
        this.displayDate = this.currentDate.toLocaleDateString(this._locale,{

            day: '2-digit',
            month: 'short',
            year: 'numeric'

        });

        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);

    }

    //Por convenção deve-se usar geters (get) e seters (set) para pegar e setar valores de uma classe privada
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

        this._displayCalcEl.innerHTML = value;

    }

}
