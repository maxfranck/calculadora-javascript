class CalcController {

    constructor() {
        //Usamos 'this.' para criar uma variável em uma classe
        //O underline representa uma classe privada
        //Convencionando o uso do 'El' para referir que estamos pegando o elemento do HTML
        this._operation = []; //Array para guardar as operações
        this._locale = 'pt-BR'; // variavel para local
        this._displayCalcEl = document.querySelector('#display'); //Display da calculadora
        this._dateEl = document.querySelector('#date'); //Data da calculadora
        this._timeEl = document.querySelector('#time'); // Hora da caalculadora
        this._currentDate;
        this.initialize(); // Funçao de inicialização
        this.initButtonsEvents(); // Função de eventos dos botões
    }

    //Funções dentro de uma classe recebe o nome de método
    //Método de inicialização - Principal
    initialize() {
        this.setDisplayDateTime();
        //Função executada em um intervalo de tempo em milissegundos
        setInterval(()=> {
            this.setDisplayDateTime();
        }, 1000);
    }

    //Método para separar o evento de click e drag
    addEventListenerAll(element, events, fn) {
        events.split(' ').forEach(event => {
            element.addEventListener(event, fn, false);
        });
    }

    clearAll() {
        this._operation = [];
    }

    clearEntry() {
        this._operation.pop();
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

    calc() {
        //Remove o último número, salvando ele em uma variavel
        let last = this._operation.pop();
        //Mudar de array para string juntando a operação
        let result = evalthis._operation.join("");
        //retornar a operação para array
        this._operation = [result, last];
    }

    pushOperation(value) {
        this._operation.push(value);
        if (this._operation.length > 3) {
            this.calc();
        }
    }

    setLastNumberToDisplay() {
        
    }
    
    //Adicionando nova operação
    addOperation(value) {
        console.log('A', this.getLastOperation());
        if (isNaN(this.getLastOperation())) {
            //Troca o operador caso já tenha clicado em um anteriormente
            if (this.isOperator(value)) {
                this.setLastOperation(value);
            } else if (isNaN(value)) {
                console.log('Outra coisa', value);
            } else {
                this.pushOperation(value);
            }
        } else {
            if (this.isOperator(value)) {
                this.pushOperation(value);
            } else {
                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(parseInt(newValue));

                //Atualizar display
                this.setLastNumberToDisplay();
            }
        }
    }

    setError() {
        this.displayCalc = "Error";
    }

    execBtn(value){
        switch(value){
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
                
                break;
            case 'ponto':
                this.addOperation('.');
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
