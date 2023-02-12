import React, { useState, useEffect } from "react";
import styles from "./TrainerClientBody.module.css";
import CardItem3 from "../../../components/Card/CardItem3";
import ClientInfo from "./ClientInfo";
import '../../Manager/Paging.css';
import Pagination from "react-js-pagination";
import axios from "axios";
import { useDispatch } from 'react-redux';
const TrainerClientBody = (props) => {
  const [searchValue, setSearchValue] = useState(""); //검색어
  const [select, setSelect] = useState(1); //선택한 페이지
  const [targetClient, setTargetClient] = useState(undefined); //상세페이지 볼 클라이언트 id
  const data = [
    { id: 1, name: "정원철", gender: "남", age: 28, time: "14:00 - 15:00" },
    { id: 2, name: "이예은", gender: "남", age: 28, time: "14:00 - 15:00" },
    { id: 3, name: "윤동근", gender: "남", age: 28, time: "14:00 - 15:00" },
    { id: 4, name: "서유진", gender: "남", age: 28, time: "14:00 - 15:00" },
    { id: 5, name: "지선호", gender: "남", age: 28, time: "14:00 - 15:00" },
    { id: 6, name: "안려환", gender: "남", age: 28, time: "14:00 - 15:00" },
  ];
  const [signupList, setSignupList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage]= useState(0);
  const handlePageChange = (page) => {
    console.log(page);
    setPage(page);
  };
  const dispatch = useDispatch();
  useEffect(() => {
    
    axios
      .post(`/api/user/userList/0`, { id: 1 })
      .then((res) => {

        console.log(res);
        console.log(res.data.content);
        setSignupList(res.data.content)
        setTotalPage(res.data.totalElements);
        // setSignupList(res.content)

      })
      .catch((err) => {
        console.log(err);
      });
  }, [page]);

  return targetClient ? (
    // 클릭한 고객 있으면 고객 상세페이지 띄우기
    <div>
      <div className={styles.container2}>
        <ClientInfo
          {...data.find((item) => item.email === targetClient)}
          setTargetClient={setTargetClient}
        />
      </div>
    </div>
  ) : (
    // 클릭한 고객 없으면 전체 리스트 띄우기
    <div>
      <input
        className={styles.search_bar}
        placeholder="고객 이름"
        onChange={(e) => setSearchValue(e.target.value)}
        value={searchValue}
        onKeyDown={(e) => (e.keyCode === 13 ? setSearchValue("") : null)}
      ></input>
      <div className={styles.container}>
        {signupList
          .filter((item) => item.name.includes(searchValue))
          .map((item) => (
            <CardItem3
              key={item.email}
              className={styles.item}
              {...item}
              targetClient={targetClient}
              setTargetClient={setTargetClient}
            />
          ))}
      </div>
      <div className={styles.pagenation}>
        <Pagination
          activePage={page}
          itemsCountPerPage={6}
          totalItemsCount={totalPage}
          pageRangeDisplayed={5}
          prevPageText={"‹"}
          nextPageText={"›"}
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default TrainerClientBody;
