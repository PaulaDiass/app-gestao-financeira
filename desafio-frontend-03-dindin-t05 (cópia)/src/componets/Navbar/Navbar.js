import "./Navbar.css";
import Profile from "../../assets/profile.png";
import Logout from "../../assets/exit.png";
import { getItem, clear } from "../../utils/localStorage";
import { useNavigate } from "react-router-dom";

function Navbar({ handleOpen }) {
  const name = getItem("name");
  const navigate = useNavigate();

  function handleLogout() {
    clear();
    navigate("/");
  }

  return (
    <div className="container-navbar">
      <img
        onClick={handleOpen}
        src={Profile}
        alt="profile"
        className="editUser"
      />
      <strong>{name}</strong>
      <img onClick={handleLogout} src={Logout} alt="logout" />
    </div>
  );
}

export default Navbar;
