import type { ComponentPropsWithoutRef } from 'react'

export const formLabelClassName =
  'flex flex-col gap-2 text-lg font-semibold text-neutral-800'

export const formInputClassName =
  'w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 font-normal text-neutral-900 placeholder:text-neutral-500 outline-none transition focus:border-neutral-500 focus:ring-2 focus:ring-neutral-300'

export const formTextareaClassName =
  `${formInputClassName} min-h-[120px] resize-y`

export const formSelectClassName =
  'w-full appearance-none rounded-xl border border-neutral-300 bg-white px-4 py-2.5 pr-14 font-normal text-neutral-900 outline-none transition focus:border-neutral-500 focus:ring-2 focus:ring-neutral-300'

function SelectChevron() {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className="pointer-events-none absolute right-5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M5 8l5 5 5-5" />
    </svg>
  )
}

export function FormSelect({
  className,
  ...props
}: ComponentPropsWithoutRef<'select'>) {
  return (
    <div className="relative">
      <select
        className={className ? `${formSelectClassName} ${className}` : formSelectClassName}
        {...props}
      />
      <SelectChevron />
    </div>
  )
}
