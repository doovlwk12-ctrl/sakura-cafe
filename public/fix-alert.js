// Fix for unwanted alert popup
// This script will override any alert function that shows the "Coming soon" message

(function() {
  // Store original alert function
  const originalAlert = window.alert;
  
  // Override alert function
  window.alert = function(message) {
    // Check if the message contains the unwanted text
    if (message && message.includes('قريباً نموذج إنشاء حساب جديد')) {
      console.log('Blocked unwanted alert:', message);
      return; // Don't show the alert
    }
    
    // For other alerts, use the original function
    if (originalAlert) {
      originalAlert(message);
    }
  };
  
  // Also override confirm function in case it's used
  const originalConfirm = window.confirm;
  window.confirm = function(message) {
    if (message && message.includes('قريباً نموذج إنشاء حساب جديد')) {
      console.log('Blocked unwanted confirm:', message);
      return false; // Return false to cancel
    }
    
    if (originalConfirm) {
      return originalConfirm(message);
    }
    return false;
  };
  
  console.log('Alert fix applied successfully');
})();
