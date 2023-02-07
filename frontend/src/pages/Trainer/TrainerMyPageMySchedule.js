import { useState, useEffect, useRef } from "react";
import styles from "./TrainerMyPageMySchedule.module.css";
import Calendar from "../../components/Calendar/Calendar";
import axios from "axios";

const TrainerMyPageMySchedule = () => {
  const morning = [6, 7, 8, 9, 10, 11];
  const afternoon = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
  const [timeArray, setTimeArray] = useState([]);   // 이미 예약된 레슨 시간 + 내가 열어둔 레슨 시간
  const [newHour, setNewHour] = useState([]);       // 클릭한 날짜의 가능 레슨 시간들 중 회원이 예약한 시간만 담은 데이터
  const [newDay, setNewDay] = useState([]);         // 캘린더에서 클릭한 날짜

  // 캘린더에서 클릭한 날짜를 props로 올려받음
  const getNewDay = (day) => {
    setNewDay(day);
  };

  const preventClick = (event) => {
    event.preventDefault();
  }

  const handleClick = (event, time) => {
    if (newHour.includes(time)) {
      preventClick(event);
    }
    if (timeArray.includes(time) && !newHour.includes(time)) {
      let newTimeArray = timeArray.filter((ele) => ele !== time);
      newTimeArray.sort(function (a, b) {
        return a - b;
      });
      setTimeArray(newTimeArray);
    }
    if (!timeArray.includes(time)) {
      setTimeArray((prev) =>
        [...prev, time].sort(function (a, b) {
          return a - b;
        })
      );
    };
  }

  const getData = useRef([]);
  const newData = getData.current

  useEffect(() => {
    const filteredData = getData.current.filter(
      (item) =>
        item.year === newDay[0] &&
        item.month === newDay[1] &&
        item.day === newDay[2]
    );
    const reservedNewData = filteredData.filter((item) => item.userId)
    const reservedNewHour = reservedNewData.map((item) => item.hour)
    console.log(filteredData)

    if (filteredData) {
      const newHour = filteredData.map((data) => data.hour);
      setTimeArray(newHour);
      setNewHour(reservedNewHour);
    }

  }, [newDay]);

  useEffect(() => {
    axios.get("/api/business/reservation/list").then((res) => {
      getData.current = res.data;
    });
  }, []);

  const sendData = () => {
    const data = {
      // trainerId: {},
      // trainerName: {},
      year: newDay[0],
      month: newDay[1],
      day: newDay[2],
      openHours: timeArray,
    };
    // post : header 넣어야 함
    axios.post("/api/business/reservation/scheduling", data).then((res) => {
      console.log(res);
    });
  };
  console.log()
  console.log(timeArray);

  return (
    <div className={styles.container}>
      <div className={styles.bigtxt}>스케줄 조정</div>
      <div className={styles.smtxt}>
        수업이 가능한 날짜와 시간을 선택하세요!
      </div>

      <div className={styles.out_box}>
        <div className={styles.in_box}>
          <Calendar getNewDay={getNewDay} newData={newData}/>
        </div>
      </div>

      <div className={styles.out_box}>
        {/* 오전 테이블 */}
        <div className={styles.time_table}>
          <div className={styles.table_text}>오전</div>
          <div className={styles.times_box}>
            {morning.map((time) => (
              <div
                className={`${styles.time} ${
                  timeArray.includes(time) ? `${styles.clicked_time}` : null
                } ${
                  newHour.includes(time) ? `${styles.prevent_clicked_time}` : null
                }`}
                key={time}
                onClick={(event) => {
                  handleClick(event, time);
                }}
              >
                {time}시
              </div>
            ))}
          </div>
        </div>
        {/* 오후 테이블 */}
        <div className={styles.time_table}>
          <div className={styles.table_text}>오후</div>
          <div className={styles.times_box}>
            {afternoon.map((time) => (
              <div
                className={`${styles.time} ${
                  timeArray.includes(time) ? `${styles.clicked_time}` : null
                }`}
                key={time}
                onClick={(event) => {
                  handleClick(event, time);
                }}
              >
                {time}시
              </div>
            ))}
          </div>
        </div>
        <div className={styles.edit} onClick={() => {sendData();}}>완료🖍</div>
      </div>
    </div>
  );
};

export default TrainerMyPageMySchedule;
