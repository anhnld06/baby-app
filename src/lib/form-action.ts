/**
 * Lets a `<form action>` reference a save action that may return `{ error }`.
 * React types form actions as returning void; the returned error is ignored
 * there, so only use this on forms that are actually submitted by
 * FormActionBar (which shows the error) and keep `action` as a no-JS fallback.
 * Returns the same function (a server action reference stays a reference).
 */
export function asFormAction(
  action: (formData: FormData) => Promise<void | { error: string }>,
) {
  return action as (formData: FormData) => Promise<void>;
}
