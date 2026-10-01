"use client";

import { Spinner } from "@/components/ui/feedback";
import { usePreferences, useUpdatePreferences } from "@/hooks/queries/use-account";

export function AccountPreferences() {
  const { data: prefs, isLoading } = usePreferences();
  const update = useUpdatePreferences();

  if (isLoading) {
    return (
      <div className="py-16 text-center">
        <Spinner className="h-7 w-7" />
      </div>
    );
  }
  if (!prefs) return null;

  return (
    <div className="max-w-lg">
      <h2 className="font-display text-2xl text-ivory">Preferences</h2>
      <p className="mt-2 font-ui text-sm text-stone">Choose what the Maison sends you.</p>

      <div className="mt-8 space-y-6">
        <ToggleRow
          label="Promotional emails"
          description="New compositions, limited releases and Maison news."
          checked={prefs.promosEnabled}
          pending={update.isPending}
          onChange={(checked) => update.mutate({ promosEnabled: checked })}
        />
        <ToggleRow
          label="Order update emails"
          description="Shipping and delivery status for your orders."
          checked={prefs.orderUpdatesEnabled}
          pending={update.isPending}
          onChange={(checked) => update.mutate({ orderUpdatesEnabled: checked })}
        />
      </div>

      {update.isError && (
        <p className="mt-6 font-ui text-sm text-burgundy">Couldn&apos;t save — please try again.</p>
      )}
    </div>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  pending,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  pending: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-6 border-b border-bronze/15 pb-6">
      <span>
        <span className="block font-ui text-sm text-ivory">{label}</span>
        <span className="mt-1 block font-ui text-xs leading-relaxed text-stone">{description}</span>
      </span>
      <input
        type="checkbox"
        checked={checked}
        disabled={pending}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-4 w-4 shrink-0 accent-antique-gold disabled:opacity-50"
      />
    </label>
  );
}
