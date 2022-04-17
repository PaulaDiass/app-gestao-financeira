import "./SignIn.css";
import { useState, useEffect } from "react";
import api from "../../services/api";
import { setItem, getItem } from "../../utils/localStorage";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../componets/Logo/Logo";

function SignIn() {
  const token = getItem("token");
  const navigate = useNavigate();
  const [warning, setWarning] = useState("");
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (token) {
      navigate("/main");
    }
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await api.post("/login", {
        email: form.email,
        senha: form.password,
      });

      const { token, usuario } = response.data;
      setItem("token", token);
      setItem("name", usuario.nome);

      navigate("/main");
    } catch (error) {
      setWarning(error.response.data.mensagem);
    }
  }

  return (
    <div className="container-sign-in">
      <div className="logo">
        <Logo />
      </div>
      <div className="sign-in-left">
        <h1>Controle suas finanças, sem planilha chata.</h1>
        <h3>
          Organizar as suas finanças nunca foi tão fácil, com o DINDIN, você tem
          tudo num único lugar e em um clique de distância.
        </h3>
        <Link className="btn-sign-up" to="/sign-up">
          Cadastre-se
        </Link>
      </div>
      <div className="sign-in-right">
        <h3>Login</h3>
        <form onSubmit={handleSubmit} className="sign-in-form">
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
              value={form.senha}
              onChange={(e) =>
                setForm({ ...form, [e.target.name]: e.target.value })
              }
              required
            />
          </label>
          {warning && <p>{warning}</p>}
          <button type="submit" className="btn-sign-in">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignIn;
