import TopNav from './TopNav'
import SearchBar from './SearchBar'
import './Header.css'

const Header = () => {
  return (
    <header className="bg-yellow-400 shadow-md">
      <TopNav />
      <SearchBar />
      <nav className="main-nav">
        <ul>
          <li><a href="/dien-thoai">Điện thoại</a></li>
          <li><a href="/laptop">Laptop</a></li>
          <li><a href="/phu-kien">Phụ kiện</a></li>
          <li><a href="/dong-ho">Đồng hồ</a></li>
          <li><a href="/tablet">Tablet</a></li>
          <li><a href="/may-doi-tra">Máy cũ,thu cũ</a></li>
          <li><a href="/pc-may-in">PC, Máy in</a></li>
          <li><a href="/sim-so-dep">Sim, Thẻ cào</a></li>
          <li><a href="/tien-ich/thanh-toan-tra-gop">Dịch vụ tiện ích</a></li>
        </ul>
      </nav>
    </header>
  )
}

export default Header
