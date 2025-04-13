import LocationSelector from './LocationSelector'

const TopNav = () => {
  return (
    <div className="flex justify-between items-center px-3 py-1 text-sm">
      <LocationSelector />
      <button className="text-blue-700 font-medium">Đăng nhập</button>
    </div>
  )
}

export default TopNav
