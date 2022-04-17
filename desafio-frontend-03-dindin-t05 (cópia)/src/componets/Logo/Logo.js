import "./Logo.css";
import Logo from "../../assets/logo.png";

function LogoDindin() {
  return (
    <div className="container-logo">
      <img src={Logo} alt="logo" />
      <h1>Dindin</h1>
    </div>
  );
}

export default LogoDindin;
