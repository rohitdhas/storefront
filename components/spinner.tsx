import React from "react";
import { motion } from "framer-motion";
import { ProgressSpinner } from "primereact/progressspinner";
import Image from "next/image";

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

export const PageLoader: React.FC = React.memo(() => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-screen flex align items-center justify-center flex-col"
    >
      <motion.div
        transition={{
          repeat: Infinity,
          repeatDelay: 0.6,
          duration: 0.6,
          repeatType: "reverse",
        }}
        initial={{ rotate: 0, scale: 1 }}
        animate={{ rotate: 360, scale: 0.5 }}
        exit={{ rotate: 0, scale: 1 }}
      >
        <Image
          src={"/logo.svg"}
          height={100}
          width={100}
          alt="Storefront Logo"
        />
      </motion.div>
      <p className="text-xl font-bold text-slate-700 my-4">Loading . . .</p>
    </motion.div>
  );
});

export default Loader;
