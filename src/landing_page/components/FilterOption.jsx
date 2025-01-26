
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
const FilterOption = () => {
    return (
      <div className="event-card ml-6 p-2 text-sm border-[1px] rounded-lg cursor-pointer font-semibold flex flex-row items-center">
        <HiOutlineAdjustmentsHorizontal size={20}/>
        Filters
      </div>
    );
  };
  
  export default FilterOption;