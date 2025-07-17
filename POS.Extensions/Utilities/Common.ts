import { ClientEntities, ProxyEntities } from "PosApi/Entities";
import { GetDeviceConfigurationClientRequest, GetDeviceConfigurationClientResponse } from "PosApi/Consume/Device";
import { GetCustomerClientRequest } from "PosApi/Consume/Customer";
import { Performaces } from "../Entities/IEvents";
export default class Common {

    public static BaseUrlProductSearch: string = "/Commerce/Products/SearchByText(";
    
    public static GetQueryStringParamVal = (params, url) => {
        let href = url;
        let reg = new RegExp('[?&]' + params + '=([^&#]*)', 'i');
        let queryString = reg.exec(href);
        return queryString ? queryString[1] : null;
    };

    public static GetSearchValue = (urlBase?: string): string => {
        let capture_resource = performance.getEntriesByType("resource");
        let requestArrDetails = capture_resource.filter((obj) => {
            let _obj2: Performaces = obj;
            return _obj2.initiatorType.toLowerCase() == "xmlhttprequest"
                && _obj2.name.toLowerCase().indexOf(Common.BaseUrlProductSearch.toLowerCase()) > -1
        }).sort((a, b) => {
            return a.startTime - b.startTime;
        });

        let requestDetails: any = (requestArrDetails.length > 0) ? requestArrDetails[requestArrDetails.length - 1] : undefined;
        if (requestDetails != undefined) {
            let SearchVal: string = Common.GetQueryStringParamVal("@p1", requestDetails.name.toLowerCase());
            return (SearchVal != undefined) ? SearchVal.replace("'", "").replace("'", "") : "";
        }
        else {
            return "";
        }
    }

    public static GetSearchValue_Backup = (urlBase): string => {
        let SearchVal: string = "";
        let capture_resource = performance.getEntriesByType("resource");
        let _list: Performaces[] = capture_resource;
        for (var i = 0; i < _list.length; i++) {
            if (_list[i].initiatorType == "xmlhttprequest") {
                if (_list[i].name.toLowerCase().indexOf(urlBase.toLowerCase()) > -1) {
                    SearchVal = Common.GetQueryStringParamVal("@p1", _list[i].name.toLowerCase());
                    SearchVal = (SearchVal != undefined) ? SearchVal.replace("'", "").replace("'", "") : "";
                }
            }
        }
        return SearchVal;
    }

    public static GetDeviceConfiguration = (_context: any): Promise<ProxyEntities.DeviceConfiguration> => {
        let promise: Promise<ProxyEntities.DeviceConfiguration> = new Promise((resolve, reject) => {
            _context.runtime.executeAsync(new GetDeviceConfigurationClientRequest())
                .then((response: ClientEntities.ICancelableDataResult<GetDeviceConfigurationClientResponse>) => {
                    resolve(response.data.result);
                }).catch((reason) => {
                    reject(reason);
                });
        });
        return promise;
    }

    public static GetDeviceConfigurationJsonString = (_context: any): Promise<string> => {
        let promise: Promise<string> = new Promise((resolve, reject) => {
            _context.runtime.executeAsync(new GetDeviceConfigurationClientRequest())
                .then((response: ClientEntities.ICancelableDataResult<GetDeviceConfigurationClientResponse>) => {
                    resolve(JSON.stringify(response.data.result));
                })
        });
        return promise;
    }

    public static GetCustomerInfo = async (context: any, customerId: string): Promise<ProxyEntities.Customer> => {
        return (await context.runtime.executeAsync(new GetCustomerClientRequest(customerId))).data.result;
    }

    public static GetSKUNumberBySearchText = (searchText: string) => {
        console.log(searchText);
        if (searchText.length == 10 && Common.IsInteger(searchText)){
            return searchText;
        }
        return "";
    }

    public static IsInteger = (input: string): boolean => {
        var numbers = /^[0-9]+$/;
        if (input.match(numbers)) {
            return true;
        }
        return false;
    }


    public static IsNullOrUndefinedOrBlank = (input: string): boolean => {
        if (input == undefined)
            return true;
        else if (input == null)
            return true;
        else if (input == "")
            return true;
        else
            return false;
    }
}