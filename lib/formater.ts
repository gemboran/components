export function currencyFormater(number: number, locale = "id-ID", currency = "IDR"): string {
  return new Intl.NumberFormat(locale, {style: "currency", currency}).format(number)
}

export function dateFormater(date: Date, locale = "id-ID", options?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat(locale, options).format(date);
}
