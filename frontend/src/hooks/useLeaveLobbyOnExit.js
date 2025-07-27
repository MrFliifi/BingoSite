import { useEffect, useRef } from "react";
import { socket } from "../websocket/socket.js";

export function useLeaveLobbyOnExit(lobbyId) {
  const hasLeft = useRef(false);

  useEffect(() => {
    const leaveLobby = () => {
      if (!hasLeft.current && lobbyId) {
        socket.emit("leaveLobby", { lobbyId, socketId :socket.id  });
        hasLeft.current = true;
      }
    };

    const handlePopState = () => leaveLobby();
    const handleBeforeUnload = () => leaveLobby();

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      leaveLobby();
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [lobbyId]);
}
