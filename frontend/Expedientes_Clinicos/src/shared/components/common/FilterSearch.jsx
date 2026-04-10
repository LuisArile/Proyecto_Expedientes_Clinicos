import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";


export function FilterInput({ label, icon: Icon, value, onChange, placeholder }) {
  return (
    <div className="space-y-2">
      <Label className="text-sm text-gray-700">{label}</Label>
      <div className="relative w-full">
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input placeholder={placeholder} className="w-full bg-slate-50 pl-10" value={value} onChange={(e) => onChange(e.target.value)} />
      </div>
    </div>
  );
}

export function FilterSelect({ label, value, onValueChange, options }) {
  return (
    <div className="space-y-2">
      <Label className="text-sm text-gray-700">{label}</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder="Todos" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos</SelectItem>
          {options.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
}