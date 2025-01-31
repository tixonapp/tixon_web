import {BiSearch} from 'react-icons/bi';
import { HiOutlineAdjustmentsHorizontal } from 'react-icons/hi2';
import './Search.css'
const Search = () => {
    return (
        <>
        <div className="searchBar">
            <div className="searchText">
                Anywhere
            </div>
        <div className="searchText">
                Any week
            </div>
            <div className="searchText">
                Add guests
            </div>
            <div className='searchIcon'>
                <BiSearch size={18}></BiSearch>
            </div>
            <div className='filterIcon'>
            <HiOutlineAdjustmentsHorizontal size={18}/>
            </div>
        </div>
        </>
    );
  };
  
  export default Search;