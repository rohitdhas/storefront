import React from "react";
import { motion } from "framer-motion";
import { ProgressSpinner } from "primereact/progressspinner";

const Loader: React.FC<{ loading: boolean }> = React.memo(({ loading }) => {
  if (!loading) return <></>;
  return (
    <motion.div
      initial={{ y: 200 }}
      animate={{ y: 0 }}
      exit={{ y: 200 }}
      className="flex justify-evenly align items-center
     bg-blue-100 p-6 rounded-md fixed right-6 bottom-6 shadow-sm"
    >
      <ProgressSpinner
        style={{ width: "40px", height: "40px" }}
        strokeWidth="4"
        animationDuration=".5s"
      />
      <p className="ml-3 font-bold text-slate-800">Loading.. Hold tight</p>
    </motion.div>
  );
});

export default Loader;
