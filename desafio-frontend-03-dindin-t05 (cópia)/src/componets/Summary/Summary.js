import "./Summary.css";

function Summary({ debit, credit }) {
  function setValueAsReal(value) {
    return (value / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  const entrada = setValueAsReal(credit);
  const saida = setValueAsReal(debit);
  const saldo = setValueAsReal(credit - debit);

  return (
    <div className="container-summary box-shadow">
      <h2>Resumo</h2>
      <div className="summary-row">
        <span>Entradas</span>
        <span style={{ color: "#7B61FF" }}>{entrada}</span>
      </div>
      <div className="summary-row">
        <span>Saídas</span>
        <span style={{ color: "#FA8C10" }}>{saida}</span>
      </div>
      <div className="summary-row balance">
        <span>Saldo</span>
        <span style={{ color: saldo < 0 ? "#FF576B" : "#3A9FF1" }}>
          {saldo}
        </span>
      </div>
    </div>
  );
}

export default Summary;
