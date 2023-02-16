import React from 'react'
import styles from './TrainerMyPageMyReview.module.css'
import { Icon } from '@iconify/react'

const TrainerMyPageMyReview= ({reviews})=>{
  console.log(reviews)

  const anonymousName = (name) => {
    const elements = [];
    for (let i = 0; i < name.length; i++) {
      elements.push(
        <Icon
          key={i}
          icon="octicon:north-star-16"
          className={styles.name_icon}
        ></Icon>
      );
    }
    return elements;
  }

  return(
    <div className={styles.container}>
      <div className={styles.content_title}>내 고객리뷰</div>
      <div className={styles.out_box}>
        <div className={styles.content_box}>
          {reviews.length?reviews.map(review => 
            <div className={styles.in_box} key={review.id}>
              <div className={styles.review_top}>
                <div className={styles.review_top_left}>
                  <div>
                    {anonymousName(review.writerName)} 님
                  </div>

                  <div>{'⭐'.repeat(review.star)}</div>
                  <div className={styles.review_time}>{review.createdAt.substr(0,10)}</div>
                </div>   
              </div>  
              
              <div className={styles.review_content}>{review.memo}</div>
            </div>
          ):<div className={styles.no_review}>리뷰가 없습니다.</div>}
        </div>
      </div>
    </div>
  )
}

export default TrainerMyPageMyReview;