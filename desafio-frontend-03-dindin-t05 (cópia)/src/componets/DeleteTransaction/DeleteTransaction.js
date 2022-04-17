import api from "../../services/api";
import "./DeleteTransaction.css";
import { getItem } from "../../utils/localStorage";
import Arrow from "../../assets/deleteModal.png";

function DeleteTransaction({
  handleClose,
  show,
  modalType,
  loadTransactions,
  id,
  idModal,
}) {
  const token = getItem("token");
  async function handleDelete() {
    try {
      const response = await api.delete(`transacao/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      handleClose();
      loadTransactions();
    } catch (error) {
      console.log(error.response.data.mensagem);
    }
  }
  return (
    <>
      {show && modalType == "deleteTransaction" && id == idModal && (
        <div className="container-delete">
          <img src={Arrow} className="arrow" />
          <span>Apagar item?</span>
          <div className="btn-div">
            <button onClick={handleDelete} className="btn-yes">
              Sim
            </button>
            <button onClick={handleClose} type="button" className="btn-no">
              Não
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default DeleteTransaction;
