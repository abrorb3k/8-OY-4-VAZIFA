import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { YTService } from "../service/api.service";
import { VideoType } from "../types";
import { useDispatch } from "react-redux";
import { setError, setIsLoading } from "../redux/slices/productSlice";

const VideoDetails = () => {
  const { id } = useParams();
  const [video, setVideo] = useState<VideoType | null>(null);
  const dispatch = useDispatch();
  const [expand, setExpand] = useState(false);
  const [comments, setComments] = useState<{ author: string; text: string }[]>(
    []
  );
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const getVideoDetails = async () => {
      if (id) {
        dispatch(setIsLoading(true));
        try {
          const data = await YTService.getVideoDetails(id);
          setVideo(data);
        } catch (error) {
          console.log(error);
          dispatch(setError("Wrong ID"));
        } finally {
          dispatch(setIsLoading(false));
        }
      }
    };

    getVideoDetails();
  }, [id]);

  const ConvertViews = (views: number) => {
    if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`;
    if (views >= 1_000) return `${(views / 1_000).toFixed(1)}K`;
    return views;
  };

  const handleAddComment = () => {
    if (newComment.trim() !== "") {
      setComments([...comments, { author: "You", text: newComment }]);
      setNewComment(""); 
    }
  };

  return (
    <div className="container py-10">
      <div className="flex gap-5">
        <div className="w-full aspect-video">
          <iframe
            className="w-full h-full rounded-xl"
            src={`https://www.youtube.com/embed/${video?.video_id}`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>
      </div>

      <div className="mt-3">
        <h2 className="text-xl font-bold">{video?.title}</h2>

        <div className="flex gap-3 mt-3 items-center">
          <img
            src={video?.thumbnails[0]?.url}
            className="w-12 aspect-square object-cover rounded-full"
            alt="channel img"
          />
          <div>
            <p className="text-lg font-bold">{video?.author}</p>
            <span className="text-sm opacity-70">1.92M followers</span>
          </div>
        </div>
      </div>

     
      <div
        className={`p-3 mt-5 rounded-xl bg-white/10 ${
          expand ? "h-auto" : "h-[200px]"
        } relative overflow-hidden`}
      >
        <div className="mb-1 font-semibold">
          <span>{ConvertViews(video?.number_of_views || 0)} viewed</span>
          <span className="text-2xl leading-0">&#183;</span>
          <span>{video?.published_time}</span>
        </div>
        <p
          className="*:text-blue-500 *:block"
          dangerouslySetInnerHTML={{
            __html: (video?.description || ""),
          }}
        ></p>
        {!expand && (
          <div
            onClick={() => setExpand(true)}
            className="absolute py-1 left-0 bottom-0 right-0 w-full bg-gradient-to-t from-[#1D202A] from-30% to-transparent text-center"
          >
            <i className="fa fa-chevron-down"></i>
          </div>
        )}
      </div>

      <div className="mt-5">
        <h2 className="text-xl font-bold">Comments</h2>

        <div className="flex gap-3 mt-3 items-center">
          <img
            src={video?.thumbnails[0]?.url}
            className="w-12 aspect-square object-cover rounded-full"
            alt="user img"
          />
          <div className="w-full">
            <input
              type="text"
              placeholder="Add a public comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full bg-transparent border border-slate-700 rounded-lg p-2 outline-none focus:border-blue-500"
            />
          </div>
          <button
            onClick={handleAddComment}
            className="bg-blue-500 px-3 py-1 rounded text-white"
          >
            Comment
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <div key={index} className="flex gap-3">
                <img
                  src="https://picsum.photos/200/300"
                  className="w-10 h-10 rounded-full aspect-square object-cover "
                  alt="user img"
                />
                <div className="w-full">
                  <div className="flex items-center gap-2">
                    <p className="font-bold">{comment.author}</p>{" "}
                  </div>
                  <p className="mt-1">{comment.text}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No comments yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoDetails;


