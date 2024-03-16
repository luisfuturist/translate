import { useState } from "react";
import { SUPPORTED_LANGUAGES } from "~/data";
import { Lang } from "~/types";

export default function useLanguages() {
  const [from, setFrom] = useState<string>(SUPPORTED_LANGUAGES[0].label);
  const [to, setTo] = useState<string>(SUPPORTED_LANGUAGES[1].label);
  const [historyTo, setHistoryTo] = useState<Lang[]>(SUPPORTED_LANGUAGES)
  const [historyFrom, setHistoryFrom] = useState<Lang[]>(SUPPORTED_LANGUAGES)

  const swapLanguages = () => {
    setTo(from);
    setFrom(to)
  }

  const changeLang = (type: 'to' | 'from', newLangLabel: string) => {
    const [langLabel, setLangLabel] = type === 'to' ? [to, setTo] : [from, setFrom];
    const [history, setHistory] = type === 'to' ? [historyTo, setHistoryTo] : [historyFrom, setHistoryFrom];

    if (newLangLabel === langLabel) {
      return;
    }

    setLangLabel(newLangLabel);

    const newLang = SUPPORTED_LANGUAGES.find(lang => lang.label === newLangLabel)!;
    const updatedHistory = history.filter(lang => lang.label !== newLangLabel);

    if (history.slice(0, 3).find(lang => lang.label === newLangLabel)) {
      return;
    }

    updatedHistory.unshift(newLang);
    setHistory(updatedHistory);
  }

  return { from, setFrom, to, setTo, changeLang, historyTo, historyFrom, swapLanguages }
}
