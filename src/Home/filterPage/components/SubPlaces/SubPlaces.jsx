// SubPlaces.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cl from './SubPlaces.module.css';
import MySelectedButton from '../UI/MySelectedButton/MySelectedButton.jsx';
import { useFetch } from '../../../../components/hooks/useFetchB.js';
import axios from 'axios';
import {
    setSelectedSubcategory,
    clearSelectedSubcategory,
    setSelectedSubsubcategory,
    setSelectedSubsubcategoryButton
} from '../../../../actions.js';


// ... (ваш импорт)
// SubPlaces.jsx

// ... (импорты и прочий код)

const SubPlaces = ({ subcategoryId, activeCategory }) => {
    const [selectedButton, setSelectedButton] = useState(null);
    const [gl, setGl] = useState(null)
    const [data, setData] = useState([]);
    const [bb, setBb] = useState([])
    const dispatch = useDispatch();

    const subsubcategoryButton = useSelector((state) => state?.title?.selectedSubsubcategoryButton)

    const fetching = useCallback(async () => {
        if (subcategoryId) {
            const response = await axios.get(
                `https://spbneformal.fun/api/sub-categories/${subcategoryId}?populate=subsubcategories,subsubcategories.image`
            );
            setData(response.data || {});
            return response;
        }
    }, [subcategoryId]);

    useEffect(() => {
        fetching();
    }, [fetching]);

    const [nt, error, loading] = useFetch(async () => {
        const response = await axios.get(
            `https://spbneformal.fun/api/sub-sub-categories/${subcategoryId}?populate=posts,posts.images,posts.category,posts.subcategory,posts.subsubcategory`
        );
        setBb(response.data || {});
        return response;
    })

    useEffect(() => {
        setGl(null)
        setData(null)
        setBb(null)
        setSelectedButton(null)
        dispatch(setSelectedSubsubcategoryButton(null))
        dispatch(setSelectedSubsubcategory(null))
    }, [activeCategory])

    useEffect(() => {
        nt()
    }, []);

    console.log(bb?.data)

    const handleButtonClick = useCallback((subcategory, index) => {
        dispatch(setSelectedSubsubcategoryButton(index + 1))
        dispatch(setSelectedSubsubcategory(subcategory))
        localStorage.setItem('selectedSubsubcategory', subcategory)
    }, [dispatch])


    const subsubcategories = data?.data?.attributes?.subsubcategories?.data;

    useEffect(() => {
        const storedCategory = localStorage.getItem('selectedSubsubcategory');
        if (storedCategory) {
            dispatch(setSelectedSubsubcategory(storedCategory))
        } else {
            dispatch(setSelectedSubsubcategoryButton(0));
            dispatch(setSelectedSubsubcategory(subsubcategories[0]?.id));
        }

    }, []);

    useEffect(() => {
        const storedButtons = JSON.parse(localStorage.getItem('selectedSubButton')) || {};
        dispatch(setSelectedSubsubcategoryButton(storedButtons))
    }, []);

    useEffect(() => {
            localStorage.setItem('selectedSubButton', JSON.stringify(subsubcategoryButton));
    }, [selectedButton, dispatch]);

    useEffect(() => {
        setGl(null)
        dispatch(setSelectedSubsubcategory(null))
    }, [subcategoryId, activeCategory, dispatch]);

    // Добавьте проверку на существование subsubcategories перед использованием метода map
    if (!subcategoryId || !subsubcategories || subsubcategories.length === 0) {
        return null;
    }

    console.log(gl)

    console.log(subsubcategories)

    return (
        <div className={cl.button__select}>
            <div className={cl.button__select__row}>
                {subsubcategories.map((item, index) => (
                    <MySelectedButton
                        key={index}
                        onClick={() => handleButtonClick(item.id, index)}
                        isRed={subsubcategoryButton === index + 1}
                    >
                        <img
                            className={cl.button__image}
                            src={`https://uploads.spbneformal.fun${item?.attributes?.image.data?.attributes?.url}`}
                            alt={`Изображение ${index}`}
                        />
                        {item?.attributes?.title}
                    </MySelectedButton>
                ))}
            </div>
        </div>
    );
};

export default SubPlaces;