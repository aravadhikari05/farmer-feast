"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { motion } from "framer-motion";

const dishes = [
  "Pasta Primavera",
  "Chicken Parmesan",
  "Vegan Tacos",
  "Ratatouille",
  "Tofu Stir Fry",
];

export default function SearchPage() {
  const [placeholder, setPlaceholder] = useState("");
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const fullText = `Try '${dishes[index]}'`;
    if (hasInteracted) {
      setPlaceholder(fullText);
      return;
    }

    const speed = isDeleting ? 40 : 80;
    const timeout = setTimeout(() => {
      if (isDeleting) {
        setPlaceholder((prev) => prev.slice(0, -1));
      } else {
        setPlaceholder((prev) => fullText.slice(0, prev.length + 1));
      }

      if (!isDeleting && placeholder === fullText) {
        setTimeout(() => setIsDeleting(true), 1000);
      }

      if (isDeleting && placeholder === "") {
        setIsDeleting(false);
        setIndex((prev) => (prev + 1) % dishes.length);
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [placeholder, isDeleting, index, hasInteracted]);

  return (
    <div
      className="w-full flex flex-col justify-center items-center px-4"
      style={{ minHeight: "calc(100vh - 233px)" }}
    >
      {" "}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-4xl font-bold text-center"
      >
        Find Recipes
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="text-muted-foreground mt-4 text-center max-w-md"
      >
        Enter a dish name and we’ll fetch the ingredients and show where to get
        them.
      </motion.p>
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="flex w-full max-w-xl items-center justify-center mt-8"
        onSubmit={(e) => {
          e.preventDefault();
          // hook up search logic here
        }}
      >
        <div className="flex w-full max-w-xl rounded-lg overflow-hidden shadow-[0_2px_6px_rgba(0,0,0,0.15)]">
          {/* Search Icon */}
          <div className="flex items-center justify-center px-3 bg-white dark:bg-white text-primary">
            <Search className="w-5 h-5" />
          </div>

          {/* Input */}
          <input
            type="text"
            placeholder={placeholder}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setHasInteracted(true);
            }}
            className="flex-1 py-2.5 px-2 text-base bg-white dark:bg-white text-primary placeholder:text-primary/60 focus:outline-none"
          />

          {/* Button */}
          <button
            type="submit"
            className="px-4 py-2.5 bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition rounded-none"
          >
            Search
          </button>
        </div>
      </motion.form>
    </div>
  );
}
