import Navbar from '../components/Common/BackButton';
import Menu from '../components/Buttons/MenuButton';
import '../components/Buttons/Menu.css';

export default function MenuPage() {
  return (
    <div className="menu">
      <Navbar />
      <Menu />
    </div>
  );
}
