import ProductList from "@/components/ProductList";

const Home = () => {
  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <p>This is the home page of our application.</p>
      <ProductList />
      {/* Bạn có thể thêm các thành phần khác ở đây */}
    </div>
  );
}

export default Home;