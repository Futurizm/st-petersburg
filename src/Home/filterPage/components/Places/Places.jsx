// Places.jsx
import React, { useEffect, useState } from 'react';
import cl from './Places.module.css';
import MySelectedButton from '../UI/MySelectedButton/MySelectedButton.jsx';
import { useFetch } from '../../../../components/hooks/useFetchB.js';
import axios from 'axios';
import MyLine from "../UI/MyLine/MyLine.jsx";
import SubPlaces from "../SubPlaces/SubPlaces.jsx";
import { useDispatch } from "react-redux";
import {
    setNegr,
    setSelectedSubcategory,
    setSelectedSubsubcategory,
    setSelectedSubsubcategoryButton
} from "../../../../actions.js";
import MyUguButton from "../UI/MyUguButton/MyUguButton.jsx";

// ... (ваш импорт)

const Places = ({ selectedSubcategory, activeCategory, onSubcategorySelect }) => {
    const [selectedButtons, setSelectedButtons] = useState({});
    const [categoriesData, setCategoriesData] = useState({});
    const [data, setData] = useState({});
    const [fetching, isDataLoading, dataError] = useFetch(async () => {
        const response = await axios.get(
         `https://spbneformal.fun/api/categories/${activeCategory}?populate=sub-sub-categories,image,subcategories,subcategories.image,subsubcategories.image`
        );
        setData(response.data || {});
        return response;
    });
    const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(null);

    useEffect(() => {
        fetching();
    }, [activeCategory]);

    const dispatch = useDispatch();
    console.log(selectedSubcategoryId)

    const handleButtonClick = (subcategory, index) => {
        const currentSelectedButtons = { ...selectedButtons };
        setSelectedSubcategoryId(subcategory);

        if (currentSelectedButtons[activeCategory] === index) {
            // Если кнопка уже активна, снимаем активность
            currentSelectedButtons[activeCategory] = null;
        } else {
            // В противном случае делаем активной
            currentSelectedButtons[activeCategory] = index;
            dispatch(setSelectedSubcategory(subcategory));
        }

        setSelectedButtons(currentSelectedButtons);

        if (onSubcategorySelect) {
            onSubcategorySelect(subcategory);
        }
        localStorage.setItem('selectedSubcategory', subcategory)
    };
    useEffect(() => {
        setSelectedButtons({}); // Сбросить выбранные подкатегории при изменении активной категории
    }, [activeCategory]);


    useEffect(() => {
        const storedCategory = localStorage.getItem('selectedSubcategory');
        if (storedCategory) {
            setSelectedSubcategoryId(storedCategory);
        }
    }, []);

    useEffect(() => {
        const storedButtons = JSON.parse(localStorage.getItem('selectedButtons')) || {};
        setSelectedButtons(storedButtons);
    }, []);

    useEffect(() => {
        localStorage.setItem('selectedButtons', JSON.stringify(selectedButtons));
    }, [selectedButtons]);

    dispatch(setNegr(selectedSubcategoryId))

    return (
        <>
            <div className={cl.button__select}>
                <div className={cl.button__select__row}>
                    {Array.isArray(data?.data?.attributes?.subcategories?.data) &&
                        data?.data?.attributes?.subcategories?.data.map((subcategory, index) => (
                            <MyUguButton
                                isRed={selectedButtons[activeCategory] === index}
                                onClick={() => {
                                    handleButtonClick(subcategory?.id, index);
                                }}
                                key={index + 1}
                            >
                                <img
                                    className={cl.button__image}
                                    src={`https://uploads.spbneformal.fun${subcategory?.attributes?.image?.data?.attributes?.url}`}
                                    alt={`Изображение ${index}`}
                                />
                                {subcategory?.attributes?.title}
                            </MyUguButton>
                        ))}
                </div>
            </div>
            <MyLine />
            {selectedButtons[activeCategory] !== null && selectedSubcategoryId !== null && (
                <SubPlaces
                    classname={cl.sintol}
                    activeCategory={activeCategory}
                    subcategoryId={selectedSubcategoryId}
                />
            )}
        </>
    );

};

export default Places;
