import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

  class Juego extends React.Component {
    render() {
      return (
        <div className="juego">
          <div className="juego-tablero">
            <Tablero />
          </div>
          <div className="juego-info">
            <div>{/* status */}</div>
            <ol>{/* TODO */}</ol>
          </div>
        </div>
      );
    }
  }

  class Tablero extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        celdas: Array(9).fill(null),
        tocaX: true,
      };
    }

    handleClick(i) {
      const celdas = this.state.celdas.slice();
      if (calculaGanador(celdas) || celdas[i]) {
        return;
      }
      celdas[i] = this.state.tocaX ? 'X' : 'O';
      this.setState({
        celdas: celdas,
        tocaX: !this.state.tocaX
      });
    }

    renderCelda(i) {
      return (
        <Celda 
          value={this.state.celdas[i]}
          onClick={() => this.handleClick(i)}
        />
      );
    }
  
    render() {
      const ganador = calculaGanador(this.state.celdas);
      let status;
      if (ganador) {
        status = 'Ganador ' + ganador;
      } else {
        status = 'Siguiente jugador: ' + (this.state.tocaX ? 'X' : 'O');
      }
  
      return (
        <div>
          <div className="status">{status}</div>
          <div className="tablero-row">
            {this.renderCelda(0)}
            {this.renderCelda(1)}
            {this.renderCelda(2)}
          </div>
          <div className="tablero-row">
            {this.renderCelda(3)}
            {this.renderCelda(4)}
            {this.renderCelda(5)}
          </div>
          <div className="tablero-row">
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
  