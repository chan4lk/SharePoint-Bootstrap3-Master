using System;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using Microsoft.SharePoint;
using Microsoft.SharePoint.Administration;

namespace TwitterBootstrapMasterPage.ControlTemplates.TwitterBootstrapMasterPage
{
    public partial class TBSiteNav : UserControl
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            try
            {
                SPWeb web = SPContext.Current.Web;
                SPUser user = web.CurrentUser;
                SiteNav.InnerHtml = string.Empty;
                foreach (SPWeb _web in web.Webs)
                {

                    SiteNav.InnerHtml += string.Format(@"<li><a href=""{0}"">{1}</a></li>", _web.Url, _web.Title);
                }
            }
            catch (Exception ex)
            {
                SPDiagnosticsService.Local.WriteTrace(
                    0,
                    new SPDiagnosticsCategory(
                        "TB Site Nav", 
                        TraceSeverity.Unexpected, 
                        EventSeverity.Error
                        ), 
                    TraceSeverity.Unexpected, 
                    ex.Message, 
                    ex.StackTrace
                    );
            }
        }
    }
}
