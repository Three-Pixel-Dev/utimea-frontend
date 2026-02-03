export type Room = {
  id: number
  name: string
  capacity: number
  status: string
}

export const roomsService = {
  getAll: async (): Promise<Room[]> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, name: 'Room 101', capacity: 30, status: 'Available' },
          { id: 2, name: 'Room 102', capacity: 25, status: 'Occupied' },
          { id: 3, name: 'Room 103', capacity: 40, status: 'Available' },
          { id: 4, name: 'Room 201', capacity: 35, status: 'Available' },
          { id: 5, name: 'Room 202', capacity: 20, status: 'Maintenance' },
          { id: 6, name: 'Room 203', capacity: 45, status: 'Available' },
          { id: 7, name: 'Room 301', capacity: 50, status: 'Available' },
          { id: 8, name: 'Room 302', capacity: 30, status: 'Occupied' },
        ])
      }, 100)
    })
  },
}
