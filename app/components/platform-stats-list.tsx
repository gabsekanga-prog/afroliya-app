'use client'

import { platformStats } from '@/lib/platform-stats'
import { CountUp } from './count-up'

export function PlatformStatsList({ className = 'mt-8 space-y-5' }: { className?: string }) {
  return (
    <div className={className}>
      {platformStats.map((stat) => (
        <article
          key={stat.label}
          className="border-l-2 border-neutral-300 pl-4 sm:pl-5"
        >
          <p className="text-3xl font-bold text-neutral-900 sm:text-4xl">
            <CountUp
              target={stat.value}
              prefix={stat.prefix}
              suffix={stat.suffix}
            />
          </p>
          <p className="mt-1 text-lg text-neutral-600 ">
            {stat.label}
          </p>
        </article>
      ))}
    </div>
  )
}
