export interface TrackPreset {
  id: number; // 0:Kick, 1:Snare, 2:HH Closed, etc.
  pulses: number;
  rotation: number;
}

export interface RhythmPreset {
  id: string;
  name: string;
  description: string;
  steps: number;
  tracks: TrackPreset[];
}

export const RHYTHM_PRESETS: RhythmPreset[] = [
  {
    id: 'tresillo',
    name: 'Tresillo (3,8)',
    description: '基本のクロスリズム。キューバ音楽、レゲトン。',
    steps: 8,
    tracks: [
      { id: 0, pulses: 4, rotation: 0 }, // Kick: 4つ打ち
      { id: 1, pulses: 0, rotation: 0 }, 
      { id: 2, pulses: 8, rotation: 0 }, // HH: 8分刻み
      { id: 4, pulses: 2, rotation: 0 }, // Clap: バックビート的要素
      { id: 7, pulses: 3, rotation: 0 }, // Cowbell: Tresillo pattern E(3,8)
    ],
  },
  {
    id: 'take-five',
    name: 'Take Five (2,5)',
    description: '5/4拍子。デイヴ・ブルーベック。',
    steps: 5, // または10/20ですが、基本単位として5
    tracks: [
      { id: 0, pulses: 1, rotation: 0 }, // Kick: 頭拍
      { id: 2, pulses: 5, rotation: 0 }, // HH: 5拍子刻み
      { id: 7, pulses: 2, rotation: 0 }, // Cowbell: E(2,5)
    ],
  },
  {
    id: 'cinquillo',
    name: 'Cinquillo (5,8)',
    description: 'キューバのハバネラ、ダンソン。強い推進力。',
    steps: 8,
    tracks: [
      { id: 0, pulses: 5, rotation: 0 }, // Kick: シンコペーション
      { id: 2, pulses: 8, rotation: 0 }, // HH
      { id: 6, pulses: 3, rotation: 2 }, // Rim: Clave的
      { id: 7, pulses: 5, rotation: 0 }, // Cowbell: Cinquillo E(5,8)
    ],
  },
  {
    id: 'fandango',
    name: 'Fandango (4,12)',
    description: '12/8拍子。バザ。ポリリズムの基盤。',
    steps: 12,
    tracks: [
      { id: 0, pulses: 4, rotation: 0 }, // Kick: 3連の頭
      { id: 4, pulses: 4, rotation: 0 }, // Clap
      { id: 7, pulses: 4, rotation: 1 }, // Cowbell: E(4,12) shifted slightly? No, E(4,12) is just every 3 steps.
                                        // Let's make it interesting.
    ],
  },
  {
    id: 'bembe',
    name: 'Bembe (7,12)',
    description: 'アフロ・キューバン。6/8拍子。',
    steps: 12,
    tracks: [
      { id: 0, pulses: 4, rotation: 0 }, // Kick: 付点4分 (6/8の2拍)
      { id: 1, pulses: 0, rotation: 0 },
      { id: 5, pulses: 5, rotation: 0 }, // Tom
      { id: 7, pulses: 7, rotation: 0 }, // Cowbell: Bembe E(7,12)
    ],
  },
  {
    id: 'macedonian',
    name: 'Macedonian (5,13)',
    description: '素数周期の変拍子。',
    steps: 13,
    tracks: [
      { id: 0, pulses: 4, rotation: 0 }, // Kick
      { id: 2, pulses: 13, rotation: 0 }, // HH
      { id: 7, pulses: 5, rotation: 0 }, // Cowbell
    ],
  },
  {
    id: 'samba',
    name: 'Samba (9,16)',
    description: 'ブラジルのサンバ。16ビート。',
    steps: 16,
    tracks: [
      { id: 0, pulses: 4, rotation: 0 }, // Kick (Surdo pattern implies more, but E(4,16) gives solid beat)
      { id: 1, pulses: 0, rotation: 0 },
      { id: 2, pulses: 16, rotation: 0 }, // Shaker-like
      { id: 7, pulses: 9, rotation: 0 }, // Cowbell/Agogo
    ],
  },
];
