var app = angular.module('ListUserGroupModule', ['ui.select2', 'ui.bootstrap', 'datatables', 'ngSanitize', 'ngFileUpload', 'angularTreeview']);

app.controller('ListUserGroup', function ($scope, $window, $http, $filter, $location) {
    var Config = window.ConfigWeb;
    $scope.UserLogin = window.Account;
    $scope.apiAdmin = Config["Api_Admin"];
    $scope.PageIndex = 1;
    $scope.PageSize = 5;
    $scope.PageIndexGeneral = 1;
    $scope.PageSizeGeneral = 10;
    $scope.listAnnouncementWithGeneral = [];
    $scope.listAnnouncementWithGroup = [];
    $scope.totalcountGeneral = 0;
    $scope.totalcount = 0;
    $scope.listUserGroup = [];
    $scope.tempSearchGroup = 0;
    $scope.DataMedia = [];
    $scope.Noti = [];
    $scope.titleButton = 'Thông báo theo nhóm';
    $scope.Editor = null;
    $scope.searchAnnouncementTitle = null;
    $scope.searchAnnouncementType = null;
    $scope.searchAnnouncementTitleGeneral = null;

    angular.element(document).ready(function () {
        $scope.GetListUserGroup();
        $scope.getAnnouncementGeneral();
    });
    $scope.dtOptions = {
        "bStateSave": true,
        "aLengthMenu": [[10, 20, 100, -1], [10, 20, 100, 'All']],
        "bSort": false,
        "language": window.datatableLanguage,
        paging: false,
        searching: false,
        info: false
    }
    $scope.GetListUserGroup = () => {

        $scope.roleList1 = [];
        let token = window.Account.Token;
        var url = $scope.apiAdmin + "api/Controllers/ManageNotification/GetListUserGroup";
        var config = {
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': token,
                'Allow': $location.absUrl()
            }
        };
        var data = {
            UserGroup: $scope.UserLogin.UserGroup,
            OrganizationID: $scope.UserLogin.organization,
        };
        $http.post(url, data, config)
            .then((response) => {
                if (response.data.data.length > 0) {
                    $scope.roleList = JSON.parse(response.data.data[0].dataJson);
                    $scope.listUserGroup = response.data.data;
                }
                else {
                    toastr.warning("Không có dữ liệu !!");
                }
            },
                function (response) {
                    toastr.warning("Vui lòng kiểm tra lại quyền hạn !!");
                });
    }
    $scope.pagechangedGeneral = () => {
        $scope.getAnnouncementGeneral(null);
    }
    $scope.ViewInPutTotalRowGeneral = () => {
        $scope.PageIndexGeneral = 1;
        $scope.getAnnouncementGeneral(null);
    }
    $scope.getAnnouncementGeneral = () => {
        if (document.getElementById("textRowGe").value != null && document.getElementById("textRowGe").value != '') {
            $scope.PageSizeGeneral = $("#textRowGe").val();
        } else {
            $scope.PageSizeGeneral = 10;
        }
        let token = window.Account.Token;
        var url = $scope.apiAdmin + "api/Controllers/ManageNotification/GetAnnouncementWithGroup";
        var config = {
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': token,
                'Allow': $location.absUrl()
            }
        };
        var data = {
            searchTitle: $scope.searchAnnouncementTitleGeneral,
            UserGroup: 0,
            OrganizationID: $scope.UserLogin.organization,
            Type: 'General',
            PageIndex: $scope.PageIndexGeneral,
            PageSize: $scope.PageSizeGeneral
        };
        $http.post(url, data, config)
            .then((response) => {
                if (response.data.data.length > 0) {
                    $scope.listAnnouncementWithGeneral = response.data.data;
                    $scope.totalcountGeneral = $scope.listAnnouncementWithGeneral[0].totalData;
                } else {
                    $scope.listAnnouncementWithGeneral = null;
                    $scope.totalcountGeneral = 0;
                }
            },
                function (response) {
                    toastr.warning("Vui lòng kiểm tra lại quyền hạn !!");
                });
    }
    $scope.pagechanged = () => {
        $scope.getAnnouncementWithGroup(null);
    }
    $scope.ViewInPutTotalRow = () => {
        $scope.PageIndex = 1;
        $scope.getAnnouncementWithGroup(null);
    }
    $scope.getAnnouncementWithGroup = (data) => {
        $scope.tempSearchGroup = data != null ? parseInt(data.id) : $scope.tempSearchGroup;
        if (document.getElementById("textRow").value != null && document.getElementById("textRow").value != '') {
            $scope.PageSize = $("#textRow").val();
        } else {
            $scope.PageSize = 5;
        }
        let token = window.Account.Token;
        var url = $scope.apiAdmin + "api/Controllers/ManageNotification/GetAnnouncementWithGroup";
        var config = {
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': token,
                'Allow': $location.absUrl()
            }
        };
        var data = {
            searchTitle: $scope.searchAnnouncementTitle,
            Type: $scope.searchAnnouncementType == '' ? null : $scope.searchAnnouncementType,
            UserGroup: $scope.tempSearchGroup,
            OrganizationID: $scope.UserLogin.organization,
            PageIndex: $scope.PageIndex,
            PageSize: $scope.PageSize
        };
        $http.post(url, data, config)
            .then((response) => {
                if (response.data.data.length > 0) {
                    $scope.listAnnouncementWithGroup = response.data.data;
                    $scope.totalcount = $scope.listAnnouncementWithGroup[0].totalData;
                    document.getElementById("announcement").style.display = "block";
                } else {
                    $scope.listAnnouncementWithGroup = null;
                    $scope.totalcount = 0;
                }
            },
                function (response) {
                    toastr.warning("Vui lòng kiểm tra lại quyền hạn !!");
                });
    }
    $scope.ShowModalDetailAnnouncement = (data) => {
        $scope.Noti = data;
        $scope.Noti.announcementTypeSub = $scope.Noti.announcementType == 'General' ? 'Thông báo chung' : 'Thông báo thường'
        $("#modalDetailAnnouncement").show();
    }
    $scope.HideModalDetailAnnouncement = () => {
        $("#modalDetailAnnouncement").hide();
    }
    $scope.changePage = () => {
        if (document.getElementById("generalAnnoucement").style.display == "block") {
            $scope.titleButton = 'Thông báo chung';
            document.getElementById("generalAnnoucement").style.display = "none";
            document.getElementById("groupAnnoucement").style.display = "block";
        }
        else {

            $scope.titleButton = 'Thông báo theo nhóm';
            document.getElementById("generalAnnoucement").style.display = "block";
            document.getElementById("groupAnnoucement").style.display = "none";
        }
    }
});
