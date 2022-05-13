import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchGIFResponse, Gifs } from '../interfaces/gifs.interface';

// al decorador le adiciona la caracteristica providedIn: 'root' que indica que el servicio
//se expone a la totalidad de la solución 
@Injectable({
  providedIn: 'root'
})
export class GifsService {

  //Se adiciona guión bajo al nombre para indicar que el elemento puede ser modificado en el futuro
  private _historial: string[] = [];
  //Define un arreglo donde se van a aguardar los resultados del consumo de la URL
  //una vez definida la interfaz, el tipo para resultados cambia a Gif
  public _resultados: Gifs[] = [];
  //Almacena llave para acceder a la página de GIFS
  private apiKey: string = "zKz8MKzV65FztX6eGvM0wtmbrVCe4fde";
  private servicioUrl: string = "http://api.giphy.com/v1/gifs";

  //El get retorna un nuevo arreglo que se genera a partir del operador spread (...)
  //recuerde que este operador se utiliza para romper la referencia del objeto y retornar uno nuevo
  //con esto se mantiene la integridad del elemento
  get historial() {    
    return [...this._historial];
  }

  get resultados() {    
    return [...this._resultados];
  }

  // Se inyecta el servicio HttpClient requerido para ejecutar consumos http
  constructor( private http: HttpClient)
  {

    //ejemplo1 de carga el valor del localStorage
    //el parse se utiliza para pasar de un string a su tipo original
    //if (localStorage.getItem('historial')){
    //  this._historial = JSON.parse(localStorage.getItem('historial')!);
    //}

    //ejemplo2 de carga el valor del localStorage
    this._historial = JSON.parse(localStorage.getItem('historial')!) || [];
    this._resultados = JSON.parse(localStorage.getItem('resultados')!) || [];


  }

  //Se define un método async para consumir el http en el ejemplo2
  //async buscarGifs(query: string = '')
  buscarGifs(query: string = '')
  {
    
    //Se pasa el valor a lowercase para evitar que se puedan crear el mismo item en 
    //mayuscula y en minuscula, por ejemplo : DBZ y dbz  
    query = query.trim().toLowerCase();

    //Con la instrucción includes verificamos si el valor ya existe en el arreglo
    //se niega para que al responder false el valor se carga
    if(!this._historial.includes(query)){
      //Adiciona un nuevo valor al arreglo
      this._historial.unshift(query);
      //Se aplica una instrucción splice al arreglo para controlar que máximo sean 10 elementos en el mismo
      this._historial = this._historial.splice(0,10);

      //graba en el localStorage del navegador
      //el stringify se usa para pasar un objeto a string (serializar el objeto)
      localStorage.setItem('historial',JSON.stringify(this._historial))
  
    }

    //Se instancia objeto especializado en almacenar parametros http
    //se cargan los parámetros de la URL
    const parametros : HttpParams = new HttpParams()
      .set('api_key',this.apiKey)
      .set('limit','10')
      .set('q',query);
    
    //ejemplo1 de consumo htttp javaScript
    //fetch("http://api.giphy.com/v1/gifs/search?api_key=zKz8MKzV65FztX6eGvM0wtmbrVCe4fde&q=Dragon Ball Z&limit=10")
    //.then(resp => {
    //  resp.json().then(data => {
    //    console.log(data);
    //  })
    //})

    //ejemplo2 consumo http con async
    //const resp = await fetch("http://api.giphy.com/v1/gifs/search?api_key=zKz8MKzV65FztX6eGvM0wtmbrVCe4fde&q=Dragon Ball Z&limit=10");
    //const data = await resp.json();
    //console.log(data);

    //ejemplo3 de consumo http a traves del servicio HTTPClient inyectado en el constructor
    //se implementa un suscribe (es como un then de una promesa)
    //los http retornan observables que permiten mucho mayo control y funcionalidad 
    //al encerrar el string entre ` permite utilizar la interpolación ${} para adicionar una variable
    //se define en el get el tipo de respuesta esperada y corresponde a la interfaz creada
    //se modifica la url para construirla a partir de variables y el objeto params
    this.http.get<SearchGIFResponse>(`${this.servicioUrl}/search`,{params : parametros})
        .subscribe( (resp: any) => {
          this._resultados = resp.data;
          localStorage.setItem('resultados',JSON.stringify(this._resultados))
        })

  }
}
