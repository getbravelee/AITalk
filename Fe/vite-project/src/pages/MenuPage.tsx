import Navbar from "../components/Navbar";
import Menu from "../components/MenuButton";
import '../styles/Menu.css';

export default function MenuPage() {
  return (
    <div className="menu">
      <Navbar />
      <Menu />
    </div>
  );
}