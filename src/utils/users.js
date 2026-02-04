export const betaAccess = () => {
  const userJson = localStorage.getItem('user')
  if (!userJson) {
    return false
  }
  try {
    const user = JSON.parse(userJson)
    return user.beta_access || false
  } catch (error) {
    console.error('Error parsing user data:', error)
    return false
  }
}

export const isLoggedIn = () => {
  return localStorage.getItem('loggedIn') === 'true'
}

export const getCompany = () => {
  const userJson = localStorage.getItem('user')
  if (!userJson) {
    return ''
  }
  try {
    const user = JSON.parse(userJson)
    return user.company || ''
  } catch (error) {
    console.error('Error parsing user data:', error)
    return ''
  }
}

// Helper function to get the auth token
export const getAuthToken = () => {
  return localStorage.getItem('token')
}
