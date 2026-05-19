'use client'

import { siteBodyClass, siteStatValueClass } from '@/lib/site-styles'
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
          <p className={siteStatValueClass}>
            <CountUp
              target={stat.value}
              prefix={stat.prefix}
              suffix={stat.suffix}
            />
          </p>
          <p className={`mt-1 ${siteBodyClass}`}>
            {stat.label}
          </p>
        </article>
      ))}
    </div>
  )
}
