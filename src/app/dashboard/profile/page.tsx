"use client";
import { useEffect, useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PageTitle } from "@/components/dashboard/ui";
import { Avatar, ROLE_BADGE } from "@/components/layout/navbar";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/lib/auth-client";
import { api, uploadImage } from "@/lib/api";
import type { Role } from "@/lib/constants";
import type { AppUser } from "@/lib/types";
import { cn, fileToDataUrl } from "@/lib/utils";

export default function UpdateProfile() {
  const { data: session, refetch } = useSession();
  const [me, setMe] = useState<AppUser | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", area: "", bio: "", image: "" });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    api<AppUser>("/api/users/me")
      .then((u) => {
        setMe(u);
        setForm({ name: u.name || "", phone: u.phone || "", area: u.area || "", bio: u.bio || "", image: u.image || "" });
      })
      .catch((e) => toast.error(e.message));
  }, []);

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Please choose an image file");
    if (file.size > 3 * 1024 * 1024) return toast.error("Photo must be under 3 MB");
    setUploading(true);
    try {
      const url = await uploadImage(await fileToDataUrl(file));
      setForm((f) => ({ ...f, image: url }));
      toast.success("Photo uploaded - save to apply it");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name.trim().length < 2) return setError("Name must be at least 2 characters");
    setError("");
    setSaving(true);
    try {
      const updated = await api<AppUser>("/api/users/profile", { method: "PATCH", body: form });
      setMe(updated);
      await refetch(); // navbar + dashboard top bar pick up the new name/photo right away
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save");
    } finally {
      setSaving(false);
    }
  };

  const role = ((session?.user as { role?: Role } | undefined)?.role || me?.role || "customer") as Role;
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, [k]: e.target.value });

  if (!me) return <Skeleton className="h-[560px] rounded-[29px]" />;

  return (
    <>
      <PageTitle title="Update profile" sub="Your new name and photo appear in the navbar and top bar right after saving." />
      <div className="grid items-start gap-[21px] lg:grid-cols-[1.618fr_1fr]">
        <form onSubmit={save} className="card overflow-hidden rounded-[29px]">
          <div className="flex flex-wrap items-center gap-5 border-b border-line p-6 sm:p-[26px]">
            <span className="relative">
              <Avatar name={form.name || me.name} image={form.image} size={96} />
              {uploading && (
                <span className="absolute inset-0 grid place-items-center rounded-full bg-black/40">
                  <Loader2 className="h-6 w-6 animate-spin text-white" />
                </span>
              )}
            </span>
            <div className="flex flex-col gap-2">
              <span className="font-bold">Profile photo</span>
              <span className="text-[13px] text-muted">JPG or PNG up to 3 MB - uploaded with ImgBB.</span>
              <input ref={fileRef} id="avatar" type="file" accept="image/*" className="sr-only" onChange={onFile} />
              <span className="flex flex-wrap gap-2">
                <label htmlFor="avatar" className="btn cursor-pointer !px-4 !py-2.5 !text-sm">
                  <Camera className="h-4 w-4" /> Upload new
                </label>
                {form.image && (
                  <button type="button" onClick={() => setForm({ ...form, image: "" })} className="btn-outline !px-4 !py-2 !text-sm">
                    Remove
                  </button>
                )}
              </span>
            </div>
          </div>
          <div className="grid gap-[18px] p-6 sm:grid-cols-2 sm:p-[26px]">
            <label className="label">
              Full name
              <input className="input" value={form.name} onChange={set("name")} />
              {error && <span className="field-error">{error}</span>}
            </label>
            <label className="label">
              Phone
              <input className="input" value={form.phone} onChange={set("phone")} placeholder="01XXXXXXXXX" />
            </label>
            <label className="label">
              Email <span className="font-normal text-muted">· read-only</span>
              <input className="input" value={me.email} readOnly />
            </label>
            <label className="label">
              Role <span className="font-normal text-muted">· read-only</span>
              <input className="input capitalize" value={role} readOnly />
            </label>
            <label className="label sm:col-span-2">
              Area
              <input className="input" value={form.area} onChange={set("area")} placeholder="e.g. Mirpur, Dhaka" />
            </label>
            <label className="label sm:col-span-2">
              Bio
              <textarea className="input" rows={4} maxLength={500} value={form.bio} onChange={set("bio")} placeholder={role === "technician" ? "Your skills and experience" : "A little about you"} />
            </label>
          </div>
          <div className="flex justify-end gap-2.5 bg-surface-2 px-6 py-4 sm:px-[26px]">
            <button type="button" onClick={() => setForm({ name: me.name, phone: me.phone || "", area: me.area || "", bio: me.bio || "", image: me.image || "" })} className="btn-outline">
              Discard
            </button>
            <button disabled={saving || uploading} className="btn">
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
        <aside className="glass flex flex-col gap-4 rounded-[29px] p-[26px] lg:sticky lg:top-[100px]">
          <span className="eyebrow !text-xs">Public preview</span>
          <div className="flex items-center gap-3">
            <Avatar name={form.name || me.name} image={form.image} size={58} />
            <span className="flex flex-col gap-1">
              <span className="text-[17px] font-bold">{form.name || me.name}</span>
              <span className={cn("self-start rounded-full px-3 py-0.5 text-xs font-bold capitalize", ROLE_BADGE[role])}>{role}</span>
            </span>
          </div>
          {form.area && <span className="text-sm text-muted">{form.area}</span>}
          <p className="text-sm leading-[1.618] text-muted">{form.bio || "Add a short bio so customers know you better."}</p>
        </aside>
      </div>
    </>
  );
}
