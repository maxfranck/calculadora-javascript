class CalcController {

    constructor() {
        //Usamos 'this.' para criar uma variável em uma classe
        //O underline representa uma classe privada
        //Convencionando o uso do 'El' para referir que estamos pegando o elemento do HTML
        this._locale = 'pt-BR';
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#date");
        this._timeEl = document.querySelector("#time");
        this._currentDate;
        this.initialize();
    }

    //Funções dentro de uma classe recebe o nome de método
    initialize() {
        this.setDisplayDateTime();
        //Função executada em um intervalo de tempo milissegundos
        setInterval(()=>{
            this.setDisplayDateTime();
        }, 1000);
    }

    setDisplayDateTime() {
        //Pegando data e hora no formato definodo no locale
        this.displayDate = this.currentDate.toLocaleDateString(this._locale,{
            day: "2-digit",
            month: "short",
            year: "numeric"
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
