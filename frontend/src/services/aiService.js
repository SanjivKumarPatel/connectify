import api from '../config/api'

export const aiService = {
  rewritePost: async (content) => {
    const response = await api.post('/ai/rewrite', { content })
    return response.data
  }
}

export default aiService