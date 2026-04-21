import Modal from "./Modal";
import { Button } from "@/components/ui";

export default function ConfirmModal({
  open,
  onOpenChange,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  loading = false,
}) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
    >

      <div className="space-y-4">

        {/* description ONLY here */}
        <p className="text-sm text-gray-600">
          {description}
        </p>

        <div className="flex justify-end gap-2">
          <Button
            variant="secondary"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            {cancelText}
          </Button>

          <Button
            variant="danger"
            onClick={onConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </div>

      </div>

    </Modal>
  );
}