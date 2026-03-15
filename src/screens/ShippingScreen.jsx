import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FormContainer } from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import { useDispatch, useSelector } from "react-redux";
import { saveShippingAddress } from "../slices/cartSlice";

const ShippingScreen = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress?.address || "");
  const [city, setCity] = useState(shippingAddress?.city || "");
  const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || "");
  const [country, setCountry] = useState(shippingAddress?.country || "");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    navigate("/payment");
  };

  return (
    <>
      <CheckoutSteps step1 step2 />
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
            Shipping
          </h1>

          <Form onSubmit={submitHandler}>
            <Form.Group controlId="address" className="my-3">
              <Form.Label className="fw-bold" style={{ fontSize: "0.9rem" }}>Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Address"
                value={address}
                className="app-form-control-custom"
                onChange={(e) => setAddress(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="city" className="my-3">
              <Form.Label className="fw-bold" style={{ fontSize: "0.9rem" }}>City</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter City"
                value={city}
                className="app-form-control-custom"
                onChange={(e) => setCity(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="postalCode" className="my-3">
              <Form.Label className="fw-bold" style={{ fontSize: "0.9rem" }}>Postal Code</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Postal Code"
                value={postalCode}
                className="app-form-control-custom"
                onChange={(e) => setPostalCode(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="country" className="my-3 mb-4">
              <Form.Label className="fw-bold" style={{ fontSize: "0.9rem" }}>Country</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Country"
                value={country}
                className="app-form-control-custom"
                onChange={(e) => setCountry(e.target.value)}
              />
            </Form.Group>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
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

export default ShippingScreen;
