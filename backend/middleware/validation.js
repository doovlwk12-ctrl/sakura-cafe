const { body, validationResult } = require('express-validator');

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: 'خطأ في التحقق من البيانات',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  next();
};

// User validation
const validateUser = [
  body('username')
    .isLength({ min: 3, max: 20 })
    .withMessage('اسم المستخدم يجب أن يكون بين 3 و 20 حرف')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('اسم المستخدم يمكن أن يحتوي على أحرف وأرقام وشرطة سفلية فقط'),
    
  body('email')
    .isEmail()
    .withMessage('البريد الإلكتروني غير صحيح')
    .normalizeEmail(),
    
  body('password')
    .isLength({ min: 6 })
    .withMessage('كلمة المرور يجب أن تكون 6 أحرف على الأقل')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('كلمة المرور يجب أن تحتوي على حرف صغير وحرف كبير ورقم'),
    
  body('fullName')
    .isLength({ min: 2, max: 50 })
    .withMessage('الاسم الكامل يجب أن يكون بين 2 و 50 حرف'),
    
  body('phone')
    .isMobilePhone('ar-SA')
    .withMessage('رقم الهاتف غير صحيح')
    .optional(),
    
  handleValidationErrors
];

// Product validation
const validateProduct = [
  body('name')
    .notEmpty()
    .withMessage('اسم المنتج مطلوب')
    .isLength({ min: 2, max: 100 })
    .withMessage('اسم المنتج يجب أن يكون بين 2 و 100 حرف'),
    
  body('price')
    .isNumeric()
    .withMessage('السعر يجب أن يكون رقم')
    .isFloat({ min: 0.01 })
    .withMessage('السعر يجب أن يكون أكبر من 0'),
    
  body('category')
    .notEmpty()
    .withMessage('التصنيف مطلوب')
    .isIn(['drinks', 'sweets', 'sandwiches', 'groups'])
    .withMessage('التصنيف غير صحيح'),
    
  body('image')
    .optional()
    .isURL()
    .withMessage('رابط الصورة غير صحيح'),
    
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('الوصف يجب أن يكون أقل من 500 حرف'),
    
  handleValidationErrors
];

// Order validation
const validateOrder = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('يجب أن يحتوي الطلب على منتج واحد على الأقل'),
    
  body('items.*.productId')
    .notEmpty()
    .withMessage('معرف المنتج مطلوب')
    .isMongoId()
    .withMessage('معرف المنتج غير صحيح'),
    
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('الكمية يجب أن تكون رقم صحيح أكبر من 0'),
    
  body('customerId')
    .optional()
    .isMongoId()
    .withMessage('معرف العميل غير صحيح'),
    
  body('branchId')
    .notEmpty()
    .withMessage('معرف الفرع مطلوب')
    .isMongoId()
    .withMessage('معرف الفرع غير صحيح'),
    
  body('paymentMethod')
    .isIn(['cash', 'card', 'wallet'])
    .withMessage('طريقة الدفع غير صحيحة'),
    
  body('orderType')
    .isIn(['pickup', 'delivery'])
    .withMessage('نوع الطلب غير صحيح'),
    
  body('deliveryAddress')
    .optional()
    .isLength({ min: 10, max: 200 })
    .withMessage('عنوان التوصيل يجب أن يكون بين 10 و 200 حرف'),
    
  body('notes')
    .optional()
    .isLength({ max: 300 })
    .withMessage('الملاحظات يجب أن تكون أقل من 300 حرف'),
    
  handleValidationErrors
];

// Branch validation
const validateBranch = [
  body('name')
    .notEmpty()
    .withMessage('اسم الفرع مطلوب')
    .isLength({ min: 2, max: 100 })
    .withMessage('اسم الفرع يجب أن يكون بين 2 و 100 حرف'),
    
  body('address')
    .notEmpty()
    .withMessage('عنوان الفرع مطلوب')
    .isLength({ min: 10, max: 200 })
    .withMessage('عنوان الفرع يجب أن يكون بين 10 و 200 حرف'),
    
  body('phone')
    .isMobilePhone('ar-SA')
    .withMessage('رقم هاتف الفرع غير صحيح'),
    
  body('email')
    .optional()
    .isEmail()
    .withMessage('البريد الإلكتروني غير صحيح')
    .normalizeEmail(),
    
  body('coordinates.lat')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('خط العرض غير صحيح'),
    
  body('coordinates.lng')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('خط الطول غير صحيح'),
    
  handleValidationErrors
];

// Login validation
const validateLogin = [
  body('username')
    .notEmpty()
    .withMessage('اسم المستخدم مطلوب'),
    
  body('password')
    .notEmpty()
    .withMessage('كلمة المرور مطلوبة'),
    
  body('userType')
    .optional()
    .isIn(['customer', 'admin', 'cashier'])
    .withMessage('نوع المستخدم غير صحيح'),
    
  handleValidationErrors
];

// Password reset validation
const validatePasswordReset = [
  body('email')
    .isEmail()
    .withMessage('البريد الإلكتروني غير صحيح')
    .normalizeEmail(),
    
  handleValidationErrors
];

const validateNewPassword = [
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('كلمة المرور يجب أن تحتوي على حرف صغير وحرف كبير ورقم'),
    
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('تأكيد كلمة المرور غير متطابق');
      }
      return true;
    }),
    
  handleValidationErrors
];

module.exports = {
  validateUser,
  validateProduct,
  validateOrder,
  validateBranch,
  validateLogin,
  validatePasswordReset,
  validateNewPassword,
  handleValidationErrors
};
