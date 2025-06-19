import PostForm from "@/components/forms/PostForm";

import { RiGalleryLine } from "react-icons/ri";

const CreatePost = () => {
  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="max-w-5xl flex-start gap-3 justify-start w-full items-center">
          <RiGalleryLine className='text-2xl md:text-3xl' />
          <h2 className="h3-bold md:h2-bold text-left w-full">Create Post</h2>
        </div>

        <PostForm action="Create" />
      </div>
    </div>
  );
};

export default CreatePost;
