// Hər dil üçün ayrıca sahə. az əsas dildir, digərləri boş qala bilər.
export const localizedString = (required = false) => ({
  az: { type: String, trim: true, required },
  en: { type: String, trim: true, default: '' },
  ru: { type: String, trim: true, default: '' },
});
