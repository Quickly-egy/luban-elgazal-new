import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaUser,
    FaEdit,
    FaSignOutAlt,
    FaTimes,
    FaCheckCircle,
    FaPhone,
    FaEnvelope,
    FaGlobeAmericas,
    FaVenus,
    FaMars,
    FaSave,
    FaHistory,
    FaKey,
    FaTicketAlt,
    FaSpinner
} from 'react-icons/fa';
import useAuthStore from '../../stores/authStore';
import PhoneChangeModal from './PhoneChangeModal';
import PasswordChangeModal from './PasswordChangeModal';
import { logPhoneUpdate, verifyPhoneSync } from '../../utils/phoneUpdateLogger';
import styles from './Profile.module.css';

export default function Profile({ showProfile, setShowProfile, onLogout }) {
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [showPhoneChangeModal, setShowPhoneChangeModal] = useState(false);
    const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false);
    const navigate = useNavigate();
    const { user, updateProfile, isAuthenticated } = useAuthStore();
    
    // Debug user authentication status
    useEffect(() => {
        console.log('👤 User data:', user);
        console.log('🔐 Auth token exists:', !!localStorage.getItem('auth_token'));
        console.log('✅ Is authenticated:', isAuthenticated);
        
        // Check for inconsistencies
        const hasToken = !!localStorage.getItem('auth_token');
        const hasUser = !!user;
        
        if (hasToken !== isAuthenticated) {
            console.warn('⚠️ Profile: عدم تطابق بين token و isAuthenticated');
        }
        
        if (hasToken && !hasUser) {
            console.warn('⚠️ Profile: يوجد token لكن لا توجد بيانات user');
        }
    }, [user, isAuthenticated]);
    
    const [profileData, setProfileData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        gender: 'male',
        country: ''
    });

    const [editData, setEditData] = useState({ ...profileData });

    // Update profile data when user data changes
    useEffect(() => {
        if (user) {
            const newProfileData = {
                firstName: user.first_name || '',
                lastName: user.last_name || '',
                email: user.email || '',
                phone: user.phone || '',
                gender: user.gender || 'male',
                country: user.country || ''
            };
            console.log('🔄 Profile: تحديث البيانات من authStore:', newProfileData);
            setProfileData(newProfileData);
            setEditData(newProfileData);
        }
    }, [user]);

    // Verify data sync with localStorage on mount and when user changes
    useEffect(() => {
        const verifyDataSync = () => {
            const storedData = localStorage.getItem('user_data');
            if (storedData) {
                const parsedData = JSON.parse(storedData);
                console.log('🔍 Profile: التحقق من تزامن البيانات:');
                console.log('📱 localStorage phone:', parsedData.phone);
                console.log('👤 authStore phone:', user?.phone);
                console.log('📋 profileData phone:', profileData.phone);
                
                if (parsedData.phone !== user?.phone) {
                    console.warn('⚠️ Profile: عدم تزامن بين localStorage و authStore');
                }
            }
        };
        
        verifyDataSync();
    }, [user, profileData]);



    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
        
        // Clear success message
        if (successMessage) {
            setSuccessMessage('');
        }
    };

    const handleSave = async () => {
        setIsLoading(true);
        setErrors({});
        setSuccessMessage('');
        
        try {
            const result = await updateProfile(editData);
            
            // Update local profile data
            setProfileData({ ...editData });
            setIsEditing(false);
            setSuccessMessage(result.message || 'تم تحديث البيانات بنجاح');
            
            // Clear success message after 3 seconds
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
            
        } catch (error) {
            console.error('خطأ في تحديث البيانات:', error);
            
            // Handle validation errors (422)
            if (error.validationErrors) {
                const validationErrors = {};
                
                // Map API field names to form field names
                const fieldMapping = {
                    'first_name': 'firstName',
                    'last_name': 'lastName',
                    'email': 'email',
                    'country': 'country',
                    'gender': 'gender'
                };
                
                Object.keys(error.validationErrors).forEach(apiField => {
                    const formField = fieldMapping[apiField] || apiField;
                    const errorMessages = error.validationErrors[apiField];
                    
                    // Translate common error messages to Arabic
                    let arabicMessage = errorMessages[0];
                    const errorMessage = errorMessages[0].toLowerCase();
                    
                    if (errorMessage.includes('already been taken') || errorMessage.includes('already exists')) {
                        if (apiField === 'email') {
                            arabicMessage = 'هذا البريد الإلكتروني مستخدم بالفعل';
                        } else {
                            arabicMessage = 'هذه البيانات مستخدمة بالفعل';
                        }
                    } else if (errorMessage.includes('invalid') || errorMessage.includes('format')) {
                        if (apiField === 'email') {
                            arabicMessage = 'البريد الإلكتروني غير صحيح';
                        } else {
                            arabicMessage = 'التنسيق غير صحيح';
                        }
                    } else if (errorMessage.includes('required')) {
                        if (apiField === 'first_name') {
                            arabicMessage = 'الاسم الأول مطلوب';
                        } else if (apiField === 'last_name') {
                            arabicMessage = 'الاسم الأخير مطلوب';
                        } else if (apiField === 'email') {
                            arabicMessage = 'البريد الإلكتروني مطلوب';
                        } else if (apiField === 'country') {
                            arabicMessage = 'الدولة مطلوبة';
                        } else if (apiField === 'gender') {
                            arabicMessage = 'الجنس مطلوب';
                        } else {
                            arabicMessage = 'هذا الحقل مطلوب';
                        }
                    }
                    
                    validationErrors[formField] = arabicMessage;
                });
                
                setErrors(validationErrors);
            } else {
                // Handle general errors
                setErrors({ general: error.message || 'حدث خطأ في تحديث البيانات' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setEditData({ ...profileData });
        setIsEditing(false);
        setErrors({});
        setSuccessMessage('');
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            setShowProfile(false);
        }
    };

    const handleLogout = async () => {
        if (onLogout) {
            await onLogout();
        }
        setShowProfile(false);
    };

    const handleViewPreviousOrders = () => {
        navigate('/order');
        setShowProfile(false);
    };

    const handleResetPassword = () => {
        setShowPasswordChangeModal(true);
    };

    const handleViewTickets = () => {
        navigate('/tickets');
        setShowProfile(false);
    };

    const handleChangePhone = () => {
        setShowPhoneChangeModal(true);
    };

    const handlePhoneChanged = (newPhone) => {
        const oldPhone = profileData.phone;
        console.log('📱 Profile: تحديث رقم الهاتف في الواجهة:', newPhone);
        
        // Log the update
        logPhoneUpdate('Profile UI', oldPhone, newPhone);
        
        // Update profile data with new phone
        setProfileData(prev => {
            const updated = { ...prev, phone: newPhone };
            console.log('📋 Profile: profileData محدث:', updated);
            return updated;
        });
        
        setEditData(prev => {
            const updated = { ...prev, phone: newPhone };
            console.log('✏️ Profile: editData محدث:', updated);
            return updated;
        });
        
        // Show success message
        setSuccessMessage('تم تحديث رقم الهاتف بنجاح');
        
        // Clear success message after 3 seconds
        setTimeout(() => {
            setSuccessMessage('');
        }, 3000);
        
        // Verify data synchronization
                setTimeout(() => {
            const syncStatus = verifyPhoneSync();
            if (syncStatus) {
                console.log('🔄 Profile: تم التحقق من تزامن البيانات بعد التحديث');
            }
        }, 500); // Small delay to ensure all updates are complete
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
                                disabled={isLoading}
                            >
                                {isEditing ? 'إلغاء' : 'تعديل'}
                            </button>
                        </div>

                        {/* Success Message */}
                        {successMessage && (
                            <div className={styles.successMessage}>
                                {successMessage}
                            </div>
                        )}

                        {/* General Error Message */}
                        {errors.general && (
                            <div className={styles.errorMessage}>
                                {errors.general}
                            </div>
                        )}

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
                                        className={`${styles.editInput} ${errors.firstName ? styles.inputError : ''}`}
                                    />
                                ) : (
                                    <div className={styles.infoValue}>
                                        <FaUser className={styles.fieldIcon} />
                                        <span>{profileData.firstName}</span>
                                    </div>
                                )}
                                {errors.firstName && <span className={styles.fieldError}>{errors.firstName}</span>}
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
                                        className={`${styles.editInput} ${errors.lastName ? styles.inputError : ''}`}
                                    />
                                ) : (
                                    <div className={styles.infoValue}>
                                        <FaUser className={styles.fieldIcon} />
                                        <span>{profileData.lastName}</span>
                                    </div>
                                )}
                                {errors.lastName && <span className={styles.fieldError}>{errors.lastName}</span>}
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
                                        className={`${styles.editInput} ${errors.email ? styles.inputError : ''}`}
                                    />
                                ) : (
                                    <div className={styles.infoValue}>
                                        <FaEnvelope className={styles.fieldIcon} />
                                        <span>{profileData.email}</span>
                                    </div>
                                )}
                                {errors.email && <span className={styles.fieldError}>{errors.email}</span>}
                            </div>

                            {/* Gender */}
                            <div className={styles.infoItem}>
                                <label>الجنس</label>
                                {isEditing ? (
                                    <select
                                        name="gender"
                                        value={editData.gender}
                                        onChange={handleInputChange}
                                        className={`${styles.editInput} ${errors.gender ? styles.inputError : ''}`}
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
                                {errors.gender && <span className={styles.fieldError}>{errors.gender}</span>}
                            </div>

                            {/* Country */}
                            <div className={styles.infoItem}>
                                <label>الدولة</label>
                                {isEditing ? (
                                    <select
                                        name="country"
                                        value={editData.country}
                                        onChange={handleInputChange}
                                        className={`${styles.editInput} ${errors.country ? styles.inputError : ''}`}
                                    >
                                        <option value="">اختر الدولة</option>
                                        <option value="مصر">مصر</option>
                                        <option value="السعودية">السعودية</option>
                                        <option value="الإمارات">الإمارات العربية المتحدة</option>
                                        <option value="الكويت">الكويت</option>
                                        <option value="قطر">قطر</option>
                                        <option value="البحرين">البحرين</option>
                                        <option value="عمان">عمان</option>
                                        <option value="الأردن">الأردن</option>
                                        <option value="لبنان">لبنان</option>
                                        <option value="سوريا">سوريا</option>
                                        <option value="العراق">العراق</option>
                                        <option value="اليمن">اليمن</option>
                                        <option value="ليبيا">ليبيا</option>
                                        <option value="تونس">تونس</option>
                                        <option value="الجزائر">الجزائر</option>
                                        <option value="المغرب">المغرب</option>
                                        <option value="السودان">السودان</option>
                                        <option value="فلسطين">فلسطين</option>
                                    </select>
                                ) : (
                                    <div className={styles.infoValue}>
                                        <FaGlobeAmericas className={styles.fieldIcon} />
                                        <span>{profileData.country || 'لم يتم تحديدها'}</span>
                                    </div>
                                )}
                                {errors.country && <span className={styles.fieldError}>{errors.country}</span>}
                            </div>
                        </div>

                        {isEditing && (
                            <div className={styles.editActions}>
                                <button 
                                    className={styles.saveBtn} 
                                    onClick={handleSave}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <div className={styles.spinner}></div>
                                    ) : (
                                        <FaSave />
                                    )}
                                    {isLoading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
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
                            <button className={styles.actionBtn} onClick={handleViewTickets}>
                                <FaTicketAlt className={styles.actionIcon} />
                                <span>التذاكر</span>
                            </button>
                            <button className={styles.actionBtn} onClick={handleChangePhone}>
                                <FaPhone className={styles.actionIcon} />
                                <span>تغيير رقم الهاتف</span>
                            </button>
                            <button className={styles.actionBtn} onClick={handleResetPassword}>
                                <FaKey className={styles.actionIcon} />
                                <span>تغيير كلمة المرور</span>
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

            {/* Phone Change Modal */}
            <PhoneChangeModal 
                isOpen={showPhoneChangeModal}
                onClose={() => setShowPhoneChangeModal(false)}
                onPhoneChanged={handlePhoneChanged}
            />

            {/* Password Change Modal */}
            <PasswordChangeModal 
                isOpen={showPasswordChangeModal}
                onClose={() => setShowPasswordChangeModal(false)}
            />
        </aside>
    );
}

