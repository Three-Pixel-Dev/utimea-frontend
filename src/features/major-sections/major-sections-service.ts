export type MajorSection = {
  id: number
  name: string
  majorSectionYear: string
}

// Mock data
const mockMajorSections: MajorSection[] = [
  { id: 1, name: 'Computer Science - Year 1', majorSectionYear: 'First Year' },
  { id: 2, name: 'Computer Science - Year 2', majorSectionYear: 'Second Year' },
  { id: 3, name: 'Engineering - Year 1', majorSectionYear: 'First Year' },
  { id: 4, name: 'Engineering - Year 2', majorSectionYear: 'Second Year' },
  { id: 5, name: 'Business - Year 1', majorSectionYear: 'First Year' },
]

export const majorSectionsService = {
  getAll: async (): Promise<MajorSection[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockMajorSections)
      }, 100)
    })
  },

  getById: async (id: number): Promise<MajorSection | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockMajorSections.find((section) => section.id === id))
      }, 100)
    })
  },

  create: async (section: Omit<MajorSection, 'id'>): Promise<MajorSection> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newSection: MajorSection = {
          id: mockMajorSections.length + 1,
          ...section,
        }
        mockMajorSections.push(newSection)
        resolve(newSection)
      }, 100)
    })
  },

  update: async (id: number, section: Partial<MajorSection>): Promise<MajorSection> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockMajorSections.findIndex((s) => s.id === id)
        if (index === -1) {
          reject(new Error('Major section not found'))
          return
        }
        mockMajorSections[index] = { ...mockMajorSections[index], ...section }
        resolve(mockMajorSections[index])
      }, 100)
    })
  },

  delete: async (id: number): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockMajorSections.findIndex((s) => s.id === id)
        if (index === -1) {
          reject(new Error('Major section not found'))
          return
        }
        mockMajorSections.splice(index, 1)
        resolve()
      }, 100)
    })
  },
}
