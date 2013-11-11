using Microsoft.SharePoint;
using Microsoft.SharePoint.Administration;
using System;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;

namespace TwitterBootstrapMasterPage.ControlTemplates
{
    public partial class SearchControl : UserControl
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            TBSearchBtn.ServerClick += new EventHandler(TBSearchBtn_ServerClick);
        }
        void TBSearchBtn_ServerClick(object sender, EventArgs e)
        {
            string searchResults = null;
            try
            {
                SPSite site = SPContext.Current.Site;
                SPWeb web = site.RootWeb;
                Microsoft.SharePoint.Utilities.SPPropertyBag properties = web.Properties;

                if (properties.ContainsKey("SRCH_ENH_FTR_URL"))
                    searchResults = properties["SRCH_ENH_FTR_URL"].ToString();
                else if (properties.ContainsKey("SRCH_TRAGET_RESULTS_PAGE"))
                    searchResults = properties["SRCH_TRAGET_RESULTS_PAGE"].ToString();
                else
                    searchResults = "/_layouts/osssearchresults.aspx";
            }
            catch (Exception ex)
            {
                SPDiagnosticsService.Local.WriteTrace(
                        0,
                        new SPDiagnosticsCategory(
                            "TB Search Control",
                            TraceSeverity.Unexpected,
                            EventSeverity.Error
                            ),
                        TraceSeverity.Unexpected,
                        ex.Message,
                        ex.StackTrace
                        );
            }
            string query = null;
            if (TBSearch.Value != null || TBSearch.Value != string.Empty)
                query = TBSearch.Value;

            if (searchResults != null)
            {
                Response.Redirect(string.Format("{0}?k={1}", searchResults, query));
            }
        }
    }
}
