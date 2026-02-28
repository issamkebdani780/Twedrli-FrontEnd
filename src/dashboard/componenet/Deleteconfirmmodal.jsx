import { Trash2, X, AlertTriangle } from "lucide-react";

/**
 * DeleteConfirmModal
 * Props:
 *   post     – the post object to delete (uses post.title & post.id)
 *   onConfirm – called when user confirms deletion
 *   onCancel  – called when user cancels / closes
 */
export default function DeleteConfirmModal({ post, onConfirm, onCancel }) {
  if (!post) return null;

  return (
    /* ── Backdrop ── */
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* ── Modal ── */}
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-fade-in">

        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X size={16} />
        </button>

        {/* Icon */}
        <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={26} className="text-red-500" />
        </div>

        {/* Text */}
        <div className="text-center mb-6">
          <h2 className="text-lg font-bold text-slate-800 mb-1">Delete Post?</h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            You are about to permanently delete{" "}
            <span className="font-semibold text-slate-700">"{post.title}"</span>.
            <br />
            This action <span className="text-red-500 font-medium">cannot be undone</span>.
          </p>
          <p className="text-xs text-slate-400 mt-2 font-mono bg-slate-50 px-3 py-1 rounded-lg inline-block">
            ID: {post.id}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(post.id)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors shadow-sm shadow-red-200"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}