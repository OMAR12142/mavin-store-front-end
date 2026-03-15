import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import mavin from "../assets/mavin.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
  }),
};

export const LandingComp = () => {
  return (
    <div className="app-hero-section bg-dark text-white py-4 py-sm-5">
      <Container fluid className="px-2 px-sm-3 px-md-4 px-lg-5">
        <Row className="align-items-center justify-content-center min-vh-50 mx-0">
          <Col
            xs={12}
            lg={6}
            className="text-center text-lg-start mb-4 mb-lg-0 px-3 px-sm-4 px-lg-5 order-2 order-lg-1"
          >
            <motion.h1
              className="display-5 display-md-4 display-lg-3 fw-bold mb-3 mb-md-4"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0}
            >
              Welcome to
              <strong className="text-warning text-uppercase"> MAVIN </strong>
            </motion.h1>

            <motion.p
              className="lead mb-3 mb-md-4 fs-6 fs-md-5 fs-lg-4 lh-base"
              style={{ color: "rgba(255,255,255,0.8)" }}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={1}
            >
              Discover the latest products with amazing quality and competitive
              prices. Shop now and experience the best online shopping
              experience.
            </motion.p>

            <motion.div
              className="d-flex flex-column flex-sm-row gap-2 gap-sm-3 justify-content-center justify-content-lg-start"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={2}
            >
              <Button
                as={Link}
                to="/allproducts"
                className="px-4 px-lg-5 py-2 py-md-3 bg-white text-black border-0 fw-bold text-decoration-none"
                style={{ borderRadius: "20px" }}
              >
                Shop Now
              </Button>
            </motion.div>
          </Col>

          <Col
            xs={12}
            lg={6}
            className="text-center order-1 order-lg-2 px-3 px-sm-4 px-lg-5 mb-4 mb-lg-0"
          >
            <motion.img
              src={mavin}
              alt="MAVIN Shopping Experience"
              className="img-fluid w-100"
              style={{
                maxHeight: "400px",
                objectFit: "cover",
                borderRadius: "20px",
              }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LandingComp;
