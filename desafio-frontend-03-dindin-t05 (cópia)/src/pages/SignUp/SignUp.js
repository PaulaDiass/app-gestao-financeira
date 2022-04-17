import "./SignUp.css";
import { useEffect, useState } from "react";
import api from "../../services/api";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../componets/Logo/Logo";

function SignUp() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    verifyPassword: "",
  });
  const [warning, setWarning] = useState("");
  const [verifiedPassword, setVerifiedPassword] = useState(false);
  const navigate = useNavigate();

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
      const response = await api.post("/usuario", {
        nome: form.name,
        email: form.email,
        senha: form.password,
      });

      navigate("/");
    } catch (error) {
      setWarning(error.response.data.mensagem);
    }
  }

  return (
    <div className="container-sign-up">
      <div className="logo">
        <Logo />
      </div>
      <div className="container-sign-up-form">
        <h1>Cadastre-se</h1>
        <form onSubmit={handleSubmit} className="sign-up-form">
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
          <button type="submit" className="btn-sign-up">
            Cadastrar
          </button>
        </form>
        <span>
          Já tem cadastro? <Link to="/">Clique aqui!</Link>
        </span>
      </div>
    </div>
  );
}

export default SignUp;
