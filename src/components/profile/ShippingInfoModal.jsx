import React, { useState, useEffect } from 'react';
import { FaTimes, FaSpinner, FaSave, FaShippingFast, FaUser, FaEnvelope, FaPhone, FaGlobeAmericas, FaMapMarkerAlt, FaHome, FaTrash, FaPlus, FaEdit, FaExclamationTriangle } from 'react-icons/fa';
import styles from './Profile.module.css';
import { useAddresses } from '../../hooks/useAddresses';
import { allCountries, getRegions } from '../../constants/countries';

// مكون موديل تأكيد الحذف
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, isDeleting, addressDetails }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.deleteModal} onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className={styles.deleteModalContent}>
                <div className={styles.deleteModalHeader}>
                    <FaExclamationTriangle className={styles.warningIcon} />
                    <h3>تأكيد الحذف</h3>
                </div>
                <div className={styles.deleteModalBody}>
                    <p>هل أنت متأكد من حذف هذا العنوان؟</p>
                    <div className={styles.addressPreview}>
                        <p><strong>{addressDetails.address_line1}</strong></p>
                        {addressDetails.address_line2 && <p>{addressDetails.address_line2}</p>}
                        <p>{`${addressDetails.city}, ${addressDetails.state}, ${addressDetails.country}`}</p>
                    </div>
                    <p className={styles.warningText}>لا يمكن التراجع عن هذا الإجراء</p>
                </div>
                <div className={styles.deleteModalActions}>
                    <button 
                        className={styles.cancelDeleteBtn} 
                        onClick={onClose}
                        disabled={isDeleting}
                    >
                        إلغاء
                    </button>
                    <button 
                        className={styles.confirmDeleteBtn} 
                        onClick={onConfirm}
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <>
                                <FaSpinner className={styles.spinner} />
                                جاري الحذف...
                            </>
                        ) : (
                            <>
                                <FaTrash />
                                تأكيد الحذف
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function ShippingInfoModal({ isOpen, onClose }) {
    const {
        addresses,
        isLoading: isLoadingAddresses,
        createAddress,
        updateAddress,
        deleteAddress,
        isCreating,
        isUpdating,
        isDeleting
    } = useAddresses();

    const [selectedAddress, setSelectedAddress] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [availableRegions, setAvailableRegions] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [addressToDelete, setAddressToDelete] = useState(null);

    const [editData, setEditData] = useState({
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        postal_code: '',
        country: '',
        is_default: false
    });

    useEffect(() => {
        if (isOpen && selectedAddress) {
            setEditData(selectedAddress);
            setAvailableRegions(getRegions(selectedAddress.country));
        }
    }, [isOpen, selectedAddress]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'country') {
            // عند تغيير الدولة، نجلب المناطق المتاحة لها
            const regions = getRegions(value);
            setAvailableRegions(regions);
            
            // إذا كانت الدولة الجديدة لا تحتوي على المنطقة الحالية، نمسح المنطقة
            setEditData(prev => ({
                ...prev,
                [name]: value,
                state: ''  // نمسح المنطقة دائماً عند تغيير الدولة
            }));
        } else {
            setEditData(prev => ({
                ...prev,
                [name]: value
            }));
        }
        
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setEditData(prev => ({
            ...prev,
            [name]: checked
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!editData.address_line1) newErrors.address_line1 = 'العنوان مطلوب';
        if (!editData.city) newErrors.city = 'المدينة مطلوبة';
        if (!editData.state) newErrors.state = 'المنطقة/المحافظة مطلوبة';
        if (!editData.country) newErrors.country = 'الدولة مطلوبة';
        return newErrors;
    };

    const handleSave = async () => {
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        try {
            if (selectedAddress) {
                await updateAddress({ id: selectedAddress.id, ...editData });
            } else {
                await createAddress(editData);
            }
            
            setSuccessMessage('تم حفظ العنوان بنجاح');
            setIsEditing(false);
            
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
        } catch (error) {
            setErrors({ general: 'حدث خطأ في حفظ العنوان' });
        }
    };

    const handleDeleteClick = (address) => {
        setAddressToDelete(address);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteAddress(addressToDelete.id);
            setShowDeleteModal(false);
            setAddressToDelete(null);
            setSuccessMessage('تم حذف العنوان بنجاح');
            
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
        } catch (error) {
            setErrors({ general: 'حدث خطأ في حذف العنوان' });
        }
    };

    const handleAddNew = () => {
        setSelectedAddress(null);
        setEditData({
            address_line1: '',
            address_line2: '',
            city: '',
            state: '',
            postal_code: '',
            country: '',
            is_default: false
        });
        setAvailableRegions([]);
        setIsEditing(true);
        setErrors({});
    };

    if (!isOpen) return null;

    return (
        <>
            <div className={styles.phoneChangeModal} onClick={(e) => e.target === e.currentTarget && onClose()}>
                <div className={styles.phoneModalContainer} style={{ maxWidth: '800px' }}>
                    <div className={styles.phoneModalHeader}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <FaShippingFast style={{ fontSize: '1.2rem' }} />
                            <h3>عناوين الشحن</h3>
                        </div>
                        <button className={styles.phoneCloseBtn} onClick={onClose}>
                            <FaTimes />
                        </button>
                    </div>

                    <div className={styles.phoneModalContent}>
                        {/* Success Message */}
                        {successMessage && (
                            <div className={styles.successMessage}>
                                {successMessage}
                            </div>
                        )}

                        {/* Error Message */}
                        {errors.general && (
                            <div className={styles.errorMessage}>
                                {errors.general}
                            </div>
                        )}

                        {/* Addresses List */}
                        {!isEditing && (
                            <div className={styles.addressesList}>
                                <button 
                                    onClick={handleAddNew}
                                    className={styles.addAddressBtn}
                                >
                                    <FaPlus /> إضافة عنوان جديد
                                </button>
                                
                                {isLoadingAddresses ? (
                                    <div className={styles.loading}>
                                        <FaSpinner className={styles.spinner} />
                                        جاري تحميل العناوين...
                                    </div>
                                ) : addresses?.length > 0 ? (
                                    addresses.map((address) => (
                                        <div key={address.id} className={styles.addressCard}>
                                            <div className={styles.addressInfo}>
                                                <h4>{address.address_line1}</h4>
                                                {address.address_line2 && <p>{address.address_line2}</p>}
                                                <p>{`${address.city}, ${address.state}, ${address.country}`}</p>
                                                {address.is_default && (
                                                    <span className={styles.defaultBadge}>العنوان الافتراضي</span>
                                                )}
                                            </div>
                                            <div className={styles.addressActions}>
                                                <button 
                                                    onClick={() => {
                                                        setSelectedAddress(address);
                                                        setIsEditing(true);
                                                    }}
                                                    className={styles.editBtn}
                                                >
                                                    <FaEdit /> تعديل
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteClick(address)}
                                                    className={styles.deleteBtn}
                                                    disabled={isDeleting}
                                                >
                                                    <FaTrash /> حذف
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className={styles.noAddresses}>
                                        لا توجد عناوين مسجلة
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Edit Form */}
                        {isEditing && (
                            <div className={styles.addressForm}>
                                <h4>{selectedAddress ? 'تعديل العنوان' : 'إضافة عنوان جديد'}</h4>
                                
                                <div className={styles.formGrid}>
                                    <div className={styles.inputGroup}>
                                        <label>العنوان الرئيسي</label>
                                        <input
                                            type="text"
                                            name="address_line1"
                                            value={editData.address_line1}
                                            onChange={handleInputChange}
                                            className={errors.address_line1 ? styles.inputError : ''}
                                            placeholder="مثال: شارع التحرير"
                                        />
                                        {errors.address_line1 && (
                                            <span className={styles.fieldError}>{errors.address_line1}</span>
                                        )}
                                    </div>

                                    <div className={styles.inputGroup}>
                                        <label>العنوان التفصيلي (اختياري)</label>
                                        <input
                                            type="text"
                                            name="address_line2"
                                            value={editData.address_line2}
                                            onChange={handleInputChange}
                                            placeholder="مثال: بجوار المسجد"
                                        />
                                    </div>

                                    <div className={styles.inputGroup}>
                                        <label>الدولة</label>
                                        <select
                                            name="country"
                                            value={editData.country}
                                            onChange={handleInputChange}
                                            className={errors.country ? styles.inputError : ''}
                                        >
                                            <option value="">اختر الدولة</option>
                                            {allCountries.map((country) => (
                                                <option key={country} value={country}>
                                                    {country}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.country && (
                                            <span className={styles.fieldError}>{errors.country}</span>
                                        )}
                                    </div>

                                    <div className={styles.inputGroup}>
                                        <label>المنطقة/المحافظة</label>
                                        <select
                                            name="state"
                                            value={editData.state}
                                            onChange={handleInputChange}
                                            className={errors.state ? styles.inputError : ''}
                                            disabled={!editData.country}
                                        >
                                            <option value="">اختر المنطقة</option>
                                            {availableRegions.map((region) => (
                                                <option key={region} value={region}>
                                                    {region}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.state && (
                                            <span className={styles.fieldError}>{errors.state}</span>
                                        )}
                                    </div>

                                    <div className={styles.inputGroup}>
                                        <label>المدينة</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={editData.city}
                                            onChange={handleInputChange}
                                            className={errors.city ? styles.inputError : ''}
                                            placeholder="أدخل اسم المدينة"
                                        />
                                        {errors.city && (
                                            <span className={styles.fieldError}>{errors.city}</span>
                                        )}
                                    </div>

                                    <div className={styles.inputGroup}>
                                        <label>الرمز البريدي</label>
                                        <input
                                            type="text"
                                            name="postal_code"
                                            value={editData.postal_code}
                                            onChange={handleInputChange}
                                            placeholder="مثال: 12345"
                                        />
                                    </div>
                                </div>

                                <div className={styles.checkboxGroup}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            name="is_default"
                                            checked={editData.is_default}
                                            onChange={handleCheckboxChange}
                                        />
                                        تعيين كعنوان افتراضي
                                    </label>
                                </div>

                                <div className={styles.formActions}>
                                    <button
                                        onClick={() => {
                                            setIsEditing(false);
                                            setErrors({});
                                        }}
                                        className={styles.cancelBtn}
                                        type="button"
                                        style={{ fontFamily: 'Cairo, sans-serif' }}
                                    >
                                        إلغاء
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className={styles.saveBtn}
                                        type="button"
                                        disabled={isCreating || isUpdating}
                                        style={{ fontFamily: 'Cairo, sans-serif' }}
                                    >
                                        {isCreating || isUpdating ? (
                                            <>
                                                <FaSpinner className={styles.spinner} />
                                                جاري الحفظ...
                                            </>
                                        ) : (
                                            <>
                                                <FaSave />
                                                حفظ العنوان
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal 
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setAddressToDelete(null);
                }}
                onConfirm={handleConfirmDelete}
                isDeleting={isDeleting}
                addressDetails={addressToDelete || {}}
            />
        </>
    );
} 