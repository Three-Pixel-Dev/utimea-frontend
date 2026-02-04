export type Student = {
  id: number
  name: string
  email: string
  batch: string
  majorSection: string
  status: string
}

export const studentsService = {
  getAll: async (): Promise<Student[]> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, name: 'Alice Johnson', email: 'alice.j@example.com', batch: 'Batch 2024', majorSection: 'Computer Science - Year 1', status: 'Active' },
          { id: 2, name: 'Bob Smith', email: 'bob.s@example.com', batch: 'Batch 2024', majorSection: 'Engineering - Year 1', status: 'Active' },
          { id: 3, name: 'Charlie Brown', email: 'charlie.b@example.com', batch: 'Batch 2025', majorSection: 'Computer Science - Year 2', status: 'Active' },
          { id: 4, name: 'Diana Prince', email: 'diana.p@example.com', batch: 'Batch 2024', majorSection: 'Business - Year 1', status: 'Active' },
          { id: 5, name: 'Edward Lee', email: 'edward.l@example.com', batch: 'Batch 2025', majorSection: 'Engineering - Year 2', status: 'Inactive' },
          { id: 6, name: 'Fiona Green', email: 'fiona.g@example.com', batch: 'Batch 2024', majorSection: 'Computer Science - Year 1', status: 'Active' },
          { id: 7, name: 'George White', email: 'george.w@example.com', batch: 'Batch 2025', majorSection: 'Business - Year 1', status: 'Active' },
          { id: 8, name: 'Hannah Black', email: 'hannah.b@example.com', batch: 'Batch 2024', majorSection: 'Engineering - Year 1', status: 'Active' },
        ])
      }, 100)
    })
  },
}
