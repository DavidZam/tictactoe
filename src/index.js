import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

  function Celda(props) {
    return (
      <button className="celda" onClick={props.onClick}>
        {props.value}
        {/* {props.celdaGanadora} */}
      </button>
    );
  }

  class Tablero extends React.Component {
    renderCelda(i, columna, fila) {
      return (
        <Celda 
          key={i}
          value={this.props.celdas[i]}
          color={null}
          // celdaGanadora={false}
          onClick={() => this.props.onClick(i, columna, fila)}
        />
      );
    }

    crearTablero = () => {
      let fila = [];
      // Bucle exterior para crear la fila
      for(let i = 0; i < 3; i++) {
        let celda = [];
        // Bucle interior para crear la celda
        for(let j = 0; j < 3; j++) {
          celda.push(
            this.renderCelda(j + (i * 3), j + 1, i + 1)
          )
          // Creamos el tablero y añadimos la fila
        }
        fila.push(
          <div key={i} className="tablero-fila">
            {celda}
          </div>
        )
      }
      return fila;
    }
  
    render() {
      return (
        // <div>
        //   <div className="tablero-fila">
        //     {this.renderCelda(0)}
        //     {this.renderCelda(1)}
        //     {this.renderCelda(2)}
        //   </div>
        //   <div className="tablero-fila">
        //     {this.renderCelda(3)}
        //     {this.renderCelda(4)}
        //     {this.renderCelda(5)}
        //   </div>
        //   <div className="tablero-fila">
        //     {this.renderCelda(6)}
        //     {this.renderCelda(7)}
        //     {this.renderCelda(8)}
        //   </div>
        // </div>

        // Resultado tras generar el tablero con dos bucles for
        <div className="ml-3 mb-3">
          {this.crearTablero()}
        </div>
      );
    }
  }

  class Juego extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        historial: [{
          celdas: Array(9).fill(null),
        }],
        coordenadas: [{
            filas: Array(1).fill(null),
            columnas: Array(1).fill(null)
        }],
        pasoNumero: 0,
        tocaX: true,
        historialOrdenAscendente: true,
        textoOrden: 'ascendente'
      };
    }

    cambiarOrden() {
      // Obtenemos el historial del state de Juego
      // let historial = this.state.historial;
      // // Hacemos un reverse del historial guardado en el state
      // historial = this.state.historial.reverse();
      // // Eliminamos el ultimo elemento del historial
      // historial.pop();
      // // Creamos un array de celdas con 9 posiciones nulas
      // const celdas = new Array(9).fill(null);
      // const elementoVacio = { celdas };
      // // Añadimos el nuevo array vacio celdas a partir del índice historial.length
      // historial[historial.length] = elementoVacio;

      // this.state.historialOrdenAscendente = !this.state.historialOrdenAscendente;
      let textoOrden;
      let historialOrdenAscendente = !this.state.historialOrdenAscendente;
      if (historialOrdenAscendente) {
        textoOrden = 'ascendente';
      } else {
        textoOrden = 'descendente';
      }

      // Cambiamos el estado para indicar que se ordena de manera distina
      this.setState({
        // historial: historial,
        historialOrdenAscendente: historialOrdenAscendente,
        textoOrden: textoOrden
      });
    }

    handleClick(i, columnaClickada, filaClickada) {
      const historial = this.state.historial.slice(0, this.state.pasoNumero + 1);
      const actual = historial[historial.length - 1];
      const celdas = actual.celdas.slice();
      const coordenadas = this.state.coordenadas.slice(0, this.state.pasoNumero + 1);
      const coordenadaActual = coordenadas[coordenadas.length - 1];
      const filas = coordenadaActual.filas.slice();
      const columnas = coordenadaActual.columnas.slice();
      filas[coordenadas.length - 1] = filaClickada;
      columnas[coordenadas.length - 1] = columnaClickada;
      if (calculaGanador(celdas) || celdas[i]) {
        return;
      }
      celdas[i] = this.state.tocaX ? 'X' : 'O';
      this.setState({
        historial: historial.concat([{
          celdas: celdas
        }]),   
        coordenadas: coordenadas.concat([{
          filas: filas,
          columnas: columnas
        }]),        
        pasoNumero: historial.length,
        tocaX: !this.state.tocaX
      });
    }

    saltarA(paso) {
      const nuevoHistorial = this.state.historial.slice(0, paso + 1);
      const nuevasCoordenadas = this.state.coordenadas.slice(0, paso + 1);
      this.setState({
        historial: nuevoHistorial,
        coordenadas: nuevasCoordenadas,
        pasoNumero: paso,
        tocaX: (paso % 2) === 0
      });
    }

    render() {
      const historial = this.state.historial;
      const coordenadas = this.state.coordenadas;
      
      const actual = historial[this.state.pasoNumero];
      const coordenadaActual = coordenadas[this.state.pasoNumero];

      const ganador = calculaGanador(actual.celdas);
      
      const movimientos = historial.map((paso, movimiento) => {
        if(!this.state.historialOrdenAscendente) {
          movimiento = this.state.pasoNumero - movimiento;
        }
        const desc = movimiento ?
          'Ir al ' + movimiento + 'º movimiento ' + '(' +
          coordenadaActual.filas[movimiento - 1] + ',' + coordenadaActual.columnas[movimiento - 1] + ')':
          'Ir al inicio del juego';
        // Comprobamos si es el ultimo movimiento
        if (movimiento === historial.length - 1) { // Si no es el ultimo pintamos el boton en negrita
          return (
            <li key={movimiento} className="bold">
              <button className="bold" onClick={() => this.saltarA(movimiento)}>{desc}</button>
            </li>
          )
        } else { // Si no es el ultimo pintamos el boton normal
          return (
            <li key={movimiento}>
              <button onClick={() => this.saltarA(movimiento)}>{desc}</button>
            </li>
          )
        }
      });

      let estado;
      if (ganador) {
        estado = 'Ganador ' + ganador;
      } else {
        estado = 'Siguiente jugador: ' + (this.state.tocaX ? 'X' : 'O');
      }
      
      return (
        <div className="juego">
          <div className="juego-tablero">
            <Tablero 
              celdas={actual.celdas}
              onClick={(i, columna, fila) => this.handleClick(i, columna, fila)}
            />
            <div>{estado}</div>
          </div>
          <div className="juego-info">
          <button onClick={() => this.cambiarOrden()}>Cambiar orden (actual: {this.state.textoOrden})</button>
            <ol>{movimientos}</ol>
          </div>
        </div>
      );
    }
  }

  function calculaGanador(celdas) {
    const lineas = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lineas.length; i++) {
      const [a, b, c] = lineas[i];
      if (celdas[a] && celdas[a] === celdas[b] && celdas[a] === celdas[c]) {
        // celdas[a].celdaGanadora = true;
        // celdas[b].celdaGanadora = true;
        // celdas[c].celdaGanadora = true;
        // this.setState({
        //     historial: historial.concat([{
        //       celdas: celdas
        //     }]) 
        // });
        return celdas[a];
      }
    }
    return null;
  }

  // ========================================
  
  ReactDOM.render(
    <Juego />,
    document.getElementById('root')
  );
  