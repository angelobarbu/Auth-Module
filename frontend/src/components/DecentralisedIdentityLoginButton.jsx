// src/components/DecentralisedIdentityLoginButton.jsx
import React, { useCallback, useRef } from "react";
import API from "../api";

const DID_POPUP_WIDTH = 500;
const DID_POPUP_HEIGHT = 650;
const DID_APP_URL = process.env.REACT_APP_DID_APP_URL

const DecentralisedIdentityLoginButton = ({ onLogin }) => {
  const popupRef = useRef(null);
  const [busy, setBusy] = React.useState(false);

  /** Opens the chooser in a centred popup */
  const openPopup = () => {
    const origin   = encodeURIComponent(window.location.origin);
    const url      = `${DID_APP_URL}?origin=${origin}`;

    const dualScreenLeft = window.screenLeft ?? window.screenX;
    const dualScreenTop  = window.screenTop  ?? window.screenY;
    const width  = window.innerWidth  ?? document.documentElement.clientWidth;
    const height = window.innerHeight ?? document.documentElement.clientHeight;

    const left = width / 2 - DID_POPUP_WIDTH / 2 + dualScreenLeft;
    const top  = height / 2 - DID_POPUP_HEIGHT / 2 + dualScreenTop;

    popupRef.current = window.open(
      url,
      "_blank",
      `scrollbars=yes, width=${DID_POPUP_WIDTH}, height=${DID_POPUP_HEIGHT}, top=${top}, left=${left}`
    );
  };

  /** Listen for the postMessage coming back */
  const handleMessage = useCallback(
    async (event) => {
      // HARD-CODE the origin you expect for security
      if (event.origin !== new URL(DID_APP_URL).origin) return;
      if (!event.data?.credential) return;

      try {
        setBusy(true);
        const res = await API.post("/auth/did", { credential: event.data.credential });
        localStorage.setItem("token", res.data.token);
        onLogin(res.data.token);
      } catch (err) {
        console.error("DID login failed", err);
      } finally {
        setBusy(false);
        window.removeEventListener("message", handleMessage);
      }
    },
    [onLogin]
  );

  const handleClick = () => {
    openPopup();
    window.addEventListener("message", handleMessage, false);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      style={{ marginTop: "1rem" }}
      className="digital-id-btn"
      disabled={busy}
      title={busy ? "Connecting..." : "Connect with Digital Identity"}
    >
      Connect with Digital Identity
    </button>
  );
};

export default DecentralisedIdentityLoginButton;
