import { Tile } from "react-native-elements";

export const formatData = (data, numColumns) => {
    const numberOfFullRows = Math.floor(data.length / numColumns);
    let numberOfElementLastRows = data.length - (numColumns * numberOfFullRows);

    while (numberOfElementLastRows !== numColumns && numberOfElementLastRows !== 0) {
        data.push({ key: `blank-${numberOfElementLastRows}`, empty: true })
        numberOfElementLastRows += 1;
    }
    return data;
}

export const formatMoney = (amount, decimalCount = 2, decimal = ".", thousands = ",", symbolSign) => {
    try {
        decimalCount = Math.abs(decimalCount);
        decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

        const negativeSign = amount < 0 ? "-" : "";
        const currencySymbol = symbolSign ? symbolSign : ""
        let amountConvert = amount.toString().replace(new RegExp(thousands, 'g'), "")
        let i = parseInt(amountConvert = Math.abs(Number(amountConvert) || 0).toFixed(decimalCount)).toString();
        let j = (i.length > 3) ? i.length % 3 : 0;
        return currencySymbol + negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amountConvert - i).toFixed(decimalCount).slice(2) : "");
    } catch (e) {
        console.log(e)
    }
};

export const getFormattedDate = (date) => {
    var year = date.getFullYear();

    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    return day + '/' + month + '/' + year;
}

export const convertDataAddressFromCacheToDatatable = (dataProvince, dataDistrict, dataWard) => {
    let data = []
    data = dataProvince.map((itemp, index) => {
        //thêm trường key, label để component hoá data
        itemp.key = itemp.ProvinceID
        itemp.label = itemp.ProvinceName
        //lấy danh sách quận/huyện theo tỉnh
        let data1 = dataDistrict.filter((item1, index) => { return itemp.ProvinceID === item1.ProvinceID })
        //thay đổi data quận huyện lấy được từ trên
        data1.map((itemd) => {
            //thêm trường key, label để component hoá data
            itemd.key = itemd.DistrictID
            itemd.label = itemd.DistrictName
            //lấy danh sách phường/xã theo quận/huyện
            let data2 = dataWard.filter((item2) => { return itemd.DistrictID === item2.DistrictID })
            data2.map((itemw) => {
                //thêm trường key, label để component hoá data
                itemw.key = itemw.WardID
                itemw.label = itemw.WardName
                return itemw
            })
            itemd.children = data2
            return itemd
        })
        itemp.children = data1
        return itemp
    })
    return data;
}

export const getDisplayItemService = (serviceCategoryID, serviceID) => {
    const color = getRandomColor()
    const size = 50
    let route = ''
    let icon = ''
    let type = ''
    switch (serviceCategoryID) {
        case 1:
            //route = 'PhoneRecharge'
            icon = 'mobile1'
            type = 'antdesign'
            break;
        case 2:

            break;
        case 3:
            //route = 'PhoneCard'
            icon = 'cards'
            type = 'material-community'
            break;
        case 4:
            //route = ''
            icon = 'gamepad'
            type = 'material-community'
            break;
        case 5:
            break;
        case 6:
            // route = 'ElectricPaymentUnit'
            icon = 'bolt'
            type = 'font-awesome'
            break;
        case 7:
            //route = 'WaterPaymentUnit'
            icon = 'tint'
            type = 'font-awesome'
            break;
        case 8:
            //route = 'InternetBill'
            icon = 'broadcast'
            type = 'octicon'
            break;
        case 9:
            // route = 'TVBill'
            icon = 'tv'
            type = 'entypo'
            break;
        case 10:
            // route = ''
            icon = 'tty'
            type = 'font-awesome'
            break;
        case 11:
            // route = ''
            icon = 'mobile1'
            type = 'antdesign'
            break;
        case 12:
            ///route = ''
            icon = 'graduation-cap'
            type = 'font-awesome'
            break;
        case 13:
            ///route = ''
            icon = 'building-o'
            type = 'font-awesome'
            break;
        case 14:
            //route = ''
            icon = 'pied-piper-alt'
            type = 'font-awesome'
            break;
        case 15:
            //route = ''
            icon = 'list-alt'
            type = 'font-awesome'
            break;
        case 16:
            //route = ''
            icon = 'paypal'
            type = 'font-awesome'
            break;
        case 17:
            //route = ''
            icon = 'shield'
            type = 'font-awesome'
            break;
        case 18:
            // route = ''
            icon = 'spotify'
            type = 'font-awesome'
            break;
        case 19:
            break;
        case 20:

            break;
        case 21:

            break;
        case 22:
            //route = ''
            icon = 'car'
            type = 'font-awesome'
            break;
        case 23:

            break;
        case 24:

            break;
        case 25:

            break;
        case 26:

            break;
        case 27:
            //route = ''
            icon = 'shopping-basket'
            type = 'font-awesome'
            break;
        case 28:
            //route = ''
            icon = 'themeisle'
            type = 'font-awesome'
            break;
        case 29:
            //route = ''
            icon = 'themeisle'
            type = 'font-awesome'
            break;
        case 30:
            //route = ''
            icon = 'money'
            type = 'font-awesome'
            break;
        default:

            break;
    }
    return { color, size, icon, type }
    // return { color, size, route, icon, type }
}

export const getRandomColor = () => {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

export const getOnlyNumber = (value, maxLength = 0, upwardLimit, downwardLimit) => {
    let valueRevert = value;
    if (maxLength > 0) {
        valueRevert = valueRevert.substring(0, maxLength)
    }
    valueRevert = valueRevert.toString().replace(new RegExp(',', 'g'), "")
    const reg = new RegExp('^\\d+$');
    if (reg.test(valueRevert) || valueRevert == '') {
        if (valueRevert == '') {
            return valueRevert;
        }
        // else {
        //     if (valueRevert <= upwardLimit) {
        //         return formatMoney(valueRevert, 0);
        //     }
        //     else {
        //         return formatMoney(upwardLimit, 0);
        //     }
        // }
        return formatMoney(valueRevert, 0);
    }
    else {
        return formatMoney(valueRevert.slice(0, -1), 0);
    }
}


export const regExEmail = new RegExp(/^([a-zA-Z0-9_\-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/);
export const PrefixMobileNumber = ['099', '059', '086', '096', '097', '098', '032', '033', '034', '035', '036', '037', '038', '039', '089', '090', '093', '070', '077', '076', '078', '088', '091', '094', '081', '082', '083', '085', '085', '092', '056', '058'];
export const regExNumber = new RegExp(/^ *[0-9]+ *$/);

export const checkPhoneNumber = (phoneNumber = '') => {
    let errorsMess = '';
    const subPhoneNumberTheFirst = phoneNumber.substring(0, 1);
    const subPhoneNumber = phoneNumber.substring(0, 3);
    switch (true) {
        case phoneNumber.length <= 0:
            errorsMess = 'Vui lòng nhập số điện thoại'
            break;
        case subPhoneNumberTheFirst != '0':
            errorsMess = 'Số điện thoại bắt đầu bằng số 0';
            break;
        case phoneNumber.indexOf('.') > -1:
            errorsMess = 'Vui lòng luôn nhập số điện thoại là số';
            break;
        case phoneNumber.length < 10:
            errorsMess = 'Số điện thoại phải đủ 10 số';
            break;
        case regExNumber.test(phoneNumber) == false:
            errorsMess = 'Số điện thoại không đúng định dạng';
            break;
        case PrefixMobileNumber.includes(subPhoneNumber) == false:
            errorsMess = 'Không đúng định dạng đầu số di động';
            break;
    };
    return errorsMess;
}

export const serviceFee = (dataItem, billDebtAmount) => {
    let serviceFee = 0;
    switch (dataItem.ServiceFeeTypeID) {
        case 1:
            serviceFee = 0;
            break;
        case 2:
            serviceFee = dataItem.ServiceFeeAmount;
            break;
        case 3:
            serviceFee = Math.round((dataItem.ServiceFeePercent * billDebtAmount) / 100);
            break;
        case 4:
            serviceFee = dataItem.ServiceFeeAmount + Math.round((dataItem.ServiceFeePercent * billDebtAmount) / 100);
            break;
    }
    return serviceFee;
}



export const supportedTouchID = (name) => {
    let errerrorsMess = '';
    switch (name) {
        case 'LAErrorAuthenticationFailed':
            errerrorsMess = 'Xác thực thất bại vì người dùng cung cấp thông tin xác thực không hợp lệ.';
            break;
        case 'LAErrorUserCancel':
            errerrorsMess = 'Người dùng đã hủy xác thực.';
            break;
        case 'LAErrorUserFallback':
            errerrorsMess = 'Xác thực bị hủy vì người dùng bấm chọn "Quay lại".';
            break;
        case 'LAErrorSystemCancel':
            errerrorsMess = 'Hệ thống đã hủy xác thực.';
            break;
        case 'LAErrorPasscodeNotSet':
            errerrorsMess = 'Thiết bị chưa thiết lập chế độ bảo mật.';
            break;
        case 'LAErrorTouchIDNotAvailable':
            errerrorsMess = 'Thiết bị chưa thiết lập bảo mật sinh trắc học.';
            break;
        case 'LAErrorTouchIDNotEnrolled':
            errerrorsMess = 'Không thể bật xác thực vì thiết bị chưa thiết lập bảo mật sinh trắc học.';
            break;
        case 'RCTTouchIDUnknownError':
            errerrorsMess = 'Không thể xác thực vì lý do không xác định.';
            break;
        case 'RCTTouchIDNotSupported':
            errerrorsMess = 'Thiết bị không hỗ trợ bảo mật sinh trắc học.';
            break;
        default:
            errerrorsMess = 'Không hỗ trợ.';
            break;
    }
    return errerrorsMess;
}
export const supportedTouchIDAndroid = (name) => {
    let errerrorsMess = '';
    switch (name) {
        case 'NOT_SUPPORTED':
            errerrorsMess = 'Thiết bị không hỗ trợ bảo mật sinh trắc học.';
            break;
        case 'NOT_AVAILABLE':
            errerrorsMess = 'Thiết bị chưa thiết lập bảo mật sinh trắc học.';
            break;
        case 'NOT_PRESENT':
            errerrorsMess = 'Không tìm thấy bảo mật sinh trắc học.';
            break;
        case 'NOT_ENROLLED':
            errerrorsMess = 'Chưa thiết lập bảo mật sinh trắc học.';
            break;
        default:
            errerrorsMess = 'Không hỗ trợ.';
            break;
    }
    return errerrorsMess;
}

export const authenticateTouchID = (code) => {
    let errorsMess = '';
    switch (code) {
        case 'AUTHENTICATION_FAILED':
            errorsMess = 'Xác thực thất bại.';
            break;
        case 'USER_CANCELED':
            errorsMess = 'Người dùng đã hủy xác thực.';
            break;
        case 'SYSTEM_CANCELED':
            errorsMess = 'Hệ thống đã hủy xác thực.';
            break;
        case 'NOT_PRESENT':
            errorsMess = 'Phần cứng sinh trắc học không có.';
            break;
        case 'NOT_SUPPORTED':
            errorsMess = 'Thiết bị không hỗ trợ bảo mật sinh trắc học.';
            break;
        case 'NOT_AVAILABLE':
            errorsMess = 'Bảo mật sinh trắc học không tồn tại.';
            break;
        case 'NOT_ENROLLED':
            errorsMess = 'Chưa thiết lập bảo mật sinh trắc học.';
            break;
        case 'TIMEOUT':
            errorsMess = 'Quá thời gian xác thực.';
            break;
        case 'LOCKOUT':
            errorsMess = 'Bảo mật sinh trắc học bị khóa.';
            break;
        case 'LOCKOUT_PERMANENT':
            errorsMess = 'Bảo mật sinh trắc học đã bị khóa vĩnh viễn.';
            break;
        case 'PROCESSING_ERROR':
            errorsMess = 'Phát sinh lỗi trong quá trình xác thực sinh trắc học.';
            break;
        case 'USER_FALLBACK':
            errorsMess = 'Không thể xác thực bằng mật khẩu hình hoặc số.';
            break;
        case 'FALLBACK_NOT_ENROLLED':
            errorsMess = 'Lỗi không xác định.';
            break;
        case 'UNKNOWN_ERROR':
            errorsMess = 'Xác thực bằng sinh trắc học đã bị khóa. Vui lòng xác thực bằng mật khẩu số hoặc hình.';
            break;
    }
    return errorsMess;
}

export const getDisplayDetailModalAlert = (statusID, title, content, type = 'error', action = '') => {
    switch (statusID) {
        case 18:
            title = 'Cảnh báo'
            content = 'Phiên làm việc hết hạn. Vui lòng đăng nhập lại'
            type = 'warning'
            action = '1'
            break;
        case 23:
            title = 'Cảnh báo đăng nhập thiết bị mới'
            content = `Vui lòng xác nhận OTP để thay đổi thiết bị sử dụng tài khoản`
            type = 'warning'
            action = '1'
            break;
        default:

            break;
    }
    return { title, content, action, type }
}