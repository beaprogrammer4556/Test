
namespace NimbusRetail
{
    namespace CommerceRuntime
    {
        using System.Threading.Tasks;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;
        using Microsoft.Dynamics.Commerce.Runtime.Hosting.Contracts;
        using NimbusRetail.CommerceRuntime.Messages;
        using DataModel = Commerce.Runtime.DataModel;

        [RoutePrefix("CustOrderEntities")]
        [BindEntity(typeof(DataModel.CustOrderEntities))]
        public class NimCustOrderController : IController
        {
            [HttpPost]
            [Authorization(CommerceRoles.Anonymous, CommerceRoles.Customer, CommerceRoles.Device, CommerceRoles.Employee)]
            public async Task<DataModel.GenericStringDataModel> ExecuteCustOrderOperation(IEndpointContext context, string RequestVal, string ObjStrVal)
            {
                DataModel.GenericStringDataModel data = new DataModel.GenericStringDataModel();
                var request = new CustOrderRequest(RequestVal, ObjStrVal);
                CustOrderResponse resp = await context.ExecuteAsync<CustOrderResponse>(request).ConfigureAwait(false);
                data.DataResult = resp.ResponseVal;
                return data;
            }
        }
    }
}




