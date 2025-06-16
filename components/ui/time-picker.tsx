"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface TimePickerProps {
  value: string
  onChange: (value: string) => void
  label?: string
  className?: string
}

export function TimePicker({
  value,
  onChange,
  label,
  className,
}: TimePickerProps) {
  return (
    <div className={className}>
      {label && <Label>{label}</Label>}
      <Input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full"
      />
    </div>
  )
} 