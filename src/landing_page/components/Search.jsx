const Search = () => {
    return (
        <>
        <div className="SearchBar
        flex flex-row items-center justify-between
        border-[1px] w-pull md:w-auto py-2 rounded-full shadow-sm cursor-pointer">
            <div className="text-sm px-6 font-semibold">
                Anywhere
            </div>
            <div className="text-sm px-6 font-semibold">
                Any week
            </div>
            <div className="text-sm px-6 font-semibold">
                Add guests
            </div>
        </div>
        </>
    );
  };
  
  export default Search;