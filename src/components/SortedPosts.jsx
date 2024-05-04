import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import yellow_heart from './../Home/categoryPage/imgs/main/section__publications/icons/yellow_heart.svg';
import heart from './../Home/page2/img/food/heart.svg';
import { resetButton, setButtonPressed, setButtons } from './../features/buttonSlide.js';
import { useDispatch, useSelector } from 'react-redux';
import useFetcher from './hooks/useFetch.js';
import cl from './../Home/page2/page2.module.css';
import Loader from "./UI/Loader/Loader.jsx";
import axios from "axios";
import { setSelectedSubcategory } from "../actions.js";
import {useFetchPupsik} from "./hooks/useFetchPupsik.js";
import useFetch from './hooks/useFetch.js';


const SortedPosts = ({ setSortState,sortState, fId, categoryId, categoryTitle }) => {
    const [localData, setLocalData] = useState([]);
    const [loadedPostsCount, setLoadedPostsCount] = useState(8); // Количество загруженных постов
    const dispatch = useDispatch();
    const [allData, setAllData] = useState([]);
    const selectedSubsubcategory = useSelector(state => state.title.subsubcategory);
    const {data, loading, error} =
        useFetch(`https://spbneformal.fun/api/categories/${fId}?populate=posts,posts.images,posts.category,posts.subcategory,posts.subsubcategory`)

    console.log(data)


    const selectedSubcategory = useSelector(state => state.title.selectedSubcategory);

    const [datas, setDatas] = useState({});
    const [filterData, setFilterData] = useState([]);

    const [fetching, isDataLoadingPupsik, errorPupsik] = useFetchPupsik(async () => {
        const response = await axios.get(
            `https://spbneformal.fun/api/getUser?uid=1295257412`
        );
        console.log(response)
        setDatas(response.data || {});
        return response;
    });

    useEffect(() => {
        fetching();
    }, []);


    useEffect(() => {
        const savedSubcategory = JSON.parse(localStorage.getItem('selectedSubcategory'));
        if (savedSubcategory !== undefined) {
            dispatch(setSelectedSubcategory(savedSubcategory));
        }
    }, [dispatch]);

    useEffect(() => {
        localStorage.setItem('selectedSubcategory', JSON.stringify(selectedSubcategory));
    }, [selectedSubcategory]);

    useEffect(() => {
        if (!loading && !error && data && data.attributes && data.attributes.posts && data.attributes.posts.data) {
            console.log("SortedPosts - Data received:", data);
            setLocalData(data.attributes.posts.data || []);
        }
    }, [data, loading, error, categoryId, fId]);

    const handleButtonClick = async (buttonId, postId) => {
        try {
            if (!buttonId || !postId) {
                console.error("Invalid buttonId or postId");
                return;
            }

            const response = await axios.get(
                `https://spbneformal.fun/api/like?uid=1295257412&postId=${postId}`
            );

            if (response.data.success) {
                const newDatas = { ...datas };
                const likedPosts = newDatas.user?.liked || [];

                const existingIndex = likedPosts.findIndex(item => item.id === postId);
                if (existingIndex !== -1) {
                    likedPosts.splice(existingIndex, 1);
                } else {
                    likedPosts.push({ id: postId });
                }

                newDatas.user.liked = likedPosts;
                setDatas(newDatas);
            } else {
                console.error("Failed to toggle like status");
            }
        } catch (error) {
            console.error("Error during API request:", error);
        }
    };

    useEffect(() => {
        if (data && data.length > 0) {
            const uniqueData = data.filter((newPost) => {
                return !allData.some((existingPost) => existingPost.id === newPost.id);
            });

            setAllData((prevData) => [...prevData, ...uniqueData]);
        }
    }, [data]);

    const saveFilteredPostsToLocalStorage = (filteredPosts) => {
        localStorage.setItem('filteredPosts', JSON.stringify(filteredPosts));
    };

    useEffect(() => {
        let filteredData = localData;

        if (selectedSubcategory !== null) {
            filteredData = filteredData.filter(post => post.attributes.subcategory?.data?.id === selectedSubcategory);
        }

        if (selectedSubsubcategory !== null) {
            filteredData = filteredData.filter(post => {
                const postSubsubcategoryIds = Array.isArray(post.attributes.subsubcategory?.data)
                    ? post.attributes.subsubcategory.data.map(subsubcategory => subsubcategory.id)
                    : [];
                return postSubsubcategoryIds.includes(selectedSubsubcategory) || post.attributes.subsubcategory?.data?.id === selectedSubsubcategory;
            });
        }
        filteredData.sort((a, b) => {
            if (sortState) {
                // Если sortState true, сортировка по лайкам
                return Number(b.attributes.views) - Number(a.attributes.views);
            } else {
                // Если sortState false (или null), сортировка от новых к старым
                return new Date(b.attributes.createdAt) - new Date(a.attributes.createdAt);
            }
        });
        setLoadedPostsCount(8);
        setFilterData(filteredData);
        saveFilteredPostsToLocalStorage(filteredData);
    }, [sortState,localData, selectedSubcategory, selectedSubsubcategory])

    useEffect(() => {
        const savedSortState = localStorage.getItem('sortState');
        if (savedSortState !== null) {
            setSortState(savedSortState === 'true'); // Преобразуйте строку в булевое значение
        }
    }, []);

    // Сохранение состояния сортировки в localStorage при его изменении
    useEffect(() => {
        localStorage.setItem('sortState', sortState.toString());
    }, [sortState]);

    useEffect(() => {
        const savedFilteredPosts = JSON.parse(localStorage.getItem('filteredPosts'));
        if (savedFilteredPosts) {

            setFilterData(savedFilteredPosts);
        }
    }, []);

    const loadMorePosts = () => {
        setLoadedPostsCount(prevCount => prevCount + 8); // Увеличиваем количество загруженных постов на 8
    };

    return (
        <div className={`${cl.food__bottom} ${cl._container}`}>
            {loading ? (
                <div className={cl.loaderContainer}>
                    <Loader />
                </div>
            ) : (
                <div className={`${cl.food__row}`}>
                    {filterData.slice(0, loadedPostsCount).map((post, index) => (
                        <div
                            key={post.id}
                            className={`${cl.food__column} ${
                                index % 5 === 4 ? cl.spanned : ""
                            }`}

                        style={
                            index % 5 === 4
                            ? {height: 200}
                            : {fontFamily: "Inter"}
                        }>
                            <div>
                                <Link to={`/page2/previewPage/${post.id}?categoryId=${fId}`}>
                                    <img className={cl.kaban}  style={
                                        index % 5 === 4
                                            ? { height: 200 }
                                            : { fontFamily: "Inter" }
                                    } src={`https://uploads.spbneformal.fun${post.attributes.images.data[0].attributes.url}`} alt="" />
                                </Link>
                            </div>
                            <button onClick={() => handleButtonClick(post.id, post.id)} className={`${cl.main_like}`}>
                                <img src={(datas?.user?.liked || []).some(item => item.id === post.id) ? yellow_heart : heart} alt="" />
                            </button>
                            <div className={`${cl.food__content} ${
                                index % 5 === 4 ? cl.block__item__text__spanned : ""
                            }`}>
                                <h2 className={`${cl.food__name} ${
                                    index % 5 === 4
                                        ? cl.block__item__text__spanned__paragraph
                                        : ""
                                }`}>
                                    {post?.attributes?.subsubcategory?.data?.attributes?.title
                                        ? post?.attributes?.subsubcategory?.data?.attributes?.title
                                        : post?.attributes?.subcategory?.data?.attributes?.title
                                            ? post?.attributes?.subcategory?.data?.attributes?.title
                                            : post?.attributes?.category?.data?.attributes?.title
                                    }
                                </h2>
                                <p className={`${cl.food__position} ${
                                    index % 5 === 4
                                        ? cl.block__item__text__spanned__header
                                        : ""
                                }`}>{post.attributes.title}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {!loading && localData.length > loadedPostsCount && filterData.length > loadedPostsCount && (
                // Если еще есть посты для загрузки, показываем кнопку "Загрузить еще"
                <button className={cl.sintolkaban} onClick={loadMorePosts}>Загрузить еще</button>
            )}
        </div>
    );
};

export default SortedPosts