import { useState } from 'react';
import { MessageCircle, Reply, Send, Edit2, Trash2, MoreVertical } from 'lucide-react';
import { CommentAPI } from '../services/api';
import type { Comment } from '../types/api';

interface VideoCommentsProps {
  videoId: number;
  comments: Comment[];
  onCommentsUpdate: (comments: Comment[]) => void;
}

interface CommentItemProps {
  comment: Comment;
  onReply: (parentId: number) => void;
  onEdit: (comment: Comment) => void;
  onDelete: (commentId: number) => void;
  onUpdate: () => void;
  level?: number;
}

function CommentItem({ comment, onReply, onEdit, onDelete, onUpdate, level = 0 }: CommentItemProps) {
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState<Comment[]>([]);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const loadReplies = async () => {
    if (replies.length > 0) {
      setShowReplies(!showReplies);
      return;
    }

    try {
      setLoadingReplies(true);
      const repliesData = await CommentAPI.getCommentReplies(comment.id);
      setReplies(repliesData.content || []);
      setShowReplies(true);
    } catch (err) {
      console.error('Failed to load replies:', err);
    } finally {
      setLoadingReplies(false);
    }
  };

  const handleReplyUpdate = () => {
    loadReplies();
    onUpdate();
  };

  return (
    <div className={`${level > 0 ? 'ml-8 border-l-2 border-gray-100 pl-4' : ''}`}>
      <div className="flex items-start space-x-3 p-4 hover:bg-gray-50 rounded-lg">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {comment.user?.firstName?.charAt(0) || 'U'}
            </span>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-900">
                {comment.user ? `${comment.user.firstName} ${comment.user.lastName}` : 'Unknown User'}
              </span>
              <span className="text-sm text-gray-500">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 hover:bg-gray-200 rounded"
              >
                <MoreVertical className="w-4 h-4 text-gray-500" />
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <button
                    onClick={() => {
                      onEdit(comment);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      onDelete(comment.id);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 text-red-600 flex items-center"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          <p className="text-gray-700 mt-1">{comment.content}</p>

          <div className="flex items-center space-x-4 mt-2">
            <button
              onClick={() => onReply(comment.id)}
              className="flex items-center text-sm text-gray-500 hover:text-blue-600"
            >
              <Reply className="w-4 h-4 mr-1" />
              Reply
            </button>

            {comment.replies && comment.replies.length > 0 && (
              <button
                onClick={loadReplies}
                disabled={loadingReplies}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                {loadingReplies ? 'Loading...' : 
                  showReplies ? 'Hide replies' : `View ${comment.replies.length} replies`
                }
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Replies */}
      {showReplies && replies.length > 0 && (
        <div className="mt-2">
          {replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
              onUpdate={handleReplyUpdate}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function VideoComments({ videoId, comments, onCommentsUpdate }: VideoCommentsProps) {
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [editText, setEditText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadComments = async () => {
    try {
      const commentsData = await CommentAPI.getCommentsByVideoId(videoId);
      onCommentsUpdate(commentsData.content || []);
    } catch (err) {
      console.error('Failed to load comments:', err);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      setLoading(true);
      await CommentAPI.createComment({
        content: newComment.trim(),
        videoId: videoId
      });
      
      setNewComment('');
      await loadComments();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async () => {
    if (!replyText.trim() || !replyingTo) return;

    try {
      setLoading(true);
      await CommentAPI.createComment({
        content: replyText.trim(),
        videoId: videoId,
        parentId: replyingTo
      });
      
      setReplyText('');
      setReplyingTo(null);
      await loadComments();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add reply');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!editText.trim() || !editingComment) return;

    try {
      setLoading(true);
      await CommentAPI.updateComment(editingComment.id, editText.trim());
      
      setEditText('');
      setEditingComment(null);
      await loadComments();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update comment');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId: number) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      await CommentAPI.deleteComment(commentId);
      await loadComments();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete comment');
    }
  };

  const startReply = (parentId: number) => {
    setReplyingTo(parentId);
    setReplyText('');
  };

  const startEdit = (comment: Comment) => {
    setEditingComment(comment);
    setEditText(comment.content);
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold flex items-center">
          <MessageCircle className="w-5 h-5 mr-2" />
          Comments ({comments.length})
        </h3>
      </div>

      <div className="p-6">
        {/* Add Comment */}
        <div className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
          <div className="flex justify-between items-center mt-2">
            {error && <span className="text-red-600 text-sm">{error}</span>}
            <div className="ml-auto">
              <button
                onClick={handleAddComment}
                disabled={!newComment.trim() || loading}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4 mr-2" />
                {loading ? 'Posting...' : 'Comment'}
              </button>
            </div>
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-2">
          {comments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No comments yet. Be the first to comment!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onReply={startReply}
                onEdit={startEdit}
                onDelete={handleDelete}
                onUpdate={loadComments}
              />
            ))
          )}
        </div>

        {/* Reply Modal */}
        {replyingTo && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Reply to Comment</h3>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write your reply..."
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                autoFocus
              />
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setReplyingTo(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReply}
                  disabled={!replyText.trim() || loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Replying...' : 'Reply'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editingComment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Edit Comment</h3>
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                autoFocus
              />
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setEditingComment(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEdit}
                  disabled={!editText.trim() || loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Updating...' : 'Update'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
