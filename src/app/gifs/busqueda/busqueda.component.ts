import { Component, ElementRef, ViewChild } from '@angular/core';
import { GifsService } from '../services/gifs.service';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styles: [
  ]
})
export class BusquedaComponent  {

  //ViewChild busca en el html el elemento que se encuentra en el parentesis (txtBuscar)
  //y lo asigna al siguiente elemento por fuera del parentesis (txtBuscar2). 
  //Al elemento al que se asigna el valor (txtBuscar2) se debe especificar el tipo
  //Entre parentesis va el identificador # del elemento en la página
  //La utilización de este decorador permite manipular la totalidad del elemento html seleccionado
  //para este ejemplo, se quiere, despues de dar enter, que se limpie la caja
  //al elemento txtBuscar2 se le suma un signo de admiración (not null assertion operator) que permite
  //indicar que este elemento siempre va a existir y no hay riesgo de que sea nulo

  @ViewChild('txtBuscar') txtBuscar2! : ElementRef<HTMLInputElement>;

  //Al constructor se le inyecta el servicio de cargar el valor de busqueda
  constructor (private gifsService: GifsService){}

  buscar(){
    const valor = this.txtBuscar2.nativeElement.value;

    //Verifica que el valor que llega no sea un vacio
    if (valor.trim().length===0){
      return;
    }

    //utilizando el servicio se consume el método que permite cargar el arreglo que este servicio contiene
    this.gifsService.buscarGifs(valor);

    this.txtBuscar2.nativeElement.value = '';
  }

}
