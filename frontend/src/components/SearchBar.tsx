const SearchBar = () => {
    return (
      <div className="flex items-center justify-between px-3 py-2">
        <input
          type="text"
          placeholder="Bạn tìm gì..."
          className="flex-grow p-2 rounded-md border border-gray-300"
        />
        <button className="ml-2">
          <img src="/icons/search.svg" alt="Search" className="w-6 h-6" />
        </button>
      </div>
    )
  }
  
  export default SearchBar
  