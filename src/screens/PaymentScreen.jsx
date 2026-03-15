import { useState, useEffect } from "react";
import { Button, Col, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FormContainer } from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import { useDispatch, useSelector } from "react-redux";
import { savePaymentMethod } from "../slices/cartSlice";

const PaymentScreen = () => {
  const [paymentMethod, setPaymentMethod] = useState("PayPal");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  useEffect(() => {
    if (!shippingAddress) {
      navigate("/shipping");
    }
  }, [shippingAddress, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };

  return (
    <>
      <CheckoutSteps step1 step2 step3 />
      <FormContainer>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <h1
            className="text-center mb-4"
            style={{ fontFamily: "'Outfit', sans-serif", letterSpacing: "-0.02em" }}
          >
            Payment Method
          </h1>
          <Form onSubmit={submitHandler}>
            <Form.Group>
              <Form.Label className="fw-bold mb-3" style={{ fontSize: "0.9rem" }}>
                Select Method
              </Form.Label>
              <Col>
                <div
                  style={{
                    background: "#F8F9FA",
                    borderRadius: "16px",
                    padding: "16px 20px",
                    border: paymentMethod === "PayPal" ? "2px solid #000" : "1px solid rgba(0,0,0,0.06)",
                    transition: "all 0.3s",
                    cursor: "pointer",
                  }}
                  onClick={() => setPaymentMethod("PayPal")}
                >
                  <Form.Check
                    className="app-radio-custom"
                    type="radio"
                    label={<span className="fw-semibold">PayPal or Credit Card</span>}
                    id="PayPal"
                    name="paymentMethod"
                    value="PayPal"
                    checked={paymentMethod === "PayPal"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  ></Form.Check>
                </div>
              </Col>
            </Form.Group>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="mt-4">
              <Button type="submit" className="app-auth-btn-custom w-100">
                Continue
              </Button>
            </motion.div>
          </Form>
        </motion.div>
      </FormContainer>
    </>
  );
};

export default PaymentScreen;
