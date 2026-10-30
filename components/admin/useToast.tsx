"use client";

import { useCallback, useRef, useState } from "react";

export function useToast() {
  const [msg, setMsg] = useState("");
  const [show, setShow] = useState(false);
  const [isError, setIsError] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toast = useCallback((message: string, error = false) => {
    if (timer.current) clearTimeout(timer.current);
    setMsg(message);
    setIsError(error);
    setShow(true);
    timer.current = setTimeout(() => setShow(false), 2400);
  }, []);

  const ToastEl = (
    <div className={`a-toast${show ? " show" : ""}${isError ? " error" : ""}`}>
      {msg}
    </div>
  );

  return { toast, ToastEl };
}
