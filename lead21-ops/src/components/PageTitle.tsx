import { useEffect } from "react";

export function PageTitle({ title }: { title: string }) {
  useEffect(() => {
    document.title = title ? `${title} · LEAD21 Ops` : "LEAD21 Ops";
  }, [title]);
  return null;
}
