import { useState, useEffect } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FormContainer } from "../components/FormContainer";
import Loader from "../components/Loader";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../slices/usersApiSlice";
import { setCredentails } from "../slices/authSlice";
import { toast } from "react-toastify";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, navigate, redirect]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentails({ ...res }));
      navigate(redirect);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <FormContainer>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <h1
          className="app-auth-heading text-center mb-4"
          style={{ fontFamily: "'Outfit', sans-serif", letterSpacing: "-0.02em" }}
        >
          Sign In
        </h1>

        <Form onSubmit={submitHandler}>
          <Form.Group controlId="email" className="my-3 mb-4">
            <Form.Label className="fw-bold" style={{ fontSize: "0.9rem" }}>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter Email"
              value={email}
              className="app-form-control-custom"
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="password" className="my-3 mb-4">
            <Form.Label className="fw-bold" style={{ fontSize: "0.9rem" }}>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter Password"
              value={password}
              className="app-form-control-custom"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              type="submit"
              className="app-auth-btn-custom w-100 mt-2"
              disabled={isLoading}
            >
              Sign In
            </Button>
          </motion.div>
          {isLoading && <Loader />}
        </Form>

        <Row className="py-3">
          <Col className="text-center">
            <span className="text-muted">Don&apos;t have an account? </span>
            <Link
              to={redirect ? `/register?redirect=${redirect}` : "/register"}
              style={{ color: "#D4AF37", fontWeight: 600 }}
            >
              Register
            </Link>
          </Col>
        </Row>
      </motion.div>
    </FormContainer>
  );
};

export default LoginScreen;
