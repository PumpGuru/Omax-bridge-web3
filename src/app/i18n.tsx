import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import all language JSON files
import en from "../locales/en.json";
import af from "../locales/af.json";
import ar from "../locales/ar.json";
import ca from "../locales/ca.json";
import cs from "../locales/cs.json";
import da from "../locales/da.json";
import de from "../locales/de.json";
import el from "../locales/el.json";
import es from "../locales/es.json";
import fi from "../locales/fi.json";
import fr from "../locales/fr.json";
import he from "../locales/he.json";
import hu from "../locales/hu.json";
import id from "../locales/id.json";
import it from "../locales/it.json";
import ja from "../locales/ja.json";
import ko from "../locales/ko.json";
import nl from "../locales/nl.json";
import no from "../locales/no.json";
import pl from "../locales/pl.json";
import pt from "../locales/pt.json";
import ro from "../locales/ro.json";
import ru from "../locales/ru.json";
import sr from "../locales/sr.json";
import sv from "../locales/sv.json";
import sw from "../locales/sw.json";
import tr from "../locales/tr.json";
import uk from "../locales/uk.json";
import vi from "../locales/vi.json";
import zhCN from "../locales/zhCN.json";
import zhTW from "../locales/zhTW.json";

// Define resources for i18n
const resources = {
  en: { translation: en },
  af: { translation: af },
  ar: { translation: ar },
  ca: { translation: ca },
  cs: { translation: cs },
  da: { translation: da },
  de: { translation: de },
  el: { translation: el },
  es: { translation: es },
  fi: { translation: fi },
  fr: { translation: fr },
  he: { translation: he },
  hu: { translation: hu },
  id: { translation: id },
  it: { translation: it },
  ja: { translation: ja },
  ko: { translation: ko },
  nl: { translation: nl },
  no: { translation: no },
  pl: { translation: pl },
  pt: { translation: pt },
  ro: { translation: ro },
  ru: { translation: ru },
  sr: { translation: sr },
  sv: { translation: sv },
  sw: { translation: sw },
  tr: { translation: tr },
  uk: { translation: uk },
  vi: { translation: vi },
  zhCN: { translation: zhCN },
  zhTW: { translation: zhTW },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });

export default i18n;
