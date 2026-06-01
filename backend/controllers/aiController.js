import { asyncHandler } from '../middleware/asynchandler.js'
import { HfInference } from '@huggingface/inference'

const hf = new HfInference(process.env.HF_TOKEN)

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
    const response = await hf.chatCompletion({
      model: "Qwen/Qwen2.5-7B-Instruct",
      messages: [
        {
          role: "user",
          content: `rewrite this social media post clearly and engagingly without changing its meaning:\n\n${content.trim()}`
        }
      ],
      max_tokens: 150,
    })

    console.log("HF RESPONSE:", response)

    const rewritten = response?.choices?.[0]?.message?.content

    if (!rewritten) {
      const error = new Error('AI failed to generate response')
      error.statusCode = 500
      throw error
    }

    res.status(200).json({
      success: true,
      rewrittenContent: rewritten
    })

  } catch (error) {
    console.log("================================")
    console.log("HF ERROR DETAILS:")
    console.log(error.httpResponse?.body)
    console.log(error)
    console.log("================================")

    error.statusCode = 500
    throw error
  }
})