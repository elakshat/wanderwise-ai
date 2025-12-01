import { useState, useEffect, useRef } from "react";
import { Input } from "./ui/input";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "./ui/command";
import { MapPin } from "lucide-react";
import { INDIAN_CITIES } from "@/data/indianCities";

interface AutocompleteInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const AutocompleteInput = ({ value, onChange, placeholder, className }: AutocompleteInputProps) => {
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<typeof INDIAN_CITIES>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fuzzyMatch = (str: string, pattern: string): boolean => {
    const normalized = str.toLowerCase().replace(/[^a-z]/g, '');
    const patternNormalized = pattern.toLowerCase().replace(/[^a-z]/g, '');
    
    let patternIdx = 0;
    for (let i = 0; i < normalized.length && patternIdx < patternNormalized.length; i++) {
      if (normalized[i] === patternNormalized[patternIdx]) {
        patternIdx++;
      }
    }
    return patternIdx === patternNormalized.length;
  };

  const handleInputChange = (val: string) => {
    onChange(val);
    
    if (val.trim().length === 0) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    const filtered = INDIAN_CITIES.filter(city => 
      fuzzyMatch(city.name, val) || 
      fuzzyMatch(city.state, val) ||
      city.name.toLowerCase().includes(val.toLowerCase()) ||
      city.state.toLowerCase().includes(val.toLowerCase())
    ).slice(0, 8);

    setSuggestions(filtered);
    setOpen(filtered.length > 0);
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, i) => 
      regex.test(part) ? <mark key={i} className="bg-primary/20 font-semibold">{part}</mark> : part
    );
  };

  return (
    <div ref={containerRef} className="relative">
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => handleInputChange(e.target.value)}
        placeholder={placeholder}
        className={className}
        onFocus={() => value && setSuggestions(suggestions)}
      />
      
      {open && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1">
          <Command className="rounded-lg border shadow-lg bg-popover">
            <CommandList>
              <CommandEmpty>No cities found.</CommandEmpty>
              <CommandGroup>
                {suggestions.map((city) => (
                  <CommandItem
                    key={city.code}
                    onSelect={() => {
                      onChange(`${city.name}, ${city.state}`);
                      setOpen(false);
                    }}
                    className="cursor-pointer"
                  >
                    <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                    <div className="flex flex-col">
                      <span>{highlightMatch(city.name, value)}</span>
                      <span className="text-xs text-muted-foreground">{city.state}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
};
