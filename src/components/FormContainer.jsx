import { Col, Container, Row } from "react-bootstrap";
import { motion } from "framer-motion";

export const FormContainer = ({ children }) => {
  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col xs={12} md={6} lg={4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="app-auth-container-custom"
          >
            {children}
          </motion.div>
        </Col>
      </Row>
    </Container>
  );
};
