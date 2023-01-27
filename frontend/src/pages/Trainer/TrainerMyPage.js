import React from 'react';
import styles from './TrainerMyPage.module.css';
import TopTitle from '../../components/Common/TopTitle'

const TrainerMyPage = () => {
    <TopTitle title='마이페이지' content='고객님의 운동기록을 확인하며 운동을 해보세요 ! '/>
    return (
        <div className={styles.TrainerMyPage}>
            TrainerMyPage
        </div>
    );
};

export default TrainerMyPage;