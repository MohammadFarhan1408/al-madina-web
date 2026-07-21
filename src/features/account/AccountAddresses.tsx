"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Field } from "@/components/ui/Field";
import { Button } from "@/components/ui/primitives";
import { Spinner, EmptyState } from "@/components/ui/feedback";
import { useAddresses } from "@/hooks/queries/use-orders";
import {
  useCreateAddress,
  useUpdateAddress,
  useRemoveAddress,
} from "@/hooks/queries/use-account";
import type { Address } from "@/types/commerce";

const schema = z.object({
  fullName: z.string().min(2, "Full name required"),
  phone: z.string().min(5, "Phone required"),
  addressLine: z.string().min(3, "Address required"),
  city: z.string().min(1, "City required"),
  country: z.string().min(2, "Country required"),
  isDefault: z.boolean().optional(),
});
type Form = z.infer<typeof schema>;

export function AccountAddresses() {
  const { data: addresses, isLoading } = useAddresses();
  const [editing, setEditing] = useState<Address | "new" | null>(null);

  if (isLoading) return <div className="py-16 text-center"><Spinner className="h-7 w-7" /></div>;

  const list = addresses ?? [];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl text-ivory">Addresses</h2>
        {editing === null && (
          <button
            type="button"
            onClick={() => setEditing("new")}
            className="border border-bronze/50 px-5 py-2.5 font-ui text-[0.72rem] uppercase tracking-[0.18em] text-ivory transition-colors hover:border-antique-gold hover:text-antique-gold"
          >
            + Add address
          </button>
        )}
      </div>

      {editing !== null ? (
        <AddressForm
          initial={editing === "new" ? undefined : editing}
          onClose={() => setEditing(null)}
        />
      ) : list.length === 0 ? (
        <EmptyState title="No saved addresses" body="Add an address for faster checkout." />
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {list.map((a) => (
            <AddressCard key={a.id} address={a} onEdit={() => setEditing(a)} />
          ))}
        </ul>
      )}
    </div>
  );
}

function AddressCard({ address, onEdit }: { address: Address; onEdit: () => void }) {
  const remove = useRemoveAddress();
  return (
    <li className="border border-bronze/20 bg-charcoal/30 p-5">
      <div className="flex items-start justify-between">
        <p className="font-ui text-sm text-ivory">{address.fullName}</p>
        {address.isDefault && (
          <span className="font-ui text-[0.6rem] uppercase tracking-[0.2em] text-antique-gold">Default</span>
        )}
      </div>
      <p className="mt-2 font-ui text-sm leading-relaxed text-ivory/70">
        {address.phone}
        <br />
        {address.addressLine}
        <br />
        {address.city}, {address.country}
      </p>
      <div className="mt-4 flex gap-4 font-ui text-[0.68rem] uppercase tracking-[0.16em]">
        <button type="button" onClick={onEdit} className="text-ivory/70 hover:text-antique-gold">Edit</button>
        <button
          type="button"
          onClick={() => remove.mutate(address.id)}
          disabled={remove.isPending}
          className="text-ivory/70 hover:text-burgundy disabled:opacity-40"
        >
          Remove
        </button>
      </div>
    </li>
  );
}

function AddressForm({ initial, onClose }: { initial?: Address; onClose: () => void }) {
  const create = useCreateAddress();
  const update = useUpdateAddress();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: initial
      ? {
          fullName: initial.fullName,
          phone: initial.phone,
          addressLine: initial.addressLine,
          city: initial.city,
          country: initial.country,
          isDefault: initial.isDefault,
        }
      : { country: "United Arab Emirates", isDefault: false },
  });

  const pending = create.isPending || update.isPending;

  const onSubmit = (values: Form) => {
    const done = { onSuccess: onClose };
    if (initial) update.mutate({ id: initial.id, input: values }, done);
    else create.mutate(values, done);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid max-w-lg gap-5">
      <h3 className="font-display text-xl text-ivory">{initial ? "Edit address" : "New address"}</h3>
      <Field label="Full name" error={errors.fullName?.message} {...register("fullName")} />
      <Field label="Phone" error={errors.phone?.message} {...register("phone")} />
      <Field label="Address" error={errors.addressLine?.message} {...register("addressLine")} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="City" error={errors.city?.message} {...register("city")} />
        <Field label="Country" error={errors.country?.message} {...register("country")} />
      </div>
      <label className="flex items-center gap-2 font-ui text-sm text-ivory/80">
        <input type="checkbox" className="accent-antique-gold" {...register("isDefault")} />
        Set as default address
      </label>
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending && <Spinner className="h-4 w-4 border-rich-black/40 border-t-rich-black" />}
          {initial ? "Save" : "Add Address"}
        </Button>
        <button type="button" onClick={onClose} className="font-ui text-xs uppercase tracking-[0.18em] text-ivory/60 hover:text-ivory">
          Cancel
        </button>
      </div>
    </form>
  );
}
