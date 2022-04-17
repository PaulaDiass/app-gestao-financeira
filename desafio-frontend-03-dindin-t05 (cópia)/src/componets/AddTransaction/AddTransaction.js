import "./AddTransaction.css";
import { useEffect, useState } from "react";
import Close from "../../assets/close.png";
import api from "../../services/api";
import { getItem } from "../../utils/localStorage";
import { format } from "date-fns";

function TransactionModal({
  handleClose,
  modalType,
  loadTransactions,
  transactionForm,
  categories,
}) {
  const [form, setForm] = useState({
    type: "saida",
    description: "",
    value: 0,
    date: new Date(),
    category: "",
  });
  const [warning, setWarning] = useState("");
  const token = getItem("token");

  useEffect(() => {
    if (modalType === "editTransaction") {
      setForm({
        type: transactionForm.type,
        description: transactionForm.description,
        value: transactionForm.value,
        date: transactionForm.date,
        category: transactionForm.category,
      });
    }
  }, [transactionForm]);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      if (modalType === "addTransaction") {
        await api.post(
          "/transacao",
          {
            tipo: form.type,
            descricao: form.description,
            valor: form.value,
            data: form.date,
            categoria_id: form.category,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else if (modalType === "editTransaction") {
        await api.put(
          `/transacao/${transactionForm.id}`,
          {
            tipo: form.type,
            descricao: form.description,
            valor: form.value,
            data: form.date,
            categoria_id: form.category,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      handleClose();
      loadTransactions();
    } catch (error) {
      setWarning(error.response.data.mensagem);
    }
  }

  return (
    <>
      <div className="transaction-modal">
        <div className="container-transaction-modal">
          {modalType === "addTransaction" ? (
            <h1>Adicionar Registro</h1>
          ) : (
            <h1>Editar Registro</h1>
          )}
          <img onClick={handleClose} src={Close} alt="fechar" />
          <form onSubmit={(e) => handleSubmit(e)} className="transaction-form">
            <div className="form-buttons">
              <button
                type="button"
                name="type"
                style={{
                  backgroundColor:
                    form.type === "entrada" ? "#3A9FF1" : "#B9B9B9",
                }}
                onClick={(e) =>
                  setForm({ ...form, [e.target.name]: "entrada" })
                }
              >
                Entrada
              </button>
              <button
                type="button"
                name="type"
                style={{
                  backgroundColor:
                    form.type === "saida" ? "#FF576B" : "#B9B9B9",
                }}
                onClick={(e) => setForm({ ...form, [e.target.name]: "saida" })}
              >
                Saída
              </button>
            </div>
            <label>
              Valor
              <br />
              <input
                name="value"
                type="number"
                min="0"
                value={form.value}
                onChange={(e) =>
                  setForm({ ...form, [e.target.name]: e.target.value })
                }
                required
              />
            </label>
            <label>
              Categoria
              <br />
              <select
                value={form.category}
                onChange={(e) => {
                  setForm({ ...form, category: e.target.value });
                }}
              >
                <option></option>
                {categories.map((category) => {
                  return (
                    <option
                      key={category.id}
                      name={category.descricao}
                      value={category.id}
                    >
                      {category.descricao}
                    </option>
                  );
                })}
              </select>
            </label>
            <label>
              Data
              <br />
              <input
                name="date"
                type="date"
                value={format(new Date(form.date), "yyyy-MM-dd")}
                onChange={(e) =>
                  setForm({ ...form, [e.target.name]: e.target.value })
                }
                required
              />
            </label>
            <label>
              Descrição
              <br />
              <input
                name="description"
                type="text"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, [e.target.name]: e.target.value })
                }
                maxlength="30"
                required
              />
            </label>
            {warning && <p>{warning}</p>}
            <button type="submit" className="btn-confirmar">
              Confirmar
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default TransactionModal;
