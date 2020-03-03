import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

  class Juego extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        historial: [{
          celdas: Array(9).fill(null),
        }],
        pasoNumero: 0,
        tocaX: true,
      };
    }

    handleClick(i) {
      const historial = this.state.historial.slice(0, this.state.pasoNumero + 1);
      const actual = historial[historial.length - 1];
      const celdas = actual.celdas.slice();
      if (calculaGanador(celdas) || celdas[i]) {
        return;
      }
      celdas[i] = this.state.tocaX ? 'X' : 'O';
      this.setState({
        historial: historial.concat([{
          celdas: celdas,
        }]),        
        pasoNumero: historial.length,
        tocaX: !this.state.tocaX
      });
    }

    saltarA(paso) {
      this.setState({
        pasoNumero: paso,
        tocaX: (paso % 2) === 0
      });
    }

    render() {
      const historial = this.state.historial;
      const actual = historial[this.state.pasoNumero];
      const ganador = calculaGanador(actual.celdas);

      const movimientos = historial.map((paso, movimiento) => {
        const desc = movimiento ?
          'Ir al ' + movimiento + 'º movimiento ()' :
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
              onClick={(i) => this.handleClick(i)}
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

  class Tablero extends React.Component {
    renderCelda(i) {
      return (
        <Celda 
          value={this.props.celdas[i]}
          onClick={() => this.props.onClick(i)}
        />
      );
    }
  
    render() {
      return (
        <div>
          <div className="tablero-fila">
            {this.renderCelda(0)}
            {this.renderCelda(1)}
            {this.renderCelda(2)}
          </div>
          <div className="tablero-fila">
            {this.renderCelda(3)}
            {this.renderCelda(4)}
            {this.renderCelda(5)}
          </div>
          <div className="tablero-fila">
            {this.renderCelda(6)}
            {this.renderCelda(7)}
            {this.renderCelda(8)}
          </div>
        </div>
      );
    }
  }

  function Celda(props) {
    return (
      <button className="celda" onClick={props.onClick}>
        {props.value}
      </button>
    );
  }

  // class Celda extends React.Component {
  //   render() {
  //     return (
  //       <button 
  //         onClick={() => this.props.onClick()}
  //         className="celda">
  //         {this.props.value}
  //       </button>
  //     );
  //   }
  // }

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
  