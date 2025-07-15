import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ChevronDown, X } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge"
import useOutsideClick from "@/hooks/useOutSideClick";

type TSelectValue = string | number;

type MultiSelectProps = {
  placeholder: string,
  choices: { label: string, value: TSelectValue }[],
  value: (TSelectValue)[],
  onChange: (value: TSelectValue[]) => void
}

const MultiSelect = ({ placeholder, choices, value, onChange }: MultiSelectProps) => {

  const [isOpen, setIsOpen] = useState(false)

  const getLabel = (val: TSelectValue) => {
    return choices.find(choice => choice.value === val).label
  }

  const ref = useOutsideClick(() => setIsOpen(!isOpen))

  return (
    <article className="relative">
      <div className={cn(
        "relative cursor-pointer flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
      )} onClick={() => setIsOpen(!isOpen)}>
        {value.length === 0 ? (
          <span>{placeholder}</span>
        ) : (
          <div className="flex flex-wrap gap-1">
            {value.map((val) => (
              <Badge
                key={val}
                className="flex items-center gap-1"
                variant="outline"
                onClick={e => {
                  e.stopPropagation();
                  onChange(value.filter(v => v !== val));
                }}
                style={{ cursor: "pointer" }}
                
              >
                {getLabel(val)}
                <X size={12} />
              </Badge>
            ))}
          </div>
        )}
        <ChevronDown size={16} className="opacity-50" />
      </div>

      {isOpen && <section ref={ref} className={cn(
        "absolute z-50 max-h-96 w-full !mt-2 overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1"
      )}>
        <div className={cn(
          "p-2",
          "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]",
          "space-y-2"
        )}>

          {choices.map(choice => (
            <div className="flex items-center space-x-2" key={choice.value}>
              <Checkbox
                id={choice.label}
                checked={value?.includes(choice.value)}
                onCheckedChange={(checked) => {
                  return checked
                    ? onChange([...value, choice.value])
                    : onChange(
                      value?.filter(
                        (v) => v !== choice.value
                      )
                    )
                }} />
              <Label htmlFor={choice.label} className="font-normal">{choice.label}</Label>
            </div>
          ))}

        </div>
      </section>}
    </article>
  )
}

export default MultiSelect;