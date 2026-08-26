import { asyncHandler } from '../middleware/asynchandler.js'
import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

export const rewritePost = asyncHandler(async (req, res) => {
  const { content } = req.body

  if (!content || !content.trim()) {
    const error = new Error('content is required')
    error.statusCode = 400
    throw error
  }

  if (content.length > 1000) {
    const error = new Error('content too long (max 1000 characters)')
    error.statusCode = 400
    throw error
  }

  try {
    const response = await groq.chat.completions.create({
      model: 'openai/gpt-oss-20b',
      messages: [
        {
          role: 'system',
          content:
            'Rewrite the post to make it clearer, grammatically correct, natural, and engaging. Keep the original meaning and return only the rewritten post.'
        },
        {
          role: 'user',
          content: content.trim()
        }
      ],
      max_completion_tokens: 150,
      reasoning_effort: 'low'
    })

    const rewritten = response?.choices?.[0]?.message?.content

    if (!rewritten) {
      const error = new Error('AI failed to generate response')
      error.statusCode = 500
      throw error
    }

    res.status(200).json({
      success: true,
      rewrittenContent: rewritten.trim()
    })
  } catch (error) {
    error.statusCode = error.status || 500
    throw error
  }
})