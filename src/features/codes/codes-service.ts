export type Code = {
  id: number
  name: string
  systemDefined: boolean
}

export type CodeValue = {
  id: number
  codeId: number
  name: string
  description: string
  position: number
  active: boolean
}

// Mock data
const mockCodes: Code[] = [
  { id: 1, name: 'Batch', systemDefined: false },
  { id: 2, name: 'Academic Year', systemDefined: false },
  { id: 3, name: 'Major Section Year', systemDefined: false },
]

const mockCodeValues: Record<number, CodeValue[]> = {
  1: [
    { id: 1, codeId: 1, name: 'Batch 2024', description: 'Batch 2024', position: 0, active: true },
    { id: 2, codeId: 1, name: 'Batch 2025', description: 'Batch 2025', position: 1, active: true },
  ],
  2: [
    { id: 1, codeId: 2, name: '2023-2024', description: 'Academic Year 2023-2024', position: 0, active: true },
    { id: 2, codeId: 2, name: '2024-2025', description: 'Academic Year 2024-2025', position: 1, active: true },
  ],
  3: [
    { id: 1, codeId: 3, name: 'First Year', description: 'Major Section Year - First Year', position: 0, active: true },
    { id: 2, codeId: 3, name: 'Second Year', description: 'Major Section Year - Second Year', position: 1, active: true },
  ],
}

export const codesService = {
  getAll: async (): Promise<Code[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockCodes)
      }, 100)
    })
  },

  getById: async (id: number): Promise<Code | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockCodes.find((code) => code.id === id))
      }, 100)
    })
  },

  create: async (code: Omit<Code, 'id'>): Promise<Code> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newCode: Code = {
          id: mockCodes.length + 1,
          ...code,
        }
        mockCodes.push(newCode)
        resolve(newCode)
      }, 100)
    })
  },

  update: async (id: number, code: Partial<Code>): Promise<Code> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockCodes.findIndex((c) => c.id === id)
        if (index === -1) {
          reject(new Error('Code not found'))
          return
        }
        mockCodes[index] = { ...mockCodes[index], ...code }
        resolve(mockCodes[index])
      }, 100)
    })
  },

  delete: async (id: number): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockCodes.findIndex((c) => c.id === id)
        if (index === -1) {
          reject(new Error('Code not found'))
          return
        }
        mockCodes.splice(index, 1)
        resolve()
      }, 100)
    })
  },

  getCodeValues: async (codeId: number): Promise<CodeValue[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockCodeValues[codeId] || [])
      }, 100)
    })
  },

  getCodeValueById: async (codeId: number, valueId: number): Promise<CodeValue | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const values = mockCodeValues[codeId] || []
        resolve(values.find((v) => v.id === valueId))
      }, 100)
    })
  },

  createCodeValue: async (codeId: number, value: Omit<CodeValue, 'id' | 'codeId'>): Promise<CodeValue> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!mockCodeValues[codeId]) {
          mockCodeValues[codeId] = []
        }
        const newValue: CodeValue = {
          id: (mockCodeValues[codeId].length + 1) * 100 + codeId,
          codeId,
          ...value,
        }
        mockCodeValues[codeId].push(newValue)
        resolve(newValue)
      }, 100)
    })
  },

  updateCodeValue: async (codeId: number, valueId: number, value: Partial<CodeValue>): Promise<CodeValue> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const values = mockCodeValues[codeId] || []
        const index = values.findIndex((v) => v.id === valueId)
        if (index === -1) {
          reject(new Error('Code value not found'))
          return
        }
        values[index] = { ...values[index], ...value }
        resolve(values[index])
      }, 100)
    })
  },

  deleteCodeValue: async (codeId: number, valueId: number): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const values = mockCodeValues[codeId] || []
        const index = values.findIndex((v) => v.id === valueId)
        if (index === -1) {
          reject(new Error('Code value not found'))
          return
        }
        values.splice(index, 1)
        resolve()
      }, 100)
    })
  },
}
