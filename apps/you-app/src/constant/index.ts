export const jwtConstants = {
  secret:
    'DO NOT USE THIS VALUE. INSTEAD, CREATE A COMPLEX SECRET AND KEEP IT SAFE OUTSIDE OF THE SOURCE CODE.',
};
export type ZodiacSign =
  | 'Aries'
  | 'Taurus'
  | 'Gemini'
  | 'Cancer'
  | 'Leo'
  | 'Virgo'
  | 'Libra'
  | 'Scorpio'
  | 'Sagittarius'
  | 'Capricorn'
  | 'Aquarius'
  | 'Pisces';

export const zodiacDateRanges: Record<
  ZodiacSign,
  { startMonth: number; startDay: number; endMonth: number; endDay: number }
> = {
  Aries: { startMonth: 3, startDay: 21, endMonth: 4, endDay: 19 },
  Taurus: { startMonth: 4, startDay: 20, endMonth: 5, endDay: 20 },
  Gemini: { startMonth: 5, startDay: 21, endMonth: 6, endDay: 20 },
  Cancer: { startMonth: 6, startDay: 21, endMonth: 7, endDay: 22 },
  Leo: { startMonth: 7, startDay: 23, endMonth: 8, endDay: 22 },
  Virgo: { startMonth: 8, startDay: 23, endMonth: 9, endDay: 22 },
  Libra: { startMonth: 9, startDay: 23, endMonth: 10, endDay: 22 },
  Scorpio: { startMonth: 10, startDay: 23, endMonth: 11, endDay: 21 },
  Sagittarius: { startMonth: 11, startDay: 22, endMonth: 12, endDay: 21 },
  Capricorn: { startMonth: 12, startDay: 22, endMonth: 1, endDay: 19 },
  Aquarius: { startMonth: 1, startDay: 20, endMonth: 2, endDay: 18 },
  Pisces: { startMonth: 2, startDay: 19, endMonth: 3, endDay: 20 },
};

// export { zodiacDateRanges };

export type ChineseZodiacSign =
  | 'Rat'
  | 'Ox'
  | 'Tiger'
  | 'Rabbit'
  | 'Dragon'
  | 'Snake'
  | 'Horse'
  | 'Goat'
  | 'Monkey'
  | 'Rooster'
  | 'Pig'
  | 'Dog'
  | 'Boar';
