import { Link } from 'react-router-dom';
import ListModeSelector from '../listModeSelector/listModeSelector';
import RootSelector from '../rootSelector/rootSelector';

export default function () {
  return (
    <header className="header">
      <div className="header-inner">
        <h1>
          <Link to="/">Note of Composure</Link>
        </h1>
        <div className="header-controls">
          <RootSelector />
          <ListModeSelector />
        </div>
      </div>
    </header>
  );
}
