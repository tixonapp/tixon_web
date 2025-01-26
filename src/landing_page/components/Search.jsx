import {BiSearch} from 'react-icons/bi';
const Search = () => {
    return (
        <>
        <div className="SearchBar
        flex flex-row items-center justify-between
        px-2
        border-[1px] w-pull md:w-auto py-2 rounded-full shadow-sm cursor-pointer">
            <div className="text-sm px-4 font-semibold">
                Anywhere
            </div>
            <div className="text-sm px-4 font-semibold">
                Any week
            </div>
            <div className="text-sm px-4 font-semibold">
                Add guests
            </div>
            <div className='p-2 text-[#e7ffe5] bg-[#2b300e] rounded-full'>
                <BiSearch size={18}></BiSearch>
            </div>
        </div>
        </>
    );
  };
  
  export default Search;