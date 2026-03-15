import { Link, useNavigate, useParams } from "react-router-dom";
import {
  useGetUserDetailsQuery,
  useUpdateUserMutation,
} from "../../slices/usersApiSlice";
import { Form, Button, Card } from "react-bootstrap";
import { motion } from "framer-motion";
import Message from "../../components/Message";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { FormContainer } from "../../components/FormContainer";
import Loader from "../../components/Loader";

export const UserEdit = () => {
  const { id: userId } = useParams();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const {
    data: user,
    isLoading,
    refetch,
    error,
  } = useGetUserDetailsQuery(userId);

  const [updateuser, { isLoading: loadingUpdate }] = useUpdateUserMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setIsAdmin(user.isAdmin);
    }
  }, [user]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateuser({ userId, name, email, isAdmin }).unwrap();
      toast.success("User updated successfully");
      refetch();
      navigate("/admin/userlist");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <Link to="/admin/userlist" className="btn btn-light my-3 app-go-back-btn">
        Go Back
      </Link>
      <FormContainer>
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
        >
          <Card className="border-0 shadow-lg" style={{ borderRadius: '20px', overflow: 'hidden' }}>
            <Card.Header className="py-4 text-center" style={{ background: '#000' }}>
              <h2 className="mb-0" style={{ color: '#D4AF37', fontFamily: "'Outfit', sans-serif" }}>Edit User</h2>
            </Card.Header>
            <Card.Body className="p-4 px-lg-5">
              {loadingUpdate && <Loader />}
              {isLoading ? (
                <Loader />
              ) : error ? (
                <Message variant="danger">
                  {error?.data?.message || error.error}
                </Message>
              ) : (
                <Form onSubmit={submitHandler}>
                  <Form.Group controlId="name" className="mb-4">
                    <Form.Label className="fw-bold small text-uppercase">Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="app-form-control-custom"
                    />
                  </Form.Group>

                  <Form.Group controlId="email" className="mb-4">
                    <Form.Label className="fw-bold small text-uppercase">Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="app-form-control-custom"
                    />
                  </Form.Group>

                  <Form.Group controlId="isadmin" className="mb-5">
                    <div className="d-flex align-items-center gap-3 p-3 rounded" style={{ background: '#F8F9FA', border: '1px solid rgba(0,0,0,0.06)' }}>
                        <Form.Check
                            type="checkbox"
                            id="custom-switch"
                            label={<span className="fw-bold small text-uppercase">Grant Admin Privileges</span>}
                            checked={isAdmin}
                            onChange={(e) => setIsAdmin(e.target.checked)}
                            className="app-checkbox-custom"
                        />
                    </div>
                  </Form.Group>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="submit"
                      className="w-100 app-auth-btn-custom py-3"
                      style={{ borderRadius: '15px', fontWeight: '800' }}
                    >
                      UPDATE USER
                    </Button>
                  </motion.div>
                </Form>
              )}
            </Card.Body>
          </Card>
        </motion.div>
      </FormContainer>
    </>
  );
};

export default UserEdit;
