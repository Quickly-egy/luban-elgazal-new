import { MdOutlineClose } from 'react-icons/md';
import styles from './wishlistModal.module.css';
import logo from './imgs/logo-CkHS0Ygq.webp'
import { FaStar, FaTrash } from 'react-icons/fa';
import { GrStatusGood } from 'react-icons/gr';
import { IoCart } from 'react-icons/io5';
export default function WishlistModal({ showWishlistModal, setShowWishlistModal }) {
    const quantity = 1;
    return (
        <aside className={`${styles.sideBar} ${showWishlistModal ? styles.show : ""}`}>
            <div className={`${styles.container}`} >
                {quantity > 0 ? <>
                    <div className={`${styles.header} between`}>
                        <div>
                            <h3>قائمة المفضلة</h3>
                            <p>0 منتج</p>
                        </div>

                        <MdOutlineClose className={`${styles.close}`} onClick={() => setShowWishlistModal(false)} />

                    </div>
                    <div className={`${styles.items_container} center`}>

                        <div className={`${styles.item} between`}>

                            <div className={`${styles.item_info} center`}>
                                <h5>لبان الغزال الأصلي </h5>
                                <p>منتجات العناية بالجمال</p>
                                <div className={`${styles.status_container} `}>
                                    <p>(25) 26565325653535653565356 </p>
                                    <div>
                                        <FaStar className={styles.star} />
                                        <FaStar className={styles.star} />
                                        <FaStar className={styles.star} />
                                        <FaStar className={styles.star} />
                                        <FaStar className={styles.star} />
                                    </div>

                                </div>
                                <GrStatusGood className={styles.status} />
                                <p>100 ريال</p>
                                <div className={`${styles.buttons_container} center`}>
                                    <FaTrash className={styles.trash} />

                                    <button>نقل الي السلة <IoCart /></button>

                                </div>
                            </div>
                            <div className={`${styles.image_container} center`}>
                                <img src={logo} alt="img not found" />
                            </div>
                        </div>
                    </div>
                </> :
                    <>
                        <div className={`${styles.header} between`}>
                            <div>
                                <h3> لا يوجد عناصر في قائمة المفضلة</h3>
                            </div>
                        </div>
                    </>}
            </div>





        </aside>
    )
}
