import * as React from 'react';
import styles from './WarHomeTiles.module.scss';
import { IWarHomeTilesProps } from './IWarHomeTilesProps';
import { escape } from '@microsoft/sp-lodash-subset';
import * as jquery from 'jquery';
import { Icon } from 'office-ui-fabric-react/lib/Icon';

export default class WarHomeTiles extends React.Component<IWarHomeTilesProps, {}> {
  public constructor(props){
    super(props);
    this.state={
      items:[
        {
          "WARRequestsApproved":"",
          "WARValueApproved":""
        }
      ]
    }
  }


  public componentDidMount(){
    var instance=this;
    var Totaldata=[];
    var TotalWARApproved=[];
    var warRevCount;
    var warReqCount; 
    let tempdata=[];    
    var totalCount;
    var today = new Date();
    var fiscalStartYear;
    var fiscalEndYear;
    var today = new Date();
    if ((today.getMonth() + 1) <= 3) {
      fiscalStartYear = today.getFullYear() - 1;
    } else {
      fiscalStartYear = today.getFullYear();
    }
    if ((today.getMonth() + 1) <= 3) {
      fiscalEndYear = today.getFullYear();
    } else {
      fiscalEndYear = today.getFullYear() + 1;
    }
    var m=fiscalStartYear+"-"+"04"+"-"+"01";//+"T00:00:00Z";//datetime%20
    var g=fiscalEndYear+"-"+"03"+"-"+"31";//+"T00:00:00Z";
    console.log("firstDayDate: "+m+" lastDayDate: "+g);
    
    jquery.ajax({
      url:this.props.siteurl+"/_api/web/Lists/GetByTitle('"+this.props.listname+"')/Items?$select=CRM,Total_x0020_Contract_x0020_Value&$filter=Created ge'"+m+"' and Created le'"+g+"' and OVERALL_x0020_STATUS eq 'Approved'&$top=5000",
      type:"GET",
      headers:{'Accept':'application/json;odata=verbose;'},
      success:function(data){
        Totaldata=data.d.results;
        // console.log(Totaldata);
        totalCount=data.d.results.length;
        
        //Calculate Total Approved Revenue
        var TotalBill=[];
        Totaldata.map((item)=>{
          TotalBill.push(parseFloat(item.Total_x0020_Contract_x0020_Value));
        })
        console.log(TotalBill);
        var arrSum = TotalBill.reduce((a,b) => a + b, 0);
        arrSum = arrSum.toFixed(2);
        
        //Calculate Total Approved Requests
        Totaldata.map((item)=>{
          TotalWARApproved.push(item.CRM);
        });  
        console.log(TotalWARApproved);        
        totalCount=TotalWARApproved.length;
        
        //Get the current fiscal year
        var fiscalyear = fiscalStartYear+"-"+fiscalEndYear;

        tempdata.push({TotalWARRev:arrSum, TotalWARReq:totalCount, CurrentFiscalYear:fiscalyear})
        instance.setState({
          items:tempdata
        })
      },
      error:function(e){
       console.log(e)
      }
    })  
  }

  public render(): React.ReactElement<IWarHomeTilesProps> {
    let Displayitems=this.state["items"];
    console.log(Displayitems);
    console.log(this.state["items"][0].TotalWARReq);

    return(
      <div className={styles.warHomeTiles}>
        {this.state["items"][0].TotalWARReq!=null?Displayitems.map(item=>{
          let totalApprovedRevenue=item.TotalWARRev;
          let totalApprovedCount=item.TotalWARReq;
          let fiscalyear=item.CurrentFiscalYear;
         // console.log(item)
          return(
            <div className="nps-container" style={{marginBottom: "20px", marginTop: "20px"}}>
              <div className="nps-dynamic-392 nps-child nps-row nps-resize" style={{visibility: "visible"}}>
                <div className="nps-counter-box-wrap" style={{width:"33%",backgroundColor:"rgb(235, 110, 0)",float: "left",height: "60px",paddingBottom: "10px",marginLeft: "10px",boxShadow: "0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%), 0 1px 5px 0 rgb(0 0 0 / 12%)"}}>
                  <div className="sp-type-counter-box-item sp-meta-allow-content nps-child nps-col nps-col-md nps-grid-with-bg nps-counter-box nps-counter-box-style-solid nps-counter-icon-left" style={{visibility: "visible"}}>
                    <div className="nps-counter-content">
                      <div className="nps-counter-icon-container">
                        <span className="nps-counter-icon" style={{position: "absolute",right: "67%",fontSize: "30px", width: "40px"}}>
                          {/* marginTop: "15px", */}
                          <Icon style={{color: "rgb(255, 255, 255)",opacity: 0.2}} iconName='DocumentApproval' />
                        </span>
                      </div>
                      <div className="nps-counter-number-container" style={{textAlign: "left",paddingLeft: "20px",paddingTop: "10px"}}>
                        <span className="nps-counter-number" style={{color: "rgb(255, 255, 255)",fontFamily: "Verdana"}}>{totalApprovedCount}</span>
                      </div>
                      <div className="nps-counter-title-container" style={{textAlign: "left",paddingLeft: "20px"}}>
                      {/* width:"60%", */}
                        <span className="nps-counter-title" style={{color: "rgb(255, 255, 255)",fontFamily: "Verdana",fontSize: "12px"}}>Total Requests Approved for Current Financial Year {fiscalyear}</span>
                      </div>
                    </div>
                  </div>
                </div>
                    <div className="nps-counter-box-wrap" style={{width:"33%",backgroundColor:"rgb(0, 43, 98)",float: "left",height: "60px",paddingBottom: "10px",marginLeft: "10px",boxShadow: "0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%), 0 1px 5px 0 rgb(0 0 0 / 12%)"}}>
                  <div className="sp-type-counter-box-item sp-meta-allow-content nps-child nps-col nps-col-md nps-grid-with-bg nps-counter-box nps-counter-box-style-solid nps-counter-icon-left" style={{visibility: "visible"}}>
                    <div className="nps-counter-content">
                      <div className="nps-counter-number-container">
                        <span className="nps-counter-number" style={{position: "absolute",right: "35%",fontSize: "35px", width: "40px"}}>
                        {/* marginTop: "15px", */}
                          <Icon style={{color: "rgb(255, 255, 255)",opacity: 0.2}} iconName='Money' />
                        </span>
                      </div>
                      <div className="nps-counter-number-container" style={{textAlign: "left",paddingLeft: "20px",paddingTop: "10px"}}>
                        <span className="nps-counter-number" style={{color: "rgb(255, 255, 255)",fontFamily: "Verdana"}}>£ {totalApprovedRevenue}</span>
                      </div>
                      <div className="nps-counter-title-container" style={{textAlign: "left",paddingLeft: "20px"}}>
                      {/* width:"60%", */}
                        <span className="nps-counter-title" style={{color: "rgb(255, 255, 255)",fontFamily: "Verdana",fontSize: "12px"}}>Total Value of Requests Approved for Current Financial Year {fiscalyear}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>



        //   <div className="nps-container"><div className="sp-type-section sp-meta-allow-content sp-meta-parent nps-copy nps-row nps-commons-layout-default nps-resize nps-grid-with-bg" style={{visibility: "visible"}}><div className="nps-background nps-commons-no-margin-mobile nps-resize nps-after-resize" style={{marginbottom:" 0px", width:" 100%", minHeight: "105px"}}><div className="nps-background-bg"></div><div className="nps-background-colorlayer" style={{backgroundColor: "rgb(255, 255, 255)"}}></div><div className="nps-commons-padding-wrap nps-commons-no-padding-mobile" style={{boxsizing: "border-box"}}><div className="nps-background-content-wrap" style={{height: "auto", minHeight: "105px"}}><div className="nps-background-content nps-background-va-top nps-background-ha-left"><div className="sp-type-section-item sp-meta-allow-content nps-child nps-col-separator-none nps-col nps-col-md nps-grid-no-bg" style={{visibility: "visible", verticalAlign: "middle",top:"50px"}}><div className="nps-container"><div className="sp-type-row sp-meta-allow-content sp-meta-parent nps-child nps-row nps-commons-layout-default nps-resize nps-grid-with-bg" style={{visibility: "visible"}}><div className="nps-background nps-resize nps-after-resize" style={{marginbottom: "0px", width: "100%", minHeight: "105px"}}><div className="nps-background-bg"></div><div className="nps-background-colorlayer"></div><div className="nps-commons-padding-wrap" style={{boxsizing: "border-box"}}><div className="nps-background-content-wrap" style={{height: "auto", minHeight: "105px"}}><div className="nps-background-content nps-background-va-null nps-background-ha-null"><div className="sp-type-column sp-meta-allow-content nps-child nps-col nps-col-md nps-col-md-12 nps-commons-layout-default nps-grid-with-bg" style={{visibility: "visible", verticalAlign: "middle"}}><div className="nps-background nps-resize nps-after-resize" style={{marginbottom: "0px", width: "100%", minHeight: "105px"}}><div className="nps-background-bg"></div><div className="nps-background-colorlayer"></div><div className="nps-commons-padding-wrap" style={{boxsizing: "border-box;"}}><div className="nps-background-content-wrap" style={{height: "auto", minHeight: "105px;"}}><div className="nps-background-content nps-background-va-top nps-background-ha-null"><div className="sp-type-counters-box sp-meta-allow-content sp-meta-parent nps-dynamic-391 nps-counters-box" ><div className="nps-container"><div className="nps-dynamic-392 nps-child nps-row nps-resize" style={{visibility: "visible"}}>
        //   <div className="nps-counter-box-wrap" style={{width:"33%"}}><div className="sp-type-counter-box-item sp-meta-allow-content nps-child nps-col nps-col-md nps-grid-with-bg nps-counter-box nps-counter-box-style-solid nps-counter-icon-left" style={{visibility: "visible",verticalAlign:"middle"}}><div className="nps-counter-box-bg"><div className="nps-counter-box-bg-img" style={{backgroundImage: "url(/sites/war/SiteAssets/HomePageTiles/Images/tileImage1.jpg)"}}></div><div className="nps-counter-box-bg-img" style={{backgroundColor: "rgb(34, 34, 34)",opacity:0.7}}></div><div className="nps-counter-box-bg-img"></div></div><div className="nps-background nps-resize nps-after-resize" style={{marginbottom: "0px", width: "100%", minHeight: "0px"}}><div className="nps-background-bg"></div><div className="nps-background-colorlayer"></div><div className="nps-commons-padding-wrap" style={{boxsizing: "border-box"}}><div className="nps-background-content-wrap" style={{height: "auto", minHeight: "0px"}}><div className="nps-background-content nps-background-va-top nps-background-ha-null"></div></div></div></div><div className="nps-counter-icon" style={{textAlign: "right"}}><i className="nps-icon nps-dynamic-394 nps-icon-fa-briefcase nps-icon-normal"></i></div><div className="nps-counter-content" style={{textAlign: "right"}}><div className="nps-counter-number-container" style={{textAlign: "right"}}><span className="nps-counter-number" style={{color: "rgb(255, 255, 255)"}}>{totalApprovedRevenue}</span><span className="nps-counter-symbol" style={{color: "rgb(255, 255, 255)"}}></span></div><div className="nps-counter-title-container" style={{textAlign: "right"}}><span className="nps-counter-title" style={{color: "rgb(255, 255, 255)"}}>Total Requests Approved for Current Financial Year{fiscalyear}</span></div></div></div></div>
        //   <div className="nps-counter-box-wrap" style={{width:"33%"}}><div className="sp-type-counter-box-item sp-meta-allow-content nps-child nps-col nps-col-md nps-grid-with-bg nps-counter-box nps-counter-box-style-solid nps-counter-icon-left" style={{visibility: "visible",verticalAlign:"middle"}}><div className="nps-counter-box-bg"><div className="nps-counter-box-bg-img" style={{backgroundImage: "url(/sites/war/SiteAssets/HomePageTiles/Images/tileImage2.jpg)"}}></div><div className="nps-counter-box-bg-img" style={{backgroundColor: "rgb(34, 34, 34)",opacity:0.7}}></div><div className="nps-counter-box-bg-img"></div></div><div className="nps-background nps-resize nps-after-resize" style={{marginbottom: "0px", width: "100%", minHeight: "0px"}}><div className="nps-background-bg"></div><div className="nps-background-colorlayer"></div><div className="nps-commons-padding-wrap" style={{boxsizing: "border-box"}}><div className="nps-background-content-wrap" style={{height: "auto", minHeight: "0px"}}><div className="nps-background-content nps-background-va-top nps-background-ha-null"></div></div></div></div><div className="nps-counter-icon" style={{textAlign: "right"}}><i className="nps-icon nps-dynamic-394 nps-icon-fa-briefcase nps-icon-normal"></i></div><div className="nps-counter-content" style={{textAlign: "right"}}><div className="nps-counter-number-container" style={{textAlign: "right"}}><span className="nps-counter-number" style={{color: "rgb(255, 255, 255)"}}>{totalApprovedCount}</span><span className="nps-counter-symbol" style={{color: "rgb(255, 255, 255)"}}></span></div><div className="nps-counter-title-container" style={{textAlign: "right"}}><span className="nps-counter-title" style={{color: "rgb(255, 255, 255)"}}>Total Value of Requests Approved for Current Financial Year{fiscalyear}</span></div></div></div></div>
        //   {/* <div className="nps-counter-box-wrap" style={{width:"33%"}}><div className="sp-type-counter-box-item sp-meta-allow-content nps-child nps-col nps-col-md nps-grid-with-bg nps-counter-box nps-counter-box-style-solid nps-counter-icon-left" style={{visibility: "visible",verticalAlign:"middle"}}><div className="nps-counter-box-bg"><div className="nps-counter-box-bg-img" style={{backgroundImage: "url(/sites/cap/SiteAssets/HomePageTiles/Images/tileImage4.jpg)"}}></div><div className="nps-counter-box-bg-img" style={{backgroundColor: "rgb(34, 34, 34)",opacity:0.7}}></div><div className="nps-counter-box-bg-img"></div></div><div className="nps-background nps-resize nps-after-resize" style={{marginbottom: "0px", width: "100%", minHeight: "0px"}}><div className="nps-background-bg"></div><div className="nps-background-colorlayer"></div><div className="nps-commons-padding-wrap" style={{boxsizing: "border-box"}}><div className="nps-background-content-wrap" style={{height: "auto", minHeight: "0px"}}><div className="nps-background-content nps-background-va-top nps-background-ha-null"></div></div></div></div><div className="nps-counter-icon" style={{textAlign: "right"}}><i className="nps-icon nps-dynamic-394 nps-icon-fa-briefcase nps-icon-normal"></i></div><div className="nps-counter-content" style={{textAlign: "right"}}><div className="nps-counter-number-container" style={{textAlign: "right"}}><span className="nps-counter-number" style={{color: "rgb(255, 255, 255)"}}>£ {approvedTotal}</span><span className="nps-counter-symbol" style={{color: "rgb(255, 255, 255)"}}></span></div><div className="nps-counter-title-container" style={{textAlign: "right"}}><span className="nps-counter-title" style={{color: "rgb(255, 255, 255)"}}>Total Cap approved this month</span></div></div></div></div> */}
        
        // </div></div></div></div></div></div></div></div></div></div></div></div></div></div></div></div></div></div></div></div></div>

          )
        }):null}
      </div >
    );
  }
}
