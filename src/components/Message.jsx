import { Alert } from "react-bootstrap";
import { motion } from "framer-motion";

const Message = ({ variant, children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <Alert variant={variant}>{children}</Alert>
    </motion.div>
  );
};

export default Message;
