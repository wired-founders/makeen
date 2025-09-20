// src\components\SubmitButtonWithLoader.tsx
// src/components/loaders/SubmitButtonWithLoader.tsx
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SubmitButtonWithLoader({
  isLoading,
  onClick,
}: {
  isLoading: boolean;
  onClick: () => void;
}) {
  return (
    <Button disabled={isLoading} onClick={onClick} className="w-fit">
      {isLoading ? (
        <span className="flex items-center gap-2">
          <Loader2 className="animate-spin h-4 w-4" />
          Saving...
        </span>
      ) : (
        "Save Changes"
      )}
    </Button>
  );
}
