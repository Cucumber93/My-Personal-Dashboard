import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">Logo</div>
        <div className="user-profile">
          <span className="username">Cucumber</span>
          <div className="avatar">
            <img src="https://i.pravatar.cc/150?img=1" alt="User Avatar" />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;

