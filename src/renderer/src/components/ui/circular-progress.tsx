interface CircularProgressProps {
  value: number
  size?: number
  strokeWidth?: number
}

export function CircularProgress({ value, size = 100, strokeWidth = 8 }: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (value / 100) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="rotate-[-90deg]" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          className="text-muted-foreground"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="text-primary"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
    </div>
  )
}
