/**
 * Filters a main array of tasks based on the provided filter options.
 * This function uses a dynamic approach to handle any number of active filters.
 *
 * @param {Array<Object>} mainArray - The complete, unfiltered array of tasks.
 * @param {Function} filterArraySetter - State setter function to update the filtered list.
 * @param {Object} filterOptions - An object containing filter keys (e.g., 'status', 'priority') and their values ('all', 'high', 'in-progress').
 */
export function filterTasks(mainArray, filterArraySetter, filterOptions) {
    // 1. Identify which filter options are actively selected (not set to 'all')
    const selectedOptions = Object.keys(filterOptions).filter(
        // Normalize filter value to string and check if it's not 'all'
        optionKey => String(filterOptions[optionKey]).toLowerCase() !== 'all'
    );

    // If no active filters, show the full list
    if (selectedOptions.length === 0) {
        filterArraySetter(mainArray);
        return;
    }
    // 2. Filter the main array by checking ALL selected criteria simultaneously
    const filteredArray = mainArray.filter(task => {
        // Use Array.prototype.every() to ensure the task matches every active filter
        return selectedOptions.every(optionKey => {
            const filterValue = String(filterOptions[optionKey]).toLowerCase(); 
            const taskValue = task[optionKey];

            // --- Special handling for the 'isAssigned' boolean filter ---
            if (optionKey === 'isAssigned') {
                // filterValue will be 'true' or 'false'
                if (filterValue === 'true' && taskValue === true) {
                    return true;
                }
                if (filterValue === 'false' && taskValue === false) {
                    return true;
                }
                return false;
            }

            // --- General case for string comparison (priority, status) ---
            if (taskValue && typeof taskValue === 'string') {
                // Normalize the task value (e.g., "In Progress" -> "in-progress") for comparison
                const normalizedTaskValue = taskValue.toLowerCase().replace(/\s/g, '-');
                
                // Also normalize the filter value (e.g., 'in-progress' filter option)
                const normalizedFilterValue = filterValue.toLowerCase().replace(/\s/g, '-');

                return normalizedFilterValue === normalizedTaskValue;
            }

            // If the task property is missing or not a comparable string, fail the filter check
            return false;
        });
    });

    console.log(`Filter applied. Showing ${filteredArray.length} tasks.`);
    filterArraySetter(filteredArray);
}
export const sortTasks = (filteredArray,filteredArraySetter,sortOptions) =>{
    const sortedArray =  [...filteredArray]
    const {order,by}=sortOptions
   if(order==="none"||by==="none") return;
   if(order==="asc"){
       sortedArray.sort((a,b)=>
       {
        if(a[by]>b[by]) return 1;
        if(a[by]<b[by]) return -1;
        return 0;
       }
    )
   console.log(sortedArray)
  filteredArraySetter(sortedArray)
  return;
   }
   if(order==="desc"){
       sortedArray.sort((a,b)=>
       {
        if(a[by]<b[by]) return 1;
        if(a[by]>b[by]) return -1;
        return 0;
       }
    )
   console.log(sortedArray)
  filteredArraySetter(sortedArray)
  return;
   }
 
}