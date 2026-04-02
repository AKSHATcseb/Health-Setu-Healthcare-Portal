import React, { useEffect } from "react";
import Navbar from "../../components/Navbar";
import Hero from "../../components/landingPage/Hero";
import Features from "../../components/landingPage/Features";
import HowItWorks from "../../components/landingPage/HowItWorks";
import Footer from "../../components/Footer";

export default function LandingPage() {
  useEffect(() => {
    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = "smooth";

    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  return (
    <div
      className="w-full min-h-screen"
      style={{
        // very light neutral page background to make dark cards pop
        background: "linear-gradient(180deg,#fbfcfd 0%, #f8fafc 60%, #ffffff 100%)",
      }}
    >
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <Features />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Footer */}
      <Footer />

      {/* Scroll to Top Button */}
      <ScrollToTopButton />
    </div>
  );
}

// Scroll to Top Button (styling adjusted to match palette)
function ScrollToTopButton() {
  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  React.useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    isVisible && (
      <button
        onClick={scrollToTop}
        aria-label="Scroll to top"
        title="Back to top"
        className="fixed bottom-6 right-6 z-40 p-3 rounded-md shadow-lg transition-transform duration-200"
        style={{
          backgroundColor: "#0b1220", // dark tile color
          color: "#f8fafc",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <svg
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M12 3l7 9H5l7-9zM5 13h14v6H5v-6z" />
        </svg>
      </button>
    )
  );
}