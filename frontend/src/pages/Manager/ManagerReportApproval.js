import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import BasicLoadingSpinner from "../../components/Loading/BasicLoadingSpinner";
import styles from "./ManagerReportApproval.module.css";
import ReportModal from "./Modal/ReportModal";
import ReportModalContainer from "./Modal/ReportModalContainer";
import { reportList,reportApproval } from "../../store/admin";


const ManagerReportApproval = () => {
  const dispatch= useDispatch();
  
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState([]);
  
  // setLoading(true);
      
  useEffect(()=>{
    // 신고목록 API 설정
    dispatch(reportList()).then((res)=>{
      console.log(res.content);
      setReport(res.content);
    })

  }, [])

  const [modal, setModal] = useState({
    show: false,
    writerName: "",
    targetName: "",
    reportType: "",
    memo:"",
    id:""
  });

  const handleOpenModal = (writerName, targetName ,reportType, memo,id) => {
    setModal({
      show: true,
      writerName,
      targetName,
      reportType,
      memo,
      id,
    });
  };

  const handleCloseModal = () => {
    setModal({
      show: false,
      writerName: "",
      targetName: "",
      reportType: "",
      id:"",
      memo: "",
    });
  };


  // 신고 승인/반려 API 인자 설정중
  // const reportHandler = (name, days)=>{
  //   if(!days || name){
  //       return;
  //   }
  //   const data = {id: name, blockPeriod: days}
  //   dispatch(reportApproval(data))
  // }
  return (
    <>
      <div className={styles.info_content_box}>
        <div className={styles.content_title}>
          신고관리 <span className={styles.square}>&#9660;</span>
        </div>
        <span>불편함을 느낀 MPTI 고객님들의 목소리에 귀를 기울여 주세요!</span>
        <div className={styles.content_content}>
          <ul className={styles.content_list}>
            {report.map((it) => {
              return (
              
                <li key={it.id} style={it.stopUntil? {backgroundColor:"red"}:null} className={styles.content_item}>
                  <div className={styles.item_info_box}>
                    <div className={styles.item_info}>
                      <div>신고자: {it.writerName}</div>| <div>피신고자: {it.targetName}</div> |<div>사건 분류: {it.reportType} </div>{" "}
                      
                    </div>
                    <div className={styles.item_btn}>
                      <button
                        className={styles.btn_negative}
                        onClick={() =>
                          handleOpenModal(it.writerName,it.targetName,  it.reportType, it.memo, it.id)
                        }
                      >
                        확인
                      </button>
                    </div>
                  </div>
                  
                  {modal.show && (
                    <ReportModalContainer onClose={handleCloseModal}>
                      <ReportModal
                        writerName={modal.writerName}
                        targetName={modal.targetName}
                        reportType={modal.reportType}
                        memo={modal.memo}
                        id={modal.id}
                        onClose={handleCloseModal}
                      />
                    </ReportModalContainer>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
};

export default ManagerReportApproval;
