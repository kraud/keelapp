import {AnimatePresence} from "framer-motion";
import React from "react";

// @ts-ignore
export function LocationProvider({ children }) {
    return <AnimatePresence>{children}</AnimatePresence>
}