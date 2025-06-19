import { FaHeart } from "react-icons/fa6";
import { FaBookmark } from "react-icons/fa";

import { Models } from "appwrite";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { checkIsLiked } from "@/lib/utils";
import {
  useLikePost,
  useSavePost,
  useDeleteSavedPost,
  useGetCurrentUser,
} from "@/lib/react-query/queries";
import { IconNode } from "lucide-react";

type PostStatsProps = {
  post: Models.Document;
};

const PostStats = ({ post }: PostStatsProps) => {
  const location = useLocation();
  const likesList = post.likes.map((user: Models.Document) => user.$id);

  const [likes, setLikes] = useState<string[]>(likesList);
  const [isSaved, setIsSaved] = useState(false);

  const { mutate: likePost } = useLikePost();
  const { mutate: savePost } = useSavePost();
  const { mutate: deleteSavePost } = useDeleteSavedPost();

  const { data: currentUser } = useGetCurrentUser();

  const savedPostRecord = currentUser?.save.find(
    (record: Models.Document) => record.post.$id === post.$id
  );

  useEffect(() => {
    setIsSaved(!!savedPostRecord);
  }, [currentUser]);

  const handleLikePost = (
    e: React.MouseEvent<IconNode, MouseEvent>
  ) => {
    e.stopPropagation();

    let likesArray = [...likes];

    if (currentUser) {
      if (likesArray.includes(currentUser.$id)) {
        likesArray = likesArray.filter((Id) => Id !== currentUser.$id);
      } else {
        likesArray.push(currentUser?.$id);
      }
    }
    // console.log(likesArray);
    
    setLikes(likesArray);
    likePost({ postId: post.$id, likesArray });
  };

  const handleSavePost = (
    e: React.MouseEvent<IconNode, MouseEvent>
  ) => {
    e.stopPropagation();

    if (savedPostRecord) {
      setIsSaved(false);
      return deleteSavePost(savedPostRecord.$id);
    }

    savePost({ userId: currentUser?.$id, postId: post.$id });
    setIsSaved(true);
  };

  const containerStyles = location.pathname.startsWith("/profile")
    ? "w-full"
    : "";

  return (
    <div
      className={`flex justify-between items-center z-20 ${containerStyles}`}
    >
      <div className="flex gap-2 mr-5">
        <FaHeart
          alt="like"
          onClick={handleLikePost}
          className={`${currentUser &&
            checkIsLiked(likes, currentUser.$id)
              ? "text-red-700"
              : "text-white"
          } cursor-pointer text-xl`}
        />
        <p className="small-medium lg:base-medium">{likes.length}</p>
      </div>

      <div className="flex gap-2">
        <FaBookmark
          className={`${isSaved ? "text-red-700" : "text-white"} cursor-pointer text-xl`}
          onClick={handleSavePost}

        />
      </div>
    </div>
  );
};

export default PostStats;
