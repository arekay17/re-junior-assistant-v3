export const fields = [
  {
    id: 'tapis',
    name: 'Tapis',
    description: 'Mature oil field surveillance dashboard',
  },
  {
    id: 'irong-barat',
    name: 'Irong Barat',
    description: 'Well and reservoir performance review',
  },
  {
    id: 'semangkok',
    name: 'Semangkok',
    description: 'Production and pressure monitoring',
  },
]

export const wellsByField = {
  tapis: [
    { id: 1, name: 'TP-01', reservoir: 'E34', oilRate: 850, waterCut: 22, gor: 750, status: 'Normal' },
    { id: 2, name: 'TP-02', reservoir: 'E40A', oilRate: 420, waterCut: 68, gor: 500, status: 'High water cut' },
    { id: 3, name: 'TP-03', reservoir: 'E22B', oilRate: 300, waterCut: 15, gor: 1800, status: 'High GOR' },
  ],

  'irong-barat': [
    { id: 1, name: 'IB-01', reservoir: 'R1', oilRate: 620, waterCut: 35, gor: 900, status: 'Normal' },
    { id: 2, name: 'IB-02', reservoir: 'R2', oilRate: 280, waterCut: 72, gor: 650, status: 'High water cut' },
    { id: 3, name: 'IB-03', reservoir: 'R3', oilRate: 510, waterCut: 18, gor: 1200, status: 'Normal' },
  ],

  semangkok: [
    { id: 1, name: 'SMK-01', reservoir: 'E12', oilRate: 390, waterCut: 28, gor: 1100, status: 'Normal' },
    { id: 2, name: 'SMK-02', reservoir: 'E20', oilRate: 240, waterCut: 12, gor: 2100, status: 'High GOR' },
    { id: 3, name: 'SMK-03', reservoir: 'E25', oilRate: 180, waterCut: 76, gor: 700, status: 'High water cut' },
  ],
}