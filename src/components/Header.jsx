import { Navbar, Nav, Container, Badge, NavDropdown } from "react-bootstrap";
import { FaUser, FaShoppingCart } from "react-icons/fa";
import nav_logo from "../assets/nav_logo.png";
import { useNavigate } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "../slices/usersApiSlice";
import { logout } from "../slices/authSlice";
import SeacrhBox from "./SeacrhBox";

const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const HandleLogOut = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <header style={{ position: "relative", zIndex: 1030 }}>
      <Navbar
        expand="lg"
        collapseOnSelect
        className="app-navbar-custom"
        style={{
          position: "relative",
          zIndex: 1030,
        }}
      >
        <Container fluid className="px-3 px-sm-4 px-lg-5">
          <LinkContainer to="/">
            <Navbar.Brand className="app-logo-text text-decoration-none d-flex align-items-center">
              <img
                src={nav_logo}
                alt=" Logo"
                className="me-2 app-logo-img"
                style={{ height: "35px" }}
              />
            </Navbar.Brand>
          </LinkContainer>

          <div
            className="d-none d-lg-block mx-auto"
            style={{ maxWidth: "500px", width: "100%" }}
          >
            <SeacrhBox />
          </div>

          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            className="app-navbar-toggle border-1"
          />

          <Navbar.Collapse
            id="basic-navbar-nav"
            style={{ position: "relative", zIndex: 1030 }}
          >
            <Nav className="ms-auto align-items-lg-center flex-column flex-lg-row gap-2 gap-lg-3">
              <div className="d-lg-none w-100 mb-3">
                <SeacrhBox />
              </div>

              <LinkContainer to="/">
                <Nav.Link className="nav-link-custom text-decoration-none text-center text-lg-start">
                  <strong className="fs-6 fs-lg-5">Home</strong>
                </Nav.Link>
              </LinkContainer>

              <LinkContainer to="allproducts">
                <Nav.Link className="nav-link-custom text-decoration-none text-center text-lg-start">
                  <strong className="fs-6 fs-lg-5">Products</strong>
                </Nav.Link>
              </LinkContainer>

              <LinkContainer to="/cart">
                <Nav.Link className="nav-link-custom app-cart-link text-decoration-none text-center text-lg-start">
                  <div className="app-cart-container text-decoration-none d-flex align-items-center justify-content-center justify-content-lg-start gap-2 position-relative">
                    <FaShoppingCart className="app-cart-icon fs-5" />
                    <strong className="app-cart-text fs-6 fs-lg-5">Cart</strong>
                    {cartItems.length > 0 && (
                      <Badge
                        pill
                        className="app-cart-badge bg-black position-absolute top-0 start-100 translate-middle d-flex align-items-center justify-content-center"
                        style={{
                          minWidth: "20px",
                          height: "20px",
                          fontSize: "0.7rem",
                          padding: "0",
                        }}
                      >
                        {cartItems.reduce((a, c) => a + c.quantity, 0)}
                      </Badge>
                    )}
                  </div>
                </Nav.Link>
              </LinkContainer>

              {userInfo ? (
                <>
                  <NavDropdown
                    title={
                      <strong className="app-user-name text-decoration-none d-flex align-items-center">
                        <FaUser className="me-1 text-decoration-none fs-6" />
                        <span className="fs-6 fs-lg-5">{userInfo.name}</span>
                      </strong>
                    }
                    id="username"
                    className="nav-link-custom app-user-dropdown text-decoration-none text-center text-lg-start"
                    style={{ position: "relative", zIndex: 1031 }}
                    align="end"
                  >
                    <LinkContainer to="/profile">
                      <NavDropdown.Item className="bg-white text-black app-dropdown-item text-decoration-none py-2">
                        Profile
                      </NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Divider />
                    <NavDropdown.Item
                      onClick={HandleLogOut}
                      className="app-dropdown-item app-logout-item text-decoration-none py-2"
                    >
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>

                  {userInfo.isAdmin && (
                    <NavDropdown
                      title={
                        <span className="fs-6 fs-lg-5">AdminDashbord</span>
                      }
                      id="adminmenu"
                      className="nav-link-custom app-admin-dropdown text-decoration-none text-center text-lg-start"
                      style={{ position: "relative", zIndex: 1031 }}
                      align="end"
                    >
                      <LinkContainer to="/admin/productslist">
                        <NavDropdown.Item className="app-dropdown-item text-decoration-none py-2">
                          Products
                        </NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/orderlist">
                        <NavDropdown.Item className="app-dropdown-item text-decoration-none py-2">
                          Orders
                        </NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/userlist">
                        <NavDropdown.Item className="app-dropdown-item text-decoration-none py-2">
                          Users
                        </NavDropdown.Item>
                      </LinkContainer>
                    </NavDropdown>
                  )}
                </>
              ) : (
                <LinkContainer to="/login">
                  <Nav.Link className="nav-link-custom app-signin-link text-decoration-none text-center text-lg-start">
                    <div className="d-flex align-items-center justify-content-center justify-content-lg-start gap-2">
                      <FaUser className="me-1 text-decoration-none fs-6" />
                      <strong className="fs-6 fs-lg-5">Sign In</strong>
                    </div>
                  </Nav.Link>
                </LinkContainer>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
