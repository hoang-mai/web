export interface Post {
  id: string;
  title: string;
  description: string;
  imgUrl: string;
  createdAt: string;
}

export interface PostStatistic {
  total: number;
  active: number;
}
