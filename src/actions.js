// actions.js
export const resetCategoryTitle = () => {
    return {
        type: 'RESET_CATEGORY_TITLE'
    };
};

// actions.js

export const setCurrentlySelectedCategory = (categoryId) => ({
    type: 'SET_CURRENTLY_SELECTED_CATEGORY',
    payload: categoryId,
});

export const setCategoryTitle = (categoryId, categoryTitle) => ({
    type: 'SET_CATEGORY_TITLE',
    payload: { categoryId, categoryTitle }
});
export const setCategoryTitled = (categoryTitle) => ({
    type: 'SET_CATEGORY_TITLED',
    payload: categoryTitle
});
export const setSelectedSubcategory = (subcategory) => ({
    type: 'SET_SELECTED_SUBCATEGORY',
    payload: subcategory,
});
export const setSelectedSubsubcategory = (subsubcategory) => ({
    type: 'SET_SELECTED_SUBSUBCATEGORY',
    payload: subsubcategory,
});

export const setSelectedSubsubcategoryButton = (subsubcategory) => ({
    type: 'SET_SELECTED_SUBSUBCATEGORY_BUTTON',
    payload: subsubcategory,
});
export const clearSelectedSubcategory = () => ({
    type: 'CLEAR_SELECTED_SUBCATEGORY',
});
export const setSelectedCategory = (categoryId) => ({
    type: 'SET_SELECTED_CATEGORY_ID',  // Используйте правильное имя
    payload: categoryId,
});
// actions.js
export const setCurrentSubcategory = (subcategoryId) => ({
    type: 'SET_CURRENT_SUBCATEGORY',
    payload: subcategoryId,
});
export const setInitialActiveCategory = (categoryId) => ({
    type: 'SET_INITIAL_ACTIVE_CATEGORY',
    payload: categoryId,
});

export const setNegr = (negr) => ({
    type: 'SET_NEGR',
    payload: negr,
});
export const setActiveCategory = (categoryId) => ({
    type: 'SET_ACTIVE_CATEGORY',
    payload: categoryId,
});
export const setActiveCategoryt = (categoryIdt) => ({
    type: 'SET_ACTIVE_CATEGORYt',
    payload: categoryIdt,
});

export const setActiveCategoryInfoPage = (categoryId) => ({
    type: 'SET_ACTIVE_CATEGORY_INFO_PAGE',
    categoryId,
});


const initialState = {
    categoryIdt: null,
    categories: {},
    activeCategoryInfoPage: null,
    selectedCategoryId: null,
    categoryTitled: null,
    activeCategory: null,
    activeCategoryFilter: null,
    selectedSubcategory: null,
    categoryData: null,
    currentSubcategoryId: null,
    subsubcategory:null,
    currentlySelectedCategory: null,
    negr:null,
    selectedSubsubcategoryButton: null

};




const rootReducer = (state = initialState, action) => {

    switch (action.type) {
        case 'SET_SELECTED_SUBSUBCATEGORY_BUTTON':
            return {
                ...state,
                selectedSubsubcategoryButton: action.payload,
            };
        case 'SET_ACTIVE_CATEGORY_INFO_PAGE':
            return {
                ...state,
                activeCategoryInfoPage: action.categoryId,
            };
        case 'SET_SELECTED_CATEGORY_ID':
            return {
                ...state,
                selectedCategoryId: action.payload,
            };
        case 'SET_ACTIVE_CATEGORYt':
            return {
                ...state,
                categoryIdt: action.payload,
            };
        case 'SET_CURRENT_SUBCATEGORY':
            return {
                ...state,
                currentSubcategoryId: action.payload,
            };
        case 'SET_CURRENTLY_SELECTED_CATEGORY':
            return {
                ...state,
                currentlySelectedCategory: action.payload,
            };
        case 'SET_NEGR':
            return {
                ...state,
                negr: action.payload,
            };
        case 'RESET_CATEGORY_TITLE':
            return {
                ...state,
                categoryTitle: null
            };

        case 'SET_SELECTED_SUBSUBCATEGORY':
            return {
                ...state,
                subsubcategory: action.payload
            };
        case 'CLEAR_SELECTED_SUBCATEGORY':
            return {
                ...state,
                selectedSubcategory: null,
            };
        case 'SET_ACTIVE_CATEGORY':
            return {
                ...state,
                activeCategory: action.payload,
            };case 'SET_INITIAL_ACTIVE_CATEGORY':
            return {
                ...state,
                activeCategory: action.payload,
            };
        case 'SET_SELECTED_SUBCATEGORY':
            return {
                ...state,
                selectedSubcategory: action.payload,
            };

        case 'SET_CATEGORY_DATA':
            return {
                ...state,
                categoryData: action.payload,
            };
        case 'SET_CATEGORY_TITLED':
            return {
                ...state,
                categoryTitled: action.payload,
            };
        case 'SET_ACTIVE_CATEGORY_FILTER':
            return {
                ...state,
                activeCategoryFilter: action.payload,
            };
        case 'SET_CATEGORY_TITLE':
            return {
                ...state,
                categories: {
                    ...state.categories,
                    [action.payload.categoryId]: action.payload.categoryTitle,
                },
            };
        default:
            return state;

    }
};

export default rootReducer;



// actions.js
// export const resetCategoryTitle = () => {
//     return {
//         type: 'RESET_CATEGORY_TITLE'
//     };
// };
//
//
// export const setCategoryTitle = (categoryId, categoryTitle) => ({
//     type: 'SET_CATEGORY_TITLE',
//     payload: { categoryId, categoryTitle }
// });
// export const setCategoryTitled = (categoryTitle) => ({
//     type: 'SET_CATEGORY_TITLED',
//     payload: categoryTitle
// });
// export const setSelectedSubcategory = (subcategory) => ({
//     type: 'SET_SELECTED_SUBCATEGORY',
//     payload: subcategory,
// });
// export const setSelectedSubsubcategory = (subsubcategory) => ({
//     type: 'SET_SELECTED_SUBCATEGORY',
//     payload: subsubcategory,
// });
// export const clearSelectedSubcategory = () => ({
//     type: 'CLEAR_SELECTED_SUBCATEGORY',
// });
// export const setSelectedCategory = (categoryId) => ({
//     type: 'SET_SELECTED_CATEGORY_ID',  // Используйте правильное имя
//     payload: categoryId,
// });
// // actions.js
// export const setCurrentSubcategory = (subcategoryId) => ({
//     type: 'SET_CURRENT_SUBCATEGORY',
//     payload: subcategoryId,
// });
// export const setInitialActiveCategory = (categoryId) => ({
//     type: 'SET_INITIAL_ACTIVE_CATEGORY',
//     payload: categoryId,
// });
//
// export const setActiveCategory = (categoryId) => ({
//     type: 'SET_ACTIVE_CATEGORY',
//     payload: categoryId,
// });
//
// const initialState = {
//     categories: {},
//     selectedCategoryId: null,
//     categoryTitled: null,
//     activeCategory: 0,
//     activeCategoryFilter: null,
//     selectedSubcategory: null,
//     categoryData: null,
//     currentSubcategoryId: null,
//
// };
//
//
//
//
// const rootReducer = (state = initialState, action) => {
//
//     switch (action.type) {
//         case 'SET_SELECTED_CATEGORY_ID':
//             return {
//                 ...state,
//                 selectedCategoryId: action.payload,
//             }; case 'SET_CURRENT_SUBCATEGORY':
//             return {
//                 ...state,
//                 currentSubcategoryId: action.payload,
//             };
//
//         case 'RESET_CATEGORY_TITLE':
//             return {
//                 ...state,
//                 categoryTitle: null
//             };
//
//         case 'SET_SELECTED_SUBSUBCATEGORY':
//             return {
//                 ...state,
//                 subsubcategory: null
//             };
//         case 'CLEAR_SELECTED_SUBCATEGORY':
//             return {
//                 ...state,
//                 selectedSubcategory: null,
//             };
//         case 'SET_ACTIVE_CATEGORY':
//             return {
//                 ...state,
//                 activeCategory: action.payload,
//             };case 'SET_INITIAL_ACTIVE_CATEGORY':
//             return {
//                 ...state,
//                 activeCategory: action.payload,
//             };
//         case 'SET_SELECTED_SUBCATEGORY':
//             return {
//                 ...state,
//                 selectedSubcategory: action.payload,
//             };
//
//         case 'SET_CATEGORY_DATA':
//             return {
//                 ...state,
//                 categoryData: action.payload,
//             };
//         case 'SET_CATEGORY_TITLED':
//             return {
//                 ...state,
//                 categoryTitled: action.payload,
//             };
//         case 'SET_ACTIVE_CATEGORY_FILTER':
//             return {
//                 ...state,
//                 activeCategoryFilter: action.payload,
//             };
//         case 'SET_CATEGORY_TITLE':
//             return {
//                 ...state,
//                 categories: {
//                     ...state.categories,
//                     [action.payload.categoryId]: action.payload.categoryTitle,
//                 },
//             };
//         default:
//             return state;
//
//     }
// };
//
// export default rootReducer;