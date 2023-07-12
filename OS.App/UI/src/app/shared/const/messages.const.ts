export class AppMessages {
    static readonly C_M_1 = 'Are you sure you want to delete the selected?';
    static readonly C_M_2 = 'Please choose at least one rating to process costing.';
    static readonly C_M_3 = 'Are you sure you want to sign out?';
    static readonly C_M_6 = 'Please choose at least one basic position to process';
    static readonly C_M_7 = 'Please select at least one CMP item for costing TRIM.';
    static readonly C_M_16 = 'Are you sure you want copy this item to create new?';
    static readonly C_M_17 = 'This rating referenced to other fabric, cannot delete!';
    static readonly C_M_18 = 'Are you sure to accept edits for the selected?';
    static readonly C_M_19 = 'Are you sure to submit for the selected?';
    static readonly C_M_20 = 'BẠN MUỐN THAY ĐỔI MÃ & MÀU?';
    static readonly C_M_21 = 'Bạn có chắc chắn muốn đăng xuất không?';

    static readonly NO_INTERNET_CONNECTION = 'No internet connection.';

    static EXISTED_ROW_SELECTION = (fieldName: string, value: string) => `${value} exist in Rating selection list.`;

    static PLEASE_SELECT = (fieldName: string) => `Please select a ${fieldName}.`;

    static PLEASE_SELECT_TO(fieldName: string, toAction: string): string {
        return `Please select a ${fieldName} to ${toAction}.`;
    }
    static PLEASE_ENTER = (fieldName: string, titleOfToast = 'Please enter') => `${titleOfToast} ${fieldName}.`;

    static PLEASE_ENTER_TO = (fieldName: string, toAction: string) => `Please enter ${fieldName} to ${toAction}.`;
    static PLEASE_CHOOSE_TO(fieldName: string, toAction: string): string {
        return `Please choose at least one ${fieldName} to ${toAction}.`;
    }
    static FIELD_INCORRECT = (fieldName: string) => `${fieldName} incorrect`;
    static ACTION_SUCCESS = (action: string) => `${action} thành công`;
}
