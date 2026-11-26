/**
 * International Locale-Aware Formatters
 * 
 * Formats currencies, dates, numbers, and exchange conversion notices
 * strictly respecting regional conventions and ISO standards.
 */

export function formatLocalizedCurrency(
  amount: number,
  currency: string = "USD",
  locale: string = "en-US",
  options?: {
    showDecimals?: boolean;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  }
): string {
  const upperCurrency = (currency || "USD").toUpperCase();
  const isZeroDecimal = ["JPY", "KRW"].includes(upperCurrency);

  try {
    const fractionDigits = isZeroDecimal
      ? 0
      : options?.showDecimals === false
      ? 0
      : options?.minimumFractionDigits ?? 2;

    const formatter = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: upperCurrency,
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: isZeroDecimal ? 0 : options?.maximumFractionDigits ?? 2,
    });

    return formatter.format(amount);
  } catch (err) {
    // Fallback if locale or currency code is non-standard
    return `${upperCurrency} ${amount.toFixed(isZeroDecimal ? 0 : 2)}`;
  }
}

export function formatLocalizedDate(
  dateInput: string | number | Date,
  locale: string = "en-US",
  timeZone: string = "UTC",
  options?: Intl.DateTimeFormatOptions
): string {
  try {
    const date = new Date(dateInput);
    const formatter = new Intl.DateTimeFormat(locale, {
      timeZone,
      year: "numeric",
      month: "short",
      day: "numeric",
      ...options,
    });
    return formatter.format(date);
  } catch {
    return new Date(dateInput).toLocaleDateString();
  }
}

export function formatCurrencySettlementNotice(
  displayCurrency: string,
  baseCurrency: string = "USD",
  rate: number = 1.0
): string {
  if (displayCurrency.toUpperCase() === baseCurrency.toUpperCase()) {
    return `Prices and settlement processed directly in ${baseCurrency}.`;
  }
  return `Prices displayed in ${displayCurrency} for your convenience. Payment is authorized and securely processed in ${baseCurrency} at guaranteed bank rate (1 ${baseCurrency} = ${rate.toFixed(4)} ${displayCurrency}).`;
}
