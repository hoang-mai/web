export interface Post {
  id: string;
  title: string;
  description: string;
  imgUrl: string;
  isVisible: boolean;
  createdAt: string;
}

export interface PostStatistic {
  total: number;
  active: number;
}
