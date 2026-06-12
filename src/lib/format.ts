export function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat('en-US').format(value);
}

export function formatMileage(miles: number) {
  return `${formatNumber(miles)} mi`;
}

export function isNavActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Strip a leading "Mazda" so display helpers don't produce "Mazda Mazda …". */
export function stripMazdaPrefix(model: string) {
  return model.replace(/^mazda\s+/i, '').trim();
}

export function formatCarTitle(year: number, model: string, trim?: string | null) {
  const name = stripMazdaPrefix(model);
  const suffix = trim ? ` ${trim}` : '';
  return `${year} Mazda ${name}${suffix}`;
}
