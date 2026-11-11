// SMS length / segment maths (GSM 03.38 basic + extension tables, else UCS-2).
// Used by the interactive demo. Pure functions, no dependencies.

const GSM7_BASIC =
  '@£$¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ !"#¤%&\'()*+,-./0123456789:;<=>?¡ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ§¿abcdefghijklmnopqrstuvwxyzäöñüà';
const GSM7_EXT = '^{}\\[~]|€';

export function analyzeSms(text) {
  const chars = Array.from(text);
  let units = 0;
  let unicode = false;

  for (const ch of chars) {
    if (GSM7_BASIC.includes(ch)) units += 1;
    else if (GSM7_EXT.includes(ch)) units += 2;
    else {
      unicode = true;
      break;
    }
  }

  if (unicode) units = text.length; // UCS-2 counts UTF-16 code units

  const single = unicode ? 70 : 160;
  const multi = unicode ? 67 : 153;
  const segments = units === 0 ? 0 : units <= single ? 1 : Math.ceil(units / multi);
  const capacity = segments <= 1 ? single : segments * multi;

  return {
    characters: chars.length,
    units,
    encoding: unicode ? 'Unicode' : 'GSM-7',
    segments,
    perSegment: segments <= 1 ? single : multi,
    remaining: Math.max(0, capacity - units),
  };
}
