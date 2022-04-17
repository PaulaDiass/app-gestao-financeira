import "./Main.css";
import Filter from "../../assets/filter.png";
import Sort from "../../assets/sort.png";
import { useEffect, useState, useRef } from "react";
import api from "../../services/api";
import { getItem, clear } from "../../utils/localStorage";
import LogoDindin from "../../componets/Logo/Logo";
import Navbar from "../../componets/Navbar/Navbar";
import EditUser from "../../componets/EditUser/EditUser";
import Summary from "../../componets/Summary/Summary";
import Transaction from "../../componets/Transaction/Transaction";
import AddTransaction from "../../componets/AddTransaction/AddTransaction";
import DeleteTransaction from "../../componets/DeleteTransaction/DeleteTransaction";
import { useNavigate } from "react-router-dom";

function Main() {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ entrada: 0, saida: 0 });
  const [userInfo, setUserInfo] = useState({});
  const [form, setForm] = useState({});
  const [categories, setCategories] = useState({});
  const [sort, setSort] = useState("asc");
  const [showModal, setShowModal] = useState(false);
  const [idModalDelete, setIdModalDelete] = useState(null);
  const [modalType, setModalType] = useState("");
  const sortIconRef = useRef(null);
  const token = getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    loadTransactions();
    loadUserData();
    loadCategories();
  }, []);

  async function loadTransactions() {
    try {
      const { data } = await api.get("/transacao", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTransactions(data);
      loadSummary();
    } catch (error) {
      console.log(error.response.data.mensagem);
      clear();
      navigate("/");
    }
  }

  async function loadSummary() {
    try {
      const { data } = await api.get("/transacao/extrato", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSummary(data);
    } catch (error) {
      console.log(error.response.data.mensagem);
    }
  }

  async function loadUserData() {
    try {
      const { data } = await api.get("/usuario", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUserInfo(data);
    } catch (error) {
      console.log(error.response.data.mensagem);
    }
  }

  async function loadCategories() {
    try {
      const response = await api.get("/categoria", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories(response.data);
    } catch (error) {
      console.log(error.response.data.mensagem);
    }
  }

  function handleDataSort(sort) {
    const localTransactions = [...transactions];
    if (sort === "asc") {
      localTransactions.sort((a, b) => {
        if (a.data > b.data) {
          return 1;
        }
        if (a.data < b.data) {
          return -1;
        }
        return 0;
      });
      setSort("desc");
      sortIconRef.current.classList.remove("flip");
    } else if (sort === "desc") {
      localTransactions.sort((a, b) => {
        if (a.data < b.data) {
          return 1;
        }
        if (a.data > b.data) {
          return -1;
        }
        return 0;
      });
      setSort("asc");
      sortIconRef.current.classList.add("flip");
    }

    setTransactions(localTransactions);
  }

  function handleOpenModal(e) {
    if (e.target.className === "deleteTransaction") {
      setIdModalDelete(e.target.id);
    }
    setModalType(e.target.className);
    setShowModal(true);
  }

  function handleCloseModal() {
    setShowModal(false);
  }

  function handleClickEdit(e, transaction) {
    handleOpenModal(e);
    setForm({
      id: transaction.id,
      type: transaction.tipo,
      description: transaction.descricao,
      value: transaction.valor,
      date: transaction.data,
      category: transaction.categoria_id,
    });
  }

  return (
    <div className="container-main">
      <div className="container-main-header">
        <div className="main-header">
          <LogoDindin />
          <Navbar handleOpen={handleOpenModal} />
        </div>
      </div>
      <div className="main-dashboard">
        <div className="dashboard-filter box-shadow">
          <img src={Filter} alt="filtrar" />
          <strong>Filtrar</strong>
        </div>
        <div className="dashboard-filter-content hidden">
          <h2>Categoria</h2>
          <span>1</span>
          <span>2</span>
          <span>3</span>
          <button>Limpar Filtros</button>
          <button>Aplicar Filtros</button>
        </div>
        <div className="container-dashboard">
          <div className="dashboard-left">
            <div className="transactions-header box-shadow">
              <span
                onClick={() => handleDataSort(sort)}
                className="header-sort data-span"
              >
                Data
                <img src={Sort} alt="ordenar" ref={sortIconRef} className="x" />
              </span>
              <span className="day-span">Dia da semana</span>
              <span className="description-span">Descrição</span>
              <span className="category-span">Categoria</span>
              <span className="value-span">Valor</span>
              <span className="blank"></span>
            </div>
            <div className="transactions-content">
              {transactions.map((item) => {
                return (
                  <div key={item.id} className="transaction-row">
                    <Transaction
                      transaction={{ ...item }}
                      show={showModal}
                      modalType={modalType}
                      handleOpen={handleOpenModal}
                      handleClickEdit={handleClickEdit}
                    />
                    <DeleteTransaction
                      id={item.id}
                      idModal={idModalDelete}
                      handleClose={handleCloseModal}
                      show={showModal}
                      modalType={modalType}
                      loadTransactions={loadTransactions}
                    />
                  </div>
                );
              })}
            </div>
          </div>
          <div className="dashboard-right">
            <Summary debit={summary.saida} credit={summary.entrada} />
            <button
              onClick={(e) => handleOpenModal(e)}
              className="addTransaction"
            >
              Adicionar Registro
            </button>
          </div>
        </div>
      </div>
      {showModal &&
        (modalType === "addTransaction" || modalType === "editTransaction") && (
          <AddTransaction
            handleClose={handleCloseModal}
            show={showModal}
            modalType={modalType}
            loadTransactions={loadTransactions}
            transactionForm={form}
            categories={categories}
          />
        )}

      {showModal && modalType === "editUser" && (
        <EditUser
          handleClose={handleCloseModal}
          show={showModal}
          modalType={modalType}
          loadUser={loadUserData}
          userInfo={userInfo}
        />
      )}
    </div>
  );
}

export default Main;
