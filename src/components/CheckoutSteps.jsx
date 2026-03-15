import { Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { motion } from "framer-motion";
import { FaCheck } from "react-icons/fa";

const steps = [
  { label: "Sign In", path: "/login", key: "step1" },
  { label: "Shipping", path: "/shipping", key: "step2" },
  { label: "Payment", path: "/payment", key: "step3" },
  { label: "Place Order", path: "/placeorder", key: "step4" },
];

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  const activeSteps = { step1, step2, step3, step4 };

  return (
    <div className="d-flex justify-content-center align-items-center mb-4 flex-wrap gap-2">
      {steps.map((step, i) => {
        const isActive = activeSteps[step.key];
        const isPast = steps.slice(0, i).every((s) => activeSteps[s.key]);

        return (
          <div key={step.key} className="d-flex align-items-center">
            {i > 0 && (
              <div
                style={{
                  width: "30px",
                  height: "2px",
                  background: isPast && isActive ? "#D4AF37" : "#e0e0e0",
                  margin: "0 4px",
                  borderRadius: "1px",
                  transition: "background 0.3s",
                }}
              />
            )}
            <motion.div
              whileHover={isActive ? { scale: 1.05 } : {}}
              transition={{ type: "spring", stiffness: 400 }}
            >
              {isActive ? (
                <LinkContainer to={step.path}>
                  <Nav.Link
                    style={{
                      background: "#000",
                      color: "#D4AF37",
                      borderRadius: "9999px",
                      padding: "8px 20px",
                      fontWeight: 600,
                      fontSize: "0.85rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      textDecoration: "none",
                      border: "none",
                      transition: "all 0.3s",
                    }}
                  >
                    <FaCheck style={{ fontSize: "0.7rem" }} />
                    {step.label}
                  </Nav.Link>
                </LinkContainer>
              ) : (
                <span
                  style={{
                    background: "#F8F9FA",
                    color: "#999",
                    borderRadius: "9999px",
                    padding: "8px 20px",
                    fontWeight: 500,
                    fontSize: "0.85rem",
                    cursor: "not-allowed",
                    border: "1px solid rgba(0,0,0,0.06)",
                  }}
                >
                  {step.label}
                </span>
              )}
            </motion.div>
          </div>
        );
      })}
    </div>
  );
};

export default CheckoutSteps;
