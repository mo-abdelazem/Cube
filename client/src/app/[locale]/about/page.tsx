import { useTranslations } from "next-intl";
import React from "react";

const About = () => {
    const t = useTranslations('HomePage');

  return <div>{t('about')}</div>;
};

export default About;
