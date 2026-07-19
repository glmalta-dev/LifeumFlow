export type PhoneValidation =
  | { valid: true; national: string; international: string }
  | { valid: false; reason: string };

export function normalizeBrazilianPhone(value?: string | null): PhoneValidation {
  if (!value?.trim()) return { valid: false, reason: "Paciente sem telefone cadastrado." };

  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("55")) digits = digits.slice(2);

  if (digits.length !== 10 && digits.length !== 11) {
    return { valid: false, reason: "Telefone deve conter DDD e 10 ou 11 digitos." };
  }
  if (digits.startsWith("0") || /^([0-9])\1+$/.test(digits)) {
    return { valid: false, reason: "Telefone brasileiro invalido." };
  }

  return { valid: true, national: digits, international: `55${digits}` };
}

export function buildWhatsAppUrl(phone: string | undefined, message: string): string | null {
  const normalized = normalizeBrazilianPhone(phone);
  if (!normalized.valid) return null;
  return `https://wa.me/${normalized.international}?text=${encodeURIComponent(message)}`;
}
