import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function Callback() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const successParam = searchParams.get("success");
    if (successParam === "true") {
      window.location.href = "http://localhost:5173/";
    }
  }, [searchParams]);
  return (
    <>
      <p>Success</p>
    </>
  );
}
