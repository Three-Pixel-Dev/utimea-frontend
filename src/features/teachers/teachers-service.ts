export type Teacher = {
  id: number
  name: string
  email: string
  department: string
  status: string
}

export const teachersService = {
  getAll: async (): Promise<Teacher[]> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, name: 'Dr. John Smith', email: 'john.smith@example.com', department: 'Mathematics', status: 'Active' },
          { id: 2, name: 'Prof. Jane Doe', email: 'jane.doe@example.com', department: 'Science', status: 'Active' },
          { id: 3, name: 'Dr. Robert Johnson', email: 'robert.j@example.com', department: 'English', status: 'Active' },
          { id: 4, name: 'Prof. Sarah Williams', email: 'sarah.w@example.com', department: 'History', status: 'On Leave' },
          { id: 5, name: 'Dr. Michael Brown', email: 'michael.b@example.com', department: 'Mathematics', status: 'Active' },
          { id: 6, name: 'Prof. Emily Davis', email: 'emily.d@example.com', department: 'Science', status: 'Active' },
          { id: 7, name: 'Dr. James Wilson', email: 'james.w@example.com', department: 'English', status: 'Active' },
          { id: 8, name: 'Prof. Lisa Anderson', email: 'lisa.a@example.com', department: 'History', status: 'Active' },
        ])
      }, 100)
    })
  },
}
