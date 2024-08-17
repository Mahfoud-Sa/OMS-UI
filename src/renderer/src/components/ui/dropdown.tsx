import * as React from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from './select'

export default function Dropdown<T>({
  groups,
  label,
  disabled = false,
  searchBoxDisabled = false,
  value,
  getLabel,
  getValue,
  onChange
}: {
  groups: { label?: string; options: T[] }[]
  label?: string | React.ReactElement
  value?: string
  disabled?: boolean
  searchBoxDisabled?: boolean
  triggerClassName?: string
  getValue: (option: T) => string | number
  getLabel: (option: T) => string | number
  onChange?: (value: string) => void
}) {
  const [searchTerm, setSearchTerm] = React.useState('')

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const filteredGroups = groups.map(({ label, options }) => ({
    label,
    options: options.filter((option) =>
      getLabel(option)?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  }))

  return (
    <Select defaultValue={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className="h-14 border border-outlineBorder bg-white font-medium  text-on-surface-variant dark:bg-primary">
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        {searchBoxDisabled && (
          <div className={`p-2`}>
            <input
              type="text"
              placeholder="ابحث..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="mb-2 w-full rounded px-2 py-1 "
            />
          </div>
        )}
        {filteredGroups.map(({ label, options }) => (
          <SelectGroup key={label}>
            {label && (
              <SelectLabel className="text-base font-medium text-on-surface-variant">
                {label}
              </SelectLabel>
            )}
            {options.map((option, idx) => (
              <SelectItem
                value={`${getValue(option)}`}
                key={getValue(option) || idx}
                className="hover:bg-gray-300"
              >
                {getLabel(option)}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  )
}
