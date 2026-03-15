import { motion } from "framer-motion";

function Loader() {
  return (
    <div className="d-flex justify-content-center align-items-center py-4">
      <motion.div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          border: "3px solid rgba(212, 175, 55, 0.15)",
          borderTop: "3px solid #D4AF37",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

export default Loader;
