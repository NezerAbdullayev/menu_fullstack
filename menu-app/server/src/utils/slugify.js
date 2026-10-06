const MAP = { ə: 'e', ı: 'i', ö: 'o', ü: 'u', ğ: 'g', ş: 's', ç: 'c', İ: 'i' };

export function slugify(text = '') {
  return text
    .replace(/[əıöüğşçİ]/gi, (ch) => MAP[ch] ?? MAP[ch.toLowerCase()] ?? ch)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
