import { useMemo } from "react";
import { Progress } from "./ui/progress";

interface PasswordStrengthMeterProps {
  password: string;
}

export const PasswordStrengthMeter = ({ password }: PasswordStrengthMeterProps) => {
  const strength = useMemo(() => {
    let score = 0;
    if (!password) return { score: 0, label: "", color: "" };
    
    // Length check
    if (password.length >= 8) score += 25;
    if (password.length >= 12) score += 10;
    
    // Complexity checks
    if (/[a-z]/.test(password)) score += 15;
    if (/[A-Z]/.test(password)) score += 15;
    if (/[0-9]/.test(password)) score += 15;
    if (/[^a-zA-Z0-9]/.test(password)) score += 20;
    
    if (score < 40) return { score, label: "Weak", color: "bg-destructive" };
    if (score < 60) return { score, label: "Fair", color: "bg-yellow-500" };
    if (score < 80) return { score, label: "Good", color: "bg-blue-500" };
    return { score, label: "Strong", color: "bg-green-500" };
  }, [password]);

  if (!password) return null;

  return (
    <div className="space-y-2">
      <Progress value={strength.score} className="h-2" />
      <p className={`text-sm font-medium ${strength.color.replace('bg-', 'text-')}`}>
        Password Strength: {strength.label}
      </p>
      <ul className="text-xs text-muted-foreground space-y-1">
        <li className={password.length >= 8 ? "text-green-600" : ""}>
          ✓ At least 8 characters
        </li>
        <li className={/[A-Z]/.test(password) ? "text-green-600" : ""}>
          ✓ Contains uppercase letter
        </li>
        <li className={/[0-9]/.test(password) ? "text-green-600" : ""}>
          ✓ Contains number
        </li>
        <li className={/[^a-zA-Z0-9]/.test(password) ? "text-green-600" : ""}>
          ✓ Contains special character
        </li>
      </ul>
    </div>
  );
};
