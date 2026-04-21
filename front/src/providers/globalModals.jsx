import { ConfirmModal } from "@/components/ui";
import { useModalStore } from "@/store/modal.store.js";

export function GlobalModals() {
  const confirm = useModalStore((s) => s.confirm);
  const close = useModalStore((s) => s.closeConfirm);

  return (
    <>
      {confirm && (
        <ConfirmModal
          open={true}
          onOpenChange={(open) => !open && close()}
          title={confirm.title}
          description={confirm.description}
          confirmText={confirm.confirmText}
          onConfirm={async () => {
            await confirm.onConfirm?.();
            close();
          }}
        />
      )}
    </>
  );
}