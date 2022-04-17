import "./EditUser.css";
import { useState, useEffect } from "react";
import Close from "../../assets/close.png";
import api from "../../services/api";
import { getItem } from "../../utils/localStorage";

function EditUserModal({ handleClose, loadUserData, userInfo }) {
  const [form, setForm] = useState({});
  const [warning, setWarning] = useState("");
  const [verifiedPassword, setVerifiedPassword] = useState();
  const token = getItem("token");

  useEffect(() => {
    setForm({
      name: userInfo.nome,
      email: userInfo.email,
      password: "",
      verifyPassword: "",
    });
  }, [userInfo]);

  useEffect(() => {
    if (form.password === form.verifyPassword) {
      setVerifiedPassword(true);
      setWarning("");
    } else {
      setVerifiedPassword(false);
      setWarning("Senhas não confirmam");
    }
  }, [form]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!verifiedPassword) {
      return;
    }

    try {
      await api.put(
        "/usuario",
        {
          nome: form.name,
          email: form.email,
          senha: form.password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      handleClose();
      loadUserData();
    } catch (error) {
      setWarning(error.response.data.mensagem);
    }
  }

  return (
    <>
      <div className="edit-user-modal">
        <div className="container-edit-user">
          <h1>Editar Perfil</h1>
          <img onClick={handleClose} src={Close} alt="fechar" />
          <form onSubmit={handleSubmit} className="user-form">
            <label>
              Nome
              <br />
              <input
                name="name"
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, [e.target.name]: e.target.value })
                }
                required
              />
            </label>
            <label>
              E-mail
              <br />
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, [e.target.name]: e.target.value })
                }
                required
              />
            </label>
            <label>
              Senha
              <br />
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, [e.target.name]: e.target.value })
                }
                required
              />
            </label>
            <label>
              Confirmação de senha
              <br />
              <input
                name="verifyPassword"
                type="password"
                value={form.verifyPassword}
                onChange={(e) =>
                  setForm({ ...form, [e.target.name]: e.target.value })
                }
                required
              />
            </label>
            {warning && <p>{warning}</p>}
            <button type="submit" className="btn-edit-user">
              Confirmar
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default EditUserModal;
