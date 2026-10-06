import { Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { currentLang } from '../../i18n'
import { localize } from '../../utils/localize'

/** Cədvəl üçün ad: yalnız seçilmiş dildəki mətn. */
export default function LocalizedName({ value }) {
  useTranslation() // dil dəyişəndə yenidən render olsun
  return <Typography.Text strong>{localize(value, currentLang())}</Typography.Text>
}
