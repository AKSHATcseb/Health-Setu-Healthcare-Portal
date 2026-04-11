import React, { useEffect } from "react";
import Navbar from "../../components/Navbar";
import Hero from "../../components/landingPage/Hero";
import Features from "../../components/landingPage/Features";
import HowItWorks from "../../components/landingPage/HowItWorks";
import Footer from "../../components/Footer";

export default function LandingPage() {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";

    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  return (
    <div
      className="w-full min-h-screen"
      style={{
        background:
          "linear-gradient(180deg,#fbfcfd 0%, #f8fafc 60%, #ffffff 100%)",
      }}
    >
      {/* Navbar */}
      <Navbar />

      {/* Hero */}
      <Hero />

      {/* Features */}
      <section id="features" className="scroll-mt-24">
        <Features />
      </section>

      {/* How It Works */}
      <section id="howitworks" className="scroll-mt-24">
        <HowItWorks />
      </section>

      {/* Footer / Contact */}
      <section id="contact" className="scroll-mt-24">
        <Footer />
      </section>

      {/* Scroll to Top */}
      <ScrollToTopButton />
    </div>
  );
}

function ScrollToTopButton() {
  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => {
    setIsVisible(window.pageYOffset > 300);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  React.useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    isVisible && (
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-40 p-3 rounded-md shadow-lg"
        style={{
          backgroundColor: "#0b1220",
          color: "#f8fafc",
        }}
      >
        ↑
      </button>
    )
  );
}