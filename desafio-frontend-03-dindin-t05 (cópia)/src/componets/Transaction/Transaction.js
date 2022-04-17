import "./Transaction.css";
import Edit from "../../assets/edit.png";
import Delete from "../../assets/delete.png";
import { format, getDay } from "date-fns";

function Transaction({ transaction, handleOpen, handleClickEdit }) {
  const transformedDate = format(new Date(transaction.data), "dd/MM/yyyy");
  let weekDay = "";
  function getWeekDay() {
    const weekDayNumber = getDay(new Date(transaction.data));
    switch (weekDayNumber) {
      case 0:
        weekDay = "Domingo";
        break;
      case 1:
        weekDay = "Segunda";
        break;
      case 2:
        weekDay = "Terça";
        break;
      case 3:
        weekDay = "Quarta";
        break;
      case 4:
        weekDay = "Quinta";
        break;
      case 5:
        weekDay = "Sexta";
        break;
      case 6:
        weekDay = "Sábado";
        break;
      default:
        weekDay = "erro";
        break;
    }
  }
  getWeekDay();

  let valueAsReal = "";
  function setValueAsReal() {
    valueAsReal = (transaction.valor / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }
  setValueAsReal();

  return (
    <div className="container-transaction">
      <span className="data-span">{transformedDate}</span>
      <span className="day-span">{weekDay}</span>
      <span className="description-span">{transaction.descricao}</span>
      <span className="category-span">{transaction.categoria_nome}</span>
      <span
        className="value-span"
        style={{ color: transaction.tipo == "saida" ? "#FA8C10" : "#7B61FF" }}
      >
        {valueAsReal}
      </span>
      <div className="transaction-buttons">
        <img
          id={transaction.id}
          onClick={(e) => handleClickEdit(e, transaction)}
          src={Edit}
          alt="editar"
          className="editTransaction"
        />
        <img
          id={transaction.id}
          onClick={(e) => handleOpen(e)}
          className="deleteTransaction"
          src={Delete}
          alt="deletar"
        />
      </div>
    </div>
  );
}

export default Transaction;
