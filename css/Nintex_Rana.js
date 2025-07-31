$viewDiv = $("div [name='Area Item OBB_Collapse']"); 
$gridBody = $viewDiv.find('.grid-body'); 
$gridTable = $gridBody.find("table"); 
$gridTable.css("min-width", "130%"); 
$gridTable.css("overflow-x", "scroll");

$("div[name='Area Item OBB_Collapse']").find("colgroup col").removeAttr("style").end().find("table").css({"table-layout": "auto",});
