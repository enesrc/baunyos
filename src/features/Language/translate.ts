import type { Lang } from './config';

export const translate = (lang: Lang, en: string, tr: string) => lang === 'en' ? en : tr;