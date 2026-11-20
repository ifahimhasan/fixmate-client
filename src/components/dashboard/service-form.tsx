"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
import { uploadImage } from "@/lib/api";
import { CATEGORIES, SERVICE_MODES } from "@/lib/constants";
import type { Service } from "@/lib/types";
import { fileToDataUrl } from "@/lib/utils";

export type ServiceInput = Pick<Service, "title" | "category" | "description" | "image" | "basePrice" | "estimatedDuration" | "serviceMode" | "serviceArea">;

const EMPTY: ServiceInput = {
  title: "",
  category: "Smartphone",
  description: "",
  image: "",
  basePrice: 0,
  estimatedDuration: "",
  serviceMode: "Home Visit",
  serviceArea: "",
};

export default function ServiceForm({
  initial,
  submitLabel,
  onSubmit,
}: {
  initial?: Partial<ServiceInput>;
  submitLabel: string;
  onSubmit: (data: ServiceInput) => Promise<void>;
}) {
  const { data: session } = useSession();
  const [form, setForm] = useState<ServiceInput>({ ...EMPTY, ...initial });
  const [price, setPrice] = useState(initial?.basePrice ? String(initial.basePrice) : "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (k: keyof ServiceInput) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm({ ...form, [k]: e.target.value });

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Please choose an image file");
    if (file.size > 5 * 1024 * 1024) return toast.error("Image must be under 5 MB");
    setUploading(true);
    try {
      const url = await uploadImage(await fileToDataUrl(file));
      setForm((f) => ({ ...f, image: url }));
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (form.title.trim().length < 3) e.title = "Title must be at least 3 characters";
    if (form.description.trim().length < 20) e.description = "Describe the service in at least 20 characters";
    const p = Number(price);
    if (!Number.isFinite(p) || p <= 0) e.basePrice = "Enter a positive price";
    if (!form.estimatedDuration.trim()) e.estimatedDuration = "Required, e.g. 2-3 hours";
    if (!form.serviceArea.trim()) e.serviceArea = "Required, e.g. Dhanmondi, Dhaka";
    if (!form.image) e.image = "Upload a service image";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      await onSubmit({ ...form, title: form.title.trim(), description: form.description.trim(), basePrice: Number(price) });
    } finally {
      setSaving(false);
    }
  };

  const err = (k: string) => errors[k] && <span className="field-error">{errors[k]}</span>;

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-[18px]">
      <label className="label">
        Service title
        <input className="input" value={form.title} onChange={set("title")} placeholder="e.g. iPhone Screen Replacement" />
        {err("title")}
      </label>
      <div className="grid gap-[18px] sm:grid-cols-2">
        <label className="label">
          Category
          <select className="input" value={form.category} onChange={set("category")}>
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className="label">
          Service mode
          <select className="input" value={form.serviceMode} onChange={set("serviceMode")}>
            {SERVICE_MODES.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </label>
        <label className="label">
          Base price (USD)
          <input className="input" type="number" min={1} step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g. 45" />
          {err("basePrice")}
        </label>
        <label className="label">
          Estimated duration
          <input className="input" value={form.estimatedDuration} onChange={set("estimatedDuration")} placeholder="e.g. 2-3 hours" />
          {err("estimatedDuration")}
        </label>
      </div>
      <label className="label">
        Service area
        <input className="input" value={form.serviceArea} onChange={set("serviceArea")} placeholder="e.g. Dhanmondi, Dhaka" />
        {err("serviceArea")}
      </label>
      <label className="label">
        Description
        <textarea className="input" rows={4} value={form.description} onChange={set("description")} placeholder="What does this service include?" />
        {err("description")}
      </label>

      <div className="flex flex-col gap-2">
        <span className="text-[13px] font-bold">Service image</span>
        <input ref={fileRef} type="file" accept="image/*" onChange={onFile} className="sr-only" id="service-image" />
        {form.image ? (
          <div className="flex items-center gap-4 rounded-[18px] border border-line p-3">
            <span className="relative h-[72px] w-[116px] overflow-hidden rounded-[13px] bg-brand-soft">
              <Image src={form.image} alt="Service preview" fill sizes="116px" className="object-cover" />
            </span>
            <label htmlFor="service-image" className="btn-outline cursor-pointer !px-4 !py-2.5 !text-sm">
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />} Change image
            </label>
          </div>
        ) : (
          <label
            htmlFor="service-image"
            className="flex cursor-pointer flex-col items-center gap-2 rounded-[18px] border-[1.5px] border-dashed border-violet-300 bg-brand-soft/40 p-6 text-center transition hover:bg-brand-soft"
          >
            <span className="grid h-12 w-12 place-items-center rounded-[14px] bg-surface text-brand">
              {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImagePlus className="h-5 w-5" />}
            </span>
            <span className="text-sm font-bold text-brand">{uploading ? "Uploading to ImgBB…" : "Upload service image"}</span>
            <span className="text-xs text-muted">PNG or JPG, up to 5 MB</span>
          </label>
        )}
        {err("image")}
      </div>

      <div className="grid gap-[18px] sm:grid-cols-2">
        <label className="label !text-xs">
          Technician name
          <input className="input" value={session?.user.name ?? ""} readOnly />
        </label>
        <label className="label !text-xs">
          Technician email
          <input className="input" value={session?.user.email ?? ""} readOnly />
        </label>
      </div>
      <button disabled={saving || uploading} className="btn !py-4">
        {saving ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
