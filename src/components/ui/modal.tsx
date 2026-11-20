"use client";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { X } from "lucide-react";

export function Modal({
  open,
  onClose,
  title,
  children,
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "md" | "lg";
}) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-[100]">
      <div className="fixed inset-0 bg-[#0e1330]/45 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center overflow-y-auto p-4">
        <DialogPanel className={`glass w-full ${size === "lg" ? "max-w-[640px]" : "max-w-[460px]"} rounded-[29px] p-2.5`}>
          <div className="rounded-[21px] bg-surface p-6 sm:p-7">
            <div className="mb-4 flex items-start justify-between gap-4">
              <DialogTitle className="text-[22px] font-bold leading-tight">{title}</DialogTitle>
              <button onClick={onClose} aria-label="Close" className="grid h-10 w-10 shrink-0 place-items-center rounded-[13px] border border-line text-muted hover:text-ink">
                <X className="h-4 w-4" />
              </button>
            </div>
            {children}
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  text,
  confirmLabel = "Confirm",
  danger = false,
  loading = false,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  text: string;
  confirmLabel?: string;
  danger?: boolean;
  loading?: boolean;
}) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="text-[15px] leading-relaxed text-muted">{text}</p>
      <div className="mt-6 flex justify-end gap-2.5">
        <button onClick={onClose} className="btn-outline">
          Cancel
        </button>
        <button onClick={onConfirm} disabled={loading} className={danger ? "btn !bg-red-600 !shadow-none hover:!bg-red-700" : "btn"}>
          {loading ? "Please wait…" : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
