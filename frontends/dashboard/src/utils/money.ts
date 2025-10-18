// Aceita number ou string em vários formatos e devolve number
export function parseAmount(input: number | string): number {
  if (typeof input === "number") return Number.isFinite(input) ? input : 0;

  // limpa espaços, símbolo de moeda e qualquer coisa que não seja dígito/ponto/vírgula/sinal
  let s = input.trim().replace(/[^\d,.\-]/g, "");
  if (!s) return 0;

  const hasComma = s.includes(",");
  const hasDot = s.includes(".");

  if (hasComma && hasDot) {
    // Quando tem os dois, o separador decimal costuma ser o que aparece por último
    const lastComma = s.lastIndexOf(",");
    const lastDot = s.lastIndexOf(".");
    if (lastComma > lastDot) {
      // caso "1.234,56" → tira pontos (milhar) e troca vírgula por ponto (decimal)
      s = s.replace(/\./g, "").replace(",", ".");
    } else {
      // caso "1,234.56" → tira vírgulas (milhar), deixa ponto (decimal)
      s = s.replace(/,/g, "");
    }
  } else if (hasComma) {
    // "1234,56" → vírgula como decimal
    s = s.replace(/\./g, "").replace(",", ".");
  } else {
    // só ponto ou inteiro → remove vírgulas de milhar se houver
    s = s.replace(/,/g, "");
  }

  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
}

// Formata em BRL a partir de number **ou** string
export function formatBRL(value: number | string): string {
  const n = parseAmount(value);
  try {
    return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  } catch {
    return `R$ ${n.toFixed(2)}`;
  }
}
