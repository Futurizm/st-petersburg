import React, { useEffect, useState, useRef } from 'react';
import cl from './near.module.css';
import cld from '../page2/page2.module.css';
import arrowLeft from './arrow-left.svg';
import home from './home.svg';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { useFetchPupsik } from '../../components/hooks/useFetchPupsik.js';
import useFetchDzhigi from '../../components/hooks/useFetchDzhigi.js';
import Footer from "../../components/Footer.jsx";
import yellow_heart from "../categoryPage/imgs/main/section__publications/icons/yellow_heart.svg";
import heart from "../page2/img/food/heart.svg";

const Near = () => {
    const [data, setData] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loadedPostsCount, setLoadedPostsCount] = useState(20); // Начальное количество загруженных постов
    const [showLoadMoreButton, setShowLoadMoreButton] = useState(true); // Показывать кнопку "Загрузить еще" или нет
    const categoriesRef = useRef(null); // Создаем ref для списка категорий

    // Загрузка данных о категориях
    const { data: categoriesData, loading: categoriesLoading } = useFetchDzhigi(
        'https://spbneformal.fun/api/categories?populate=image'
    );

    useEffect(() => {
        fetching();
    }, []);

    const { categoryId } = useParams(); // Получаем значение параметра категории из маршрута

    useEffect(() => {
        if (categoriesData && categoriesData.length > 0) {
            setSelectedCategory(categoriesData[0].id); // Устанавливаем идентификатор первой категории по умолчанию
        }
    }, [categoriesData]);

    const scrollToActiveCategory = () => {
        const tabsBox = document.querySelector(`.${cld.tabs_box}`);
        const activeTab = document.querySelector(`.${cld.tab}.${cld.active}`);

        if (tabsBox && activeTab) {
            const scrollOffset = activeTab.offsetLeft - (tabsBox.clientWidth - activeTab.clientWidth) / 2;
            tabsBox.scrollTo({
                left: scrollOffset,
                behavior: 'smooth',
            });
        }
    };

    useEffect(() => {
        scrollToActiveCategory();

    }, [selectedCategory]);

    useEffect(() => {
        // Load the saved category from localStorage on initial render
        const storedCategory = localStorage.getItem('selectedCategory');
        console.log('Retrieved category from localStorage:', storedCategory);
        if (storedCategory) {
            setSelectedCategory(JSON.parse(storedCategory));
            handleCategoryClick(JSON.parse(storedCategory)); // Вызываем функцию для загрузки данных о постах для сохраненной категории
        }
    }, []);

    const handleCategoryClick = async (categoryId) => {
        try {
            setSelectedCategory(categoryId);
            localStorage.setItem('selectedCategory', JSON.stringify(categoryId)); // Сохраняем выбранную категорию в localStorage
            setLoadedPostsCount(20); // Сбрасываем счетчик загруженных постов
            await fetching(categoryId); // Выполняем запрос данных о постах для выбранной категории
        } catch (error) {
            console.error('Error handling category click:', error);
        }
    };


    const loadMorePosts = () => {
        // Increase the count of loaded posts by 20
        setLoadedPostsCount(prevCount => prevCount + 20)
    };

// В методе useEffect, который запускается при загрузке страницы
    useEffect(() => {
        // Load the saved category from localStorage on initial render
        const storedCategory = localStorage.getItem('selectedCategory');
        console.log('Retrieved category from localStorage:', storedCategory);
        if (storedCategory && categoriesData && categoriesData.length > 0) {
            setSelectedCategory(JSON.parse(storedCategory));
        }
        scrollToActiveCategory()
    }, [categoriesData]); // Обновление selectedCategory при изменении categoriesData

    useEffect(() => {
        // Load the saved category from localStorage on initial render
        const storedCategory = localStorage.getItem('selectedCategory');
        console.log('Retrieved category from localStorage:', storedCategory);
        if (storedCategory) {
            setSelectedCategory(JSON.parse(storedCategory));
            fetching(); // Загружаем данные о постах для сохраненной категории
        }
    }, [localStorage.getItem('selectedCategory')]); // / Обновление selectedCategory при изменении localStorage
// Запрос данных о постах для текущей категории
    const fetching = async () => {
        try {
            const response = await axios.get(
                `https://spbneformal.fun/api/getNearPlaces?populate=category,category.image&uid=1295257412&category=${selectedCategory}&count=${loadedPostsCount}`
            );
            setData(response.data.posts || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const [filteredPosts, setFilteredPosts] = useState([]);

    useEffect(() => {
        if (selectedCategory) {
            fetching(selectedCategory); // Загружаем данные о постах для выбранной категории
        }
    }, [selectedCategory]);

    useEffect(() => {
        // Filter the posts based on the selected category
        const filteredPosts = data.filter((post) =>
            selectedCategory ? post.category.id === selectedCategory : true
        );
        console.log('Filtered posts:', filteredPosts);
        // Update the state with the filtered posts
        setFilteredPosts(filteredPosts);
    }, [data, selectedCategory]);

    useEffect(() => {
        console.log('Updated filteredPosts:', filteredPosts)
    }, [filteredPosts])

    // Render only the first `loadedPostsCount` posts from filteredPosts
    const visiblePosts = filteredPosts.slice(0, loadedPostsCount);

    useEffect(() => {
        // Проверяем, остались ли еще посты для загрузки
        setShowLoadMoreButton(loadedPostsCount < filteredPosts.length)
    }, [filteredPosts, loadedPostsCount])


    const [remainingPostsCount, setRemainingPostsCount] = useState(0);

    useEffect(() => {
        // Calculate the count of remaining posts to load
        const remainingCount = data.length - loadedPostsCount;
        // Update the state with the remaining count
        setRemainingPostsCount(remainingCount > 0 ? remainingCount : 0);
    }, [data.length, loadedPostsCount]);
    const [datas, setDatas] = useState({});

    useEffect(() => {
        fetchingPupsik();
    }, []);

    const [fetchingPupsik, isDataLoadingPupsik, errorPupsik] = useFetchPupsik(async () => {
        const response = await axios.get(
            `https://spbneformal.fun/api/getUser?uid=1295257412`
        );
        console.log(response);
        setDatas(response.data || {});
        return response;
    });

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

                // Проверяем, есть ли уже лайк у данного поста
                const existingIndex = likedPosts.findIndex(item => item.id === postId);
                if (existingIndex !== -1) {
                    // Удалить лайк, если он уже есть
                    likedPosts.splice(existingIndex, 1);
                } else {
                    // Добавить лайк, если его нет
                    likedPosts.push({ id: postId });
                }

                // Обновить состояние лайков в datas
                newDatas.user.liked = likedPosts;

                // Обновить состояние datas
                setDatas(newDatas);
            } else {
                console.error("Failed to toggle like status");
            }
        } catch (error) {
            console.error("Error during API request:", error);
        }
    };
    return (
        <div>
            <header className={cl.header}>
                    <div className={`${cl.header__container} ${cl._container}`}>
                        <Link to="/" className={cl.header__icon}>
                            <img src={arrowLeft} alt="" />
                        </Link>
                        <Link to="/" className={`${cl.header__icon} ${cl.mod}`}>
                            <img src={home} alt="" />
                        </Link>
                    </div>
            </header>

            <div className={cl.main}>
                <div className={cl.title}>Рядом с вами</div>
                <div className={`${cld.wrapper} ${cl.dzhigi}`}>
                    <ul ref={categoriesRef} className={cld.tabs_box}>
                        {categoriesData?.map((cat) => (
                            <li
                                key={cat.id}
                                onClick={() => handleCategoryClick(cat.id, cat.attributes.title)}
                                className={`${cld.tab} ${cl.isha}  ${selectedCategory === cat.id ? cld.active : ''} ${cl.kabanchik}`}
                                data-category={cat.id}
                            >
                                <Link to={`/Near/${cat.id}`} className={cld.tab__link}>
                                    <img
                                        className={cld.button__image}
                                        src={`https://uploads.spbneformal.fun${cat.attributes.image.data.attributes.url}`}
                                        alt=""
                                    />
                                    <span className={`${cld.tab__text} ${selectedCategory === cat.id ? cld.whiteText : ''}`}>
                {cat.attributes.title}
            </span>
                                </Link>
                            </li>
                        ))}

                    </ul>
                </div>

                <div className={cl.nearPlace}>
                    Чтобы приложение подсказало ближайшие места рядом с вами, поделитесь геолокацией с ботом в
                    чате.{' '}
                    <a href="https://telegra.ph/Kak-podelitsya-geopoziciej-s-prilozheniem-03-17" target="_blank"
                       style={{color: 'red'}}>
                        Смотри как это сделать тут
                    </a>
                </div>

                <div className={cl.cards}>
                    {visiblePosts.map((post) => (
                        <div className={cl.card} key={post.id}>
                            <Link to={`/Near/previewPage/${post.id}?categoryId=${selectedCategory}`}>
                                <img src={`https://uploads.spbneformal.fun${post.images[0]?.url}`} alt=""
                                     className={cl.asd}/>
                            </Link>
                            <button onClick={() => handleButtonClick(post.id, post.id)} className={cl.mainLike}>
                                <img className={cl.img__button}
                                     src={(datas?.user?.liked || []).some(item => item.id === post.id) ? yellow_heart : heart}
                                     alt=""/>
                            </button>
                            <div className={cl.extra__information}>
                                <div className={cl.position}>{(Number(post.distance) / 1000).toFixed(1)} км</div>
                                { post?.tag ? <div className={cl.position}>{post?.tag}</div> : ''}
                            </div>
                            <div className={cl.mainMatin}>
                            <p className={cl.mainText}>{post.subcategory?.title ? post.subcategory?.title : post.category?.title}</p>
                                <p className={cl.mainSub}>{post.title}</p>
                            </div>
                        </div>
                    ))}
                </div>
                {showLoadMoreButton && (
                    <button className={cl.but} onClick={loadMorePosts}>
                        Загрузить еще
                    </button>
                )}
            </div>
            <Footer/>
        </div>
    );
};

export default Near;
