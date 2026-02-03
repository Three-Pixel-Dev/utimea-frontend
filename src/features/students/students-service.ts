export type Student = {
  id: number
  name: string
  email: string
  grade: string
  status: string
}

export const studentsService = {
  getAll: async (): Promise<Student[]> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, name: 'Alice Johnson', email: 'alice.j@example.com', grade: 'A', status: 'Active' },
          { id: 2, name: 'Bob Smith', email: 'bob.s@example.com', grade: 'B', status: 'Active' },
          { id: 3, name: 'Charlie Brown', email: 'charlie.b@example.com', grade: 'A', status: 'Active' },
          { id: 4, name: 'Diana Prince', email: 'diana.p@example.com', grade: 'A+', status: 'Active' },
          { id: 5, name: 'Edward Lee', email: 'edward.l@example.com', grade: 'B+', status: 'Inactive' },
          { id: 6, name: 'Fiona Green', email: 'fiona.g@example.com', grade: 'A', status: 'Active' },
          { id: 7, name: 'George White', email: 'george.w@example.com', grade: 'B', status: 'Active' },
          { id: 8, name: 'Hannah Black', email: 'hannah.b@example.com', grade: 'A+', status: 'Active' },
        ])
      }, 100)
    })
  },
}
