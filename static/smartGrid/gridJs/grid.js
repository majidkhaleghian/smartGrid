﻿
var application = angular.module('application', []);
// #region Directives

// #region Directive: Grid Main Content
application.directive('smartGridcomplist', function () {
    return {
        restrict: 'E',
        templateUrl: '../smartGrid/gridDirectives/gridCompListDir.html',
    };
});
// #endregion

// #region Directive: Grid Footer

application.directive('smartGridcompfooter', function () {
    return {
        restrict: 'E',
        templateUrl: '../smartGrid/gridDirectives/gridCompFooter.html',
    };
});
// #endregion

// #region Other Directives
application.directive('integerOnly', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                if (text) {
                    var transformedInput = text.replace(/[^0-9]/g, '');

                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                return undefined;
            }
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});

application.directive('focusOn', function ($timeout) {
    return function (scope, element, attrs) {
        scope.$on(attrs.focusOn, function (e) {
            $timeout(function () {
                element[0].focus();
            });
        });
    };
});
// #endregion

// #endregion

// #region Main Factory
application.factory('gridFactory', ['$http', function ($http) {

    var srv = {};

    srv.myFunc = function (scope, gridColOptionsArray, gridServOption, callback) {

        // #region Prapare
        delete localStorage.currentEnterd;
        // #endregion

        // #region Variables

        scope.openCloseSettingFlag = false;
        scope.filterFlag = gridServOption.filterFlag;
        scope.settingFlag = gridServOption.settingFlag;
        scope.selectAllFlag = gridServOption.selectAllFlag;
        scope.checkBoxForRowFlag = gridServOption.checkBoxForRowFlag;
        scope.detailBtnFlag = gridServOption.detailBtnFlag;
        scope.detailBtnActionFlag = gridServOption.detailBtnActionFlag;
        scope.showHideAttchmentFlag = gridServOption.showHideAttchmentFlag;
        scope.detailBtnActionEditFlag = gridServOption.detailBtnActionEditFlag;
        scope.deleteBtnActionFlag = gridServOption.deleteBtnActionFlag;

        scope.checkLblForRowFlag = gridServOption.checkLblForRowFlag;
        scope.defaultDetailBtnSize = gridDefaultOptions.defaultDetailBtnSize;
        scope.defaultBigDetailBtnSize = gridDefaultOptions.defaultBigDetailBtnSize;
        scope.defaultActionColSize = gridServOption.bigGrid ? gridDefaultOptions.defaultActionColSizeBigGrid : gridDefaultOptions.defaultActionColSize;
        scope.defaultSelectAllBtnSize = gridDefaultOptions.defaultSelectAllBtnSize;
        scope.SortFields = gridServOption.SortFields;
        scope.searchData = gridServOption.searchData;
        scope.gridName = gridServOption.gridName;

        //for show more info on grid 
        scope.moreInfoPlace = gridServOption.moreInfoPlace;
        scope.gridMoreInfoArray = gridServOption.gridMoreInfoArray;

        scope.gridSearchArray = gridServOption.gridAdvancedSearchArray;
        angular.forEach(scope.gridSearchArray, function (advVal, advKey) {
            advVal.displayName = convertDisplayNameToFarsi(advVal.fieldName, scope.publicDisplayNames, scope.gridName);
        });
        scope.fillMoreInfoArray = [];

        //scope.pageSize = gridServOption.pageSize;
        if (localStorage.getItem("_EditStoredInfo_" + scope.gridName)) {
            if (localStorage.getItem("_EditStoredInfo_" + scope.gridName) !== undefined) {
                scope.pageSize = JSON.parse(localStorage.getItem('_EditStoredInfo_' + scope.gridName)).pageSize;
                scope.x = {};
                scope.x.pageSize = (scope.pageSize).toString();
            } else
                scope.pageSize = (scope.x !== undefined) ? scope.x.pageSize : gridServOption.pageSize;
        } else
            scope.pageSize = (scope.x !== undefined) ? scope.x.pageSize : gridServOption.pageSize;

        scope.goPage = 1;
        scope.pageNumber = gridServOption.pageNumber;
        scope.searchSrv = gridServOption.searchSrv;
        scope.icClicentGridData = gridServOption.icClicentGridData;
        scope.showDataItemListName = gridServOption.showDataItemListName;
        scope.filterExample = gridServOption.filterExample;
        scope.gridType = gridServOption.gridType;
        scope.selectClass;
        scope.totalCount;
        scope.defaultTinyColSize = gridServOption.bigGrid ? gridDefaultOptions.defaultTinyColSizeBigGrid : gridDefaultOptions.defaultTinyColSize;
        scope.defaultColSize = gridServOption.bigGrid ? gridDefaultOptions.defaultColSizeBigGrid : gridDefaultOptions.defaultColSize;
        scope.desiredButsItems = [];
        scope.publicDisplayNames = gridServOption.publicDisplayNames;

        scope.bigGrid = gridServOption.bigGrid;
        if (gridServOption._showPageSize == undefined)
            scope._showPageSize = true;
        else
            scope._showPageSize = gridServOption._showPageSize;

        if (gridServOption.extraCol !== undefined)
            scope.extraCol = gridServOption.extraCol;
        else
            scope.extraCol = false;

        scope.tinyColumnsSize = 0;
        scope.tinyActionColumnsSize = 0;
        if (scope.detailBtnActionFlag) {
            scope.tinyColumnsSize += parseInt(scope.defaultActionColSize);
            scope.tinyActionColumnsSize += parseInt(scope.defaultActionColSize);
        }
        if (scope.showHideAttchmentFlag) {
            scope.tinyColumnsSize += parseInt(scope.defaultActionColSize);
            scope.tinyActionColumnsSize += parseInt(scope.defaultActionColSize);
        }

        if (scope.detailBtnActionEditFlag) {
            scope.tinyColumnsSize += parseInt(scope.defaultActionColSize);
            scope.tinyActionColumnsSize += parseInt(scope.defaultActionColSize);
        }
        //if (scope.detailBtnFlag) {
        //    if (scope.gridType && scope.gridType === gridDefaultOptions.defaultBIG) {
        //        scope.tinyColumnsSize += parseInt(scope.defaultBigDetailBtnSize);
        //        scope.tinyActionColumnsSize += parseInt(scope.defaultBigDetailBtnSize);
        //    } else {
        //        scope.tinyColumnsSize += parseInt(scope.defaultDetailBtnSize);
        //        scope.tinyActionColumnsSize += parseInt(scope.defaultDetailBtnSize);
        //    }
        //}
        if (scope.selectAllFlag) {
            scope.tinyColumnsSize += parseInt(scope.defaultSelectAllBtnSize);
        }
        if (scope.deleteBtnActionFlag) {
            scope.tinyColumnsSize += parseInt(scope.defaultActionColSize);
            scope.tinyActionColumnsSize += parseInt(scope.defaultDetailBtnSize);
        }
        angular.forEach(gridServOption.desiredButtonsItems, function (val, key) {
            var desiObj = {
            };
            desiObj.icon = val;
            desiObj.title = getDesiTitle(desiObj.icon);
            desiObj.titleTxt = getDesiTitleTxt(desiObj.icon);
            scope.desiredButsItems.push(desiObj);
            scope.tinyColumnsSize += parseInt(scope.defaultActionColSize);
            scope.tinyActionColumnsSize += parseInt(scope.defaultActionColSize);
        });
        scope.tinyColumnsFlag = false;

        if (scope.tinyActionColumnsSize !== 0)
            scope.tinyColumnsFlag = true;



        scope.colorSelected = gridServOption.colorSelected;
        scope.showHideType = gridServOption.showHideType;

        scope.showOrNoDesiIcon = gridServOption.showOrNoDesiIcon;

        //scope.multiGridInPage = gridServOption.multiGridInPage;
        //scope.currentGridDataPlace = gridServOption.currentGridDataPlace;

        var countSelect = 0;
        scope.searchObj = new Object();
        var Data = [];

        scope.pagination = {
            last: gridServOption.pageSize + 1,
            currentPage: gridServOption.pageNumber + 1
        };

        scope.tagListFieldSearch = [];
        scope.selectedSearchField = '';
        scope.selectedTag = '';
        // #endregion

        // #region Search

        scope.selectSearchField = function (selectedSearchField) {

            if (selectedSearchField === '') {
                scope.isSearchField = false;
                return;
            }
            scope.isSearchField = true;
            scope.selectedTag = '';
            angular.forEach(scope.gridSearchArray, function (seVal, seKey) {
                if (seVal.displayName === selectedSearchField)
                    scope.selectedSearchField = seVal;
            });

        };

        scope.addSearchTag = function (selectedTag) {
            scope.isSearchField = false;
            scope.searchData[scope.selectedSearchField.fieldName] = selectedTag;
            var searchObj = {
                [scope.selectedSearchField.fieldName]: selectedTag,
                'fieldName': scope.selectedSearchField.fieldName,
                'selectedTag': selectedTag,
                'displayName': convertDisplayNameToFarsi(scope.selectedSearchField.fieldName, scope.publicDisplayNames, scope.gridName)
            };
            scope.selectedTag = selectedTag;

            if (scope.tagListFieldSearch.length > 0) {
                var keepGoing = true;
                angular.forEach(scope.tagListFieldSearch, function (val, key) {
                    if (keepGoing) {
                        if (val.fieldName !== searchObj.fieldName) {
                            scope.tagListFieldSearch.push(searchObj);
                            keepGoing = false;
                        }
                        else {
                            scope.tagListFieldSearch.splice(scope.tagListFieldSearch.indexOf(val), 1);
                            scope.tagListFieldSearch.push(searchObj);
                        }

                    }
                });
            } else
                scope.tagListFieldSearch.push(searchObj);
        };

        scope.removeSearchTag = function (selectedTag) {
            scope.tagListFieldSearch.splice(scope.tagListFieldSearch.indexOf(selectedTag), 1);
            scope.searchData[selectedTag.fieldName] = null;
            localStorage.removeItem("_EditStoredInfo_" + scope.gridName);
            scope.setCurrent(0, 'pagination', callback);
        };

        scope.enterSearch = function (colType, colSearch) {
            var searchFields = [];

            localStorage.setItem('currentEnterd', colType);
            $("div.searchAria input.gridInputDefaultSearch_" + scope.gridName).each(function () {
                if (searchFields.indexOf($(this).attr('data-search')) === -1) {
                    searchFields.push($(this).attr('data-search'));
                    if ($(this).attr('data-search') != undefined) {
                        if (scope.filterExample)
                            (scope.searchData[scope.filterExample])[$(this).attr('data-search')] = $(this)[0].value === '' ? null : $(this)[0].value;
                        else
                            scope.searchData[$(this).attr('data-search')] = $(this)[0].value === '' ? null : $(this)[0].value;
                    }
                    else {
                        if (scope.filterExample)
                            (scope.searchData[scope.filterExample])[$(this).attr('id')] = $(this)[0].value === '' ? null : $(this)[0].value;
                        else
                            scope.searchData[$(this).attr('id')] = $(this)[0].value === '' ? null : $(this)[0].value;
                    }
                }
            });
            if (colType == 'status') {
                $("div.searchAria select.gridInputDefaultSearch_" + scope.gridName).each(function () {

                    if ($(this).attr('data-search') != undefined) {
                        //$scope.prop.value = 'Service 1'
                        //if ($(this)[0].label != '? string:f_status ?')

                        if (scope.filterExample) {
                            if (colSearch.isDropDownSearch.value === 'همه') {
                                (scope.searchData[scope.filterExample])[$(this).attr('data-search')] = null;
                            } else {
                                (scope.searchData[scope.filterExample])[$(this).attr('data-search')] = colSearch.isDropDownSearch.value;
                            }
                        }
                        else {
                            if (colSearch.isDropDownSearch.value === 'همه') {
                                scope.searchData[$(this).attr('data-search')] = null;
                            } else {
                                scope.searchData[$(this).attr('data-search')] = colSearch.isDropDownSearch.value;
                            }
                        }
                    }
                    //else {
                    //    if (scope.filterExample)
                    //        (scope.searchData[scope.filterExample])[$(this).attr('id')] = $(this)[0].value;
                    //    else
                    //        scope.searchData[$(this).attr('id')] = $(this)[0].value;
                    //}

                });
            }
            scope.setCurrent(0, 'pagination', callback);

        };

        scope.clearSearchAria = function () {

            localStorage.removeItem("_EditStoredInfo_" + scope.gridName);

            $("div.searchAria input.gridInputDefaultSearch_" + scope.gridName).each(function () {
                $(this)[0].value = '';

                if ($(this).attr('data-search') != undefined) {
                    if (scope.filterExample)
                        (scope.searchData[scope.filterExample])[$(this).attr('data-search')] = $(this)[0].value;
                    else {
                        if (scope.gridName === 'gridMyRequests') {
                            scope.searchData[$(this).attr('data-search')] = null;
                        } else {

                            scope.searchData[$(this).attr('data-search')] = $(this)[0].value;
                        }
                    }
                }
                else {
                    if (scope.filterExample)
                        (scope.searchData[scope.filterExample])[$(this).attr('id')] = $(this)[0].value;
                    else
                        scope.searchData[$(this).attr('id')] = $(this)[0].value;
                }

            });
            scope.setCurrent(scope.pageNumber, 'pagination', callback);
        };

        // #endregion

        // #region Paging

        // #region Get Paging Information
        scope.getPaging = function (dataLength, pageSize, pageNumber) {
            //how much items per page to show  


            var show_per_page = pageSize;
            //getting the amount of elements inside content div  
            var number_of_items = dataLength;
            //calculate the number of pages we are going to have  
            var number_of_pages = Math.ceil(number_of_items / show_per_page);
            scope.number_of_pages = number_of_pages;
            scope.pagination.last = number_of_pages;
            scope.pages = [];
            if (pageNumber < 5)
                pageNumber = 0;
            var current_link = pageNumber;
            //if (current_link != 1)
            //    current_link -= 1;
            // var pageCount = new Object();
            if (number_of_pages <= 5) {
                while (number_of_pages > current_link) {

                    current_link++;
                    scope.pages.push(current_link);
                }
            } else {
                if (5 > current_link) {
                    while (5 > current_link) {
                        if (current_link < number_of_pages) {
                            current_link++;
                            scope.pages.push(current_link);
                        }
                    }
                    scope.pages.push('...');
                    scope.pages.push(scope.pagination.last);
                }
                else {
                    if (number_of_pages > pageNumber) {
                        {
                            while (5 + pageNumber > current_link) {
                                if (current_link <= number_of_pages) {
                                    scope.pages.push(current_link);
                                    current_link++;
                                } else {
                                    return;
                                }
                            }
                            if (current_link < number_of_pages) {

                                scope.pages.push('...');
                                scope.pages.push(scope.pagination.last);
                            }
                        }
                    }
                }
            }
            //var myEl = angular.element(document.querySelector('.myActive' + pageNumber));
            //myEl.addClass(scope.selectClass);

        };
        // #endregion

        scope.goPrevPage = function (pgNum, type) {
            //localStorage.removeItem("_EditStoredInfo_" + scope.gridName);
            //scope.setStorage(pgNum);
            scope.setCurrent(pgNum, type, callback);
        };

        scope.goNextPage = function (pgNum, type) {
            //localStorage.removeItem("_EditStoredInfo_" + scope.gridName);
            //scope.setStorage(pgNum);
            scope.setCurrent(pgNum, type, callback);
        };

        scope.goToPage = function () {
            if (parseInt(scope.goPage) > scope.pagination.last)
                scope.goPage = scope.pagination.last;
            if (parseInt(scope.goPage) < 1)
                scope.goPage = 1;

            //localStorage.removeItem("_EditStoredInfo_" + scope.gridName);
            //scope.setStorage(parseInt(scope.goPage) - 1);

            scope.setCurrent(parseInt(scope.goPage) - 1, 'pagination', callback);
        };

        scope.changePageSize = function (changePageSize) {

            scope.pageSize = parseInt(changePageSize);
            scope.pageNumber = 0;
            //localStorage.removeItem("_EditStoredInfo_" + scope.gridName);
            //scope.setStorage(scope.requestObj.pageNumber, scope.requestObj);
            scope.setCurrent(scope.pageNumber, 'pagination', callback);
        };

        // #endregion

        // #region Create Grid Data
        scope.createGridData = function (pageNumber) {

            scope.keysArrayPlus = new Array();

            if (($.grep(gridColOptionsArray, function (e) { return e.fieldName == '_id'; })).length == 0)
                gridColOptionsArray.push({ 'fieldName': '_id', 'colPriority': 0, 'colSize': scope.defaultTinyColSize });

            for (var iKArr = 0; iKArr < gridColOptionsArray.length; iKArr++)
                scope.keysArrayPlus.push(gridColOptionsArray[iKArr].fieldName);


            scope.gridKey = srv.getObjectTitleAndOptions(scope.keysArrayPlus, gridColOptionsArray, '', scope);

            scope.gridData = [];
            var startNo = (scope.pageSize * (pageNumber));
            var endNo = scope.pageSize;
            if (pageNumber != 0) {
                startNo = (scope.pageSize * (pageNumber - 1)) + 1;
                endNo = (scope.pageSize * pageNumber);
            }
            //if (Data.length < endNo)
            //    endNo = Data.length;
            for (var k = 0 ; k < endNo; k++) {
                var myObj = new Array();
                var colObj = new Object();
                if (Data[k] != undefined) {
                    if (pageNumber == 0)
                        Data[k]._id = k + 1;
                    else
                        Data[k]._id = k + (pageNumber * scope.pageSize) + 1;

                    var fields = Data[k];

                    for (var i = 0 ; i < scope.gridKey.length ; i++) {
                        var ob = new Object();


                        if (fields[scope.gridKey[i].name] != undefined)
                            ob.fieldName = fields[scope.gridKey[i].name];
                        else
                            ob.fieldName = '-';

                        ob.celFieldName = ob.fieldName;
                        if (ob.fieldName.length > 100) {
                            ob.celFieldName = ob.fieldName.slice(0, 100);
                        }

                        if (scope.gridKey[i].showHideFlg != undefined)
                            ob.showHideFlg = true;
                        else
                            ob.showHideFlg = false;

                        if (scope.gridKey[i].fieldIsDropDown != undefined)
                            ob.fieldIsDropDown = scope.gridKey[i].fieldIsDropDown;
                        else
                            ob.fieldIsDropDown = false;
                        if (ob.fieldIsDropDown) {

                            if (scope.gridKey[i].dropDownType === 'Number') {
                                ob.fieldIsDropDownArr = {
                                };
                                ob.fieldIsDropDownArr.values = [];
                                if (ob.fieldName !== '-') {
                                    for (var iDrp = 1 ; iDrp <= ob.fieldName ; iDrp++) {
                                        var obj = {
                                        };
                                        obj = iDrp;
                                        ob.fieldIsDropDownArr.values.push(obj);
                                    }
                                    //if (ob.fieldIsDropDownArr)
                                    //    ob.fieldIsDropDownArr.value = ob.fieldName;
                                }
                            }
                        }

                        if (scope.gridKey[i].keepOldVal) {
                            if (scope.keepOldVal)
                                if (fields[scope.gridKey[i].keepOldVal])
                                    if (scope.keepOldVal(fields[scope.gridKey[i].keepOldVal])) {
                                        ob.fieldName = scope.keepOldVal(fields[scope.gridKey[i].keepOldVal]);
                                        if (ob.fieldIsDropDownArr) {
                                            ob.fieldIsDropDownArr.value = ob.fieldName;
                                            fields['extraField'] = scope.getExtraField(ob.fieldIsDropDownArr.value, fields);
                                        }
                                    }
                        }
                        ob.filedSize = scope.gridKey[i].colSize;
                        ob.fieldType = scope.gridKey[i].name;
                        ob.searchInpType = scope.gridKey[i].searchInpType;

                        // if (scope.filterExample) {
                        if (scope.gridKey[i].isDropDownSearch)
                            scope.gridKey[i].isDropDownSearch.value = scope.searchData[scope.gridKey[i].fildSearch];
                            //    else
                            //        scope.gridKey[i].searchVal = scope.gridKey[i].searchVal = (scope.searchData[scope.filterExample])[scope.gridKey[i].fildSearch];
                            //}
                        else {
                            scope.gridKey[i].searchVal = scope.searchData[scope.gridKey[i].fildSearch];
                        }

                        var sortIcon = gridDefaultOptions.defaultSortIcon;
                        var sortType = 'none';
                        scope.gridKey[i].sortIcon = sortIcon;
                        scope.gridKey[i].sortType = sortType;
                        scope.gridKey[i].selectCls = '';

                        if (scope.gridKey[i].sortField == scope.SortFields.orderName) {
                            scope.gridKey[i].sortType = scope.SortFields.sortType;
                            switch (scope.gridKey[i].sortType) {
                                case 'none':
                                    scope.gridKey[i].sortIcon = gridDefaultOptions.defaultSortIcon;
                                    break;
                                case 'desc':
                                    scope.gridKey[i].sortIcon = gridDefaultOptions.downSortIcon;
                                    break;
                                case 'asc':
                                    scope.gridKey[i].sortIcon = gridDefaultOptions.upSortIcon;
                                    break;
                                default:
                                    scope.gridKey[i].sortIcon = gridDefaultOptions.defaultSortIcon;
                                    break;
                            }
                            scope.gridKey[i].selectCls = 'select';
                        }
                        //Just for Adonis request

                        if (Data[k][scope.colorSelected] < 50)
                            fields['colorSelected'] = 'succesSelect';
                        if (50 < Data[k][scope.colorSelected] < 75)
                            fields['colorSelected'] = 'yellowSelect';
                        if (75 < Data[k][scope.colorSelected] < 100)
                            fields['colorSelected'] = 'warningSelect';
                        if (Data[k][scope.colorSelected] > 100)
                            fields['colorSelected'] = 'stopSelect';
                        else
                            fields['colorSelected'] = '';

                        if (scope.showHideType != undefined) {
                            if (Data[k][scope.showHideType] == 1)
                                fields['showHideType'] = true;
                            else
                                fields['showHideType'] = false;
                        } else {
                            fields['showHideType'] = true;
                        }

                        //Just for Adonis request
                        ob.obj = fields;
                        myObj.push(ob);
                    }

                    scope.gridData.push(myObj);



                }

            };

            //if (scope.multiGridInPage)
            //    scope.currentGridDataPlace = scope.gridData;
        };


        // #endregion
        
        // #region Set LocalStorage
        scope.setStorage = function (pageNumber, currentGridInfo) {

            if (currentGridInfo === null ||
                currentGridInfo === "null" ||
                currentGridInfo === undefined) {

                var editStoredInfo = {};
                editStoredInfo = scope.searchData;

                editStoredInfo.pageNumber = pageNumber;
                editStoredInfo.pageSize = scope.pageSize;

                localStorage.setItem("_EditStoredInfo_" + scope.gridName, JSON.stringify(editStoredInfo));
            } else {
                var editStoredInfo = {};

                editStoredInfo = currentGridInfo;

                editStoredInfo.pageNumber = pageNumber;
                editStoredInfo.pageSize = scope.pageSize;

                localStorage.setItem("_EditStoredInfo_" + scope.gridName, JSON.stringify(editStoredInfo));

            }
        };
        // #endregion

        // #region Load-Set Current Data
        scope.setCurrent = function (pageNumber, type, callback) {
            //if (scope.pagination.last == pageNumber + 1 || scope.pagination.last == pageNumber)
            //    $("li.arrowLeft").hide();
            if (scope.pagination.last === pageNumber && type === 'pagination')
                return;
            if (pageNumber > -1) {

                if (type != 'pagination') {
                    if (pageNumber != 0)
                        pageNumber -= 1;
                    //
                    //countSelect = (countSelect % scope.pageSize) + scope.pageSize;
                }
                scope.pageNumber = pageNumber;
                var obj = {};

                if (scope.searchSrv === 'SERVICE_CLIENT_IC_GRID') {
                    viewData = scope.icClicentGridData;

                    Data = viewData;

                    if (callback)
                        callback(viewData);
                    if (scope.getDataCallback)
                        scope.getDataCallback(viewData);//this methode for get data to my controller

                    scope.totalCount = parseInt(viewData.length);

                    if (scope.totalCount != 0) {
                        // scope.getPaging(scope.totalCount, scope.pageSize, scope.pageNumber);
                        if (scope.pagination.last < pageNumber)
                            return;
                        if (pageNumber == '...')
                            return;

                        if (type == 'pagination')
                            if (document.getElementsByClassName('myActive' + pageNumber).length == 0)
                                scope.getPaging(scope.totalCount, scope.pageSize, pageNumber);

                        scope.createGridData(pageNumber);


                        setTimeout(function () {
                            //if (pageNumber == 0)
                            pageNumber += 1;
                            scope.pagination.currentPage = pageNumber;
                            scope.pagination.last = scope.number_of_pages;

                            angular.forEach(document.querySelectorAll('.page'), function (item) {
                                angular.element(item).removeClass('select')
                            });

                            $("ul.paging li." + scope.gridName).each(function () {
                                $(this).removeClass('select')

                            });
                            $(".current" + pageNumber + scope.gridName).addClass('select');


                            $("div.searchAria input.gridInputDefaultSearch_" + scope.gridName).each(function (element) {

                                if ($(this)[0].id === localStorage.getItem('currentEnterd')) {
                                    if ($(this).val() !== '') {
                                        $(this).focus();
                                    }
                                }
                            });
                        }, 200);

                    }
                    else {
                        scope.gridData = [];
                    }
                }
                else {
                    if (type === '') {
                        localStorage.removeItem("_EditStoredInfo_" + scope.gridName);
                    }
                    var currentGridInfo;
                    if (localStorage.getItem("_EditStoredInfo_" + scope.gridName)) {

                        currentGridInfo = JSON.parse(localStorage.getItem("_EditStoredInfo_" + scope.gridName));
                        if (scope.moreInfoPlace) {
                            angular.forEach(scope.gridSearchArray, function (v1, k1) {
                                angular.forEach(currentGridInfo, function (v2, k2) {
                                    if (v1.fieldName === k2) {
                                        v1.selectedTag = currentGridInfo[k2];
                                        scope.tagListFieldSearch.push(v1);
                                    }
                                });
                            });
                        }

                        scope.searchData = JSON.parse(JSON.stringify(currentGridInfo));
                        obj = JSON.parse(JSON.stringify(currentGridInfo));

                        //if (type === '')
                        //    scope.setStorage(obj.pageNumber,obj);
                    }
                    else {
                        obj = scope.searchData;
                        obj.pageNumber = pageNumber;
                        obj.pageSize = scope.pageSize;

                    }

                    localStorage.removeItem("_EditStoredInfo_" + scope.gridName);

                    scope.requestObj = JSON.parse(JSON.stringify(obj));
                    scope.pageSize = scope.requestObj.pageSize;
                    pageNumber = scope.requestObj.pageNumber;
                    $http.post(scope.searchSrv, scope.requestObj, function (viewData) {
                        if (scope.showDataItemListName)
                            Data = viewData.resultSet[scope.showDataItemListName];
                        else
                            Data = viewData.resultSet;


                        if (viewData.result)
                            if (viewData.result.callback)
                                scope.totalCount = parseInt(viewData.result.callback);
                            else
                                scope.totalCount = gridDefaultOptions.defaultTotalCount;
                        else
                            scope.totalCount = Data.length;
                        if (scope.totalCount != 0) {
                            // scope.getPaging(scope.totalCount, scope.pageSize, scope.pageNumber);

                            //if (scope.pagination.last < pageNumber)
                            //    return;
                            //if (pageNumber == '...')
                            //    return;


                            if (type == 'pagination')
                                if (document.getElementsByClassName('myActive' + pageNumber).length == 0)
                                    scope.getPaging(scope.totalCount, scope.pageSize, pageNumber);

                            scope.createGridData(pageNumber);


                            setTimeout(function () {
                                pageNumber += 1;
                                scope.pagination.currentPage = pageNumber;
                                scope.$apply(function () {
                                    scope.goPage = scope.pagination.currentPage;
                                });

                                $("._goTo")[0].value = scope.goPage;
                                scope.pagination.last = scope.number_of_pages;

                                if (scope.pagination.last < pageNumber)
                                    return;
                                if (pageNumber == '...')
                                    return;

                                angular.forEach(document.querySelectorAll('.page'), function (item) {
                                    angular.element(item).removeClass('select');
                                });

                                $("ul.paging li." + scope.gridName).each(function () {
                                    $(this).removeClass('select')

                                });
                                $(".current" + pageNumber + scope.gridName).addClass('select');

                                if (scope.requestObj) {
                                    var objArr = Object.keys(scope.requestObj);
                                    angular.forEach(objArr, function (val, key) {
                                        $("div.searchAria input.gridInputDefaultSearch_" + scope.gridName).each(function () {

                                            if ($(this)[0].id === val) {

                                                if (scope.requestObj[val] &&
                                                     scope.requestObj[val] !== '') {
                                                    $(this)[0].value = scope.requestObj[val];

                                                }
                                            }

                                        });
                                    });
                                }
                            }, 200);

                        }
                        else {
                            scope.gridData = [];
                        }



                        if (callback)
                            callback(viewData.resultSet);
                        if (scope.getDataCallback)
                            scope.getDataCallback(viewData);//this methode for get data to my controller

                    });
                }
            }
        };


        // #endregion

        // #region Gird With Checkbox Oparations

        var tmpSelect = [];

        scope.checkAll = function ($event) {

            var checkbox = $event.target;
            var action = (checkbox.checked ? 'add' : 'remove');
            switch (action) {
                case 'add': {
                    scope.selectedAll = true;
                    break;
                }
                case 'remove': {
                    scope.selectedAll = false;
                    break;
                }
                default:
                    break;
            }
            angular.forEach(scope.gridData, function (item) {

                item.Selected = scope.selectedAll;

                if (item.Selected)
                    scope.selectGridRow(item[0].obj, true);
                else
                    scope.selectGridRow(item[0].obj, false);
            });
            if (scope.checkAllImpl)
                scope.checkAllImpl(scope.selectedAll);
        };
        
        scope._isSelected = function (rowData) {

            var flg = scope.isSelected(rowData[0].obj);
            if (tmpSelect.indexOf(rowData[0].obj.id) === -1 && flg) {
                tmpSelect.push(rowData[0].obj.id);
                countSelect = tmpSelect.length;
            }
            else if (tmpSelect.indexOf(rowData[0].obj.id) !== -1 && flg) {
                //   countSelect += 1;
            }
            else if (tmpSelect.indexOf(rowData[0].obj.id) !== -1 && !flg) {

                tmpSelect.splice(tmpSelect.indexOf(rowData[0].obj.id), 1);
                //countSelect -= 1;
            }

            return flg;
        };

        scope._updateSelection = function ($event, rowData) {

            scope.$broadcast('isOpen');//focus
            var checkbox = $event.target;
            var action = (checkbox.checked ? 'add' : 'remove');

            switch (action) {
                case 'add': {
                    rowData.Selected = true;
                    countSelect++;
                    scope.selectGridRow(rowData[0].obj, true);
                    break;
                }
                case 'remove': {

                    rowData.Selected = false;
                    if (countSelect > 0)
                        countSelect--;
                    scope.selectGridRow(rowData[0].obj, false);
                    break;
                }
                default:
                    break;
            }
            //for (iC = 0 ; iC < scope.gridData.length ; iC++) {
            //    if (scope.gridData[iC].Selected)
            //        countSelect++;
            //}

            if (countSelect !== 0 && countSelect % scope.pageSize === 0)
                scope.selectedAll = true;
            else
                scope.selectedAll = false;
        };

        // #endregion

        // #region Sorting
        scope._doSort = function (col) {

            //alert(col.id);
            var sortField = col.sortField;
            if (col.sortIcon == gridDefaultOptions.defaultSortIcon) {
                col.sortIcon = gridDefaultOptions.downSortIcon;
                scope.SortFields.sortType = 'asc';
            }
            else if (col.sortIcon == gridDefaultOptions.downSortIcon) {
                col.sortIcon = gridDefaultOptions.upSortIcon;
                scope.SortFields.sortType = 'none';
            }
            else if (col.sortIcon == gridDefaultOptions.upSortIcon) {
                col.sortIcon = gridDefaultOptions.defaultSortIcon;
                scope.SortFields.sortType = 'desc';
            }

            scope.SortFields.orderName = sortField;

            //  scope.searchData.pagination = getPaginationObject(paginationObject.pageNumber, paginationObject.pageSize);

            if (!(scope.SortFields.sortType == "none"))
                scope.searchData.orderInfo = getSortList(sortField, scope.SortFields.sortType);
            else
                scope.searchData.orderInfo = null;

            // function on the asnad2_Utils.js
            //  setSortOption(scope.searchData.pagination);
            scope.setCurrent(scope.pageNumber, 'pagination', callback);
        };


        // #endregion

        // #region Actions (Edit/Detail/Desier/Delete)
        scope._doEdit = function (rowData) {
            scope.setStorage(scope.requestObj.pageNumber, scope.requestObj);
            scope.editActionBtn(rowData[0].obj);
        };

        scope._doDetail = function (rowData) {
            scope.setStorage(scope.requestObj.pageNumber, scope.requestObj);
            if (scope.doDetail)
                scope.doDetail(rowData[0].obj);
        };

        scope.desiAction = function (desiIcon, desiItem) {
            scope.setStorage(scope.requestObj.pageNumber, scope.requestObj);
            scope.doDesies(desiIcon, desiItem[0].obj);
        };

        scope.deletAction = function (deleteElm) {
            scope.deletActionBtn(deleteElm[0].obj);
        };

        // #region Old Version

        //scope.editAction = function (editElem) {
        //    scope.setStorage(scope.requestObj.pageNumber, scope.requestObj);
        //    scope.editActionBtn(editElem[0].obj);
        //};

        //scope.viewDetail = function (detailElm) {
        //    scope.setStorage(scope.requestObj.pageNumber, scope.requestObj);
        //    scope.viewDetailBtn(detailElm[0].obj);
        //};

        // #endregion

        // #endregion

        // #region Select Row (Change Skin)
        scope.selectRoww = function (selectElm, that) {

            $("ul[data-gridName='" + scope.gridName + "'] li.roww").each(function () {
                $(this).removeClass('select');
            });
            $("ul[data-gridName='" + scope.gridName + "'] li[data-id='" + selectElm[0].obj._id + "']").addClass('select');
            if (scope._selectRoww)
                scope._selectRoww(selectElm[0].obj, scope.gridName);

        };
        // #endregion

        // #region Grid with Dropdowns in Cells

        scope.selectDrpOpt = function (selectedDropDownField, selectedOptData) {
            if (scope.selectDropDownOption)
                scope.selectDropDownOption(selectedDropDownField, selectedOptData[0].obj);
        };

        // #endregion

        // #region Extra

        //scope.toTrustedHTML = function (html) {
        //    return sce.trustAsHtml(html.toString());
        //}

        // #region Advance Search (Extra)
        scope.advanceSearch = function () {
            localStorage.removeItem("_EditStoredInfo_" + scope.gridName);
            scope.setCurrent(0, 'pagination', callback);
        };
        // #endregion

        // #region Settings (Extra)
        scope.openCloseSettingClick = function () {
            if (scope.openCloseSettingFlag)
                scope.openCloseSettingFlag = false;
            else
                scope.openCloseSettingFlag = true;
        };
        // #endregion

        // #region Collaps (Extra)
        scope.openCollaps = function (rowData) {

            var rowID = rowData._id;

            if ($(document).find("#collaps_" + rowID).length === 0) {
                scope.fillMoreInfoArray = [];
                //load more info array
                angular.forEach(scope.gridMoreInfoArray, function (moreVal, moreKey) {
                    var moreInfoObj = {};
                    moreInfoObj.displayName = convertDisplayNameToFarsi(moreVal.fieldName, scope.publicDisplayNames, scope.gridName);
                    moreInfoObj.fieldName = rowData[moreVal.fieldName];
                    scope.fillMoreInfoArray.push(moreInfoObj);
                });

                var tmpl = '<ul class="collapsUl-bg" id="collaps_' + rowID + '">';

                angular.forEach(scope.fillMoreInfoArray, function (moreVal, moreKey) {
                    tmpl += '<li class="roww rowInf">' + moreVal.displayName + " : " + moreVal.fieldName + '</li>';
                });

                tmpl += '</ul>';

                $("ul[data-gridName='" + scope.gridName + "'] li[data-id='" + rowID + "']").append(tmpl);
            } else {
                $("#collaps_" + rowID).remove();
            }
        };
        // #endregion


        // #endregion
        
        scope.setCurrent(scope.pageNumber, 'pagination', callback);
    },

    srv.columnSizeCheker = function (finalArray, gridName, scope) {
        scope.allColumnsCount = finalArray.length;
        scope.allColumnsSize;

        scope.smalColumns = {
            'columnsCount': 0,
            'columnsSize': 0
        };

        scope.largColumns = {
            'columnsCount': 0,
            'columnsSize': 0
        };

        if (scope.tinyColumnsFlag && scope.desiredButsItems.length > 0) {

            angular.forEach(scope.desiredButsItems, function (val, key) {
                scope.allColumnsCount++;
                scope.smalColumns.columnsCount++;
                scope.smalColumns.columnsSize += parseInt(scope.defaultSelectAllBtnSize);
            });

        }

        if (scope.selectAllFlag && scope.checkBoxForRowFlag) {
            scope.allColumnsCount++;
            scope.smalColumns.columnsCount++;
            scope.smalColumns.columnsSize += parseInt(scope.defaultSelectAllBtnSize);
        }
        //if (scope.detailBtnFlag) {
        //    scope.allColumnsCount++;
        //    scope.smalColumns.columnsCount++;
        //    scope.smalColumns.columnsSize += parseInt(scope.defaultDetailBtnSize);
        //}
        if (scope.detailBtnActionFlag) {
            scope.allColumnsCount++;
            scope.smalColumns.columnsCount++;
            scope.smalColumns.columnsSize += parseInt(scope.defaultActionColSize);
        }
        if (scope.showHideAttchmentFlag) {
            scope.allColumnsCount++;
            scope.smalColumns.columnsCount++;
            scope.smalColumns.columnsSize += parseInt(scope.defaultActionColSize);
        }
        if (scope.detailBtnActionEditFlag) {
            scope.allColumnsCount++;
            scope.smalColumns.columnsCount++;
            scope.smalColumns.columnsSize += parseInt(scope.defaultActionColSize);
        }
        if (scope.deleteBtnActionFlag) {
            scope.allColumnsCount++;
            scope.smalColumns.columnsCount++;
            scope.smalColumns.columnsSize += parseInt(scope.defaultActionColSize);
        }
        angular.forEach(finalArray, function (item) {

            if (item.name != 'id') {
                if (item.colSize <= 5) {
                    scope.smalColumns.columnsCount++;
                    scope.smalColumns.columnsSize += parseInt(item.colSize);
                }
                else {
                    scope.largColumns.columnsCount++;
                    scope.largColumns.columnsSize += parseInt(item.colSize);
                }

            }
        });
        if (scope.extraCol) {
            scope.smalColumns.columnsSize += 10;
        }

        if (scope.moreInfoPlace) {
            scope.smalColumns.columnsSize += parseInt(scope.defaultActionColSize);
        }
        scope.allColumnsSize = scope.largColumns.columnsSize + scope.smalColumns.columnsSize;
        if (scope.allColumnsSiz % 5 != 0 && scope.gridName === 'gridDeviceList')
            scope.allColumnsSize = scope.allColumnsSize + (scope.allColumnsSiz % 5);


        scope.differencePlus = 0;
        scope.differenceMines = 0;

        if (parseInt(scope.allColumnsSize) > 100) {
            scope.differenceMines = parseInt(scope.allColumnsSize) - 100;
            while (scope.differenceMines > 0) {
                for (var i = finalArray.length - 1 ; i > 0  ; i--) {
                    var item = finalArray[i];
                    if (parseInt(scope.allColumnsSize) != 100) {
                        if (item.name != 'id' && item.name != '_id') {
                            if (parseInt(item.colSize) > 5) {
                                item.colSize = parseInt(item.colSize) - 5;
                                scope.allColumnsSize = scope.allColumnsSize - 5;
                                scope.differenceMines = scope.differenceMines - 5;
                            }
                        }
                    }
                }
            }
        }
        else if (parseInt(scope.allColumnsSize) % 100 != 0) {
            scope.differencePlus = 100 - parseInt(scope.allColumnsSize);
            while (scope.differencePlus > 0) {
                angular.forEach(finalArray, function (item) {
                    if (parseInt(scope.allColumnsSize) != 100) {
                        if (item.name != 'id' && item.name != '_id') {

                            item.colSize = parseInt(item.colSize) + 5;
                            scope.allColumnsSize = scope.allColumnsSize + 5;
                            scope.differencePlus = scope.differencePlus - 5;
                        }
                    }
                });
            }
        }

        return finalArray;
    };

    srv.getObjectTitleAndOptions = function (gridKey, gridColOptions, gridName, scope) {

        var finalArray = new Array();
        for (var i = 0 ; i < gridKey.length ; i++) {

            var obj = new Object();
            obj.id = i;
            obj.name = createFieldValue(gridKey[i]);
            obj.sortField = createSortField(gridKey[i], gridName);
            if (scope.publicDisplayNames)
                obj.displayName = convertDisplayNameToFarsi(gridKey[i], scope.publicDisplayNames, gridName);
            else
                obj.displayName = convertDisplayNameToFarsi(gridKey[i], gridName);
            //  obj.colSize = gridDefaultOptions.defaultColSize;
            obj.colPriority = gridDefaultOptions.defaultcolPriority;

            if (gridColOptions)
                for (var iGridColOption = 0 ; iGridColOption < gridColOptions.length ; iGridColOption++) {
                    if (gridKey[i] == gridColOptions[iGridColOption].fieldName) {

                        if (gridColOptions[iGridColOption].fildSearch != undefined)
                            obj.fildSearch = gridColOptions[iGridColOption].fildSearch;
                        else
                            obj.fildSearch = gridColOptions[iGridColOption].fieldName;

                        if (gridColOptions[iGridColOption].iconList != undefined)
                            obj.iconList = gridColOptions[iGridColOption].iconList;
                        else
                            obj.iconList = null;


                        if (gridColOptions[iGridColOption].colSize != undefined)
                            obj.colSize = gridColOptions[iGridColOption].colSize;
                        else {
                            obj.colSize = scope.defaultColSize;
                            if (scope.gridType)
                                if (scope.gridType === gridDefaultOptions.defaultBIG)
                                    obj.colSize = gridDefaultOptions.defaultBigColSize;
                                else
                                    obj.colSize = scope.defaultColSize;
                        }

                        if (gridColOptions[iGridColOption].colPriority != undefined)
                            obj.colPriority = gridColOptions[iGridColOption].colPriority;
                        else
                            obj.colPriority = gridDefaultOptions.defaultcolPriority;

                        if (gridColOptions[iGridColOption].hasSort == true)
                            obj.hasSort = gridColOptions[iGridColOption].hasSort;
                        else
                            obj.hasSort = false;

                        if (gridColOptions[iGridColOption].isDropDownSearch != undefined) {

                            obj.isDropDownSearch = {
                                "type": "select",
                                "values": gridColOptions[iGridColOption].isDropDownSearch
                            };
                        }
                        else
                            obj.isDropDownSearch = null;

                        if (gridColOptions[iGridColOption].fieldIsDropDown == true)
                            obj.fieldIsDropDown = gridColOptions[iGridColOption].fieldIsDropDown;
                        else
                            obj.fieldIsDropDown = false;

                        if (gridColOptions[iGridColOption].showHideFlg == true)
                            obj.showHideFlg = gridColOptions[iGridColOption].showHideFlg;
                        else
                            obj.showHideFlg = false;

                        if (gridColOptions[iGridColOption].dropDownType != undefined)
                            obj.dropDownType = gridColOptions[iGridColOption].dropDownType;
                        else
                            obj.dropDownType = false;

                        if (gridColOptions[iGridColOption].searchInpType != undefined)
                            obj.searchInpType = gridColOptions[iGridColOption].searchInpType;
                        else
                            obj.searchInpType = '';

                        if (gridColOptions[iGridColOption].keepOldVal != undefined)
                            obj.keepOldVal = gridColOptions[iGridColOption].keepOldVal;
                        else
                            obj.keepOldVal = false;
                        //dropDownType
                    }
                }
            finalArray.push(obj);
        }

        finalArray.sort(srv.compare);

        return srv.columnSizeCheker(finalArray, gridName, scope);

    },

    srv.compare = function (a, b) {
        if (a.colPriority < b.colPriority)
            return -1;
        if (a.colPriority > b.colPriority)
            return 1;
        return 0;
    };
    
    return srv;

}]);
// #endregion

// #region Sort Factoiry
application.factory('SortFields', function () {
    var service = {};
    service.orderName = 'id',
    service.sortType = '',
    service.iconOrder = '',
    service.cleanSortField = function () {

        var paginationObj = new Object();

        paginationObj.sortList = getSortList(null, null);
        setSortOption(paginationObj);

        service.orderName = '',
        service.sortType = '',
        service.iconOrder = '';
    };
    return service;
});
// #endregion

// #region Paging Factory
application.factory('paging', ['$http', function ($http) {
    var srv = this;
    srv.getPaging = function (scope, dataLength, pageNumber, pageSize, callback) {

        scope.pagination = {
            last: pageSize + 1,
            currentPage: pageNumber + 1
        };
        //how much items per page to show  
        var show_per_page = pageSize;
        //getting the amount of elements inside content div  
        var number_of_items = dataLength;
        //calculate the number of pages we are going to have  
        var number_of_pages = Math.ceil(number_of_items / show_per_page);
        scope.number_of_pages = number_of_pages;
        scope.pagination.last = number_of_pages;
        scope.pages = [];
        if (pageNumber == 5)
            pageNumber = 0;
        var current_link = pageNumber;
        //if (current_link != 1)
        //    current_link -= 1;
        // var pageCount = new Object();
        if (number_of_pages <= 5) {
            while (number_of_pages > current_link) {

                current_link++;
                scope.pages.push(current_link);
            }
        } else {
            if (5 > current_link) {
                while (5 > current_link) {
                    if (current_link < number_of_pages) {
                        current_link++;
                        scope.pages.push(current_link);
                    }
                }
                scope.pages.push('...');
                //scope.pages.push(scope.pagination.last)
            }
            else {
                if (number_of_pages > pageNumber) {
                    {
                        while (5 + pageNumber > current_link) {
                            if (current_link <= number_of_pages) {
                                scope.pages.push(current_link);
                                current_link++;
                            } else {
                                return;
                            }
                        }
                        if (current_link != number_of_pages) {
                            scope.pages.push('...');
                            //        scope.pages.push(scope.pagination.last);

                        }
                    }
                }

            }
        }
        if (callback)
            callback(number_of_pages);
    };


    return srv;
}]);
// #endregion