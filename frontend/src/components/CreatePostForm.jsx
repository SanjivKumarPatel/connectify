import { useState } from 'react'
import { postService } from '../services/postService'
import { aiService } from '../services/aiService'

const CreatePostForm = ({ onPostCreated, setToast }) => {
  const [content, setContent] = useState('')
  const [aiContent, setAiContent] = useState('')
  const [useAiContent, setUseAiContent] = useState(false)
  const [postLoading, setPostLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)

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

      setAiContent(data.rewrittenContent)
      setUseAiContent(false)

      setToast({
        message: 'Post rewritten successfully',
        type: 'success'
      })
    } catch (error) {
      setToast({
        message:
          error?.response?.data?.message || 'AI rewrite failed',
        type: 'error'
      })
    } finally {
      setAiLoading(false)
    }
  }

  const handleCreatePost = async (e) => {
    e.preventDefault()

    const finalContent = useAiContent ? aiContent : content

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
      setAiContent('')
      setUseAiContent(false)

      setToast({
        message: 'Post created successfully!',
        type: 'success'
      })

      onPostCreated()
    } catch (error) {
      setToast({
        message:
          error.response?.data?.message ||
          'Failed to create post',
        type: 'error'
      })
    } finally {
      setPostLoading(false)
    }
  }

  return (
    <div className='bg-white rounded-xl shadow-md p-3 mb-4 border'>
      <h3 className='text-base font-semibold mb-4'>
        Create a Post
      </h3>

      <form
        onSubmit={handleCreatePost}
        className='space-y-3'
      >
        <textarea
          id='post-content'
          name='content'
          className='w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 resize-none'
          rows='1'
          placeholder='What is on your mind?'
          value={content}
          onChange={(e) => {
            setContent(e.target.value)
            setUseAiContent(false)
          }}
        />

        {aiContent && (
          <div
            className={`p-4 border-l-4 rounded ${
              useAiContent
                ? 'bg-green-50 border-green-400'
                : 'bg-blue-50 border-blue-400'
            }`}
          >
            <p className='text-sm font-semibold mb-2'>
              AI Suggestion
            </p>

            <p className='italic mb-3'>
              {aiContent}
            </p>

            <div className='flex gap-2'>
              <button
                type='button'
                onClick={() =>
                  setUseAiContent(!useAiContent)
                }
                className={`px-3 py-1 text-sm rounded ${
                  useAiContent
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-300 text-gray-700'
                }`}
              >
                {useAiContent ? '✓ Using AI' : 'Use This'}
              </button>

              <button
                type='button'
                onClick={() => {
                  setContent(aiContent)
                  setUseAiContent(false)
                }}
                className='px-3 py-1 text-sm bg-gray-300 text-gray-700 rounded'
              >
                Copy to Edit
              </button>
            </div>
          </div>
        )}

        <div className='flex gap-2'>
          <button
            type='button'
            onClick={handleRewrite}
            disabled={!content.trim() || aiLoading || postLoading}
            className='flex-1 py-2 bg-purple-500 text-white rounded-lg disabled:opacity-50'
          >
            {aiLoading ? 'Rewriting...' : '✨ Rewrite'}
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