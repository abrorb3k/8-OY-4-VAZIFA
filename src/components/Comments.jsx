import React, { useEffect, useState } from "react";
import { YTService } from "../service/api.service";

interface CommentType {
  author: string;
  text: string;
}

interface CommentsProps {
  videoId: string;
}

const Comments: React.FC<CommentsProps> = ({ videoId }) => {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const data = await YTService.getVideoComments(videoId);
        setComments(data);
      } catch (err) {
        console.error("Izohlarni olishda xatolik:", err);
        setError("Izohlarni yuklashda xatolik yuz berdi!");
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [videoId]);

  return (
    <div className="mt-5 p-4 bg-gray-800 rounded-lg">
      <h3 className="text-lg font-bold mb-3">Izohlar</h3>

      {loading && <p className="text-gray-400">Yuklanmoqda...</p>}
      {error && <p className="text-red-500">{error}</p>}
      
      {!loading && !error && comments.length === 0 && (
        <p className="text-gray-400">Izohlar mavjud emas</p>
      )}

      <ul>
        {comments.map((comment, index) => (
          <li key={index} className="border-b border-gray-700 pb-3 mb-3">
            <p className="font-semibold">{comment.author}</p>
            <p className="text-gray-300">{comment.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Comments;
