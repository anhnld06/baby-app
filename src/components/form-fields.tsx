import type {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function Field({
  label,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div className="w-full min-w-0 max-w-full space-y-2">
      <Label htmlFor={props.id ?? props.name}>{label}</Label>
      <Input
        className="h-12 w-full min-w-0 max-w-full rounded-xl bg-background"
        id={props.id ?? props.name}
        {...props}
      />
    </div>
  );
}

export function SelectField({
  label,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { label: string }) {
  return (
    <div className="w-full min-w-0 max-w-full space-y-2">
      <Label htmlFor={props.id ?? props.name}>{label}</Label>
      <select
        id={props.id ?? props.name}
        className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-12 w-full min-w-0 max-w-full rounded-xl border px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50 sm:text-sm"
        {...props}
      >
        {children}
      </select>
    </div>
  );
}

export function TextAreaField({
  label,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <div className="w-full min-w-0 max-w-full space-y-2">
      <Label htmlFor={props.id ?? props.name}>{label}</Label>
      <Textarea
        id={props.id ?? props.name}
        className="min-h-24 w-full min-w-0 max-w-full rounded-xl bg-background"
        {...props}
      />
    </div>
  );
}
