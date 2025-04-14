/**
 * Configuration file for TTS voices
 * This file allows easy management of voice IDs and their display names
 */
export type VoiceConfig = {
  id: string;
  displayName: string;
  gender?: 'male' | 'female';
  accent?: string;
  description?: string;
};

export const voices: VoiceConfig[] = [
  {
    id: 'p225',
    displayName: 'British Male 1',
    gender: 'male',
    accent: 'British',
  },
  {
    id: 'p226',
    displayName: 'British Female 1',
    gender: 'female',
    accent: 'British',
  },
  {
    id: 'p227',
    displayName: 'American Male 1',
    gender: 'male',
    accent: 'American',
  },
  {
    id: 'p228',
    displayName: 'British Female 2',
    gender: 'female',
    accent: 'British',
  },
  {
    id: 'p229',
    displayName: 'British Female 3',
    gender: 'female',
    accent: 'British',
  },
  {
    id: 'p230',
    displayName: 'British Male 2',
    gender: 'male',
    accent: 'British',
  },
  {
    id: 'p231',
    displayName: 'British Female 4',
    gender: 'female',
    accent: 'British',
  },
  {
    id: 'p232',
    displayName: 'British Male 3',
    gender: 'male',
    accent: 'British',
  },
  {
    id: 'p233',
    displayName: 'American Female 1',
    gender: 'female',
    accent: 'American',
  },
  {
    id: 'p234',
    displayName: 'British Male 4',
    gender: 'male',
    accent: 'British',
  },
  {
    id: 'p236',
    displayName: 'British Female 5',
    gender: 'female',
    accent: 'British',
  },
  {
    id: 'p237',
    displayName: 'Scottish Male 1',
    gender: 'male',
    accent: 'Scottish',
  },
  {
    id: 'p238',
    displayName: 'Scottish Female 1',
    gender: 'female',
    accent: 'Scottish',
  },
  {
    id: 'p239',
    displayName: 'British Female 6',
    gender: 'female',
    accent: 'British',
  },
  {
    id: 'p240',
    displayName: 'British Male 5',
    gender: 'male',
    accent: 'British',
  },
  {
    id: 'p241',
    displayName: 'Australian Female 1',
    gender: 'female',
    accent: 'Australian',
  },
  {
    id: 'p243',
    displayName: 'British Male 6',
    gender: 'male',
    accent: 'British',
  },
  {
    id: 'p244',
    displayName: 'British Female 7',
    gender: 'female',
    accent: 'British',
  },
  {
    id: 'p245',
    displayName: 'Scottish Male 2',
    gender: 'male',
    accent: 'Scottish',
  },
  {
    id: 'p246',
    displayName: 'British Female 8',
    gender: 'female',
    accent: 'British',
  },
  {
    id: 'p247',
    displayName: 'American Male 2',
    gender: 'male',
    accent: 'American',
  },
  {
    id: 'p248',
    displayName: 'Irish Female 1',
    gender: 'female',
    accent: 'Irish',
  },
  {
    id: 'p249',
    displayName: 'Scottish Female 2',
    gender: 'female',
    accent: 'Scottish',
  },
  {
    id: 'p250',
    displayName: 'American Female 2',
    gender: 'female',
    accent: 'American',
  },
  {
    id: 'p251',
    displayName: 'American Male 3',
    gender: 'male',
    accent: 'American',
  },
  {
    id: 'p252',
    displayName: 'British Male 7',
    gender: 'male',
    accent: 'British',
  },
  {
    id: 'p253',
    displayName: 'British Female 9',
    gender: 'female',
    accent: 'British',
  },
  {
    id: 'p254',
    displayName: 'British Male 8',
    gender: 'male',
    accent: 'British',
  },
  {
    id: 'p255',
    displayName: 'British Male 9',
    gender: 'male',
    accent: 'British',
  },
  {
    id: 'p256',
    displayName: 'British Female 10',
    gender: 'female',
    accent: 'British',
  },
  {
    id: 'p257',
    displayName: 'British Female 11',
    gender: 'female',
    accent: 'British',
  },
  {
    id: 'p258',
    displayName: 'British Male 10',
    gender: 'male',
    accent: 'British',
  },
  {
    id: 'p259',
    displayName: 'British Female 12',
    gender: 'female',
    accent: 'British',
  },
  {
    id: 'p260',
    displayName: 'British Male 11',
    gender: 'male',
    accent: 'British',
  },
  {
    id: 'p261',
    displayName: 'Australian Male 1',
    gender: 'male',
    accent: 'Australian',
  },
  {
    id: 'p262',
    displayName: 'British Female 13',
    gender: 'female',
    accent: 'British',
  },
  { id: 'p263', displayName: 'Irish Male 1', gender: 'male', accent: 'Irish' },
  {
    id: 'p264',
    displayName: 'British Female 14',
    gender: 'female',
    accent: 'British',
  },
  {
    id: 'p265',
    displayName: 'British Male 12',
    gender: 'male',
    accent: 'British',
  },
  {
    id: 'p266',
    displayName: 'British Female 15',
    gender: 'female',
    accent: 'British',
  },
  {
    id: 'p267',
    displayName: 'British Male 13',
    gender: 'male',
    accent: 'British',
  },
  {
    id: 'p268',
    displayName: 'Canadian Female 1',
    gender: 'female',
    accent: 'Canadian',
  },
  {
    id: 'p269',
    displayName: 'British Female 16',
    gender: 'female',
    accent: 'British',
  },
  {
    id: 'p270',
    displayName: 'British Male 14',
    gender: 'male',
    accent: 'British',
  },
  {
    id: 'p271',
    displayName: 'Canadian Male 1',
    gender: 'male',
    accent: 'Canadian',
  },
  {
    id: 'p272',
    displayName: 'South African Female 1',
    gender: 'female',
    accent: 'South African',
  },
  {
    id: 'p273',
    displayName: 'British Male 15',
    gender: 'male',
    accent: 'British',
  },
  {
    id: 'p274',
    displayName: 'British Female 17',
    gender: 'female',
    accent: 'British',
  },
  {
    id: 'p275',
    displayName: 'British Male 16',
    gender: 'male',
    accent: 'British',
  },
  {
    id: 'p276',
    displayName: 'British Female 18',
    gender: 'female',
    accent: 'British',
  },
  {
    id: 'p277',
    displayName: 'Canadian Female 2',
    gender: 'female',
    accent: 'Canadian',
  },
  {
    id: 'p278',
    displayName: 'British Female 19',
    gender: 'female',
    accent: 'British',
  },
  {
    id: 'p279',
    displayName: 'British Female 20',
    gender: 'female',
    accent: 'British',
  },
  {
    id: 'p280',
    displayName: 'American Female 3',
    gender: 'female',
    accent: 'American',
  },
  {
    id: 'p281',
    displayName: 'British Female 21',
    gender: 'female',
    accent: 'British',
  },
  {
    id: 'p282',
    displayName: 'British Male 17',
    gender: 'male',
    accent: 'British',
  },
  {
    id: 'p283',
    displayName: 'British Female 22',
    gender: 'female',
    accent: 'British',
  },
  {
    id: 'p284',
    displayName: 'British Male 18',
    gender: 'male',
    accent: 'British',
  },
  {
    id: 'p285',
    displayName: 'British Female 23',
    gender: 'female',
    accent: 'British',
  },
  {
    id: 'p286',
    displayName: 'British Male 19',
    gender: 'male',
    accent: 'British',
  },
  {
    id: 'p287',
    displayName: 'Irish Female 2',
    gender: 'female',
    accent: 'Irish',
  },
  {
    id: 'p288',
    displayName: 'New Zealand Female 1',
    gender: 'female',
    accent: 'New Zealand',
  },
  {
    id: 'p292',
    displayName: 'British Male 20',
    gender: 'male',
    accent: 'British',
  },
  {
    id: 'p293',
    displayName: 'American Female 4',
    gender: 'female',
    accent: 'American',
  },
  {
    id: 'p294',
    displayName: 'American Female 5',
    gender: 'female',
    accent: 'American',
  },
  {
    id: 'p295',
    displayName: 'Scottish Female 3',
    gender: 'female',
    accent: 'Scottish',
  },
  {
    id: 'p297',
    displayName: 'American Male 4',
    gender: 'male',
    accent: 'American',
  },
  {
    id: 'p298',
    displayName: 'American Female 6',
    gender: 'female',
    accent: 'American',
  },
  {
    id: 'p299',
    displayName: 'American Female 7',
    gender: 'female',
    accent: 'American',
  },
  {
    id: 'p300',
    displayName: 'British Female 24',
    gender: 'female',
    accent: 'British',
  },
  {
    id: 'p301',
    displayName: 'British Male 21',
    gender: 'male',
    accent: 'British',
  },
  {
    id: 'p302',
    displayName: 'Australian Female 2',
    gender: 'female',
    accent: 'Australian',
  },
  {
    id: 'p303',
    displayName: 'American Female 8',
    gender: 'female',
    accent: 'American',
  },
  {
    id: 'p304',
    displayName: 'British Female 25',
    gender: 'female',
    accent: 'British',
  },
  {
    id: 'p305',
    displayName: 'British Male 22',
    gender: 'male',
    accent: 'British',
  },
  {
    id: 'p306',
    displayName: 'American Male 5',
    gender: 'male',
    accent: 'American',
  },
  {
    id: 'p307',
    displayName: 'British Female 26',
    gender: 'female',
    accent: 'British',
  },
  {
    id: 'p308',
    displayName: 'British Female 27',
    gender: 'female',
    accent: 'British',
  },
  {
    id: 'p310',
    displayName: 'British Female 28',
    gender: 'female',
    accent: 'British',
  },
  {
    id: 'p311',
    displayName: 'Scottish Male 3',
    gender: 'male',
    accent: 'Scottish',
  },
  {
    id: 'p312',
    displayName: 'Irish Female 3',
    gender: 'female',
    accent: 'Irish',
  },
  {
    id: 'p313',
    displayName: 'American Female 9',
    gender: 'female',
    accent: 'American',
  },
  {
    id: 'p314',
    displayName: 'American Female 10',
    gender: 'female',
    accent: 'American',
  },
  {
    id: 'p316',
    displayName: 'British Female 29',
    gender: 'female',
    accent: 'British',
  },
  {
    id: 'p317',
    displayName: 'British Female 30',
    gender: 'female',
    accent: 'British',
  },
  {
    id: 'p318',
    displayName: 'American Female 11',
    gender: 'female',
    accent: 'American',
  },
  {
    id: 'p323',
    displayName: 'American Male 6',
    gender: 'male',
    accent: 'American',
  },
  {
    id: 'p326',
    displayName: 'British Male 23',
    gender: 'male',
    accent: 'British',
  },
  {
    id: 'p329',
    displayName: 'American Female 12',
    gender: 'female',
    accent: 'American',
  },
  {
    id: 'p330',
    displayName: 'British Female 31',
    gender: 'female',
    accent: 'British',
  },
  {
    id: 'p333',
    displayName: 'American Male 7',
    gender: 'male',
    accent: 'American',
  },
  {
    id: 'p334',
    displayName: 'Scottish Female 4',
    gender: 'female',
    accent: 'Scottish',
  },
  {
    id: 'p335',
    displayName: 'British Female 32',
    gender: 'female',
    accent: 'British',
  },
  {
    id: 'p336',
    displayName: 'British Female 33',
    gender: 'female',
    accent: 'British',
  },
  {
    id: 'p339',
    displayName: 'Canadian Female 3',
    gender: 'female',
    accent: 'Canadian',
  },
  {
    id: 'p340',
    displayName: 'American Female 13',
    gender: 'female',
    accent: 'American',
  },
  {
    id: 'p341',
    displayName: 'British Female 34',
    gender: 'female',
    accent: 'British',
  },
  {
    id: 'p343',
    displayName: 'British Female 35',
    gender: 'female',
    accent: 'British',
  },
  {
    id: 'p345',
    displayName: 'British Female 36',
    gender: 'female',
    accent: 'British',
  },
  {
    id: 'p347',
    displayName: 'American Female 14',
    gender: 'female',
    accent: 'American',
  },
  {
    id: 'p351',
    displayName: 'British Female 37',
    gender: 'female',
    accent: 'British',
  },
  {
    id: 'p360',
    displayName: 'American Female 15',
    gender: 'female',
    accent: 'American',
  },
  {
    id: 'p361',
    displayName: 'British Female 38',
    gender: 'female',
    accent: 'British',
  },
  {
    id: 'p362',
    displayName: 'British Female 39',
    gender: 'female',
    accent: 'British',
  },
  {
    id: 'p363',
    displayName: 'British Female 40',
    gender: 'female',
    accent: 'British',
  },
  {
    id: 'p364',
    displayName: 'Irish Female 4',
    gender: 'female',
    accent: 'Irish',
  },
  {
    id: 'p374',
    displayName: 'British Female 41',
    gender: 'female',
    accent: 'British',
  },
  {
    id: 'p376',
    displayName: 'British Female 42',
    gender: 'female',
    accent: 'British',
  },
];

/**
 * Get a map of voice IDs to their display names
 * Useful for quick lookups of voice information
 */
export const getVoiceMap = (): Record<string, string> => {
  return voices.reduce(
    (acc, voice) => {
      acc[voice.id] = voice.displayName;
      return acc;
    },
    {} as Record<string, string>,
  );
};

/**
 * Get the default voice ID
 */
export const getDefaultVoiceId = (): string => {
  return 'p234'; // British Male 4
};
