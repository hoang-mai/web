import { Post } from "@/types/post";

const PostCard = ({ post }: { post: Post }) => (
  <div className="bg-white rounded shadow p-4">
    <img
      src={post.imgUrl}
      alt={post.title}
      className="w-full h-48 object-cover rounded mb-3"
    />
    <h3 className="text-lg font-bold">{post.title}</h3>
    <p className="text-gray-600">{post.description}</p>
  </div>
);

export default PostCard;
