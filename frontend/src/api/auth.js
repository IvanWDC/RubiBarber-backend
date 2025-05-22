import API from './client'

export const loginUser = async (email, password) => {
  const response = await API.post('/auth/login', {
    email,
    password,
  })
  return response.data
}
