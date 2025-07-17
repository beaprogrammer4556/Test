namespace NimbusRetail
{
    namespace CommerceRuntime
    {
        using System.Threading.Tasks;
        using Microsoft.Dynamics.Commerce.Runtime.DataModel;
        using Microsoft.Dynamics.Commerce.Runtime.Hosting.Contracts;
		using NimbusRetail.CommerceRuntime.Messages;
		using DataModel = Commerce.Runtime.DataModel;

        [RoutePrefix("SampleEntities")]
        [BindEntity(typeof(DataModel.SampleEntities))]
        public class NimSampleController : IController
        {
            [HttpPost]
            [Authorization(CommerceRoles.Anonymous, CommerceRoles.Customer, CommerceRoles.Device, CommerceRoles.Employee)]
            public async Task<DataModel.GenericStringDataModel> ExecuteOperationOperation(IEndpointContext context, string RequestVal, string ObjStrVal)
            {
                DataModel.GenericStringDataModel data = new DataModel.GenericStringDataModel();
                var request = new SampleRequest(RequestVal, ObjStrVal);
                SampleResponse resp = await context.ExecuteAsync<SampleResponse>(request).ConfigureAwait(false);
                data.DataResult = resp.ResponseVal;
                return data;
            }
        }
    }
}