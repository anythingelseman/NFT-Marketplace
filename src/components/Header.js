import { Link, Outlet } from "react-router-dom";

const Header = (props) => {
  if (!props.defaultAccount) return <Outlet />;

  return (
    <div>
      <h1>Header</h1>
      <p>Navbar: </p>
      <Link to="/">Transition</Link>
      <br />
      <Link to="/networks"> Networks</Link>
      <Outlet />
    </div>
  );
};

export default Header;
