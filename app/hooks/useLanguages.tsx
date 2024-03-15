import { useState } from "react";
import { SUPPORTED_LANGUAGES } from "~/data";
import { Lang } from "~/types";

export default function useLanguages() {
  const [from, setFrom] = useState<string>(SUPPORTED_LANGUAGES[0].id);
  const [to, setTo] = useState<string>(SUPPORTED_LANGUAGES[1].id);
  const [historyTo, setHistoryTo] = useState<Lang[]>(SUPPORTED_LANGUAGES)
  const [historyFrom, setHistoryFrom] = useState<Lang[]>(SUPPORTED_LANGUAGES)

  const swapLanguages = () => {
    setTo(from);
    setFrom(to)
  }

  const changeLang = (type: 'to' | 'from', newLangId: string) => {
    const langKey = type === 'to' ? to : from;

    if (newLangId === langKey) {
      return;
    }

    if ((type === 'to' && newLangId === to)) {
      return;
    }

    const setLang = type === 'to' ? setTo : setFrom;
    const setHistory = type === 'to' ? setHistoryTo : setHistoryFrom;

    if ((type === 'to' && newLangId === from) || (type === 'from' && newLangId === to)) {
      swapLanguages();
      return;
    }

    const lang = SUPPORTED_LANGUAGES.find(lang => lang.id === newLangId)!;

    const updatedHistory = historyTo.filter(lang => lang.id !== newLangId);
    updatedHistory.unshift(lang);

    setHistory(updatedHistory);
    setLang(newLangId);
  }

  return { from, setFrom, to, setTo, changeLang, historyTo, historyFrom, swapLanguages }
}
