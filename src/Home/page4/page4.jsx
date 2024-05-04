import cl from "./page4.module.css";
import React, { useEffect, useState } from 'react';
import med_backBut from "./assets/icons/med_backBut.svg";
import PiterTwo from "./assets/img/PiterTwo.svg";
import {Link, useNavigate} from 'react-router-dom';
import axios from "axios";
import { useFetch } from "../../components/hooks/useFetchB.js";
import Posts from "../../components/Posts.jsx";
import { useDispatch, useSelector } from "react-redux";
import heart from "../categoryPage/imgs/main/section__publications/icons/heart.svg"
import yellow_heart from "../categoryPage/imgs/main/section__publications/icons/yellow_heart.svg"
import {resetButton, setButtonPressed, setButtons} from "../../features/buttonSlide.js";
import sun from "../filterPage/imgs/Header/sun.svg";
import {useFetchPupsik} from "../../components/hooks/useFetchPupsik.js";



const Page4 = () => {
  const [data, setData] = useState({});
  const [cardsToShow, setCardsToShow] = useState(4);
  const dispatch = useDispatch();
  const { buttons } = useSelector(state => state.button);
  const [allData, setAllData] = useState([]);
  const [datas, setDatas] = useState({});



  const [fetchingPupsik, isDataLoadingPupsik, errorPupsik] = useFetchPupsik(async () => {
    const response = await axios.get(
        `https://spbneformal.fun/api/getUser?uid=${window?.Telegram?.WebApp?.initDataUnsafe?.user?.id}`
    );
    console.log(response)
    setDatas(response.data || {});
    return response;
  });

  useEffect(() => {
    fetchingPupsik();
  }, []);

  const handleButtonClick = async (buttonId, postId) => {
    try {
      if (!buttonId || !postId) {
        console.error("Invalid buttonId or postId");
        return;
      }

      const response = await axios.get(
          `https://spbneformal.fun/api/like?uid=${window?.Telegram?.WebApp?.initDataUnsafe?.user?.id}&postId=${postId}`
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

  const [fetching, isDataLoading, dataError] = useFetch(async () => {
    const response = await axios.get(
        `https://spbneformal.fun/api/getUser?uid=${window?.Telegram?.WebApp?.initDataUnsafe?.user?.id}`
    );
    console.log(response)
    setData(response.data || {});
    return response;
  });

  useEffect(() => {
    fetching();
  }, []);

  const updateLikedItems = (postId) => {
    setData(prevData => {
      const updatedLikedItems = prevData.user?.liked.filter(item => item.id !== postId);
      return {
        ...prevData,
        user: {
          ...prevData.user,
          liked: updatedLikedItems,
        },
      };
    });

    setAllData(prevData => prevData.filter(post => post.id !== postId));
  };

  const loadMoreCards = () => {
    setCardsToShow(prev => prev + (data.user?.liked?.length || 0) - 4);
  };

  const renderCards = data.user?.liked?.slice(0, cardsToShow) || [];

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText('t.me/spbneformal_app_bot')
        .then(() => {
          alert('Скопировано');
        })
        .catch(err => {
          console.error('Не удалось скопировать ссылку: ', err);
        });
  };


  return (
      <div className={cl.wrapper}>
        {isDataLoading ? (
            <div className={cl.loadingSpinner}>
              <img style={{width: 20}} className={cl.loader} src={sun} alt="Loading"/>
            </div>
    ) : (
          <>
          <main className={cl.profile}>
      <Link to={"/"}>
        <a href="#!" id={cl.back}>
          <img src={med_backBut} alt=""/>
        </a>
      </Link>
      <div className={cl.user_images}>
        <div id={cl.circle_img}>
          <img src={`${data.user?.photoBase64Url}`} alt="" id={cl.user_img}/>
        </div>
        <p id={cl.tag_saved}>{isDataLoading ? <span>...Loading </span> :
            <span>{data.user?.liked?.length} сохранений</span>}</p>
      </div>
      <div className={cl.user_date}>
        <h1 id={cl.user_name}>{isDataLoading ? <span>...Loading </span> : <span>{data.user?.name}</span>}</h1>
        <p id={cl.user_tag}>{isDataLoading ? <span>...Loading </span> : <span>{data.user?.username}</span>}</p>
      </div>
      </main>

{data && data.user?.liked?.length > 0 && (
      <section className={cl.saved}>
        <div className={cl.texxt_title}>
          <h2>СОХРАНЕНИЯ</h2>
          <span>({data.user?.liked?.length})</span>
        </div>

        <div className={cl.cont}>
          <div className={cl.list_saved}>
            {renderCards.map((like, index) => (
                <div key={index} className={cl.block_saved}>
                  <Link key={index + 1} to={`page4/previewPage/${like.id}?categoryId=${like?.category?.id}`}>
                    <img
                        key={index}
                        src={`https://uploads.spbneformal.fun${like?.images[0]?.url}`}
                        alt=""
                        className={cl.saved_img}
                    />
                  </Link>
                  <button onClick={() => {
                    handleButtonClick(like.id, like.id);
                    updateLikedItems(like.id);
                  }} className={cl.like_icon}>
                    <img src={yellow_heart} alt=""/>
                  </button>
                  <p>{like?.category?.title}</p>
                  <h2>{like?.title}</h2>
                </div>
            ))}
          </div>
        </div>
        {cardsToShow < (data.user?.liked?.length || 0) && (
            <button onClick={loadMoreCards} className={cl.but}>
              ПОКАЗАТЬ ВСЕ
            </button>
        )}
      </section>
  )}
{/* <Posts updateLikedItems={updateLikedItems} /> */}
  <section className={cl.invite}>
    <img src={PiterTwo} alt=""/>
    <h2>Зови друзей!</h2>
    <p>
      На случай если очень хочется поделиться нашим приложением с друзьями:{" "}
      <br/> отправляй эту пригласительную ссылку 👇
    </p>
    <p id={cl.hrefTG}>t.me/spbneformal_app_bot</p>
    <button onClick={copyLinkToClipboard} className={cl.but}>СКОПИРОВАТЬ ССЫЛКУ</button>
  </section>

  <section className={cl.homeBlock3}></section>

  <section className={cl.homeBlock4}></section>
</>
      )}

</div>
);
};

export default Page4;
