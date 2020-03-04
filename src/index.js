import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

  function Celda(props) {
    return (
      <button className="celda" onClick={props.onClick}>
        {props.value}
      </button>
    );
  }

  class Tablero extends React.Component {
    renderCelda(i, columna, fila) {
      return (
        <Celda 
          value={this.props.celdas[i]}
          onClick={() => this.props.onClick(i, columna, fila)}
        />
      );
    }
  
    render() {
      return (
        <div>
          <div className="tablero-fila">
            {this.renderCelda(0, 1, 1)}
            {this.renderCelda(1, 2, 1)}
            {this.renderCelda(2, 3, 1)}
          </div>
          <div className="tablero-fila">
            {this.renderCelda(3, 1, 2)}
            {this.renderCelda(4, 2, 2)}
            {this.renderCelda(5, 3, 2)}
          </div>
          <div className="tablero-fila">
            {this.renderCelda(6, 1, 3)}
            {this.renderCelda(7, 2, 3)}
            {this.renderCelda(8, 3, 3)}
          </div>
        </div>
      );
    }
  }

  class Juego extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        historial: [{
          celdas: Array(9).fill(null)
        }],
        coordenadas: [{
            filas: Array(1).fill(null),
            columnas: Array(1).fill(null)
        }],
        pasoNumero: 0,
        tocaX: true,
      };
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
      this.setState({
        // REVISAR
        // historial: this.state.historial.slice(paso + 1, this.state.historial.length - 1),
        // coordenadas: this.state.coordenadas.slice(paso + 1, this.state.coordenadas.length - 1),
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
        const desc = movimiento ?
          'Ir al ' + movimiento + 'º movimiento ' + '(' +
          coordenadaActual.filas[movimiento - 1] + ',' + coordenadaActual.columnas[movimiento - 1] + ')':
          'Ir al inicio del juego';
        return (
          <li key={paso}>
            <button onClick={() => this.saltarA(movimiento)}>{desc}</button>
          </li>
        )
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
          </div>
          <div className="juego-info">
            <div>{estado}</div>
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
  