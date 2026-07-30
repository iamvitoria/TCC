import { useEffect, useState } from "react";
import { X, Download } from "lucide-react";
import { useLocation } from "react-router-dom";

const STORAGE_KEY = "dismissPWAInstall";
const DAYS_TO_SHOW_AGAIN = 7;

export default function InstallPWA() {
  const location = useLocation();

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (
      location.pathname === "/" ||
      location.pathname === "/login" ||
      location.pathname === "/register"
    ) {
      return;
    }

    const standalone = window.matchMedia(
    "(display-mode: standalone)"
    ).matches;

    if (standalone) return;

    const dismissed = localStorage.getItem(STORAGE_KEY);

    if (dismissed) {
      const diff =
        Date.now() - Number(dismissed);

      const days = diff / (1000 * 60 * 60 * 24);

      if (days < DAYS_TO_SHOW_AGAIN) {
        return;
      }
    }

    const handler = (e) => {
        console.log("beforeinstallprompt disparou!");
        e.preventDefault();

        setDeferredPrompt(e);
        setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () =>
      window.removeEventListener(
        "beforeinstallprompt",
        handler
      );
  }, [location.pathname]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    const { outcome } =
      await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setVisible(false);
    }

    setDeferredPrompt(null);
  };

  const handleClose = () => {
    localStorage.setItem(
      STORAGE_KEY,
      Date.now().toString()
    );

    setVisible(false);
  };

  console.log({
    visible,
    deferredPrompt,
    });

  if (!visible) return null;

  return (
    <div style={styles.container}>
      <button
        style={styles.close}
        onClick={handleClose}
        aria-label="Fechar"
      >
        <X size={18} />
      </button>

      <div style={styles.icon}>
        <Download size={28} />
      </div>

      <div style={{ flex: 1 }}>
        <h3 style={styles.title}>
          Instale o EcoMonitor
        </h3>

        <p style={styles.text}>
          Adicione o EcoMonitor à sua tela inicial.
        </p>
      </div>

      <button
        style={styles.button}
        onClick={handleInstall}
      >
        Adicionar
      </button>
    </div>
  );
}

const styles = {
  container: {
    position: "fixed",
    bottom: 20,
    left: "50%",
    transform: "translateX(-50%)",
    width: "min(90%, 620px)",
    background: "#ffffff",
    borderRadius: 14,
    padding: "18px 20px",
    display: "flex",
    alignItems: "center",
    gap: 18,
    boxShadow: "0 10px 30px rgba(0,0,0,.18)",
    zIndex: 9999,
    border: "1px solid #d8e4d2",
  },

  icon: {
    width: 52,
    height: 52,
    borderRadius: "50%",
    background: "#E7F0DC",
    color: "#1C3520",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },

  title: {
    margin: 0,
    color: "#1C3520",
    fontSize: 18,
    fontWeight: 700,
  },

  text: {
    marginTop: 6,
    marginBottom: 0,
    color: "#666",
    lineHeight: 1.45,
    fontSize: 14,
  },

  button: {
    border: "none",
    background: "#1C3520",
    color: "#fff",
    padding: "12px 18px",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600,
    flexShrink: 0,
  },

  close: {
    position: "absolute",
    top: 10,
    right: 10,
    background: "transparent",
    border: "none",
    cursor: "pointer",
    color: "#666",
  },
};