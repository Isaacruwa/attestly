import { Suspense } from "react";
import NewAiSystemForm from "./NewAiSystemForm";

export default function NewAiSystemPage() {
  return (
    <Suspense fallback={null}>
      <NewAiSystemForm />
    </Suspense>
  );
}
