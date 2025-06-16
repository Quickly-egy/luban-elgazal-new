import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaUser,
    FaEdit,
    FaSignOutAlt,
    FaTimes,
    FaCheckCircle,
    FaPhone,
    FaEnvelope,
    FaIdCard,
    FaVenus,
    FaMars,
    FaSave,
    FaHistory,
    FaKey
} from 'react-icons/fa';
import styles from './Profile.module.css';

export default function Profile({ showProfile, setShowProfile, onLogout }) {
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState({
        firstName: 'أحمد',
        lastName: 'محمد',
        email: 'ahmed@example.com',
        phone: '+966 50 123 4567',
        gender: 'male',
        identity: '1234567890'
    });

    const [editData, setEditData] = useState({ ...profileData });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = () => {
        setProfileData({ ...editData });
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditData({ ...profileData });
        setIsEditing(false);
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            setShowProfile(false);
        }
    };

    const handleLogout = () => {
        if (onLogout) {
            onLogout();
        }
        setShowProfile(false);
    };

    const handleViewPreviousOrders = () => {
        navigate('/order');
        setShowProfile(false);
    };

    const handleResetPassword = () => {
        // Here you would typically show a password reset modal or navigate to a password reset page
        // For now, we'll show a simple alert
        alert('سيتم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني');
        // You could also implement:
        // - Show a password reset modal
        // - Navigate to a password reset page
        // - Call an API to send reset email
        setShowProfile(false);
    };


    return (
        <aside
            className={`${styles.profileModal} ${showProfile ? styles.show : ""}`}
            onClick={handleOverlayClick}
        >
            <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className={styles.modalHeader}>
                    <div className={styles.headerContent}>
                        <div className={styles.headerIcon}>
                            <FaUser />
                        </div>
                        <div className={styles.headerText}>
                            <h3>حسابي الشخصي</h3>
                            <p>إدارة بياناتك الشخصية</p>
                        </div>
                    </div>
                    <button className={styles.closeBtn} onClick={() => setShowProfile(false)}>
                        <FaTimes />
                    </button>
                </div>

                <div className={styles.modalContent}>
                    {/* Account Status */}
                    <div className={styles.accountStatus}>
                        <div className={styles.statusHeader}>
                            <FaCheckCircle className={styles.statusIcon} />
                            <div>
                                <h4>حالة الحساب</h4>
                                <span className={styles.activeStatus}>نشط</span>
                            </div>
                        </div>
                    </div>

                    {/* Personal Information */}
                    <div className={styles.personalInfo}>
                        <div className={styles.sectionHeader}>
                            <h4>المعلومات الشخصية</h4>
                            <button
                                className={styles.editBtn}
                                onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
                            >
                                {isEditing ? 'إلغاء' : 'تعديل'}
                            </button>
                        </div>

                        <div className={styles.infoGrid}>
                            {/* First Name */}
                            <div className={styles.infoItem}>
                                <label>الاسم الأول</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={editData.firstName}
                                        onChange={handleInputChange}
                                        className={styles.editInput}
                                    />
                                ) : (
                                    <div className={styles.infoValue}>
                                        <FaUser className={styles.fieldIcon} />
                                        <span>{profileData.firstName}</span>
                                    </div>
                                )}
                            </div>

                            {/* Last Name */}
                            <div className={styles.infoItem}>
                                <label>الاسم الأخير</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={editData.lastName}
                                        onChange={handleInputChange}
                                        className={styles.editInput}
                                    />
                                ) : (
                                    <div className={styles.infoValue}>
                                        <FaUser className={styles.fieldIcon} />
                                        <span>{profileData.lastName}</span>
                                    </div>
                                )}
                            </div>

                            {/* Phone */}
                            <div className={styles.infoItem}>
                                <label>رقم الهاتف</label>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={editData.phone}
                                        onChange={handleInputChange}
                                        className={styles.editInput}
                                    />
                                ) : (
                                    <div className={styles.infoValue}>
                                        <FaPhone className={styles.fieldIcon} />
                                        <span>{profileData.phone}</span>
                                    </div>
                                )}
                            </div>

                            {/* Email */}
                            <div className={styles.infoItem}>
                                <label>البريد الإلكتروني</label>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        name="email"
                                        value={editData.email}
                                        onChange={handleInputChange}
                                        className={styles.editInput}
                                    />
                                ) : (
                                    <div className={styles.infoValue}>
                                        <FaEnvelope className={styles.fieldIcon} />
                                        <span>{profileData.email}</span>
                                    </div>
                                )}
                            </div>

                            {/* Gender */}
                            <div className={styles.infoItem}>
                                <label>الجنس</label>
                                {isEditing ? (
                                    <select
                                        name="gender"
                                        value={editData.gender}
                                        onChange={handleInputChange}
                                        className={styles.editInput}
                                    >
                                        <option value="male">ذكر</option>
                                        <option value="female">أنثى</option>
                                    </select>
                                ) : (
                                    <div className={styles.infoValue}>
                                        {profileData.gender === 'male' ? <FaMars className={styles.fieldIcon} /> : <FaVenus className={styles.fieldIcon} />}
                                        <span>{profileData.gender === 'male' ? 'ذكر' : 'أنثى'}</span>
                                    </div>
                                )}
                            </div>

                            {/* Identity */}
                            <div className={styles.infoItem}>
                                <label>الهوية</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="identity"
                                        value={editData.identity}
                                        onChange={handleInputChange}
                                        className={styles.editInput}
                                    />
                                ) : (
                                    <div className={styles.infoValue}>
                                        <FaIdCard className={styles.fieldIcon} />
                                        <span>{profileData.identity}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {isEditing && (
                            <div className={styles.editActions}>
                                <button className={styles.saveBtn} onClick={handleSave}>
                                    <FaSave />
                                    حفظ التغييرات
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Quick Actions */}
                    <div className={styles.quickActions}>
                        <h4>إجراءات سريعة</h4>
                        <div className={styles.actionsList}>
                            <button className={styles.actionBtn} onClick={handleViewPreviousOrders}>
                                <FaHistory className={styles.actionIcon} />
                                <span>الطلبات السابقة</span>
                            </button>
                            <button className={styles.actionBtn} onClick={handleResetPassword}>
                                <FaKey className={styles.actionIcon} />
                                <span>إعادة تعيين كلمة المرور</span>
                            </button>
                        </div>
                    </div>

                    {/* Logout */}
                    <div className={styles.logoutSection}>
                        <button className={styles.logoutBtn} onClick={handleLogout}>
                            <FaSignOutAlt />
                            تسجيل الخروج
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    );
}

