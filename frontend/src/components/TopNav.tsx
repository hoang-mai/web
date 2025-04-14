import LocationSelector from './LocationSelector'

const TopNav = () => {
  return (
    <div className="flex justify-between items-center px-3 py-1 text-sm">
      <button className="text-blue-700 font-medium">Đăng nhập</button>
      <LocationSelector />
    </div>
  )
}

export default TopNav
