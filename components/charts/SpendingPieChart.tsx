'use client'

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from 'recharts'

interface SpendingCategory {
  name: string
  value: number
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#6366F1'] // Tailwind colors

export function SpendingPieChart({
  data,
  total
}: {
  data: SpendingCategory[]
  total: number
}) {
  return (
    <div className="bg-muted rounded-lg p-6 flex flex-col md:flex-row items-center justify-center gap-6 w-full max-w-4xl mx-auto">
      {/* Pie Chart */}
      <div className="relative w-[200px] h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={2}
              startAngle={90}
              endAngle={450}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Spending</p>
          <p className="text-2xl font-semibold">
            ${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Spending Breakdown */}
      <div className="flex-1 w-full">
        <h3 className="text-base font-semibold mb-4 uppercase tracking-wide">
          Weekly Spending Breakdown
        </h3>
        <ul className="space-y-2">
          {data.map((item, index) => (
            <li key={index} className="flex justify-between text-sm">
              <span>{item.name}</span>
              <span className="font-medium">
                {Math.round((item.value / total) * 100)}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
