export type TableItem = {
  id: number
  name: string
  room: string
  seats: number
  status: string
}

export const tablesService = {
  getAll: async (): Promise<TableItem[]> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, name: 'Table A1', room: 'Room 101', seats: 4, status: 'Available' },
          { id: 2, name: 'Table A2', room: 'Room 101', seats: 4, status: 'Occupied' },
          { id: 3, name: 'Table B1', room: 'Room 102', seats: 6, status: 'Available' },
          { id: 4, name: 'Table B2', room: 'Room 102', seats: 6, status: 'Available' },
          { id: 5, name: 'Table C1', room: 'Room 103', seats: 8, status: 'Reserved' },
          { id: 6, name: 'Table C2', room: 'Room 103', seats: 8, status: 'Available' },
          { id: 7, name: 'Table D1', room: 'Room 201', seats: 4, status: 'Available' },
          { id: 8, name: 'Table D2', room: 'Room 201', seats: 4, status: 'Occupied' },
        ])
      }, 100)
    })
  },
}
