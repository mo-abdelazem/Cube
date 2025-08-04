import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations('HomePage');
  return <div className="text-red-400">{t('Home')}</div>;
}
