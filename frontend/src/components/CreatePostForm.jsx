import { useState } from "react";
import { postService } from "../services/postService";

const CreatePostForm = ({ onPostCreated, setToast }) => {
  const [content, setContent] = useState("");
  const [postLoading, setPostLoading] = useState(false);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    const finalContent = content;

    if (!finalContent.trim()) {
      setToast({ message: "Post content cannot be empty", type: "warning" });
      return;
    }

    try {
      setPostLoading(true);
      await postService.createPost(finalContent);
      setContent("");
      setToast({ message: "Post created successfully!", type: "success" });
      onPostCreated();
    } catch (error) {
      setToast({
        message: error.response?.data?.message || "Failed to create post",
        type: "error",
      });
    } finally {
      setPostLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-3 mb-4 border">
      <h3 className="text-base font-semibold mb-4">Create a Post</h3>

      <form onSubmit={handleCreatePost} className="space-y-3 ">
        {/* text area of create post  */}
        <textarea
          id="post-content"
          name="content"
          className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
          rows="1"
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={postLoading}
            className="flex-1 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
          >
            {postLoading ? "Posting..." : "Post"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePostForm;