class CalcController {

    constructor() {

        //Usamos 'this.' para criar uma variável em uma classe
        //O underline representa uma classe privada
        this._displayCalc = "0";
        this._currentDate;
        this.initialize();

    }

    //Funções dentro de uma classe recebe o nome de método
    initialize() {

        //Convencionando o uso do 'El' para referir que estamos pegando o elemento do HTML
        let displayCalcEl = document.querySelector("#display");
        let dateEl = document.querySelector("#data");
        let timeEl = document.querySelector("#hora");

        displayCalcEl.innerHTML = "4567";
        dateEl.innerHTML = "19/02/2020";
        timeEl.innerHTML = "23:06";

    }

    //Por convenção deve-se usar geters e seters para pegar e setar valores de uma classe privada
    //pega valor em uma classe privada
    get displayCalc() {

        return this._displayCalc;

    }

    //seta valor em uma classe privada
    set displayCalc(valor) {

        this._displayCalc = valor;

    }

    get currentDate() {

        return this._currentDate;

    }

    //seta valor em uma classe privada
    set currentDate(valor) {

        this._currentDate = valor;

    }

}