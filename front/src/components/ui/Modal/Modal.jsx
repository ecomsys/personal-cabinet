import * as Dialog from "@radix-ui/react-dialog";
import Icon from "../Icon";

export default function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>

        <Dialog.Overlay
          className="fixed inset-0 bg-black/50 z-[999]
          data-[state=open]:animate-overlayShow
          data-[state=closed]:animate-overlayHide"
        />

        <Dialog.Content
          className="fixed z-[1000] left-1/2 top-1/2 w-full max-w-sm
          -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-lg
          data-[state=open]:animate-contentShow
          data-[state=closed]:animate-contentHide"
        >

          {/* HEADER */}
          <div className="flex justify-between items-start mb-3 gap-4">

            <div className="flex flex-col">

              {title && (
                <Dialog.Title className="font-semibold text-lg">
                  {title}
                </Dialog.Title>
              )}

              {/* ВСЕГДА есть Description */}
              <Dialog.Description className="text-sm text-gray-500">
                {description || ""}
              </Dialog.Description>

            </div>

            <Dialog.Close asChild>
              <button className="text-gray-500 hover:text-black cursor-pointer">
                <Icon name="close" className="w-6 h-6" />
              </button>
            </Dialog.Close>

          </div>

          {/* CONTENT */}
          {children}

        </Dialog.Content>

      </Dialog.Portal>
    </Dialog.Root>
  );
}