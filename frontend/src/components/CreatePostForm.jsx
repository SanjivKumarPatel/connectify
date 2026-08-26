import { useState } from 'react'
import { postService } from '../services/postService'
import { aiService } from '../services/aiService'

const CreatePostForm = ({ onPostCreated, setToast }) => {
  const [content, setContent] = useState('')
  const [postLoading, setPostLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)

  const handleCreatePost = async (e) => {
    e.preventDefault()

    const finalContent = content

    if (!finalContent.trim()) {
      setToast({
        message: 'Post content cannot be empty',
        type: 'warning'
      })
      return
    }

    try {
      setPostLoading(true)

      await postService.createPost(finalContent)

      setContent('')

      setToast({
        message: 'Post created successfully!',
        type: 'success'
      })

      onPostCreated()
    } catch (error) {
      setToast({
        message: error.response?.data?.message || 'Failed to create post',
        type: 'error'
      })
    } finally {
      setPostLoading(false)
    }
  }

  const handleRewrite = async () => {
    if (!content.trim()) {
      setToast({
        message: 'Write something first',
        type: 'warning'
      })
      return
    }

    try {
      setAiLoading(true)

      const data = await aiService.rewritePost(content)

      setContent(data.rewrittenContent)

      setToast({
        message: 'Post rewritten successfully',
        type: 'success'
      })
    } catch (error) {
      setToast({
        message: error?.response?.data?.message || 'AI rewrite failed',
        type: 'error'
      })
    } finally {
      setAiLoading(false)
    }
  }

  return (
    <div className='bg-white rounded-xl shadow-md p-3 mb-4 border'>
      <h3 className='text-base font-semibold mb-4'>Create a Post</h3>

      <form onSubmit={handleCreatePost} className='space-y-3'>
        <textarea
          id='post-content'
          name='content'
          className='w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 resize-none'
          rows='1'
          placeholder='What is on your mind?'
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className='flex gap-2'>
          <button
            type='button'
            onClick={handleRewrite}
            disabled={aiLoading || postLoading}
            className='flex-1 py-2 bg-purple-600 text-white rounded-lg disabled:opacity-50'
          >
            {aiLoading ? 'Rewriting...' : '✨ Rewrite with AI'}
          </button>

          <button
            type='submit'
            disabled={postLoading || aiLoading}
            className='flex-1 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50'
          >
            {postLoading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreatePostForm