import * as Dialog from "@radix-ui/react-dialog";
import Icon from "../Icon";

export default function Modal({ open, onOpenChange, title, children }) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-[999]" />

        <Dialog.Content className="fixed z-[1000] left-1/2 top-1/2 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-lg">
          <div className="flex justify-between items-center mb-3">
            {title && (
              <Dialog.Title className="font-semibold text-lg">
                {title}
              </Dialog.Title>
            )}

            <Dialog.Close asChild>
              <button className="text-gray-500 hover:text-black cursor-pointer">
                <Icon name="close" className="w-6 h-6" />
              </button>
            </Dialog.Close>
          </div>

          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
