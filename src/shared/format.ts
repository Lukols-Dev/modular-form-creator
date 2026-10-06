const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

const dateTimeFormatter = new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

export function formatDate(isoDate: string): string {
  return dateFormatter.format(new Date(isoDate))
}

export function formatDateTime(isoDate: string): string {
  return dateTimeFormatter.format(new Date(isoDate))
}

const listFormatter = new Intl.ListFormat('en', { style: 'long', type: 'conjunction' })

/** Joins items into a readable list, e.g. "Basic Info and Project Details". */
export function formatList(items: string[]): string {
  return listFormatter.format(items)
}

/** Groups digits in threes without converting to a number, so long values keep every digit. */
export function formatDigits(digits: string): string {
  const firstGroupLength = digits.length % 3 || 3
  const groups = [digits.slice(0, firstGroupLength)]
  for (let start = firstGroupLength; start < digits.length; start += 3) {
    groups.push(digits.slice(start, start + 3))
  }
  return groups.join(',')
}
