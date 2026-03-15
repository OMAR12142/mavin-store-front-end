import { useState, useEffect } from "react";
import { Form, Row, Col, Button, Table, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useProfileMutation } from "../slices/usersApiSlice";
import { toast } from "react-toastify";
import Message from "../components/Message";
import { FaTimes, FaEye, FaUserEdit } from "react-icons/fa";
import { LinkContainer } from "react-router-bootstrap";
import { setCredentails } from "../slices/authSlice";
import { useGetMyOrdersQuery } from "../slices/ordersApiSlice";
import Loader from "../components/Loader";

const Profile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
    }
  }, [userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await updateProfile({
          _id: userInfo._id,
          name,
          email,
          password,
        }).unwrap();
        dispatch(setCredentails(res));
        toast.success("Profile Updated Successfully");
        setPassword("");
        setConfirmPassword("");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Row className="app-profile-container g-4">
        <Col lg={4}>
          <Card className="app-profile-card border-0 shadow-lg" style={{ borderRadius: '20px', overflow: 'hidden' }}>
            <div className="p-4 text-center" style={{ background: '#000' }}>
              <div className="mb-3 d-inline-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(212, 175, 55, 0.1)', border: '2px solid #D4AF37' }}>
                <FaUserEdit size={32} color="#D4AF37" />
              </div>
              <h3 className="mb-0" style={{ color: '#D4AF37', fontFamily: "'Outfit', sans-serif" }}>User Profile</h3>
              <p className="text-muted small mt-2 mb-0" style={{ color: 'rgba(212, 175, 55, 0.6) !important' }}>Personalize your information</p>
            </div>
            <Card.Body className="p-4">
              <Form onSubmit={submitHandler}>
                <Form.Group controlId="name" className="mb-4">
                  <Form.Label className="fw-bold small text-uppercase" style={{ letterSpacing: '0.05em' }}>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="app-form-control-custom"
                  />
                </Form.Group>

                <Form.Group controlId="email" className="mb-4">
                  <Form.Label className="fw-bold small text-uppercase" style={{ letterSpacing: '0.05em' }}>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="app-form-control-custom"
                  />
                </Form.Group>

                <Form.Group controlId="password" style={{ position: 'relative' }} className="mb-4">
                  <Form.Label className="fw-bold small text-uppercase" style={{ letterSpacing: '0.05em' }}>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="app-form-control-custom"
                  />
                  <small className="text-muted d-block mt-2" style={{ fontSize: '0.75rem' }}>
                    Leave blank to keep current password
                  </small>
                </Form.Group>

                <Form.Group controlId="confirmPassword" style={{ position: 'relative' }} className="mb-4">
                  <Form.Label className="fw-bold small text-uppercase" style={{ letterSpacing: '0.05em' }}>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="app-form-control-custom"
                  />
                </Form.Group>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="submit"
                    className="w-100 app-auth-btn-custom py-3 mt-2"
                    disabled={loadingUpdateProfile}
                    style={{ borderRadius: '15px', fontWeight: '800' }}
                  >
                    {loadingUpdateProfile ? "Updating..." : "UPDATE PROFILE"}
                  </Button>
                </motion.div>
                {loadingUpdateProfile && <Loader />}
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={8}>
          <Card className="app-orders-card border-0 shadow-lg" style={{ borderRadius: '20px', overflow: 'hidden' }}>
            <Card.Header className="py-4 px-4 border-0" style={{ background: '#000' }}>
              <h3 className="mb-0" style={{ color: '#D4AF37', fontFamily: "'Outfit', sans-serif" }}>Order History</h3>
            </Card.Header>
            <Card.Body className="p-0">
              {isLoading ? (
                <div className="text-center py-5">
                  <Loader />
                </div>
              ) : error ? (
                <div className="p-4">
                  <Message variant="danger">
                    {error?.data?.message || error.error}
                  </Message>
                </div>
              ) : orders?.length === 0 ? (
                <div className="text-center py-5 px-4">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <FaTimes className="text-muted mb-4" size={64} style={{ opacity: 0.3 }} />
                    <h4 className="text-muted fw-bold">No Orders Found</h4>
                    <p className="text-muted">Start shopping to see your order history here.</p>
                  </motion.div>
                </div>
              ) : (
                <div className="table-responsive">
                  <Table borderless hover className="app-orders-table mb-0">
                    <thead style={{ background: '#F8F9FA' }}>
                      <tr>
                        <th className="py-3 px-4 text-uppercase small fw-bold">ID</th>
                        <th className="py-3 px-4 text-uppercase small fw-bold">Date</th>
                        <th className="py-3 px-4 text-uppercase small fw-bold">Total</th>
                        <th className="py-3 px-4 text-uppercase small fw-bold text-center">Paid</th>
                        <th className="py-3 px-4 text-uppercase small fw-bold text-center">Delivered</th>
                        <th className="py-3 px-4 text-uppercase small fw-bold text-end">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders?.map((order) => (
                        <tr key={order._id} className="align-middle" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                          <td className="py-3 px-4 fw-mono small">
                            {order._id.substring(0, 10)}...
                          </td>
                          <td className="py-3 px-4">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 fw-bold">
                            ${order.totalPrice.toFixed(2)}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {order.isPaid ? (
                              <span className="badge bg-success">Paid</span>
                            ) : (
                              <span className="badge bg-danger">Unpaid</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {order.isDelivered ? (
                              <span className="badge bg-success">Delivered</span>
                            ) : (
                              <span className="badge bg-warning">Processing</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-end">
                            <LinkContainer to={`/order/${order._id}`}>
                              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ display: 'inline-block' }}>
                                <Button
                                  variant="outline-dark"
                                  size="sm"
                                  className="px-3"
                                  style={{ borderRadius: '10px', fontWeight: '600' }}
                                >
                                  Details
                                </Button>
                              </motion.div>
                            </LinkContainer>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </motion.div>
  );
};

export default Profile;
