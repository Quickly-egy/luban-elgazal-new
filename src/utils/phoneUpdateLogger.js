// Phone Update Logger Utility
// مساعد لتتبع تحديثات رقم الهاتف

export const logPhoneUpdate = (context, oldPhone, newPhone) => {
    console.group(`📱 ${context}: تحديث رقم الهاتف`);
    console.log('🔄 الرقم القديم:', oldPhone);
    console.log('✅ الرقم الجديد:', newPhone);
    console.log('📅 وقت التحديث:', new Date().toLocaleString('ar-EG'));
    console.groupEnd();
};

export const verifyPhoneSync = () => {
    try {
        // Get data from different sources
        const localStorage_data = localStorage.getItem('user_data');
        const parsedData = localStorage_data ? JSON.parse(localStorage_data) : null;
        
        console.group('🔍 التحقق من تزامن رقم الهاتف');
        console.log('💾 localStorage phone:', parsedData?.phone);
        
        // Return sync status
        return {
            localStorage: parsedData?.phone,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error('❌ خطأ في التحقق من تزامن رقم الهاتف:', error);
        return null;
    } finally {
        console.groupEnd();
    }
};

export const createPhoneUpdateSummary = (updateData) => {
    return {
        success: true,
        oldPhone: updateData.oldPhone,
        newPhone: updateData.newPhone,
        timestamp: new Date().toISOString(),
        sources_updated: [
            'localStorage',
            'authStore',
            'UI_components'
        ]
    };
}; 